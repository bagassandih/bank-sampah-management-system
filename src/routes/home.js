const express = require('express');

// initiate router
const router = express.Router();

// Sub route / for login
router.get('/', (req, res) => res.render('home') );

module.exports = router;
