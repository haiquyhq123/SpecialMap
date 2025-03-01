const express = require('express');
const router = express.Router();
const arcgisController = require('../controllers/arcgisController');

router.get('/', arcgisController.fetchAndSaveArcgisData);
router.get('/saved', arcgisController.getSavedArcgisData);

module.exports = router;
