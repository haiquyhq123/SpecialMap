const axios = require('axios');
const pool = require('../services/mysql'); // MySQL connection pool
const config = require('../config/config');

// Fetch data from external ArcGIS APIs, save to MySQL, and return combined GeoJSON
async function fetchAndSaveData() {
  try {
    // Make both API calls concurrently
    const [currentRes, futureRes] = await Promise.all([
      axios.get(config.currentConstructionAPI),
      axios.get(config.futureConstructionAPI)
    ]);
    
    // Extract the GeoJSON data from each response
    const currentData = currentRes.data;
    const futureData = futureRes.data;
    
    const combinedFeatures = [];
    if (currentData && currentData.features) {
      combinedFeatures.push(...currentData.features);
    }
    if (futureData && futureData.features) {
      combinedFeatures.push(...futureData.features);
    }
    
    // Save each feature to the MySQL table "arcgis_features"
    for (const feature of combinedFeatures) {
      await pool.query('INSERT INTO arcgis_features (feature) VALUES (?)', [JSON.stringify(feature)]);
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
    const [rows] = await pool.query('SELECT feature FROM arcgis_features');
    // const features = rows.map(row => JSON.parse(row.feature));

    const features = rows.map(row =>row.feature);

    // console.log("Raw feature data:", rows[0]?.feature);

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
