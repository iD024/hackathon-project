import React, { useState, useMemo, useEffect, useRef } from "react";
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
};

const wrapperStyle = {
  flex: 1,
  height: "calc(100vh - 130px)",
  minWidth: 0,
};

const issueMarkerIcon = {
  url: `data:image/svg+xml,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233d402b" width="36px" height="36px">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>`,
  scaledSize: { width: 36, height: 36 },
};

function MapView({ issues, userLocation }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["marker"],
  });

  const [activeMarker, setActiveMarker] = useState(null);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const mapRef = useRef(null);

  const userLocationIcon = useMemo(() => {
    if (!isLoaded) return null;
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: "#4285F4",
      fillOpacity: 1,
      strokeColor: "white",
      strokeWeight: 2,
    };
  }, [isLoaded]);

  useEffect(() => {
    if (mapRef.current && issues && issues.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      issues.forEach((issue) => {
        bounds.extend({
          lat: issue.location.coordinates[1],
          lng: issue.location.coordinates[0],
        });
      });
      mapRef.current.fitBounds(bounds);
    }
  }, [issues, isLoaded]);

  const handleMarkerClick = (clickedIssue) => {
    const issuesAtLocation = issues.filter(
      (issue) =>
        issue.location.coordinates[1] ===
          clickedIssue.location.coordinates[1] &&
        issue.location.coordinates[0] === clickedIssue.location.coordinates[0]
    );

    if (issuesAtLocation.length > 1) {
      setSelectedIssues(issuesAtLocation);
      setActiveMarker(clickedIssue._id);
    } else {
      setSelectedIssues([clickedIssue]);
      setActiveMarker(clickedIssue._id);
    }
  };

  const mapCenter = useMemo(() => {
    if (userLocation && (!issues || issues.length === 0)) {
      return userLocation;
    }
    if (issues && issues.length > 0) {
      return {
        lat: issues[0].location.coordinates[1],
        lng: issues[0].location.coordinates[0],
      };
    }
    return null;
  }, [issues, userLocation]);

  if (loadError) {
    return <div>Error loading maps.</div>;
  }

  if (!isLoaded) {
    return <div style={wrapperStyle}>Loading Map...</div>;
  }

  return (
    <div style={wrapperStyle}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {userLocation && (
          <MarkerF
            position={userLocation}
            icon={userLocationIcon}
            title={"Your Location"}
          />
        )}

        {issues.map((issue) => (
          <MarkerF
            key={issue._id}
            position={{
              lat: issue.location.coordinates[1],
              lng: issue.location.coordinates[0],
            }}
            icon={issueMarkerIcon}
            onClick={() => handleMarkerClick(issue)}
          />
        ))}

        {activeMarker && (
          <InfoWindowF
            position={{
              lat: selectedIssues[0].location.coordinates[1],
              lng: selectedIssues[0].location.coordinates[0],
            }}
            onCloseClick={() => {
              setActiveMarker(null);
              setSelectedIssues([]);
            }}
          >
            <div>
              {selectedIssues.length > 1 ? (
                <>
                  <h4>{selectedIssues.length} Issues Here</h4>
                  <ul>
                    {selectedIssues.map((issue) => (
                      <li key={issue._id}>{issue.title}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h4>{selectedIssues[0].title}</h4>
                  <p>{selectedIssues[0].description}</p>
                </>
              )}
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
}

export default MapView;
