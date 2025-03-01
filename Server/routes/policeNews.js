const express = require('express');
const router = express.Router();
const policeNewsController = require('../controllers/policeNewsController');

router.get('/', policeNewsController.getPoliceNews);

module.exports = router;
