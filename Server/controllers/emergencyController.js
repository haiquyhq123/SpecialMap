const emergencyService = require('../services/emergencyService');

exports.fetchAndSaveData = async (req, res) => {
  try {
    const data = await emergencyService.fetchAndSaveData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error occurred while fetching and saving ArcGIS data' });
  }
};

exports.getSavedData = async (req, res) => {
  try {
    const data = await emergencyService.getSavedData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error occurred while retrieving saved ArcGIS data' });
  }
};
