const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// Sub route / for home
router.get('/', adminController.auth, (req, res) => {
  res.clearCookie('token').send('logout');
});

module.exports = router;
