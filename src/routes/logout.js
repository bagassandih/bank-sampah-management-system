const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');

// Sub route / for home
router.get('/', adminController.auth, (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.send('logout');
});

module.exports = router;
