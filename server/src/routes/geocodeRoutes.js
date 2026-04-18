const express = require('express');
const router = express.Router();
const { getGeocode } = require('../controllers/geocodeController');

router.get('/', getGeocode);

module.exports = router;
