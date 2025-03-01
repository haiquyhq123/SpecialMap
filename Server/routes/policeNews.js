const express = require('express');
const router = express.Router();
const policeNewsController = require('../controllers/policeNewsController');
const pool = require('../services/mysql');

router.post('/fetchAllPages', policeNewsController.fetchAllPages);
router.post('/incidents/upload', policeNewsController.uploadIncident);
router.get('/incidents', policeNewsController.getIncidents);
router.get('/incidents/:id', policeNewsController.getIncidentsById);

/**
 * POST /api/incidents/upload
 * Inserts incidents from JSON payload into the database.
 */
router.post('/incidents/upload', async (req, res) => {
    try {
  
      // if (!Array.isArray(jsonData)) {
      //   return res.status(400).json({ status: 'error', message: 'Invalid JSON format. Expected an array.' });
      // }
  
      // const insertQuery = `
      //   INSERT INTO news_items (incident_number, posted_date, incident_date, location, title)
      //   VALUES (?, ?, ?, ?)
      // `;
  
      // // Process each JSON object in the array
      // for (const item of jsonData) {
      //   if (!item.infotext || !Array.isArray(item.infotext)) {
      //     console.error('Invalid entry:', item);
      //     continue; // Skip invalid entries
      //   }
  
      //   for (const textBlock of item.infotext) {
      //     // Extracting necessary fields from HTML string
      //     const extractedData = extractIncidentDetails(textBlock);
  
      //     if (extractedData) {
      //       await pool.query(insertQuery, [
      //         extractedData.incidentNumber,
      //         extractedData.posted_date,
      //         extractedData.incidentDate,
      //         extractedData.location,
      //         extractedData.title,
              
      //       //   extractedData.description
      //       ]);
      //     }
      //   }
      // }
  
      res.json({ status: 'success', message: 'Incidents inserted successfully.' });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  });
  
  /**
   * Extracts incident details from the given HTML string.
   */
  function extractIncidentDetails(htmlString) {
    const regex = /Incident #:\s*(.*?)\s*<br>\s*Incident Date:\s*(.*?)\s*<br>\s*Location:\s*(.*?)\s*<br>/s;
    const match = htmlString.match(regex);
  
    if (!match) return null;
  
    return {
      incidentNumber: match[1].trim(),
      incidentDate: match[2].trim(),
      location: match[3].trim(),
      title: extractTitle(htmlString),
      description: htmlString.replace(/<\/?[^>]+(>|$)/g, "").trim() // Remove HTML tags
    };
  }
  
  /**
   * Extracts the title from the HTML string.
   */
  function extractTitle(htmlString) {
    const titleRegex = /title="Read More (.*?)">/s;
    const titleMatch = htmlString.match(titleRegex);
    return titleMatch ? titleMatch[1].trim() : 'No Title';
  }

module.exports = router;
