const express = require('express');
const adminController = require('../controllers/admin');

// initiate router
const router = express.Router();

// Sub route / for login
router.post('/login', adminController.loginController);

module.exports = router;
