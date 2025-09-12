import { useEffect } from "react";
import { useMap } from "react-leaflet";

// This component will automatically recenter the map when the userLocation prop changes.
function RecenterAutomatically({ userLocation }) {
  const map = useMap(); // Get the current map instance

  useEffect(() => {
    if (userLocation) {
      // If the user's location is available, fly to it with a smooth animation
      map.flyTo([userLocation.lat, userLocation.lng], 15, {
        animate: true,
        duration: 1.5, // Animation duration in seconds
      });
    }
  }, [userLocation, map]); // Rerun this effect if the location or map instance changes

  return null; // This component doesn't render anything itself
}

export default RecenterAutomatically;
