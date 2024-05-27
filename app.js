// Import package
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// initialize server and db
const app = express();
const port = process.env.PORT || 5000;
const dbUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME;

// Middleware for parsing body from request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect db
mongoose.connect(dbUrl + dbName)
    .then(() => {
        console.log('DB connected:', dbName);
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Run server
app.listen(port, () => console.log('Server running:', port));