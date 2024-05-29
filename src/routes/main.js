const express = require('express');
const router = express.Router();

const adminRoutes = require('./admin');
const customerRoutes = require('./customer');
const wastetypeRoutes = require('./wastetype');

router.use('/admin', adminRoutes);
router.use('/customer', customerRoutes);
router.use('/wastetype', wastetypeRoutes);

module.exports = router;