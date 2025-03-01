const policeNewsService = require('../services/policeNewsService');

exports.getPoliceNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const newsItems = await policeNewsService.fetchAndStoreIncidents(page);
    res.json({ dailyIncidents: newsItems });
  } catch (error) {
    res.status(500).json({ error: 'Error occurred while fetching Daily Incidents data' });
  }
};
