// MapComponent.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet icon not showing
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapComponent = () => {
  const position = [28.6139, 77.2090]; // Delhi

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer center={position} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Yeh Delhi hai!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;