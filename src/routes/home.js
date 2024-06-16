const express = require('express');
const adminController = require('../controllers/admin');
// initiate router
const router = express.Router();

// Sub route / for login
router.get('/', adminController.auth, (req, res) => {
  res.render('home', { full_name: req.user?.full_name ?? null })
});

module.exports = router;
