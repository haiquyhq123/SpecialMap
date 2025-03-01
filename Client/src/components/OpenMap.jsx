import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🚧 Custom construction icon for markers
const constructionIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/564/564619.png", // Construction icon
  iconSize: [30, 30], // Adjust size
  iconAnchor: [15, 30], // Position adjustment
  popupAnchor: [0, -30]
});

function OpenMap({ location }) {
  const [coordinates, setCoordinates] = useState([43.4643, -80.5204]); // Default: Waterloo, Ontario, Canada
  const [roadData, setRoadData] = useState([]); // Store API response (list of features)
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // 🔹 Fetch data from API 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://10.144.112.60:3000/api/arcgis/saved");
        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }
        const result = await response.json();
        if (result.status === "success" && result.data && Array.isArray(result.data.features)) {
          setRoadData(result.data.features);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching road closure data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading road closure data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!roadData.length) return <p>No road data available</p>;

  return (
    <div className="map-container">
      <MapContainer center={coordinates} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* 📍 Default Location Marker */}
        <Marker position={coordinates}>
          <Popup>
            {location.charAt(0).toUpperCase() + location.slice(1)}. <br /> This is Waterloo,
          </Popup>
        </Marker>

        {/* 🚧 Render multiple road closures */}
        {roadData.map((feature) => {
          const { geometry, properties } = feature;

          // Check if geometry is valid
          if (!geometry || !geometry.coordinates) return null;

          // 🔹 Convert coordinates for Leaflet ([longitude, latitude] → [latitude, longitude])
          let polylineCoords = [];

          if (geometry.type === "LineString") {
            polylineCoords = geometry.coordinates.map(coord => [coord[1], coord[0]]);
          } else if (geometry.type === "MultiLineString") {
            polylineCoords = geometry.coordinates.flat().map(coord => [coord[1], coord[0]]);
          }

          // 🔹 Get the first coordinate (start point) for the construction marker
          const startCoord = polylineCoords.length > 0 ? polylineCoords[0] : null;

          return (
            <React.Fragment key={feature.id}>
              {/* 🚧 Add polyline for road closure */}
              <Polyline positions={polylineCoords} color="red">
                <Popup>
                  <b>{properties.STREET_NAME}</b><br />
                  <b>Status:</b> {properties.STATUS}<br />
                  <b>Reason:</b> {properties.REASON}<br />
                  <b>Details:</b> {properties.DETAILS}<br />
                  <b>Responsible:</b> {properties.Responsible}
                </Popup>
              </Polyline>

              {/* 🚜 Add construction marker at the start of the polyline */}
              {startCoord && (
                <Marker position={startCoord} icon={constructionIcon}>
                  <Popup>
                    🚧 <b>Construction Zone</b> 🚧<br />
                    <b>Street:</b> {properties.STREET_NAME}<br />
                    <b>Status:</b> {properties.STATUS}<br />
                    <b>Details:</b> {properties.DETAILS}<br />
                  </Popup>
                </Marker>
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default OpenMap;