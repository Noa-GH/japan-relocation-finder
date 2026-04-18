const express = require('express');
const cors = require('cors');
require('dotenv').config();

const geocodeRoutes = require('./routes/geocodeRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/geocode', geocodeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// This file sets up the server and listens for requests.
// It uses the express app to handle the requests.
// It uses the cors middleware to handle the CORS policy.
// It uses the express.json middleware to handle the JSON requests.
// It uses the geocodeRoutes to handle the geocoding requests.
// It uses the health check to check if the server is running.
// It listens for requests on the port specified in the .env file.
// It logs a message to the console when the server is running.

// Why separate server file? The server file is the main file that starts the server and listens for requests.
// The server file uses the express app to handle the requests.
// The server file uses the cors middleware to handle the CORS policy.