const express = require('express');
const router = express.Router();
const policeNewsController = require('../controllers/policeNewsController');
const pool = require('../services/mysql');

router.get('/', policeNewsController.getPoliceNews);
/**
 * GET /api/incidents
 * Retrieves all incidents from the database and returns them as JSON.
 */
router.get('/incidents', async (req, res) => {
  try {
    // Query to fetch all records from 'news_items' table
    const [rows] = await pool.query('SELECT * FROM news_items ORDER BY incident_date DESC');

    // Return the data as JSON response
    res.json({
      status: 'success',
      totalRecords: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

/**
 * GET /api/incidents/:id
 * Retrieves a single incident by its ID.
 */
router.get('/incidents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM news_items WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Incident not found' });
    }

    res.json({
      status: 'success',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching single incident:', error.message);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
});

module.exports = router;



module.exports = router;
