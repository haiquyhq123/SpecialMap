const policeNewsService = require('../services/policeNewsService');

async function fetchAllPages(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const newsItems = await policeNewsService.fetchAllIncidents(page);
    res.json({ dailyIncidents: newsItems });
  } catch (error) {
    res.status(500).json({ error: 'Error occurred while fetching Daily Incidents data' });
  }
};

async function getIncidents(req, res) {
  try {
    const newsItems = await policeNewsService.getIncidents();
    res.json({ dailyIncidents: newsItems });
  } catch (error) {
    res.status(500).json({ error: 'Error occurred while fetching Daily Incidents data' });
  }
};

async function getIncidentsById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }
    
    const newsItems = await policeNewsService.getIncidentsById(id);
    res.json({ dailyIncidents: newsItems });
  } catch (error) {
    res.status(500).json({ error: 'Error occurred while fetching Daily Incidents data' });
  }
};

// Export the function for use in other modules
module.exports = {
  fetchAllPages,
  getIncidents,
  getIncidentsById,
};