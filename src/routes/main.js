const express = require('express');
const router = express.Router();

const adminRoutes = require('./admin');
const customerRoutes = require('./customer');
const wasteTypeRoutes = require('./wasteType');
const depositRoutes = require('./deposit');
const withdrawalRoutes = require('./withdrawal');

router.use('/admin', adminRoutes);
router.use('/customer', customerRoutes);
router.use('/wasteType', wasteTypeRoutes);
router.use('/deposit', depositRoutes);
router.use('/withdrawal', withdrawalRoutes);

module.exports = router;