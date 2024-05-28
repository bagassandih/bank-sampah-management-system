const express = require('express');
const router = express.Router();

const adminRoutes = require('./admin');
const customerRoutes = require('./customer');

router.use('/admin', adminRoutes);
router.use('/customer', customerRoutes);

module.exports = router;