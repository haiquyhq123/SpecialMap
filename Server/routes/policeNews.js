const express = require('express');
const router = express.Router();
const policeNewsController = require('../controllers/policeNewsController');
const pool = require('../services/mysql');

router.post('/fetchAllPages', policeNewsController.fetchAllPages);
router.post('/incidents/upload', policeNewsController.uploadIncident);
router.get('/incidents', policeNewsController.getIncidents);
router.get('/incidents/:id', policeNewsController.getIncidentsById);

module.exports = router;
