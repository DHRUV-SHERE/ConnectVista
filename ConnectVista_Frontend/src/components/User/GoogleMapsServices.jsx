import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Users, Grid3X3 } from 'lucide-react';
import { serviceAPI } from '../../services/serviceAPI';

const GoogleMapsServices = ({ services, userLocation, onServiceClick, setViewMode }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [allProviders, setAllProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMarker, setUserMarker] = useState(null);
  const [providerMarkers, setProviderMarkers] = useState([]);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDU6SRDNFh1xH_5yHrhHcMLyathi5CwizA&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      const mapCenter = userLocation ? 
        { lat: userLocation.lat, lng: userLocation.lng } : 
        { lat: 23.0225, lng: 72.5714 }; // Ahmedabad center

      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      setMap(googleMap);

      // Add user location marker
      if (userLocation) {
        const userMarkerInstance = new window.google.maps.Marker({
          position: { lat: userLocation.lat, lng: userLocation.lng },
          map: googleMap,
          title: 'Your Location',
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF3B30" width="32" height="32">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32)
          }
        });

        const userInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h4 style="margin: 0; color: #333;">Your Location</h4>
              <p style="margin: 4px 0 0 0; color: #666; font-size: 12px;">You are here</p>
            </div>
          `
        });

        userMarkerInstance.addListener('click', () => {
          userInfoWindow.open(googleMap, userMarkerInstance);
        });

        setUserMarker(userMarkerInstance);
      }
    };

    loadGoogleMaps();
  }, [userLocation]);

  // Fetch providers and add markers
  useEffect(() => {
    const fetchAndDisplayProviders = async () => {
      if (!services.length || !map) return;
      
      try {
        setLoading(true);
        
        // Clear existing provider markers
        providerMarkers.forEach(marker => marker.setMap(null));
        setProviderMarkers([]);

        const providersPromises = services.map(async (service) => {
          try {
            const response = await serviceAPI.getProvidersByService(service._id, {
              sortBy: 'distance',
              lat: userLocation?.lat,
              lng: userLocation?.lng
            });
            return response.data || [];
          } catch (error) {
            console.error(`Error fetching providers for ${service.name}:`, error);
            return [];
          }
        });

        const providersArrays = await Promise.all(providersPromises);
        const flatProviders = providersArrays.flat();
        
        // Remove duplicates
        const uniqueProviders = flatProviders.filter((provider, index, self) => 
          index === self.findIndex(p => p._id === provider._id)
        );
        
        setAllProviders(uniqueProviders);

        // Add provider markers using Google Geocoding for accurate locations
        const newMarkers = [];
        const geocoder = new window.google.maps.Geocoder();

        for (const provider of uniqueProviders) {
          // Create full address string
          const address = `${provider.businessAddress?.street || ''}, ${provider.businessAddress?.city || ''}, ${provider.businessAddress?.state || ''} ${provider.businessAddress?.pinCode || ''}`.trim();
          
          if (!address) continue;

          try {
            // Use Google Geocoding for accurate coordinates
            const result = await new Promise((resolve, reject) => {
              geocoder.geocode({ address }, (results, status) => {
                if (status === 'OK' && results[0]) {
                  resolve(results[0]);
                } else {
                  reject(new Error(`Geocoding failed: ${status}`));
                }
              });
            });

            const position = result.geometry.location;
            const isAvailable = provider.isAvailable !== false;

            const marker = new window.google.maps.Marker({
              position: position,
              map: map,
              title: provider.businessName || provider.name,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${isAvailable ? '#4CAF50' : '#FFC107'}" width="24" height="24">
                    <circle cx="12" cy="12" r="10"/>
                    ${isAvailable ? 
                      '<path d="M10 14.59l6.3-6.3a1 1 0 011.4 1.42l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 011.4-1.42l2.3 2.3z" fill="white"/>' :
                      '<path d="M12 6v6l4 2" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>'
                    }
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24),
                anchor: new window.google.maps.Point(12, 12)
              }
            });

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 12px; max-width: 300px;">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div>
                      <h4 style="margin: 0; font-size: 16px; font-weight: bold;">${provider.businessName || provider.name}</h4>
                      <p style="margin: 2px 0; color: #666; font-size: 12px;">${provider.category || 'Service Provider'}</p>
                    </div>
                    <div style="width: 8px; height: 8px; border-radius: 50%; background-color: ${isAvailable ? '#4CAF50' : '#FFC107'};"></div>
                  </div>
                  
                  <p style="margin: 8px 0; color: #666; font-size: 13px; line-height: 1.4;">${provider.description || 'Professional service provider'}</p>
                  
                  <div style="margin: 8px 0;">
                    <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
                      <span style="font-size: 12px;">⭐ ${provider.rating?.average || 0}</span>
                      <span style="font-size: 11px; color: #999;">(${provider.rating?.count || 0} reviews)</span>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px; font-size: 12px; color: #666;">
                      <span>📍</span>
                      <span>${provider.businessAddress?.city}</span>
                    </div>
                    
                    <div style="font-size: 13px; font-weight: 600; color: #1976d2;">
                      ₹${provider.serviceDetails?.minPrice || provider.startingPrice || 0}+
                    </div>
                  </div>
                  
                  <div style="display: flex; gap: 8px; margin-top: 12px;">
                    <button onclick="window.viewProvider('${provider._id}')" style="flex: 1; padding: 6px 12px; font-size: 12px; border-radius: 6px; border: none; background-color: #1976d2; color: white; cursor: pointer;">
                      View Profile
                    </button>
                    <button onclick="window.openDirections(${position.lat()}, ${position.lng()})" style="padding: 6px 12px; font-size: 12px; border-radius: 6px; border: 1px solid #1976d2; background-color: white; color: #1976d2; cursor: pointer;">
                      📍
                    </button>
                  </div>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });

            newMarkers.push(marker);
          } catch (error) {
            console.error(`Error geocoding address for ${provider.businessName}:`, error);
          }
        }

        setProviderMarkers(newMarkers);
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (map && services.length > 0) {
      const timeoutId = setTimeout(fetchAndDisplayProviders, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [services, map, userLocation]);

  // Global functions for info window buttons
  useEffect(() => {
    window.viewProvider = (providerId) => {
      const service = services.find(s => 
        allProviders.some(p => p._id === providerId && s.category?.toLowerCase() === p.category?.toLowerCase())
      );
      if (service) {
        onServiceClick(service);
      }
    };

    window.openDirections = (lat, lng) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    };

    return () => {
      delete window.viewProvider;
      delete window.openDirections;
    };
  }, [services, allProviders, onServiceClick]);

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
      <div className="p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
            <MapPin className="inline h-5 w-5 mr-2" />
            Service Providers Near You
          </h3>
          <button
            onClick={() => setViewMode("grid")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:opacity-80"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'white'
            }}
          >
            <Grid3X3 className="h-4 w-4" />
            Back to Grid
          </button>
        </div>
        
        <div className="text-sm mb-4 flex items-center gap-4" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
          <span>
            <Users className="inline h-4 w-4 mr-1" />
            {loading ? 'Loading...' : `${allProviders.length} providers found`}
          </span>
          {userLocation && (
            <span>
              <Navigation className="inline h-4 w-4 mr-1" />
              Using Google Maps for accuracy
            </span>
          )}
        </div>
      </div>
      
      <div className="h-[600px] w-full relative">
        <div ref={mapRef} className="w-full h-full" />
        
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading providers...</span>
          </div>
        )}
        
        {/* Map Legend */}
        <div className="absolute top-4 left-4 p-3 rounded-lg shadow-lg max-w-xs"
          style={{
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-color)',
            border: '1px solid var(--border-color)'
          }}
        >
          <h5 className="font-medium text-sm mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Map Legend
          </h5>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Available Provider</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Busy Provider</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapsServices;