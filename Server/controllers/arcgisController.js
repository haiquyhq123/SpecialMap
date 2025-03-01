const arcgisService = require('../services/arcgisService');

exports.fetchAndSaveArcgisData = async (req, res) => {
  try {
    const data = await arcgisService.fetchAndSaveData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error occurred while fetching and saving ArcGIS data' });
  }
};

exports.getSavedArcgisData = async (req, res) => {
  try {
    const data = await arcgisService.getSavedData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error occurred while retrieving saved ArcGIS data' });
  }
};
