import React, { useState, useMemo } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";

// --- STYLES (Moved outside for clarity) ---
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "8px",
  border: "1px solid #bdc3c7",
};

const wrapperStyle = {
  flexBasis: "65%",
  height: "calc(100vh - 90px)",
  padding: "10px",
};

// --- COMPONENT ---
function MapView({ issues, userLocation }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [activeMarker, setActiveMarker] = useState(null);

  // --- ICONS (Memoized for performance) ---
  // We use useMemo to create these icons only once, AFTER the map script has loaded.
  const userLocationIcon = useMemo(() => {
    if (isLoaded) {
      return {
        url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiIgd2lkdGg9IjM2cHgiIGhlaWdodD0iMzZweCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzQyODVGNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+",
        scaledSize: new window.google.maps.Size(24, 24),
        anchor: new window.google.maps.Point(12, 12),
      };
    }
    return null;
  }, [isLoaded]);

  const handleActiveMarker = (markerId) => {
    setActiveMarker(markerId);
  };

  const defaultCenter = { lat: 26.853, lng: 75.66 }; // Jaipur area
  const mapCenter = userLocation || defaultCenter;

  // --- RENDER LOGIC ---
  if (loadError) {
    return (
      <div>
        Error loading maps. Please ensure your API key is correct and enabled.
      </div>
    );
  }

  if (!isLoaded) {
    return <div style={wrapperStyle}>Loading Map...</div>;
  }

  return (
    <div style={wrapperStyle}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={userLocation ? 15 : 11}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* User's Location Marker */}
        {userLocation && userLocationIcon && (
          <MarkerF position={userLocation} icon={userLocationIcon} />
        )}

        {/* Issue Markers */}
        {issues.map((issue) => (
          <MarkerF
            key={issue._id}
            position={{
              lat: issue.location.coordinates[1],
              lng: issue.location.coordinates[0],
            }}
            onClick={() => handleActiveMarker(issue._id)}
          >
            {activeMarker === issue._id && (
              <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                <div>
                  <h4>{issue.aiCategory}</h4>
                  <p>{issue.description}</p>
                </div>
              </InfoWindowF>
            )}
          </MarkerF>
        ))}
      </GoogleMap>
    </div>
  );
}

export default MapView;
