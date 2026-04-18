const { geocodeLocation } = require('../services/geocodeService');

const getGeocode = async (req, res) => {
  const { query } = req.query;

  // Validate input
  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  try {
    const results = await geocodeLocation(query);

    if (results.length === 0) {
      return res.status(404).json({ error: 'No results found for that location.' });
    }

    res.json({ results });
  } catch (err) {
    if (err.code === 'MISSING_API_KEY') {
      return res.status(503).json({
        error: 'Geocoding is not configured. Set GEOAPIFY_API_KEY in server/.env.',
      });
    }

    const status = err.response?.status;
    if (status === 401) {
      return res.status(401).json({
        error: 'Geoapify rejected the API key (invalid or unauthorized).',
      });
    }
    if (status === 429) {
      return res.status(429).json({ error: 'Geocoding rate limit exceeded. Try again later.' });
    }
    if (status) {
      console.error('Geocode error:', status, err.response?.data || err.message);
      return res.status(status >= 500 ? 502 : status).json({
        error: 'Geocoding request failed.',
        detail: err.response?.data?.message || err.message,
      });
    }

    console.error('Geocode error:', err.message);
    res.status(500).json({ error: 'Failed to fetch geocoding data.' });
  }
};

module.exports = { getGeocode };

// This controller handles the API endpoint for geocoding.
// It validates the input, calls the geocode service, and returns the results.
// If no results are found, it returns a 404 error.
// If there's an error, it returns a 500 error.

// Why separate controller from service? 
// The controller handles HTTP concerns (request, response, status codes). 
// The service handles business logic (calling Geoapify). 
// If you ever swap Geoapify for a different API, you only change the service — the controller stays untouched.