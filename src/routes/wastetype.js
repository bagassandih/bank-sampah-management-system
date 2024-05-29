const express = require('express');
const wastetypeController = require('../controllers/wastetype');
const adminController = require('../controllers/admin');

// initiate router
const router = express.Router();

// Sub route / for wastetype
router.get('/', adminController.auth, wastetypeController.getWastetype);
router.post('/', adminController.auth, wastetypeController.createWastetype);
router.put('/', adminController.auth, wastetypeController.updateWastetype);
router.delete('/', adminController.auth, wastetypeController.deleteWastetype);

module.exports = router;
