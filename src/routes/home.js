const express = require('express');
const homeController = require('../controllers/home');
const adminController = require('../controllers/admin');
// initiate router
const router = express.Router();

// Sub route / for home
router.get('/', adminController.auth, homeController.getHomeData);

module.exports = router;
