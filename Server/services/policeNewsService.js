const axios = require('axios');
const cheerio = require('cheerio');
const pool = require('../services/mysql'); // MySQL connection pool
const config = require('../config/config');

async function fetchAllIncidents() {

  try {
    // Fetch the first page to get totalIncidents count
    const response = await axios.get(config.incidentAPI);
    const html = response.data;
    const $ = cheerio.load(html);

    // Extract total incidents from hidden input field
    const totalIncidents = parseInt($('#cphContent_hdnTotal').val(), 10) || 0;
    
    if (totalIncidents === 0) {
      console.log("No incidents found.");
      return [];
    }

    // Calculate total pages (5 incidents per page)
    const totalPages = Math.ceil(totalIncidents / 5);
    console.log(`Total Incidents: ${totalIncidents}, Total Pages: ${totalPages}`);

    let allIncidents = [];

    // Loop through all pages and collect incident data
    for (let page = 1; page <= totalPages; page++) {
      console.log(`Fetching data from page ${page}...`);
      const incidents = await fetchAndStoreIncidents(page);
      allIncidents = allIncidents.concat(incidents);
    }

    console.log(`Total incidents collected: ${allIncidents.length}`);
    return allIncidents;

  } catch (error) {
    console.error("Error fetching total incidents:", error.message);
    return [];
  }
}

/**
 * Fetches incident data from a specific page (using GET request-based pagination)
 */
async function getDailyIncidents(pageNumber) {
  //  Append the page number to the URL for pagination
  const url = `${config.incidentAPI}&page=${pageNumber}`;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const totalIncidents = $('#cphContent_hdnTotal').val();

    return parseNewsItems($);
  } catch (error) {
    console.error(` Error fetching data from page ${pageNumber}:`, error.message);
    return [];
  }
}


/**
 * Retrieves the total number of pages available for incidents
 */
async function getTotalPages() {
  try {
    console.log(" Detecting the total number of pages...");

    const response = await axios.get(config.incidentAPI);
    const html = response.data;
    const $ = cheerio.load(html);

    let totalPages = 1; // Default value

    //  Detect the maximum number of pages from pagination links
    const paginationLinks = $('a.pageNumber');
    paginationLinks.each((i, el) => {
      const pageNum = parseInt($(el).text().trim(), 10);
      if (!isNaN(pageNum) && pageNum > totalPages) {
        totalPages = pageNum;
      }
    });

    console.log(` Total pages detected: ${totalPages}`);
    return totalPages;
  } catch (error) {
    console.error(' Error detecting total pages:', error.message);
    return 1; // Default to 1 if an error occurs
  }
}

/**
 * Parses incident data from the provided Cheerio-loaded HTML
 */
function parseNewsItems($) {
  const newsItems = [];
  const newsContainer = $('div.newsContainer');

  if (newsContainer.length > 0) {
    newsContainer.find('div.newsItem').each((i, elem) => {
      const title = $(elem).find('h2').text().trim() || 'No Title';
      const postedDate = $(elem).find('span.newsItem_PostedDate').text().trim() || 'No Posted Date';
      const description = $(elem).find('span[id*="lblDescription"]').text().trim() || 'No Description';

      //  Extract incident details (number, date, location)
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
    console.log(' Could not find the Daily Incidents section.');
  }
  return newsItems;
}

/**
 * Extracts incident number, date, and location from the incident description
 */
function parseDescription(rawDesc) {
  let incidentNumber = '';
  let incidentDate = '';
  let location = '';

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
 * Fetches incident data from a specific page and inserts it into MySQL
 */
async function fetchAndStoreIncidents(pageNumber) {
  try {
    const incidents = await getDailyIncidents(pageNumber);

    if (incidents.length === 0) {
      console.log(` Page ${pageNumber}: No data found.`);
      return;
    }

    for (const item of incidents) {
      await sleep(150);
      // Get coordinates from the location
      const { latitude, longitude } = await getCoordinates(item.location);

      const insertQuery = `
        INSERT INTO news_items
          (title, posted_date, incident_number, incident_date, location, latitude, longitude, receivedFrom)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await pool.query(insertQuery, [
        item.title,
        item.postedDate,
        item.incidentNumber,
        item.incidentDate,
        item.location,
        latitude,
        longitude,
        0
      ]);
    }

    console.log(` Page ${pageNumber}: ${incidents.length} records inserted.`);
  } catch (error) {
    console.error(` Error inserting data from page ${pageNumber}:`, error.message);
  }
}

/**
 * Fetches all pages dynamically and stores data in MySQL
 */
async function fetchAllPages() {
  try {
    const totalPages = await getTotalPages(); // Retrieve total number of pages

    for (let page = 1; page <= totalPages; page++) {
      console.log(` Fetching data from page ${page}...`);
      await fetchAndStoreIncidents(page);
      break;
    }

    console.log(' Successfully processed all pages.');
  } catch (error) {
    console.error(' Error fetching all pages:', error.message);
  }
}

/**
 * Retrieves all incidents from the database
 */
async function getIncidents() {
  try {
    const [rows] = await pool.query('SELECT title, posted_date, incident_number, incident_description, incident_date, location, latitude, longitude, receivedFrom, created_at FROM news_items ORDER BY incident_date DESC');
    return rows;
  } catch (error) {
    console.error(' Error fetching data:', error.message);
  }
}

/**
 * Retrieves a single incident by its ID
 */
async function getIncidentsById(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM news_items WHERE id = ?', [id]);

    if (rows.length === 0) {
      console.log(` ID ${id}: No data found.`);
    }

    return rows;
  } catch (error) {
    console.error(' Error fetching single incident:', error.message);
  }
}

async function uploadIncident(req) {
  try {
    const incident = req.body;

    const { latitude, longitude } = await getCoordinates(incident.location);

    const insertQuery = `
      INSERT INTO news_items
        (title, posted_date, incident_description, incident_date, location, latitude, longitude, receivedFrom)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(insertQuery, [
      req.body.title,
      req.body.posted_date,
      req.body.incident_description,
      req.body.incident_date,
      req.body.location,
      latitude, 
      longitude,
      1
    ]);
  } catch (error) {
    console.error(` Error inserting data from page ${pageNumber}:`, error.message);
  }
}

async function getCoordinates(address) {
  try {
    let convertAddress = address.split(',')[0]+ ' ON';
    const query = `${config.geoCodeAPI}` +
    `api_key=${config.geoCodeApiKey}&` +
    `text=${convertAddress}`.replace(' ', '+');
        const response = await axios.get(query);
    
    if (response.data.features.length > 0) {
      return {
        longitude: parseFloat(response.data.features[0].geometry.coordinates[0]),
        latitude: parseFloat(response.data.features[0].geometry.coordinates[1]),
      };
    } else {
      console.warn(`Coordinates not found for: ${address}`);
      return { latitude: null, longitude: null };
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    return { latitude: null, longitude: null };
  }
}

async function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}


//  Export functions for use in other modules
module.exports = {
  fetchAllIncidents,
  fetchAndStoreIncidents,
  fetchAllPages,
  getIncidents,
  getIncidentsById,
  uploadIncident,
  getCoordinates,
};
