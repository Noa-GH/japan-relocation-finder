const express = require('express');
const router = express.Router();
const { getRouteData } = require('../controllers/routeController');

router.get('/', getRouteData);

module.exports = router;