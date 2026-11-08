/**
 * EMPOWAY Colombo Accessible Transport Connection Service
 * Evaluates transit connectivity, nearest railway stations, accessible bus stops,
 * drop-off kerbs, and last-mile step-free corridor conditions.
 */

// Colombo Major Rail Terminals and Commuter Stations
const COLOMBO_RAIL_STATIONS = [
  {
    name: 'Colombo Fort Railway Station',
    lat: 6.9344,
    lng: 79.8505,
    lines: ['Main Line', 'Coastal Line', 'Kelani Valley Line', 'Puttalam Line'],
    stepFreePlatformAccess: true,
    hasDisabledAssistance: true,
    assistancePhone: '+94 11 243 4215',
    notes: 'Terminal Platform 1 is level with the concourse. Inform Station Master office 15 mins prior for portable train ramp assistance.'
  },
  {
    name: 'Maradana Railway Station',
    lat: 6.9272,
    lng: 79.8647,
    lines: ['Main Line', 'Coastal Line', 'Kelani Valley Line'],
    stepFreePlatformAccess: true,
    hasDisabledAssistance: true,
    assistancePhone: '+94 11 269 4235',
    notes: 'Main entrance concourse has street-level ramp. Footbridge elevators connect to Island Platforms 1 and 2.'
  },
  {
    name: 'Kompannavidiya (Slave Island) Station',
    lat: 6.9224,
    lng: 79.8517,
    lines: ['Coastal Line'],
    stepFreePlatformAccess: true,
    hasDisabledAssistance: false,
    assistancePhone: '+94 11 243 4215',
    notes: 'Ground-level crossing connecting Justice Akbar Mawatha to Platform 1. Moderate slope.'
  },
  {
    name: 'Kollupitiya Railway Station',
    lat: 6.9118,
    lng: 79.8510,
    lines: ['Coastal Line'],
    stepFreePlatformAccess: true,
    hasDisabledAssistance: true,
    assistancePhone: '+94 11 257 3254',
    notes: 'Marine Drive entrance has level ramped access. Direct connection to Galle Road via Station Road (paved with dropped kerbs).'
  },
  {
    name: 'Bambalapitiya Railway Station',
    lat: 6.8928,
    lng: 79.8550,
    lines: ['Coastal Line'],
    stepFreePlatformAccess: false,
    hasDisabledAssistance: false,
    assistancePhone: '+94 11 258 8763',
    notes: 'Marine Drive entrance has gentle ramp; however, crossover bridge to Colombo-bound platform has steps without elevator.'
  },
  {
    name: 'Wellawatte Railway Station',
    lat: 6.8745,
    lng: 79.8584,
    lines: ['Coastal Line'],
    stepFreePlatformAccess: true,
    hasDisabledAssistance: false,
    assistancePhone: '+94 11 236 1289',
    notes: 'Marine Drive level gate provides direct step-free access to Platform 1.'
  },
  {
    name: 'Secretariat Halt',
    lat: 6.9312,
    lng: 79.8436,
    lines: ['Coastal Line'],
    stepFreePlatformAccess: true,
    hasDisabledAssistance: false,
    assistancePhone: null,
    notes: 'Direct ramp to Galle Face Promenade. Flat and wheelchair-accessible.'
  }
];

// Colombo Major Bus Hubs, Express Terminals and Corridors
const COLOMBO_BUS_HUBS = [
  {
    name: 'Colombo Fort Multi-Modal Bus Stand',
    lat: 6.9348,
    lng: 79.8520,
    routes: ['100', '101', '120', '138', '177', '180'],
    shelteredBays: true,
    curbRampsPresent: true,
    lowFloorBusService: true,
    notes: 'Key Colombo transfer point. Low-floor SLTB commuter buses operate on routes 100 & 101 from here.'
  },
  {
    name: 'Bastian Mawatha Central Bus Stand (Pettah)',
    lat: 6.9370,
    lng: 79.8540,
    routes: ['Intercity Express', 'Highway Express to Galle/Kandy', '01', '02', '04'],
    shelteredBays: true,
    curbRampsPresent: true,
    lowFloorBusService: false,
    notes: 'Main inter-provincial terminal. Wide paved boarding platforms; dropped kerb on Bastian Mawatha exit.'
  },
  {
    name: 'Town Hall & Lipton Circus Bus Hub',
    lat: 6.9147,
    lng: 79.8685,
    routes: ['120', '138', '177', '154', '155'],
    shelteredBays: true,
    curbRampsPresent: true,
    lowFloorBusService: true,
    notes: 'Viharamahadevi Park perimeter. Continuous wide paved sidewalks and dropped kerbs at pedestrian crossings.'
  },
  {
    name: 'Borella Junction Bus Interchange',
    lat: 6.9140,
    lng: 79.8780,
    routes: ['103', '144', '176', '168', '175'],
    shelteredBays: true,
    curbRampsPresent: false,
    lowFloorBusService: false,
    notes: 'Busy junction. Kerbs at bus bays are relatively high (15-20cm); caution advised when boarding standard buses.'
  },
  {
    name: 'Galle Face & Galle Road Transit Corridor',
    lat: 6.9230,
    lng: 79.8465,
    routes: ['100', '101', '102', '400'],
    shelteredBays: true,
    curbRampsPresent: true,
    lowFloorBusService: true,
    notes: 'Galle Road corridor features tactile sidewalks and dropped kerbs. Pilot accessible low-floor buses frequent this spine.'
  },
  {
    name: 'Cinnamon Gardens (Nelum Pokuna / Public Library Halt)',
    lat: 6.9115,
    lng: 79.8665,
    routes: ['138', '120', '154'],
    shelteredBays: true,
    curbRampsPresent: true,
    lowFloorBusService: true,
    notes: 'Wide tree-shaded pedestrian pavements with smooth paving and dropped kerbs along Ananda Coomaraswamy Mawatha.'
  },
  {
    name: 'Bambalapitiya Junction Bus Halt',
    lat: 6.8950,
    lng: 79.8565,
    routes: ['100', '101', '154', '155'],
    shelteredBays: true,
    curbRampsPresent: true,
    lowFloorBusService: true,
    notes: 'Galle Road & Bauddhaloka Mawatha intersection. Dropped kerbs on pedestrian crossing.'
  },
  {
    name: 'Havelock City / Thimbirigasyaya Bus Halt',
    lat: 6.8875,
    lng: 79.8670,
    routes: ['120', '138', '177'],
    shelteredBays: true,
    curbRampsPresent: true,
    lowFloorBusService: false,
    notes: 'Paved walkways around Havelock precinct with modern ramped driveways.'
  }
];

/**
 * Haversine formula: calculate distance between two coordinates in meters
 */
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Format meter distance to human readable string (e.g., "350 m" or "1.4 km")
 */
function formatDistance(meters) {
  if (meters < 1000) {
    return `${meters} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Estimate wheelchair rolling / walking time in minutes (~70 meters per minute)
 */
function estimateRollingMinutes(meters) {
  const minutes = Math.ceil(meters / 70);
  return minutes < 1 ? 1 : minutes;
}

/**
 * Evaluate Colombo corridor walkability based on area and distance
 */
function evaluateCorridorConditions(place, distanceToBusMeters) {
  const area = (place.cityOrArea || '').toLowerCase();
  const district = (place.district || '').toLowerCase();

  // Certain modern Colombo corridors have high dropped-kerb density
  const highQualityCorridors = ['colombo 03', 'kollupitiya', 'colombo 07', 'cinnamon gardens', 'fort', 'colombo 01', 'galle face'];
  const moderateCorridors = ['colombo 02', 'slave island', 'colombo 04', 'bambalapitiya', 'colombo 10', 'borella', 'havelock'];

  let curbRampStatus = 'PARTIAL';
  let sidewalkQuality = 'MODERATE';
  let corridorAdvice = 'Continuous paved sidewalks available; expect occasional curb drops at side-streets.';

  if (highQualityCorridors.some((c) => area.includes(c))) {
    curbRampStatus = 'EXCELLENT';
    sidewalkQuality = 'HIGH';
    corridorAdvice = 'High-standard pedestrian corridor with dropped kerbs at signalized junctions and smooth concrete pavers.';
  } else if (moderateCorridors.some((c) => area.includes(c))) {
    curbRampStatus = 'MODERATE';
    sidewalkQuality = 'MODERATE';
    corridorAdvice = 'Generally accessible sidewalks, but beware of uneven driveway transitions and parked vehicles.';
  } else {
    curbRampStatus = 'LIMITED';
    sidewalkQuality = 'VARIABLE';
    corridorAdvice = 'Narrower sidewalks with higher roadside curbs (15-20cm). Request companion support or use vehicle drop-off.';
  }

  return {
    curbRampStatus,
    sidewalkQuality,
    corridorAdvice,
    isShortWalk: distanceToBusMeters <= 500
  };
}

/**
 * Main transport connection analysis function
 */
function analyzeTransportConnections(place) {
  if (!place || !place.latitude || !place.longitude) {
    return null;
  }

  const pLat = parseFloat(place.latitude);
  const pLng = parseFloat(place.longitude);

  // 1. Find nearest railway station
  const railConnections = COLOMBO_RAIL_STATIONS.map((st) => {
    const dist = calculateDistanceMeters(pLat, pLng, st.lat, st.lng);
    return {
      ...st,
      distanceMeters: dist,
      formattedDistance: formatDistance(dist),
      rollingMinutes: estimateRollingMinutes(dist)
    };
  }).sort((a, b) => a.distanceMeters - b.distanceMeters);

  const nearestRail = railConnections[0] || null;

  // 2. Find nearest bus stop / hub
  const busConnections = COLOMBO_BUS_HUBS.map((b) => {
    const dist = calculateDistanceMeters(pLat, pLng, b.lat, b.lng);
    return {
      ...b,
      distanceMeters: dist,
      formattedDistance: formatDistance(dist),
      rollingMinutes: estimateRollingMinutes(dist)
    };
  }).sort((a, b) => a.distanceMeters - b.distanceMeters);

  const nearestBus = busConnections[0] || null;

  // 3. Last-mile corridor evaluation
  const corridor = evaluateCorridorConditions(place, nearestBus ? nearestBus.distanceMeters : 999);

  // 4. Drop-off Bay Assessment (based on place verified features)
  const feat = place.accessibilityFeature || {};
  const hasParking = feat.accessibleParking === 'AVAILABLE';
  const hasStepFreeEntrance = feat.stepFreeEntrance === 'AVAILABLE';
  const hasRamp = feat.wheelchairRamp === 'AVAILABLE';

  const dropOff = {
    suitability: hasStepFreeEntrance || hasRamp ? 'EXCELLENT' : 'MODERATE',
    hasDedicatedBay: hasParking,
    shelteredPortico: place.entranceDetails ? place.entranceDetails.toLowerCase().includes('portico') || place.entranceDetails.toLowerCase().includes('sliding') : false,
    vehicleAccessNotes: hasStepFreeEntrance
      ? 'Step-free vehicle drop-off directly in front of main entrance doors. Wheelchair accessible cabs (PickMe / Kangaroo Flash) can unload safely.'
      : 'Entrance has curbs/steps. Driver assistance required to bridge curb onto pedestrian pathway.',
    accessibleTaxiRecommendation: 'Book wheelchair-accessible vans in advance via Colombo taxi dispatch or hospital transport services.'
  };

  // 5. Overall Transit Connectivity Score (0-100)
  let transitScore = 70;
  if (nearestBus && nearestBus.distanceMeters <= 400) transitScore += 15;
  else if (nearestBus && nearestBus.distanceMeters <= 800) transitScore += 5;

  if (nearestRail && nearestRail.distanceMeters <= 1200) transitScore += 10;
  if (corridor.curbRampStatus === 'EXCELLENT') transitScore += 10;
  if (hasParking) transitScore += 5;

  transitScore = Math.min(100, Math.max(30, transitScore));

  let connectivityVerdict = 'GOOD';
  let verdictLabel = 'Accessible Transit Links Available';
  let verdictColor = 'emerald';

  if (transitScore >= 85) {
    connectivityVerdict = 'EXCELLENT';
    verdictLabel = 'Excellent Public Transit Hub Connectivity';
    verdictColor = 'emerald';
  } else if (transitScore < 60) {
    connectivityVerdict = 'LIMITED';
    verdictLabel = 'Transit Distance High – Drop-off Cab Recommended';
    verdictColor = 'amber';
  }

  // 6. Colombo commuter transit advice
  const transitTips = [
    `Nearest Bus Stop: ${nearestBus ? nearestBus.name : 'Colombo Main Halt'} is ${nearestBus ? nearestBus.formattedDistance : ''} away (~${nearestBus ? nearestBus.rollingMinutes : ''} min roll).`,
    `Railway Connectivity: ${nearestRail ? nearestRail.name : 'Colombo Fort'} (${nearestRail ? nearestRail.formattedDistance : ''}) provides commuter rail links. Call Station Master at ${nearestRail ? nearestRail.assistancePhone || 'station desk' : ''} to arrange portable ramp boarding.`,
    `Roadway Crossings: Use designated pedestrian zebra crossings or signalized pelican crossings in this sector. Avoid crossing wide multi-lane traffic corridors without traffic lights.`
  ];

  return {
    transitScore,
    connectivityVerdict,
    verdictLabel,
    verdictColor,
    nearestBus,
    nearestRail,
    allNearbyBusStops: busConnections.slice(0, 3),
    allNearbyRailStations: railConnections.slice(0, 3),
    corridor,
    dropOff,
    transitTips
  };
}

module.exports = {
  COLOMBO_RAIL_STATIONS,
  COLOMBO_BUS_HUBS,
  calculateDistanceMeters,
  formatDistance,
  estimateRollingMinutes,
  analyzeTransportConnections
};

