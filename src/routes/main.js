const express = require('express');
const router = express.Router();

const adminRoutes = require('./admin');
const customerRoutes = require('./customer');
const wasteTypeRoutes = require('./wasteType');

router.use('/admin', adminRoutes);
router.use('/customer', customerRoutes);
router.use('/wasteType', wasteTypeRoutes);

module.exports = router;