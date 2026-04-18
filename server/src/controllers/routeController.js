const { getRoute } = require('../services/routeServices');

const getRouteData = async (req, res) => {
  const { originLat, originLon, destLat, destLon, mode } = req.query;

  // Validate all required params are present
  if (!originLat || !originLon || !destLat || !destLon) {
    return res.status(400).json({
      error: 'originLat, originLon, destLat, and destLon are all required.',
    });
  }

  // Validate they are actual numbers
  const coords = [originLat, originLon, destLat, destLon];
  const allNumbers = coords.every((c) => !isNaN(parseFloat(c)));

  if (!allNumbers) {
    return res.status(400).json({
      error: 'All coordinate parameters must be valid numbers.',
    });
  }

  // Validate travel mode if provided
  const validModes = ['drive', 'walk', 'bicycle', 'transit'];
  if (mode && !validModes.includes(mode)) {
    return res.status(400).json({
      error: `Invalid mode. Must be one of: ${validModes.join(', ')}.`,
    });
  }

  try {
    const result = await getRoute(originLat, originLon, destLat, destLon, mode);

    if (!result) {
      return res.status(404).json({ error: 'No route found between these locations.' });
    }

    res.json({ route: result });
  } catch (err) {
    console.error('Route error:', err.message);
    console.error('Route error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch route data.' });
  }
};

module.exports = { getRouteData };

// Why validate coordinates as numbers? If someone passes originLat=tokyo instead of originLat=35.6762, Geoapify will reject it. 
// Catching that on your side means a cleaner, more descriptive error for whoever is using the API.