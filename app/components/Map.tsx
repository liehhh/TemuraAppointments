"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMemo, useState, useEffect } from "react";
import PopupCarousel from "./PopupCarousel";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProps {
  latitude: number;
  longitude: number;
  locationName?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  photos?: string[];
}

export default function Map({
  latitude,
  longitude,
  locationName = "Location",
  onMouseEnter,
  onMouseLeave,
  photos = [],
}: MapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const position = useMemo(() => [latitude, longitude] as [number, number], [latitude, longitude]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div style={{ height: "400px", width: "100%" }}>Loading map...</div>;
  }

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={icon}>
        <Popup maxWidth={250} minWidth={200} closeButton={true} offset={[0, -10]}>
          <PopupCarousel photos={photos} locationName={locationName} />
        </Popup>
      </Marker>
    </MapContainer>
  );
}
