const express = require('express');
const withdrawalController = require('../controllers/withdrawal');
const adminController = require('../controllers/admin');

// initiate router
const router = express.Router();

// Sub route / for Withdrawal
router.get('/', adminController.auth, withdrawalController.getWithdrawal);
router.post('/', adminController.auth, withdrawalController.createWithdrawal);
router.put('/', adminController.auth, withdrawalController.updateWithdrawal);
router.delete('/', adminController.auth, withdrawalController.deleteWithdrawal);

module.exports = router;
