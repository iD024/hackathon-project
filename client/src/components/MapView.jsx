import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../components/css/MapView.css"; // Make sure to import the CSS

// Fix for default icon issue with Webpack
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function MapView({ issues }) {
  // Default center for the map (New York City)
  const defaultPosition = [40.7128, -74.006];

  return (
    <div className="map-view">
      <MapContainer
        center={defaultPosition}
        zoom={13}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {issues.map((issue) => (
          <Marker
            key={issue._id}
            position={[
              issue.location.coordinates[1], // Leaflet uses [latitude, longitude]
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
