// components/ServiceSeeker/MapView.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../services/api';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icons
const userIcon = new L.Icon({
  iconUrl: '/user-marker.png', // You can create this icon
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const providerIcon = new L.Icon({
  iconUrl: '/provider-marker.png', // You can create this icon
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35]
});

const MapView = () => {
  const [userLocation, setUserLocation] = useState([20.5937, 78.9629]); // Default: India center
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(10); // Default 10km radius

  // Get user's current location
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            fetchNearbyProviders(latitude, longitude);
            
            // Update location in backend
            api.put('/seeker/location', { latitude, longitude })
              .then(response => console.log('Location updated in backend'))
              .catch(err => console.warn('Failed to update location:', err));
          },
          (error) => {
            console.warn('Geolocation error:', error);
            // Use default location and fetch providers
            fetchNearbyProviders(userLocation[0], userLocation[1]);
          }
        );
      } else {
        console.warn('Geolocation not supported');
        fetchNearbyProviders(userLocation[0], userLocation[1]);
      }
    };

    getUserLocation();
  }, []);

  const fetchNearbyProviders = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await api.get('/profile/nearby', {
        params: {
          latitude: lat,
          longitude: lng,
          radius: radius
        }
      });
      
      if (response.data.success) {
        setProviders(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch nearby providers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
    if (userLocation) {
      fetchNearbyProviders(userLocation[0], userLocation[1], newRadius);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="map-view-container">
      <div className="map-controls mb-4">
        <h2 className="text-xl font-bold mb-2">Find Nearby Service Providers</h2>
        
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Search Radius</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="50"
                value={radius}
                onChange={(e) => handleRadiusChange(e.target.value)}
                className="w-48"
              />
              <span className="text-sm font-medium">{radius} km</span>
            </div>
          </div>
          
          <button 
            onClick={() => {
              if (userLocation) {
                fetchNearbyProviders(userLocation[0], userLocation[1]);
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="map-container rounded-lg overflow-hidden border border-gray-200">
            <MapContainer 
              center={userLocation} 
              zoom={12} 
              style={{ height: '500px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* User location */}
              <Marker position={userLocation} icon={userIcon}>
                <Popup>Your Location</Popup>
              </Marker>
              
              {/* Search radius circle */}
              <Circle
                center={userLocation}
                radius={radius * 1000} // Convert km to meters
                pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
              />
              
              {/* Provider markers */}
              {providers.map((provider) => {
                const coords = provider.businessAddress?.coordinates?.coordinates;
                if (!coords || coords.length !== 2) return null;
                
                return (
                  <Marker 
                    key={provider._id} 
                    position={[coords[1], coords[0]]} 
                    icon={providerIcon}
                  >
                    <Popup>
                      <div className="provider-popup">
                        <h3 className="font-bold text-lg">{provider.businessName}</h3>
                        <p className="text-sm text-gray-600">{provider.description}</p>
                        
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500">⭐</span>
                            <span>{provider.rating?.average?.toFixed(1) || 'N/A'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-green-500">💰</span>
                            <span>From ₹{provider.startingPrice}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-blue-500">📍</span>
                            <span>{provider.distance?.toFixed(1) || 'N/A'} km away</span>
                          </div>
                          
                          {provider.languages?.length > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-purple-500">🗣️</span>
                              <span>{provider.languages.join(', ')}</span>
                            </div>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => window.location.href = `/provider/${provider._id}`}
                          className="mt-3 w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          View Profile
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
        
        <div className="providers-list">
          <h3 className="font-bold text-lg mb-3">Nearby Providers ({providers.length})</h3>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {providers.length === 0 ? (
              <p className="text-gray-500">No providers found within {radius}km radius</p>
            ) : (
              providers.map((provider) => (
                <div key={provider._id} className="provider-card p-4 border rounded-lg hover:shadow-md">
                  <h4 className="font-semibold">{provider.businessName}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{provider.description}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">⭐</span>
                      <span>{provider.rating?.average?.toFixed(1) || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span>₹{provider.startingPrice}</span>
                      <span className="text-sm text-gray-500">starting</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span>📍 {provider.distance?.toFixed(1) || 'N/A'} km</span>
                    <button 
                      onClick={() => window.location.href = `/provider/${provider._id}`}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default MapView;