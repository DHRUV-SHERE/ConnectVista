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
      const { street, city, state, pinCode } = addressParts;
      const addressString = `${street}, ${city}, ${state} ${pinCode}, India`;
      
      const result = await this.geocodeAddress(addressString);
      
      return {
        type: 'Point',
        coordinates: [result.longitude, result.latitude] // GeoJSON format: [lng, lat]
      };
    } catch (error) {
      console.error('Failed to get coordinates:', error);
      // Return default coordinates (center of India)
      return {
        type: 'Point',
        coordinates: [78.9629, 20.5937] // Default: center of India
      };
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