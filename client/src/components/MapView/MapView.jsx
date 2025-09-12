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
                <div style={{ minWidth: '200px', maxWidth: '300px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>
                    {issue.aiCategory || 'General Issue'}
                  </h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                    {issue.description}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      backgroundColor: issue.status === 'Reported' ? '#e74c3c' : 
                                     issue.status === 'Assigned' ? '#f39c12' : '#2ecc71',
                      color: 'white'
                    }}>
                      {issue.status}
                    </span>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      backgroundColor: issue.aiSeverity === 'High' ? '#e74c3c' :
                                     issue.aiSeverity === 'Medium' ? '#f39c12' :
                                     issue.aiSeverity === 'Low' ? '#27ae60' : '#95a5a6',
                      color: 'white'
                    }}>
                      {issue.aiSeverity || 'Pending'} Priority
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                    <div style={{ marginBottom: '4px' }}>
                      <strong>Reported by:</strong> {issue.reportedBy?.name || 'Anonymous'}
                    </div>
                    <div>
                      <strong>Date:</strong> {new Date(issue.createdAt).toLocaleString()}
                    </div>
                  </div>
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
