import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function OpenMap({ location }) {
  const [coordinates, setCoordinates] = useState([43.4643, -80.5204]); // Default to Waterloo, Ontario, Canada

  useEffect(() => {
    if (location) {
      // Example locations with their coordinates
      const locations = {
        waterloo: [43.4643, -80.5204],
        toronto: [43.65107, -79.347015],
        ottawa: [45.4215, -75.6972],
        vancouver: [49.2827, -123.1207]
      };

      const lowerCaseLocation = location.toLowerCase();
      if (locations[lowerCaseLocation]) {
        setCoordinates(locations[lowerCaseLocation]);
      } else {
        // Handle unknown location
        console.log("Location not found");
      }
    }
  }, [location]);

  return (
    <div className="map-container">
      <MapContainer center={coordinates} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={coordinates}>
          <Popup>
            {location.charAt(0).toUpperCase() + location.slice(1)}. <br /> A beautiful place.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default OpenMap;
