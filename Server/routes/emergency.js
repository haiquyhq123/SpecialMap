const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');

router.get('/', emergencyController.fetchAndSaveData);
router.get('/saved', emergencyController.getSavedData);

module.exports = router;
