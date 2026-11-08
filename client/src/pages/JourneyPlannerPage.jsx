import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Compass,
  MapPin,
  Navigation,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Footprints,
  Phone,
  Search,
  ChevronRight,
  Info,
  Car,
  Heart,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import StatusBadge from '../components/StatusBadge';

// Helper custom Leaflet pins
const createRoutePin = (type, label) => {
  const isStart = type === 'start';
  const bgColor = isStart ? '#059669' : '#B96F54';
  const size = 38;

  const html = `
    <div style="
      position: relative;
      width: ${size}px;
      height: ${size}px;
      background-color: ${bgColor};
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 14px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <span style="
        transform: rotate(45deg);
        color: white;
        font-weight: 800;
        font-size: 13px;
        font-family: sans-serif;
      ">${isStart ? 'A' : 'B'}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'journey-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
};

function ChangeMapView({ bounds, center }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    } else if (center) {
      map.setView(center, 13);
    }
  }, [bounds, center, map]);
  return null;
}

export const JourneyPlannerPage = () => {
  const [allPlaces, setAllPlaces] = useState([]);
  const [startPlaceId, setStartPlaceId] = useState('');
  const [destPlaceId, setDestPlaceId] = useState('');
  const [customStart, setCustomStart] = useState('');
  const [customDest, setCustomDest] = useState('');
  const [startCoords, setStartCoords] = useState([6.9344, 79.8505]); // Default: Colombo Fort
  const [destCoords, setDestCoords] = useState([6.9218, 79.8654]); // Default: NHSL
  const [startLabel, setStartLabel] = useState('Colombo Fort Concourse');
  const [destLabel, setDestLabel] = useState('National Hospital of Sri Lanka (NHSL)');
  const [nearbyFacilities, setNearbyFacilities] = useState([]);
  const [loadingGps, setLoadingGps] = useState(false);
  const [gpsError, setGpsError] = useState('');

  // Load all places for select lists and route intersection
  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const res = await api.getPlaces({ limit: 100 });
        if (res.success && res.places) {
          setAllPlaces(res.places);
          if (res.places.length >= 2) {
            setStartPlaceId(String(res.places[0].id));
            setDestPlaceId(String(res.places[1].id));
            setStartCoords([res.places[0].latitude, res.places[0].longitude]);
            setDestCoords([res.places[1].latitude, res.places[1].longitude]);
            setStartLabel(res.places[0].name);
            setDestLabel(res.places[1].name);
          }
        }
      } catch (err) {
        console.error('Error loading places for journey planner:', err);
      }
    };
    loadPlaces();
  }, []);

  // Compute nearby corridor facilities whenever start or dest changes
  useEffect(() => {
    if (!startCoords || !destCoords || allPlaces.length === 0) return;

    // Midpoint & corridor bounding box calculation
    const minLat = Math.min(startCoords[0], destCoords[0]) - 0.02;
    const maxLat = Math.max(startCoords[0], destCoords[0]) + 0.02;
    const minLng = Math.min(startCoords[1], destCoords[1]) - 0.02;
    const maxLng = Math.max(startCoords[1], destCoords[1]) + 0.02;

    const corridor = allPlaces.filter(
      (p) =>
        p.latitude >= minLat &&
        p.latitude <= maxLat &&
        p.longitude >= minLng &&
        p.longitude <= maxLng &&
        p.name !== startLabel &&
        p.name !== destLabel
    );

    setNearbyFacilities(corridor.slice(0, 6));
  }, [startCoords, destCoords, allPlaces, startLabel, destLabel]);

  const handleStartSelect = (e) => {
    const val = e.target.value;
    setStartPlaceId(val);
    const place = allPlaces.find((p) => String(p.id) === val);
    if (place) {
      setStartCoords([place.latitude, place.longitude]);
      setStartLabel(place.name);
    }
  };

  const handleDestSelect = (e) => {
    const val = e.target.value;
    setDestPlaceId(val);
    const place = allPlaces.find((p) => String(p.id) === val);
    if (place) {
      setDestCoords([place.latitude, place.longitude]);
      setDestLabel(place.name);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser. Please search or select manually.');
      return;
    }

    setLoadingGps(true);
    setGpsError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setStartCoords([latitude, longitude]);
        setStartLabel('Your Current Location (GPS)');
        setStartPlaceId('custom_gps');
        setLoadingGps(false);
      },
      (err) => {
        setLoadingGps(false);
        setGpsError('Location permission denied or unavailable. Please search manually using the destination selector below.');
      },
      { timeout: 8000 }
    );
  };

  // Approximate distance (Haversine formula in km)
  const calcDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const routeDistanceKm = calcDistance(
    startCoords[0],
    startCoords[1],
    destCoords[0],
    destCoords[1]
  );

  const routePositions = [startCoords, destCoords];
  const mapBounds = [startCoords, destCoords];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-empoway-muted" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-empoway-terracotta transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-empoway-blush" />
        <Link to="/explore" className="hover:text-empoway-terracotta transition-colors">
          Places
        </Link>
        <ChevronRight className="w-3 h-3 text-empoway-blush" />
        <span className="font-semibold text-empoway-coffee">
          Accessibility Journey Planner
        </span>
      </nav>

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-empoway-blush/70 shadow-card space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-empoway-terracotta/10 text-empoway-terracotta flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-empoway-terracotta/10 text-empoway-terracotta border border-empoway-terracotta/20">
              Corridor Audit & Navigation
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-empoway-coffee">
              Accessibility Journey Planner
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-empoway-muted leading-relaxed max-w-3xl">
          Plot your destination across Colombo, inspect audited entrances and ramps at both ends, and discover verified accessible facilities along the corridor.
        </p>
      </div>

      {/* Route Inputs Card */}
      <div className="bg-white rounded-3xl p-6 border border-empoway-blush/80 shadow-card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Origin Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-empoway-coffee uppercase tracking-wider">
                Starting Location (Point A)
              </label>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={loadingGps}
                className="text-[11px] font-bold text-empoway-terracotta hover:underline inline-flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" />
                <span>{loadingGps ? 'Locating...' : 'Use My GPS'}</span>
              </button>
            </div>

            <select
              value={startPlaceId}
              onChange={handleStartSelect}
              className="w-full p-3 text-xs sm:text-sm rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee font-semibold focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
            >
              <option value="">-- Choose Starting Venue --</option>
              {allPlaces.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  {pl.name} ({pl.cityOrArea})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-empoway-coffee uppercase tracking-wider">
              Destination Location (Point B)
            </label>
            <select
              value={destPlaceId}
              onChange={handleDestSelect}
              className="w-full p-3 text-xs sm:text-sm rounded-xl bg-empoway-ivory border border-empoway-blush text-empoway-coffee font-semibold focus:border-empoway-terracotta focus:ring-1 focus:ring-empoway-terracotta"
            >
              <option value="">-- Choose Destination Venue --</option>
              {allPlaces.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  {pl.name} ({pl.cityOrArea})
                </option>
              ))}
            </select>
          </div>
        </div>

        {gpsError && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}
      </div>

      {/* Mandatory Transparent Route Accessibility Disclosure */}
      <div className="p-5 rounded-2xl bg-amber-50/80 border-2 border-amber-300 text-amber-950 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Factual Route Accessibility Policy & Disclosure</span>
        </div>
        <p className="leading-relaxed">
          EMPOWAY provides verified accessibility audits for specific destination buildings. However, <strong>street pavement gradients, sidewalk kerb-drops, and pedestrian crossing accessibility along public roads in Colombo are not universally mapped or certified</strong>.
          We never falsely claim that an entire road corridor is 100% wheelchair-accessible unless verified municipal route telemetry exists. Always confirm on-site sidewalk conditions before undertaking long pedestrian transits.
        </p>
      </div>

      {/* Route Map & Nearby Facilities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-empoway-blush/80 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-empoway-cream">
            <div>
              <h2 className="text-sm font-bold text-empoway-coffee">
                Journey Path & Facility Corridor
              </h2>
              <p className="text-xs text-empoway-muted">
                Estimated straight-line transit: ~{routeDistanceKm} km
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-semibold text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Point A (Start)
              </span>
              <span className="flex items-center gap-1 font-semibold text-empoway-terracotta">
                <span className="w-2.5 h-2.5 rounded-full bg-empoway-terracotta" /> Point B (Dest)
              </span>
            </div>
          </div>

          <div className="h-[480px] rounded-2xl overflow-hidden border border-empoway-blush/60 relative">
            <MapContainer
              center={startCoords}
              zoom={14}
              scrollWheelZoom={true}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <ChangeMapView bounds={mapBounds} />

              {/* Origin Marker */}
              <Marker position={startCoords} icon={createRoutePin('start', 'A')}>
                <Popup className="empoway-popup">
                  <div className="p-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-700 block">Origin Point A</span>
                    <strong className="text-xs text-empoway-coffee">{startLabel}</strong>
                  </div>
                </Popup>
              </Marker>

              {/* Destination Marker */}
              <Marker position={destCoords} icon={createRoutePin('dest', 'B')}>
                <Popup className="empoway-popup">
                  <div className="p-1">
                    <span className="text-[10px] font-bold uppercase text-empoway-terracotta block">Destination Point B</span>
                    <strong className="text-xs text-empoway-coffee">{destLabel}</strong>
                  </div>
                </Popup>
              </Marker>

              {/* Route Polyline */}
              <Polyline
                positions={routePositions}
                pathOptions={{
                  color: '#B96F54',
                  weight: 4,
                  dashArray: '8, 8',
                  opacity: 0.8
                }}
              />

              {/* Nearby Corridor Facilities Markers */}
              {nearbyFacilities.map((fac) => (
                <Marker
                  key={fac.id}
                  position={[fac.latitude, fac.longitude]}
                >
                  <Popup className="empoway-popup">
                    <div className="p-1 text-xs space-y-1">
                      <span className="text-[10px] uppercase font-bold text-empoway-caramel block">
                        {fac.category?.name || 'Corridor Facility'}
                      </span>
                      <strong className="text-empoway-coffee block">{fac.name}</strong>
                      <p className="text-[11px] text-empoway-muted">{fac.cityOrArea}</p>
                      <Link
                        to={`/places/${fac.id}`}
                        className="text-xs font-bold text-empoway-terracotta hover:underline inline-block pt-1"
                      >
                        Inspect Accessibility Profile →
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Right Column: Nearby Accessible Facilities Along Journey */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-empoway-blush/80 shadow-card space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-empoway-terracotta block">
                En Route Support
              </span>
              <h3 className="text-base font-bold text-empoway-coffee">
                Nearby Accessible Facilities ({nearbyFacilities.length})
              </h3>
              <p className="text-xs text-empoway-muted mt-0.5">
                Hospitals, transit hubs, and rest stops situated along your journey corridor.
              </p>
            </div>

            <div className="space-y-3">
              {nearbyFacilities.length === 0 ? (
                <p className="py-6 text-center text-xs text-empoway-muted">
                  No additional facilities recorded within 2km of this direct path.
                </p>
              ) : (
                nearbyFacilities.map((fac) => (
                  <div
                    key={fac.id}
                    className="p-3.5 rounded-2xl bg-empoway-ivory border border-empoway-blush/60 space-y-1.5 hover:border-empoway-terracotta/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-empoway-caramel">
                        {fac.category?.name}
                      </span>
                      <StatusBadge status={fac.accessibilityStatus} size="sm" />
                    </div>

                    <h4 className="font-bold text-xs text-empoway-coffee leading-snug">
                      <Link to={`/places/${fac.id}`} className="hover:underline">
                        {fac.name}
                      </Link>
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-empoway-muted pt-1">
                      <span>{fac.cityOrArea}</span>
                      <Link
                        to={`/places/${fac.id}`}
                        className="text-empoway-terracotta font-bold hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>Audit</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Colombo Transit & Emergency Contact Info */}
          <div className="bg-white rounded-3xl p-6 border border-empoway-blush/80 shadow-card space-y-3 text-xs">
            <h4 className="font-bold text-empoway-coffee border-b border-empoway-cream pb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-empoway-terracotta" />
              <span>Colombo Emergency & Transport Contacts</span>
            </h4>
            <div className="space-y-2 text-empoway-coffee">
              <div className="flex justify-between">
                <span>National Emergency Ambulance:</span>
                <strong>1990 (Suwa Seriya)</strong>
              </div>
              <div className="flex justify-between">
                <span>NHSL Emergency Dept:</span>
                <a href="tel:0112691111" className="text-empoway-terracotta font-bold hover:underline">
                  011 269 1111
                </a>
              </div>
              <div className="flex justify-between">
                <span>Colombo Fort Railway Station:</span>
                <a href="tel:0112434215" className="text-empoway-terracotta font-bold hover:underline">
                  011 243 4215
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyPlannerPage;

