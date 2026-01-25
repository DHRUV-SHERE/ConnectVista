import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Users } from 'lucide-react';

const SimpleMapExplore = ({ providers, userLocation, onProviderClick }) => {
  const mapRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Initialize simple map
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || providers.length === 0) return;

      try {
        const L = await import('leaflet');
        
        // Clear existing map
        if (mapRef.current._leaflet_id) {
          mapRef.current._leaflet_map?.remove();
        }

        const mapCenter = userLocation ? 
          [userLocation.lat, userLocation.lng] : 
          [23.0225, 72.5714]; // Ahmedabad center

        const map = L.map(mapRef.current).setView(mapCenter, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // User location marker
        if (userLocation) {
          const userIcon = L.divIcon({
            html: `<div style="background: #FF3B30; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            className: 'custom-user-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
            .addTo(map)
            .bindPopup('<b>Your Location</b><br>You are here');
        }

        // Provider markers using database coordinates
        providers.forEach(provider => {
          const coords = provider.businessAddress?.coordinates?.coordinates;
          if (coords && coords.length === 2) {
            // MongoDB stores as [longitude, latitude]
            const [lng, lat] = coords;
            const isAvailable = provider.isAvailable !== false;

            const providerIcon = L.divIcon({
              html: `<div style="background: ${isAvailable ? '#4CAF50' : '#FFC107'}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
              className: 'custom-provider-marker',
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            });

            const popupContent = `
              <div style="min-width: 200px;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${provider.businessName || provider.name}</h4>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${provider.category || 'Service Provider'}</p>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 12px; line-height: 1.4;">${provider.description || 'Professional service provider'}</p>
                <div style="margin: 8px 0;">
                  <div style="font-size: 12px; margin-bottom: 4px;">⭐ ${provider.rating?.average || 0} (${provider.rating?.count || 0} reviews)</div>
                  <div style="font-size: 12px; margin-bottom: 4px;">📍 ${provider.businessAddress?.city}</div>
                  <div style="font-size: 13px; font-weight: 600; color: #1976d2;">₹${provider.serviceDetails?.minPrice || provider.startingPrice || 0}+</div>
                  ${provider.distance ? `<div style="font-size: 11px; color: #999; margin-top: 4px;">📍 ${provider.distance < 1 ? `${Math.round(provider.distance * 1000)}m` : `${provider.distance.toFixed(1)}km`} away</div>` : ''}
                </div>
                <div style="display: flex; gap: 8px; margin-top: 12px;">
                  <button onclick="window.viewProviderProfileFromMap('${provider._id}')" style="flex: 1; padding: 6px 12px; font-size: 12px; border-radius: 4px; border: none; background-color: #1976d2; color: white; cursor: pointer;">View Profile</button>
                  <button onclick="window.openDirectionsFromExploreMap(${lat}, ${lng})" style="padding: 6px 12px; font-size: 12px; border-radius: 4px; border: 1px solid #1976d2; background-color: white; color: #1976d2; cursor: pointer;">📍</button>
                </div>
              </div>
            `;

            L.marker([lat, lng], { icon: providerIcon })
              .addTo(map)
              .bindPopup(popupContent);
          }
        });

        mapRef.current._leaflet_map = map;
        setLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setLoading(false);
      }
    };

    if (providers.length > 0) {
      initMap();
    }
  }, [providers, userLocation]);

  // Global functions for popup buttons
  useEffect(() => {
    window.viewProviderProfileFromMap = (providerId) => {
      const provider = providers.find(p => p._id === providerId);
      if (provider) {
        onProviderClick(provider);
      }
    };

    window.openDirectionsFromExploreMap = (lat, lng) => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    };

    return () => {
      delete window.viewProviderProfileFromMap;
      delete window.openDirectionsFromExploreMap;
    };
  }, [providers, onProviderClick]);

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
      <div className="p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
            <MapPin className="inline h-5 w-5 mr-2" />
            Service Providers Near You
          </h3>
        </div>
        
        <div className="text-sm mb-4 flex items-center gap-4" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
          <span>
            <Users className="inline h-4 w-4 mr-1" />
            {loading ? 'Loading...' : `${providers.length} providers found`}
          </span>
          <span>
            <Navigation className="inline h-4 w-4 mr-1" />
            Using database coordinates
          </span>
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
              <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
              <span>Available Provider</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full border border-white"></div>
              <span>Busy Provider</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMapExplore;