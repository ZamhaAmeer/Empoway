import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, ShieldCheck, Users, HelpCircle, Layers, Info } from 'lucide-react';
import StatusBadge from './StatusBadge';

// Create custom SVG DivIcon for Leaflet markers based on status and heatmap mode
const createCustomMarker = (status, isSelected = false, isHeatmapMode = false) => {
  const norm = (status || 'UNKNOWN').toUpperCase();

  let bgColor = '#684638'; // Unknown default
  let borderColor = '#FFF9F0';
  let glowColor = 'rgba(104,70,56,0.3)';
  let iconSvg = '?';

  if (norm === 'VERIFIED') {
    bgColor = '#059669'; // Emerald
    borderColor = '#FFFFFF';
    glowColor = 'rgba(5, 150, 105, 0.45)';
    iconSvg = '✓';
  } else if (norm === 'COMMUNITY_REPORTED') {
    bgColor = '#D97706'; // Amber / Caramel
    borderColor = '#FFFFFF';
    glowColor = 'rgba(217, 119, 6, 0.45)';
    iconSvg = '★';
  }

  const size = isSelected ? 44 : isHeatmapMode ? 38 : 34;

  const html = `
    <div style="
      position: relative;
      width: ${size}px;
      height: ${size}px;
      background-color: ${bgColor};
      border: 3px solid ${borderColor};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 0 ${isHeatmapMode ? '16px' : '8px'} ${glowColor}, 0 4px 10px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    ">
      <span style="
        transform: rotate(45deg);
        color: white;
        font-weight: 800;
        font-size: ${isSelected ? '15px' : '13px'};
        font-family: sans-serif;
        line-height: 1;
      ">${iconSvg}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'empoway-custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
};

// Component to adjust bounds when places change
function ChangeView({ bounds, center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (center) {
      map.setView(center, zoom || 13);
    }
  }, [bounds, center, zoom, map]);
  return null;
}

export const MapView = ({
  places = [],
  selectedPlace = null,
  center = [6.9271, 79.8612], // Colombo default
  zoom = 13,
  height = '500px'
}) => {
  const [heatmapMode, setHeatmapMode] = useState(false);
  const [coverageFilter, setCoverageFilter] = useState('ALL');

  // Compute bounds if places exist
  const validPlaces = places.filter(
    (p) => typeof p.latitude === 'number' && typeof p.longitude === 'number' && !isNaN(p.latitude) && !isNaN(p.longitude)
  );

  const displayedPlaces = validPlaces.filter((p) => {
    if (coverageFilter === 'VERIFIED') return p.accessibilityStatus === 'VERIFIED';
    if (coverageFilter === 'COMMUNITY') return p.accessibilityStatus === 'COMMUNITY_REPORTED';
    if (coverageFilter === 'UNKNOWN') return p.accessibilityStatus === 'UNKNOWN';
    return true;
  });

  const bounds =
    displayedPlaces.length > 0
      ? displayedPlaces.map((p) => [p.latitude, p.longitude])
      : null;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-empoway-blush/80 shadow-card bg-empoway-cream" style={{ height }}>
      {/* Map Control Bar (Heatmap Layer Toggle & Coverage Filter) */}
      <div className="absolute top-3 left-3 z-1000 flex flex-wrap items-center gap-2 max-w-[calc(100%-80px)]">
        <button
          type="button"
          onClick={() => setHeatmapMode(!heatmapMode)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-elevated border flex items-center gap-1.5 backdrop-blur-md ${heatmapMode
              ? 'bg-empoway-terracotta text-white border-empoway-terracotta ring-2 ring-empoway-peach/50'
              : 'bg-white/95 text-empoway-coffee border-empoway-blush hover:bg-empoway-cream'
            }`}
          title="Toggle between standard pin markers and accessibility coverage heatmap layer"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{heatmapMode ? 'Heatmap Layer: Active' : 'Heatmap Layer'}</span>
        </button>

        <div className="hidden sm:flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-xl border border-empoway-blush shadow-xs text-xs">
          {[
            { id: 'ALL', label: `All (${validPlaces.length})` },
            { id: 'VERIFIED', label: 'Verified' },
            { id: 'COMMUNITY', label: 'Community' },
            { id: 'UNKNOWN', label: 'Needs Data' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setCoverageFilter(f.id)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${coverageFilter === f.id
                  ? 'bg-empoway-coffee text-white font-bold'
                  : 'text-empoway-coffee hover:bg-empoway-cream'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute top-3 right-3 z-1000 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-empoway-blush/60 shadow-elevated text-xs space-y-1.5 max-w-[220px]">
        <div className="font-bold text-empoway-coffee text-[10px] uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>{heatmapMode ? 'Coverage Legend' : 'Marker Legend'}</span>
          <span className="text-empoway-terracotta font-semibold">Colombo</span>
        </div>
        <div className="flex items-center gap-2 text-empoway-coffee">
          <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0 ring-2 ring-emerald-200" />
          <span className="font-semibold text-[11px]">Physically Audited & Verified</span>
        </div>
        <div className="flex items-center gap-2 text-empoway-coffee">
          <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0 ring-2 ring-amber-200" />
          <span className="font-semibold text-[11px]">Community Reported</span>
        </div>
        <div className="flex items-center gap-2 text-empoway-coffee">
          <span className="w-3 h-3 rounded-full bg-stone-500 shrink-0 ring-2 ring-stone-200" />
          <span className="font-semibold text-[11px]">Missing / Incomplete Data</span>
        </div>

        {heatmapMode && (
          <div className="pt-1.5 border-t border-empoway-blush/40 text-[10px] text-empoway-muted leading-tight">
            <em>Areas with few markers indicate limited survey data, not lack of access.</em>
          </div>
        )}
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={
            heatmapMode
              ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />

        {bounds && <ChangeView bounds={bounds} />}

        {/* Heatmap radiant coverage circles when in heatmap mode */}
        {heatmapMode &&
          displayedPlaces.map((place) => {
            const color =
              place.accessibilityStatus === 'VERIFIED'
                ? '#059669'
                : place.accessibilityStatus === 'COMMUNITY_REPORTED'
                  ? '#D97706'
                  : '#78716c';

            return (
              <Circle
                key={`circle-${place.id}`}
                center={[place.latitude, place.longitude]}
                radius={280}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.22,
                  color: color,
                  weight: 1.5,
                  opacity: 0.6
                }}
              />
            );
          })}

        {displayedPlaces.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          const coverPhoto =
            place.photographs && place.photographs.length > 0
              ? place.photographs.find((p) => p.isCover)?.url || place.photographs[0].url
              : '/places/colombo-city-centre.jpg';

          return (
            <Marker
              key={place.id}
              position={[place.latitude, place.longitude]}
              icon={createCustomMarker(place.accessibilityStatus, isSelected, heatmapMode)}
            >
              <Popup className="empoway-popup" minWidth={260}>
                <div className="text-empoway-coffee p-1 font-body">
                  <div className="h-28 -mx-1 -mt-1 mb-2 rounded-t-lg overflow-hidden bg-empoway-cream">
                    <img
                      src={coverPhoto}
                      alt={place.name}
                      onError={(e) => {
                        if (!e.currentTarget.src.endsWith('/places/colombo-city-centre.jpg')) {
                          e.currentTarget.src = '/places/colombo-city-centre.jpg';
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="mb-1">
                    <StatusBadge status={place.accessibilityStatus} size="sm" />
                  </div>

                  <h4 className="font-bold text-sm text-empoway-coffee mt-1 line-clamp-1">
                    {place.name}
                  </h4>

                  <p className="text-[11px] text-empoway-muted mt-0.5 line-clamp-2">
                    {place.address}
                  </p>

                  <div className="mt-3 pt-2 border-t border-empoway-cream flex items-center justify-between">
                    <span className="text-[11px] text-empoway-caramel font-semibold">
                      {place.cityOrArea}
                    </span>
                    <Link
                      to={`/places/${place.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-empoway-terracotta hover:underline"
                    >
                      View Profile <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;

