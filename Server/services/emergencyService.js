const axios = require('axios');
const pool = require('../services/mysql'); // MySQL connection pool
const config = require('../config/config');

// Fetch data from external ArcGIS APIs, save to MySQL, and return combined GeoJSON
async function fetchAndSaveData() {
  try {
    // Make both API calls concurrently
    const axiosResopnse = await axios.get(config.emergencyAPI);
    
    // Extract the GeoJSON data from each response
    const emergencyData = axiosResopnse.data;
    
    const combinedFeatures = [];
    if (emergencyData && emergencyData.features) {
      combinedFeatures.push(...emergencyData.features);
    }
    
    // Save each feature to the MySQL table "emergency_services"
    for (const feature of combinedFeatures) {
      await pool.query('INSERT INTO emergency_services (feature) VALUES (?)', [JSON.stringify(feature)]);
    }
    
    return {
      type: 'FeatureCollection',
      features: combinedFeatures
    };
  } catch (error) {
    console.error('Error occurred while processing ArcGIS data:', error);
    throw error;
  }
}

// Retrieve saved ArcGIS data from MySQL and return with metadata
async function getSavedData() {
  try {
    const [rows] = await pool.query('SELECT feature FROM emergency_services');

    const features = rows.map(row =>row.feature);

    return {
      status: 'success',
      data: {
        features: features,
        totalCount: features.length,
        lastUpdated: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error fetching saved ArcGIS data:', error);
    throw error;
  }
}

module.exports = {
  fetchAndSaveData,
  getSavedData
};
