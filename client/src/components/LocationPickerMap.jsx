import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

const pickerIcon = L.divIcon({
  html: `
    <div style="
      width: 38px;
      height: 38px;
      background-color: #B96F54;
      border: 3px solid #FFFFFF;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 16px rgba(185,111,84,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <span style="
        transform: rotate(45deg);
        color: white;
        font-weight: 800;
        font-size: 16px;
      ">📍</span>
    </div>
  `,
  className: 'location-picker-pin',
  iconSize: [38, 38],
  iconAnchor: [19, 38]
});

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

function PanToLocation({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 14);
    }
  }, [lat, lng, map]);
  return null;
}

export const LocationPickerMap = ({
  latitude,
  longitude,
  onChange,
  height = '350px'
}) => {
  const currentLat = typeof latitude === 'number' && !isNaN(latitude) ? latitude : 6.9271;
  const currentLng = typeof longitude === 'number' && !isNaN(longitude) ? longitude : 79.8612;

  const handleSelect = (lat, lng) => {
    onChange({
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6))
    });
  };

  const colomboPresets = [
    { label: 'Colombo Fort (01)', lat: 6.9344, lng: 79.8448 },
    { label: 'Kollupitiya (03)', lat: 6.9056, lng: 79.8518 },
    { label: 'Cinnamon Gardens (07)', lat: 6.9042, lng: 79.8674 },
    { label: 'Borella (08)', lat: 6.9197, lng: 79.8687 },
    { label: 'Battaramulla', lat: 6.8996, lng: 79.9198 }
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-empoway-muted">
        <span className="flex items-center gap-1 font-medium text-empoway-coffee">
          <MapPin className="w-3.5 h-3.5 text-empoway-terracotta" />
          Click anywhere on the map or choose a preset area:
        </span>
        <div className="flex flex-wrap gap-1">
          {colomboPresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handleSelect(preset.lat, preset.lng)}
              className="px-2 py-0.5 rounded bg-empoway-cream hover:bg-empoway-blush text-empoway-coffee text-[11px] font-medium transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full rounded-xl overflow-hidden border border-empoway-blush/80 shadow-inner" style={{ height }}>
        <MapContainer
          center={[currentLat, currentLng]}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <PanToLocation lat={currentLat} lng={currentLng} />
          <MapClickHandler onLocationSelect={handleSelect} />
          <Marker
            position={[currentLat, currentLng]}
            icon={pickerIcon}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                handleSelect(position.lat, position.lng);
              }
            }}
          />
        </MapContainer>
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-empoway-muted bg-empoway-cream/60 px-3 py-1.5 rounded-lg border border-empoway-blush/50">
        <span>Selected Latitude: <strong className="text-empoway-coffee">{currentLat.toFixed(5)}</strong></span>
        <span>Selected Longitude: <strong className="text-empoway-coffee">{currentLng.toFixed(5)}</strong></span>
      </div>
    </div>
  );
};

export default LocationPickerMap;

