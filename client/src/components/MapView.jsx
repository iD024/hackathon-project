import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "../components/css/MapView.css";
import RecenterAutomatically from "./RecenterAutomatically";
import L from "leaflet";

// Standard Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom icon for the user's location
const userLocationIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzAzNjZGMiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

function MapView({ issues, userLocation }) {
  const defaultPosition = [26.853, 75.66]; // Centered closer to your likely area in Rajasthan

  return (
    <div className="map-view-wrapper">
      <MapContainer
        center={defaultPosition} // Map will initially load here
        zoom={13}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* This component will handle flying to the user's location */}
        <RecenterAutomatically userLocation={userLocation} />

        {/* Marker for the user's current location */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Markers for all the reported issues */}
        {issues.map((issue) => (
          <Marker
            key={issue._id}
            position={[
              issue.location.coordinates[1],
              issue.location.coordinates[0],
            ]}
          >
            <Popup>
              <b>{issue.aiCategory}</b>
              <br />
              {issue.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;
