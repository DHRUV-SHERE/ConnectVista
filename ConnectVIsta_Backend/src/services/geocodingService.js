// services/geocodingService.js
const axios = require('axios');

class GeocodingService {
  constructor() {
    this.googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
    this.osmTimeout = 5000; // 5 seconds timeout for OpenStreetMap
    this.maxRetries = 2; // Number of retry attempts
  }

  async geocodeWithOpenStreetMap(addressString, retryCount = 0) {
    try {
      console.log(`Geocoding address with OpenStreetMap (attempt ${retryCount + 1}): ${addressString}`);

      // Using axios directly for better control over timeout
      const encodedAddress = encodeURIComponent(addressString);
      const url = `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${encodedAddress}&format=json&limit=1`;

      const response = await axios.get(url, {
        timeout: this.osmTimeout,
        headers: {
          'User-Agent': 'ConnectVista/1.0 (contact@connectvista.com)'
        }
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          formattedAddress: result.display_name || addressString,
          source: 'openstreetmap'
        };
      }

      return null;
    } catch (error) {
      console.error(`OpenStreetMap geocoding error (attempt ${retryCount + 1}):`, error.code);

      // Retry on timeout or network errors
      if (retryCount < this.maxRetries && (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND' || error.code === 'ECONNRESET')) {
        console.log(`Retrying OpenStreetMap geocoding in 2 seconds...`);
        await this.sleep(2000); // Wait 2 seconds before retry
        return this.geocodeWithOpenStreetMap(addressString, retryCount + 1);
      }

      throw error;
    }
  }

  async geocodeAddress(addressString) {
    try {
      // Try OpenStreetMap first (free)
      const osmResult = await this.geocodeWithOpenStreetMap(addressString);

      if (osmResult) {
        return osmResult;
      }

      // Fallback to Google Maps if available and OpenStreetMap returned no results
      if (this.googleApiKey) {
        console.log('OpenStreetMap returned no results, trying Google Maps...');
        return await this.geocodeWithGoogle(addressString);
      }

      // If no results from any provider, return null
      console.log('No geocoding results found from any provider');
      return null;
    } catch (error) {
      console.error('All geocoding providers failed:', error.message);

      // Return null to trigger fallback to default coordinates
      return null;
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

  // Generate approximate coordinates based on PIN code (India)
  async geocodeByPinCode(pinCode) {
    try {
      console.log(`Trying to geocode by PIN code: ${pinCode}`);

      // Common Indian city coordinates for fallback based on major cities/areas
      const pinCodeRegions = {
        // Ahmedabad
        '382': { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
        '380': { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
        // Mumbai
        '400': { city: 'Mumbai', lat: 19.0760, lng: 72.8777 },
        // Delhi
        '110': { city: 'Delhi', lat: 28.7041, lng: 77.1025 },
        // Bangalore
        '560': { city: 'Bangalore', lat: 12.9716, lng: 77.5946 },
        // Hyderabad
        '500': { city: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
        // Chennai
        '600': { city: 'Chennai', lat: 13.0827, lng: 80.2707 },
        // Kolkata
        '700': { city: 'Kolkata', lat: 22.5726, lng: 88.3639 },
        // Pune
        '411': { city: 'Pune', lat: 18.5204, lng: 73.8567 },
        // Surat
        '395': { city: 'Surat', lat: 21.1702, lng: 72.8311 },
        // Vadodara
        '390': { city: 'Vadodara', lat: 22.3072, lng: 73.1812 },
        // Rajkot
        '360': { city: 'Rajkot', lat: 22.3039, lng: 70.8022 },
        // Jaipur
        '302': { city: 'Jaipur', lat: 26.9124, lng: 75.7873 },
        // Lucknow
        '226': { city: 'Lucknow', lat: 26.8467, lng: 80.9462 },
        // Kanpur
        '208': { city: 'Kanpur', lat: 26.4499, lng: 80.3319 },
        // Nagpur
        '440': { city: 'Nagpur', lat: 21.1458, lng: 79.0882 },
        // Indore
        '452': { city: 'Indore', lat: 22.7196, lng: 75.8577 },
        // Thane
        '400': { city: 'Thane', lat: 19.1863, lng: 72.9668 },
      };

      // Check if we have region data for this PIN code
      const prefix = pinCode.substring(0, 3);
      if (pinCodeRegions[prefix]) {
        const region = pinCodeRegions[prefix];
        console.log(`Found approximate coordinates for PIN code region ${prefix}:`, region);
        return {
          latitude: region.lat,
          longitude: region.lng,
          formattedAddress: `${region.city}, India (approximate)`,
          source: 'pincode-fallback'
        };
      }

      // Default center of India if no specific region found
      console.log(`No specific region found for PIN code ${pinCode}, using default India coordinates`);
      return {
        latitude: 22.7196,
        longitude: 75.8577,
        formattedAddress: 'India (approximate by PIN code)',
        source: 'india-default'
      };
    } catch (error) {
      console.error('PIN code geocoding error:', error);
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

      // Try geocoding the full address
      let result = await this.geocodeAddress(addressString);

      if (result) {
        // Validate the geocoding result
        this.validateGeocodeResult(result, addressString);
        console.log(`Geocoded result: lat=${result.latitude}, lng=${result.longitude}`);

        return {
          type: 'Point',
          coordinates: [result.longitude, result.latitude] // GeoJSON format: [lng, lat]
        };
      }

      // If full address geocoding failed, try just city + state + PIN
      console.log('Full address geocoding failed, trying simplified address...');
      const simplifiedParts = [];
      if (addressParts.city) simplifiedParts.push(addressParts.city);
      if (addressParts.state) simplifiedParts.push(addressParts.state);
      if (addressParts.pinCode) simplifiedParts.push(addressParts.pinCode);
      simplifiedParts.push('India');

      const simplifiedAddress = simplifiedParts.join(', ');
      result = await this.geocodeAddress(simplifiedAddress);

      if (result) {
        console.log(`Simplified geocoded result: lat=${result.latitude}, lng=${result.longitude}`);
        return {
          type: 'Point',
          coordinates: [result.longitude, result.latitude]
        };
      }

      // If still failed, try PIN code based geocoding
      if (addressParts.pinCode) {
        console.log('Address geocoding failed, trying PIN code based coordinates...');
        result = await this.geocodeByPinCode(addressParts.pinCode);

        if (result) {
          console.log(`PIN code geocoded result: lat=${result.latitude}, lng=${result.longitude}`);
          return {
            type: 'Point',
            coordinates: [result.longitude, result.latitude]
          };
        }
      }

      // Final fallback: use default coordinates (Ahmedabad - user's location)
      console.warn('All geocoding methods failed, using default coordinates for Ahmedabad');
      return {
        type: 'Point',
        coordinates: [72.5714, 23.0225] // Default to Ahmedabad coordinates
      };
    } catch (error) {
      console.error('Failed to get coordinates:', error.message);

      // Return default coordinates instead of throwing error
      // This allows signup to continue even if geocoding fails
      console.warn('Geocoding completely failed, using default coordinates for Ahmedabad');
      return {
        type: 'Point',
        coordinates: [72.5714, 23.0225] // Default to Ahmedabad coordinates
      };
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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