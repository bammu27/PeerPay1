const axios = require('axios');


async function getCoordinates(address) {
  const openCageApiKey = process.env.OPENCAGE_API_KEY;  // Replace with your OpenCage API key
  const baseUrl = 'https://api.opencagedata.com/geocode/v1/json';

  const addressString = `${address.street}, ${address.city}, ${address.state}, ${address.pincode}`;

  try {
    const response = await axios.get(baseUrl, {
      params: {
        q: addressString,
        key: openCageApiKey,
      },
    });

    // Log the response for debugging
    

    if (response.data.results && response.data.results.length > 0) {
      // Extract coordinates from the response
      const location = response.data.results[0].geometry;
      return {
        lat: location.lat,
        lon: location.lng,
      };
    } else {
      throw new Error("No coordinates found for the provided address.");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    throw new Error("Error fetching coordinates: " + error.message);
  }
}



module.exports = getCoordinates;
