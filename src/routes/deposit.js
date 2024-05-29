const express = require('express');
const depositController = require('../controllers/deposit');
const adminController = require('../controllers/admin');

// initiate router
const router = express.Router();

// Sub route / for Deposit
router.get('/', adminController.auth, depositController.getDeposit);
router.post('/', adminController.auth, depositController.createDeposit);
router.put('/', adminController.auth, depositController.updateDeposit);
router.delete('/', adminController.auth, depositController.deleteDeposit);

module.exports = router;
