const express = require('express');
const customerController = require('../controllers/customer');

// initiate router
const router = express.Router();

// Sub route / for customer
router.get('/', customerController.getCustomer);

module.exports = router;
