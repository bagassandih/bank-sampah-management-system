const express = require('express');
const customerController = require('../controllers/customer');
const adminController = require('../controllers/admin');

// initiate router
const router = express.Router();

// Sub route / for customer
router.get('/', adminController.auth, customerController.getCustomers);

module.exports = router;
