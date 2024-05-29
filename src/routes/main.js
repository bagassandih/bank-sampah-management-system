const express = require('express');
const router = express.Router();

const adminRoutes = require('./admin');
const customerRoutes = require('./customer');
const wasteTypeRoutes = require('./wasteType');
const depositRoutes = require('./deposit');

router.use('/admin', adminRoutes);
router.use('/customer', customerRoutes);
router.use('/wasteType', wasteTypeRoutes);
router.use('/deposit', depositRoutes);

module.exports = router;