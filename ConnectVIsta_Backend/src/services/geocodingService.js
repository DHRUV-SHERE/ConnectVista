// services/geocodingService.js
const axios = require('axios');
const NodeGeocoder = require('node-geocoder');

class GeocodingService {
  constructor() {
    // Option 1: OpenStreetMap (Free)
    this.geocoder = NodeGeocoder({
      provider: 'openstreetmap',
      httpAdapter: 'https',
      formatter: null
    });

    // Option 2: Google Maps (More accurate, requires API key)
    this.googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
  }

  async geocodeAddress(addressString) {
    try {
      console.log(`Geocoding address: ${addressString}`);
      
      // Try OpenStreetMap first (free)
      const osmResults = await this.geocoder.geocode(addressString);
      
      if (osmResults && osmResults.length > 0) {
        const result = osmResults[0];
        return {
          latitude: result.latitude,
          longitude: result.longitude,
          formattedAddress: result.formattedAddress || addressString,
          source: 'openstreetmap'
        };
      }

      // Fallback to Google Maps if available
      if (this.googleApiKey) {
        return await this.geocodeWithGoogle(addressString);
      }

      throw new Error('No geocoding results found');
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  async geocodeWithGoogle(addressString) {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: addressString,
          key: this.googleApiKey
        }
      });

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
          formattedAddress: response.data.results[0].formatted_address,
          source: 'google'
        };
      }
      throw new Error('Google geocoding returned no results');
    } catch (error) {
      console.error('Google geocoding error:', error);
      throw error;
    }
  }

  async getCoordinatesFromAddress(addressParts) {
    try {
      // Build full address string from all provided parts
      const addressPartsArray = [];
      
      if (addressParts.street) addressPartsArray.push(addressParts.street);
      if (addressParts.city) addressPartsArray.push(addressParts.city);
      if (addressParts.state) addressPartsArray.push(addressParts.state);
      if (addressParts.pinCode) addressPartsArray.push(addressParts.pinCode);
      addressPartsArray.push('India'); // Always include country

      const addressString = addressPartsArray.join(', ');
      
      console.log(`Geocoding full address: ${addressString}`);
      
      const result = await this.geocodeAddress(addressString);
      
      // Validate the geocoding result
      this.validateGeocodeResult(result, addressString);
      
      console.log(`Geocoded result: lat=${result.latitude}, lng=${result.longitude}`);
      
      return {
        type: 'Point',
        coordinates: [result.longitude, result.latitude] // GeoJSON format: [lng, lat]
      };
    } catch (error) {
      console.error('Failed to get coordinates:', error);
      throw new Error(`Failed to geocode address: ${error.message}`);
    }
  }

  validateGeocodeResult(result, addressString) {
    // Check if lat/lng exist
    if (!result || !result.latitude || !result.longitude) {
      throw new Error('Invalid geocode response: missing latitude or longitude');
    }

    // Check for valid coordinate ranges
    if (result.latitude < -90 || result.latitude > 90) {
      throw new Error('Invalid latitude value');
    }
    if (result.longitude < -180 || result.longitude > 180) {
      throw new Error('Invalid longitude value');
    }

    // If we have access to result types, check for country-level results
    // This applies when the geocoder returns a country instead of a specific address
    if (result.types && Array.isArray(result.types) && result.types.includes('country')) {
      throw new Error('Address too vague: geocoder returned country-level result. Please provide a more specific address.');
    }

    // Additional check: if coordinates point to center of India (default fallback indicator)
    // India's center is approximately [78.9629, 20.5937]
    const INDIA_CENTER_LNG = 78.9629;
    const INDIA_CENTER_LAT = 20.5937;
    const TOLERANCE = 0.5; // Allow some tolerance

    if (Math.abs(result.longitude - INDIA_CENTER_LNG) < TOLERANCE && 
        Math.abs(result.latitude - INDIA_CENTER_LAT) < TOLERANCE) {
      throw new Error('Geocoder returned default India coordinates. Please provide a more specific address.');
    }
  }

  // Calculate distance between two coordinates in kilometers
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI/180);
  }
}

module.exports = new GeocodingService();