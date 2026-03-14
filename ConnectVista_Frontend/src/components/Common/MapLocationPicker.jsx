import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { Search, MapPin, Loader2, Navigation } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to handle map centering
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapLocationPicker = ({ onLocationSelect, initialLocation = null }) => {
  const [position, setPosition] = useState(initialLocation || [20.5937, 78.9629]); // Default to India center
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [zoom, setZoom] = useState(initialLocation ? 15 : 5);
  const markerRef = useRef(null);

  // Handle address search using Nominatim (Free)
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name, address } = data[0];
        const newPos = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPos);
        setZoom(16);
        
        // Return data to parent
        onLocationSelect({
          latitude: newPos[0],
          longitude: newPos[1],
          street: address.road || address.suburb || "",
          city: address.city || address.town || address.village || "",
          state: address.state || "",
          pinCode: address.postcode || "",
          formattedAddress: display_name
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Get current location from browser
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPos);
        setZoom(17);
        fetchAddress(newPos[0], newPos[1]);
      },
      (err) => console.error(err)
    );
  };

  // Reverse geocode to get address from Lat/Lng
  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data) {
        onLocationSelect({
          latitude: lat,
          longitude: lng,
          street: data.address.road || data.address.suburb || "",
          city: data.address.city || data.address.town || data.address.village || "",
          state: data.address.state || "",
          pinCode: data.address.postcode || "",
          formattedAddress: data.display_name
        });
      }
    } catch (error) {
      console.error("Reverse geocode failed:", error);
    }
  };

  // Event handlers for marker dragging
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          const posArray = [newPos.lat, newPos.lng];
          setPosition(posArray);
          fetchAddress(posArray[0], posArray[1]);
        }
      },
    }),
    [],
  );

  return (
    <div className="space-y-4 w-full">
      {/* Search Box */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search city, area or street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {isSearching ? <Loader2 className="animate-spin" size={20} /> : "Search"}
        </button>
        <button
          onClick={handleGetCurrentLocation}
          title="Use my current location"
          className="p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-blue-600 hover:bg-blue-50 transition-all"
        >
          <Navigation size={20} />
        </button>
      </div>

      <p className="text-[11px] text-gray-500 flex items-center gap-1">
        <MapPin size={12} className="text-blue-500" />
        Search first, then <b>drag the blue pin</b> to your exact shop/house location for 100% accuracy.
      </p>

      {/* Map Container */}
      <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 relative z-0">
        <MapContainer 
          center={position} 
          zoom={zoom} 
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <ChangeView center={position} zoom={zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
          >
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapLocationPicker;
