const axios = require('axios');

const getRoute = async (originLat, originLon, destLat, destLon, mode = 'drive') => {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  const response = await axios.get('https://api.geoapify.com/v1/routing', {
    params: {
      waypoints: `${originLat},${originLon}|${destLat},${destLon}`,
      mode,
      apiKey,
    },
  });


  const features = response.data.features;

  if (!features || features.length === 0) {
    return null;
  }

  // Pull only what we need from the response
  const properties = features[0].properties;

  return {
    distance: {
      meters: properties.distance,
      kilometers: (properties.distance / 1000).toFixed(2),
    },
    duration: {
      seconds: properties.time,
      minutes: Math.round(properties.time / 60),
    },
    mode,
  };
};

module.exports = { getRoute };

// What's happening here? Geoapify's routing API expects coordinates, not place names, so we're passing in lat/lon pairs directly. 
// The mode parameter controls travel type — we default it to drive but support others. 
// We then clean the response down to just distance and duration, which is all the frontend needs.