const express = require('express');
const router = express.Router();

const adminRoutes = require('./admin');
const customerRoutes = require('./customer');
const wasteTypeRoutes = require('./wasteType');
const depositRoutes = require('./deposit');
const withdrawalRoutes = require('./withdrawal');
const homeRoutes = require('./home');

router.use('/', adminRoutes);
router.use('/customer', customerRoutes);
router.use('/wasteType', wasteTypeRoutes);
router.use('/deposit', depositRoutes);
router.use('/withdrawal', withdrawalRoutes);
router.use('/home', homeRoutes);

module.exports = router;