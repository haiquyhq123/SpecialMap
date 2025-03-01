const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');

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
    
    // Send POST request to simulate page change
    const postResponse = await axios.post(url, qs.stringify(formData), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const postHtml = postResponse.data;
    const $$ = cheerio.load(postHtml);
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
      
      newsItems.push({
        title,
        postedDate,
        description
      });
    });
  } else {
    console.log('Could not find the Daily Incidents section.');
  }
  return newsItems;
}

module.exports = {
  getDailyIncidents
};
