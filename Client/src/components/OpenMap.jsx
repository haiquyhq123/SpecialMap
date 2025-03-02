import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🚧 현재 진행 중인 공사 아이콘
const currentConstructionIcon = new L.Icon({
  iconUrl: "./src/images/existing_construction.png", 
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

// 🛠 미래 예정 공사 아이콘
const futureConstructionIcon = new L.Icon({
  iconUrl: "./src/images/future_construction.png", 
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const accidentIcon = new L.Icon({
  iconUrl: "./src/images/siren.png", // Car accident icon
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});


function OpenMap() {
  const [coordinates] = useState([43.4643, -80.5204]); // Default: Waterloo, Ontario, Canada
  const [roadData, setRoadData] = useState([]); // Store API response (list of features)
  const [accidentData, setAccidentData] = useState([]); // Accidents
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  // 토글 상태 추가
  const [showCurrentConstruction, setShowCurrentConstruction] = useState(true);
  const [showFutureConstruction, setShowFutureConstruction] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);

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

  // 🔹 Fetch Accident Data
  useEffect(() => {
    const fetchAccidents = async () => {
      try {
        const response = await fetch("http://10.144.112.60:3000/api/police-news/incidents");
        if (!response.ok) {
          throw new Error(`Server Error: ${response.status}`);
        }
        const result = await response.json();
    
        if (result.dailyIncidents && Array.isArray(result.dailyIncidents)) {
          const processedIncidents = result.dailyIncidents.map(incident => ({
            ...incident,
            latitude: incident.latitude ? parseFloat(incident.latitude) : 43.4643, // Default to Waterloo
            longitude: incident.longitude ? parseFloat(incident.longitude) : -80.5204
          }));
    
          setAccidentData(processedIncidents);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        console.error("Error fetching accident data:", error);
      }
    };
  
    fetchAccidents();
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

          // 🔹 공사 유형(현재 또는 미래) 구분
          const isFutureConstruction = properties.CLOSURE_SCHEDULED === "Future";
          const constructionIcon = isFutureConstruction ? futureConstructionIcon : currentConstructionIcon;
          const polylineColor = isFutureConstruction ? "blue" : "red";

          if ((isFutureConstruction && !showFutureConstruction) || (!isFutureConstruction && !showCurrentConstruction)) {
            return null;
          }

          return (
            <React.Fragment key={feature.id}>
              {/* 🚧 Add polyline for road closure */}
              <Polyline positions={polylineCoords} color={polylineColor}>
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
                    {isFutureConstruction ? "🛠 Future Construction 🛠" : "🚧 Construction Zone 🚧"}<br />
                    <b>Street:</b> {properties.STREET_NAME}<br />
                    <b>Status:</b> {properties.STATUS}<br />
                    <b>Details:</b> {properties.DETAILS}<br />
                  </Popup>
                </Marker>
              )}
            </React.Fragment>
          );
        })}

        {/* 🚨 Render Accident Markers */}
        {showIncidents && (
          accidentData
            .filter(incident => 
              incident.latitude && incident.longitude && 
              !isNaN(parseFloat(incident.latitude)) && 
              !isNaN(parseFloat(incident.longitude))
            )
            .map((incident, index) => (
              <Marker 
                key={`accident-${index}`} 
                position={[parseFloat(incident.latitude), parseFloat(incident.longitude)]} 
                icon={accidentIcon}
              >
                <Popup>
                  🚨 <b>{incident.title}</b> <br />
                  <b>Incident Number:</b> {incident.incident_number} <br />
                  <b>Date:</b> {incident.incident_date} <br />
                  <b>Location:</b> {incident.location} <br />
                </Popup>
              </Marker>
            ))
        )}

      </MapContainer>
      <div className="toggles" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', marginTop: '10px' }}>
        {/* Current Construction */}
        <label style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: '6px', padding: '0.5rem' }}>
          <img 
            src="./src/images/existing_construction.png" 
            alt="Current Construction Icon" 
            style={{ width: '30px', height: '30px', marginRight: '5px' }} 
          />
          <input 
            type="checkbox" 
            checked={showCurrentConstruction} 
            onChange={() => setShowCurrentConstruction(!showCurrentConstruction)} 
            style={{ marginRight: '5px' }}
          />
          Current Construction
        </label>

        {/* Future Construction */}
        <label style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: '6px', padding: '0.5rem' }}>
          <img 
            src="./src/images/future_construction.png" 
            alt="Future Construction Icon" 
            style={{ width: '30px', height: '30px', marginRight: '5px' }} 
          />
          <input 
            type="checkbox" 
            checked={showFutureConstruction} 
            onChange={() => setShowFutureConstruction(!showFutureConstruction)} 
            style={{ marginRight: '5px' }}
          />
          Future Construction
        </label>

        {/* Incidents */}
        <label style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: '6px', padding: '0.5rem' }}>
          <img 
            src="./src/images/siren.png" 
            alt="Incident Icon" 
            style={{ width: '30px', height: '30px', marginRight: '5px' }} 
          />
          <input 
            type="checkbox" 
            checked={showIncidents} 
            onChange={() => setShowIncidents(!showIncidents)} 
            style={{ marginRight: '5px' }}
          />
          Incidents
        </label>
      </div>
    </div>
  );
}

export default OpenMap;
