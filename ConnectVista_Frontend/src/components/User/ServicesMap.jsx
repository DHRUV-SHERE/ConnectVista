import { useState, useEffect, Suspense } from 'react';
import { MapPin, Navigation, Users, Grid3X3 } from 'lucide-react';
import { serviceAPI } from '../../services/serviceAPI';

// Custom SVG icons
const CUSTOM_ICONS = {
  userLocationIcon: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF3B30" width="24" height="24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" fill="#FF3B30"/>
    </svg>
  `)}`,
  
  serviceIcon: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0EA5E9" width="24" height="24">
      <circle cx="12" cy="8" r="4" fill="#0EA5E9"/>
      <path d="M12 14c-3.31 0-6 2.69-6 6v2h12v-2c0-3.31-2.69-6-6-6z" fill="#0EA5E9"/>
    </svg>
  `)}`,
  
  availableProviderIcon: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4CAF50" width="20" height="20">
      <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
      <path d="M10 14.59l6.3-6.3a1 1 0 011.4 1.42l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 011.4-1.42l2.3 2.3z" fill="white"/>
    </svg>
  `)}`,
  
  busyProviderIcon: `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFC107" width="20" height="20">
      <circle cx="12" cy="12" r="10" fill="#FFC107"/>
      <path d="M12 6v6l4 2" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>
    </svg>
  `)}`
};

const ServicesMapContent = ({ services, userLocation, onServiceClick, setViewMode }) => {
  const [MapContainer, setMapContainer] = useState(null);
  const [TileLayer, setTileLayer] = useState(null);
  const [Marker, setMarker] = useState(null);
  const [Popup, setPopup] = useState(null);
  const [L, setL] = useState(null);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  const [allProviders, setAllProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        const leaflet = await import("leaflet");
        const { MapContainer: MC, TileLayer: TL, Marker: M, Popup: P } = await import("react-leaflet");
        
        delete leaflet.Icon.Default.prototype._getIconUrl;
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: "",
          iconUrl: "",
          shadowUrl: "",
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });

        setL(leaflet);
        setMapContainer(() => MC);
        setTileLayer(() => TL);
        setMarker(() => M);
        setPopup(() => P);
        setIsLeafletLoaded(true);
      } catch (error) {
        console.error("Error loading Leaflet:", error);
      }
    };

    loadLeaflet();
  }, []);

  // Fetch providers for all services
  useEffect(() => {
    const fetchAllProviders = async () => {
      if (!services.length) return;
      
      try {
        setLoading(true);
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
        
        // Remove duplicates based on provider ID
        const uniqueProviders = flatProviders.filter((provider, index, self) => 
          index === self.findIndex(p => p._id === provider._id)
        );
        
        setAllProviders(uniqueProviders);
      } catch (error) {
        console.error('Error fetching providers:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isLeafletLoaded && services.length > 0) {
      const timeoutId = setTimeout(fetchAllProviders, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [services, userLocation, isLeafletLoaded]);

  const createCustomIcons = (leaflet) => {
    if (!leaflet) return null;
    
    const userLocationIcon = new leaflet.Icon({
      iconUrl: CUSTOM_ICONS.userLocationIcon,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      className: 'custom-user-marker'
    });

    const availableProviderIcon = new leaflet.Icon({
      iconUrl: CUSTOM_ICONS.availableProviderIcon,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
      className: 'custom-available-marker'
    });

    const busyProviderIcon = new leaflet.Icon({
      iconUrl: CUSTOM_ICONS.busyProviderIcon,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
      className: 'custom-busy-marker'
    });

    return {
      userLocationIcon,
      availableProviderIcon,
      busyProviderIcon
    };
  };

  if (!isLeafletLoaded || !MapContainer || !TileLayer || !Marker || !Popup || !L) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center bg-gray-50 rounded-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading map...</span>
      </div>
    );
  }

  const icons = createCustomIcons(L);
  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : [20.5937, 78.9629];

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
      <div className="p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
            <MapPin className="inline h-5 w-5 mr-2" />
            All Service Providers
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
              Sorted by distance
            </span>
          )}
        </div>
      </div>
      
      <div className="h-[600px] w-full relative">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User location marker */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={icons.userLocationIcon}>
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    Your Location
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">You are here</p>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Provider markers */}
          {allProviders.map((provider) => {
            const coords = provider.businessAddress?.coordinates?.coordinates;
            if (!coords || coords.length !== 2) return null;
            
            const [lng, lat] = coords;
            const isAvailable = provider.isAvailable !== false;
            
            return (
              <Marker
                key={provider._id}
                position={[lat, lng]}
                icon={isAvailable ? icons.availableProviderIcon : icons.busyProviderIcon}
              >
                <Popup>
                  <div className="p-3 max-w-xs">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg">{provider.businessName || provider.name}</h4>
                        <p className="text-sm text-gray-600">{provider.category || 'Service Provider'}</p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {provider.description || 'Professional service provider'}
                    </p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">⭐ {provider.rating?.average || 0}</span>
                        <span className="text-xs text-gray-500">({provider.rating?.count || 0} reviews)</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{provider.businessAddress?.city}</span>
                      </div>
                      
                      <div className="text-sm font-medium text-blue-600">
                        ₹{provider.serviceDetails?.minPrice || provider.startingPrice || 0}+
                      </div>
                      
                      {provider.distance && (
                        <div className="text-xs text-gray-500">
                          📍 {provider.distance < 1 ? `${Math.round(provider.distance * 1000)}m` : `${provider.distance.toFixed(1)}km`} away
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // Find the service this provider belongs to
                          const service = services.find(s => s.category?.toLowerCase() === provider.category?.toLowerCase());
                          if (service) {
                            onServiceClick(service);
                          }
                        }}
                        className="flex-1 px-3 py-2 text-sm rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                      >
                        View Service
                      </button>
                      <button
                        onClick={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                          window.open(url, '_blank');
                        }}
                        className="px-3 py-2 text-sm rounded-lg font-medium transition-colors border border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Navigation className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
        
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
              <div className="w-4 h-4 flex items-center justify-center">
                <img src={CUSTOM_ICONS.userLocationIcon} alt="Your location" className="w-4 h-4" />
              </div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 flex items-center justify-center">
                <img src={CUSTOM_ICONS.availableProviderIcon} alt="Available" className="w-3 h-3" />
              </div>
              <span>Available Provider</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 flex items-center justify-center">
                <img src={CUSTOM_ICONS.busyProviderIcon} alt="Busy" className="w-3 h-3" />
              </div>
              <span>Busy Provider</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesMap = ({ services, userLocation, onServiceClick, setViewMode }) => {
  return (
    <Suspense fallback={
      <div className="h-[600px] w-full flex items-center justify-center bg-gray-50 rounded-2xl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ServicesMapContent 
        services={services}
        userLocation={userLocation}
        onServiceClick={onServiceClick}
        setViewMode={setViewMode}
      />
    </Suspense>
  );
};

export default ServicesMap;