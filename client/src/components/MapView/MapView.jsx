import React, { useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";

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

// Custom icon for the user's location
const userLocationIcon = {
  url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiIgd2lkdGg9IjM2cHgiIGhlaWdodD0iMzZweCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzQyODVGNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+",
  scaledSize: new window.google.maps.Size(24, 24),
  anchor: new window.google.maps.Point(12, 12),
};

function MapView({ issues, userLocation }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [activeMarker, setActiveMarker] = useState(null);

  const handleActiveMarker = (markerId) => {
    if (markerId === activeMarker) {
      return;
    }
    setActiveMarker(markerId);
  };

  const defaultCenter = { lat: 26.853, lng: 75.66 }; // Default center
  const mapCenter = userLocation || defaultCenter;

  if (loadError) {
    return <div>Error loading maps. Please check your API key.</div>;
  }

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <div style={wrapperStyle}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={userLocation ? 15 : 10}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {/* User's Location Marker */}
        {userLocation && (
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
                  <b>{issue.aiCategory}</b>
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
