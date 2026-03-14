import { useEffect, useRef, useState } from "react";
import { MapPin, Search, Loader2 } from "lucide-react";

const GoogleAddressSearch = ({ onAddressSelect, defaultValue = "" }) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState(defaultValue);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    // Initialize Google Autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "IN" }, // Restrict to India
      fields: ["address_components", "geometry", "formatted_address"],
      types: ["address"]
    });

    // Listen for place selection
    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      
      if (!place.geometry || !place.geometry.location) {
        console.error("No location data available for this place");
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      
      // Parse address components
      const addressData = {
        street: "",
        city: "",
        state: "",
        pinCode: "",
        latitude: lat,
        longitude: lng,
        formattedAddress: place.formatted_address
      };

      place.address_components.forEach(component => {
        const types = component.types;
        
        if (types.includes("sublocality_level_1") || types.includes("route")) {
          addressData.street = component.long_name;
        }
        if (types.includes("locality")) {
          addressData.city = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          addressData.state = component.long_name;
        }
        if (types.includes("postal_code")) {
          addressData.pinCode = component.long_name;
        }
      });

      setInputValue(place.formatted_address);
      onAddressSelect(addressData);
    });

    // Clean up
    return () => {
      if (window.google && window.google.maps && window.google.maps.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onAddressSelect]);

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search your business location..."
          className="appearance-none relative block w-full px-12 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] transition-all duration-200"
        />
      </div>
      <p className="mt-1.5 text-[10px] text-gray-400 flex items-center gap-1">
        <Search size={10} />
        Powered by Google Maps for precise location accuracy
      </p>
    </div>
  );
};

export default GoogleAddressSearch;
