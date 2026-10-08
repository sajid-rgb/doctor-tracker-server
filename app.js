const express = require('express');
const router = require('./routes');
const mongoose = require('mongoose');
const app = express();
const connectDB = require('./config/db');

// Middleware to parse JSON bodies
app.use(express.json());

const cors = require('cors');
// Enable CORS for all routes
app.use(cors());

// Sample API route

const dotenv = require('dotenv');
dotenv.config();

const portFromEnv = process.env.PORT || 3000;

const port = portFromEnv;

connectDB();

// Use the users router
app.use('/api', router);
app.use(router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
