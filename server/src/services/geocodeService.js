const axios = require('axios');

const geocodeLocation = async (query) => {
  const apiKey = process.env.GEOAPIFY_API_KEY?.trim();
  if (!apiKey) {
    const err = new Error('GEOAPIFY_API_KEY is not set');
    err.code = 'MISSING_API_KEY';
    throw err;
  }

  const response = await axios.get('https://api.geoapify.com/v1/geocode/search', {
    params: {
      text: query,
      lang: 'en',
      limit: 5,
      format: 'json',
      apiKey,
    },
  });

  const results = response.data.results;

  if (!results || results.length === 0) {
    return [];
  }

  // Clean the response — only return what your app actually needs
  return results.map((place) => ({
    name: place.formatted,
    lat: place.lat,
    lon: place.lon,
    city: place.city || null,
    county: place.county || null,
    state: place.state || null,
    country: place.country || null,
    placeId: place.place_id || null,
  }));
};

module.exports = { geocodeLocation };

// This function takes a location name (e.g., "Tokyo, Japan") and 
// returns an array of 5 possible locations with their coordinates, city, county, state, country, and place ID.
// Why clean the response? Geoapify returns a large object with many fields you don't need. 
// Trimming it down means less noise in your frontend and better performance.