const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const pool = require('../services/mysql'); // MySQL connection pool

// Function to fetch and parse Daily Incidents
async function getDailyIncidents(pageNumber = 1) {
  const url = 'https://www.wrps.on.ca/Modules/NewsIncidents/search.aspx?feedId=73a5e2dc-45fb-425f-96b9-d575355f7d4d';

  if (pageNumber === 1) {
    // For page 1, perform a simple GET request
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    return parseNewsItems($);
  } else {
    // For pages > 1, perform GET to obtain hidden fields and then POST to simulate paging
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Extract required ASP.NET hidden fields for postback
    const viewState = $('#__VIEWSTATE').attr('value');
    const viewStateGenerator = $('#__VIEWSTATEGENERATOR').attr('value');
    const eventValidation = $('#__EVENTVALIDATION').attr('value');
    
    // Prepare form data with the updated page number
    const formData = {
      '__VIEWSTATE': viewState,
      '__VIEWSTATEGENERATOR': viewStateGenerator,
      '__EVENTVALIDATION': eventValidation,
      'ctl00$cphContent$hdnPage': pageNumber.toString()
    };

    // Now send a POST request with the hidden fields
    const postResponse = await axios.post(url, qs.stringify(formData), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const postHtml = postResponse.data;
    const $$ = cheerio.load(postHtml);

    // Parse the items from the POST response
    return parseNewsItems($$);
  }
}


// Helper function to parse news items from the loaded HTML using Cheerio
function parseNewsItems($) {
  const newsItems = [];
  const newsContainer = $('div.newsContainer');

  if (newsContainer.length > 0) {
    // Iterate over each news item
    newsContainer.find('div.newsItem').each((i, elem) => {
      const title = $(elem).find('h2').text().trim() || 'No Title';
      const postedDate = $(elem).find('span.newsItem_PostedDate').text().trim() || 'No Posted Date';
      const description = $(elem).find('span[id*="lblDescription"]').text().trim() || 'No Description';

      // Parse description to extract incidentNumber, incidentDate, location
      const { incidentNumber, incidentDate, location } = parseDescription(description);

      newsItems.push({
        title,
        postedDate,
        incidentNumber,
        incidentDate,
        location,
        description
      });
    });
  } else {
    console.log('Could not find the Daily Incidents section.');
  }
  return newsItems;
}

/**
 * This function extracts 'incidentNumber', 'incidentDate', and 'location' from the raw description
 * using a simple regular expression approach. Adjust the regex if the format changes.
 */
function parseDescription(rawDesc) {
  // Default values
  let incidentNumber = '';
  let incidentDate = '';
  let location = '';

  // Regex pattern (adapt if the actual format is different)
  // Example format: "Incident #: WA25053113  Incident Date: Mar 1, 2025 5:47:04 AM  Location: WESTMOUNT RD E, KITCHENER, ON"
  const pattern = /Incident #:\s*(.*?)\s*Incident Date:\s*(.*?)\s*Location:\s*(.*)/s;

  const match = rawDesc.match(pattern);
  if (match) {
    incidentNumber = match[1].trim();
    incidentDate = match[2].trim();
    location = match[3].trim();
  }

  return { incidentNumber, incidentDate, location };
}

/**
 * Retrieves incidents for the given pageNumber, then inserts them into MySQL using shared connection pool.
 */
async function fetchAndStoreIncidents(pageNumber) {
  try {
    // 1) Fetch daily incidents from the website
    const incidents = await getDailyIncidents(pageNumber);
    
    // 2) Check if there are any incidents before inserting
    if (incidents.length === 0) {
      console.log(`Page ${pageNumber}: No data found.`);
      return;
    }

    // 3) Insert each incident into MySQL
    for (const item of incidents) {
      const insertQuery = `
        INSERT INTO news_items
          (title, posted_date, incident_number, incident_date, location)
        VALUES (?, ?, ?, ?, ?)
      `;

      await pool.query(insertQuery, [
        item.title,
        item.postedDate,
        item.incidentNumber,
        item.incidentDate,
        item.location
        // item.description
      ]);
    }

    console.log(`Page ${pageNumber}: ${incidents.length} records inserted.`);
  } catch (error) {
    console.error('Error inserting data into MySQL:', error.message);
  }
}

/**
 * GET /api/incidents
 * Retrieves all incidents from the database and returns them as JSON.
 */
async function getIncidents () {
  try {
    // Query to fetch all records from 'news_items' table
    const [rows] = await pool.query('SELECT * FROM news_items ORDER BY incident_date DESC');

    return rows;
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};

/**
 * GET /api/incidents/:id
 * Retrieves a single incident by its ID.
 */
async function getIncidentsById (id) {
  try {
    // const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM news_items WHERE id = ?', [id]);

    if (rows.length === 0) {
      // return res.status(404).json({ status: 'error', message: 'Incident not found' });
      console.log(`ID ${id}: No data found.`);
    }

    return rows;
  } catch (error) {
    console.error('Error fetching single incident:', error.message);
  }
};

// Export the function for use in other modules
module.exports = {
  fetchAndStoreIncidents,
  getIncidents,
  getIncidentsById,
};
