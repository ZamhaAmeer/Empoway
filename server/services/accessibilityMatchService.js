/**
 * EMPOWAY Personal Accessibility Match Engine
 * Computes individual accessibility compatibility based on user mobility equipment
 * and places verified architectural features and barriers.
 */

const MOBILITY_PROFILES = {
  power_wheelchair: {
    id: 'power_wheelchair',
    name: 'Power / Electric Wheelchair',
    description: 'Requires strict step-free access, wide turning corridors, low ramp gradients, and elevator connectivity.',
    icon: 'Zap',
    criticalNeeds: ['stepFreeEntrance', 'wheelchairRamp', 'wideDoorways', 'elevator', 'wheelchairPathways'],
    desirableNeeds: ['accessibleToilet', 'accessibleParking', 'accessibleCounters'],
    maxStepTolerance: 0,
    doorwayToleranceCm: 85
  },
  manual_wheelchair: {
    id: 'manual_wheelchair',
    name: 'Manual Wheelchair',
    description: 'Requires ramps or level entrances, accessible restrooms, clear pathways, and manageable thresholds.',
    icon: 'Wheelchair',
    criticalNeeds: ['stepFreeEntrance', 'wheelchairRamp', 'accessibleToilet', 'wheelchairPathways'],
    desirableNeeds: ['wideDoorways', 'elevator', 'accessibleParking', 'accessibleCounters'],
    maxStepTolerance: 1, // Can manage a single low 2-inch threshold with assist
    doorwayToleranceCm: 75
  },
  walking_aid: {
    id: 'walking_aid',
    name: 'Cane, Crutches or Walker',
    description: 'Needs step-free routes or elevators for multi-level buildings, non-slip pathways, and close parking.',
    icon: 'Footprints',
    criticalNeeds: ['stepFreeEntrance', 'elevator', 'wheelchairPathways'],
    desirableNeeds: ['wheelchairRamp', 'accessibleParking', 'accessibleToilet'],
    maxStepTolerance: 2,
    doorwayToleranceCm: 70
  },
  stroller: {
    id: 'stroller',
    name: 'Pram or Stroller / Family',
    description: 'Needs step-free entrance, elevator, wide doors, and clean accessible family restrooms.',
    icon: 'Baby',
    criticalNeeds: ['stepFreeEntrance', 'elevator', 'wideDoorways'],
    desirableNeeds: ['wheelchairRamp', 'accessibleToilet', 'wheelchairPathways'],
    maxStepTolerance: 1,
    doorwayToleranceCm: 75
  },
  limited_mobility: {
    id: 'limited_mobility',
    name: 'Senior / Limited Stamina',
    description: 'Benefits from step-free entry, elevators, close parking bays, and level continuous walking corridors.',
    icon: 'Heart',
    criticalNeeds: ['stepFreeEntrance', 'elevator', 'accessibleParking'],
    desirableNeeds: ['wheelchairPathways', 'accessibleToilet'],
    maxStepTolerance: 3,
    doorwayToleranceCm: 70
  },
  custom: {
    id: 'custom',
    name: 'Custom Mobility Profile',
    description: 'Individually selected requirements tailored to your specific travel and mobility needs.',
    icon: 'Sliders',
    criticalNeeds: [],
    desirableNeeds: []
  }
};

const FEATURE_NAMES = {
  stepFreeEntrance: 'Wheelchair-accessible entrance',
  wheelchairRamp: 'Ramp availability',
  elevator: 'Elevator availability',
  accessibleToilet: 'Accessible toilet',
  accessibleParking: 'Accessible parking',
  wideDoorways: 'Wide entrance & doorways',
  wheelchairPathways: 'Wheelchair-friendly pathways',
  accessibleCounters: 'Accessible service counters'
};

/**
 * Calculate personal match compatibility for a place
 * @param {Object} place - Place model or plain object
 * @param {Object} userProfile - User mobility profile or profile type string
 * @returns {Object} Match results with score, verdict, checklist, barriers and advice
 */
function calculatePersonalMatch(place, userProfile = 'manual_wheelchair') {
  let profileKey = 'manual_wheelchair';
  let customNeeds = null;

  if (typeof userProfile === 'string') {
    profileKey = userProfile;
  } else if (userProfile && typeof userProfile === 'object') {
    profileKey = userProfile.type || 'manual_wheelchair';
    customNeeds = userProfile.customNeeds || null;
  }

  const baseConfig = MOBILITY_PROFILES[profileKey] || MOBILITY_PROFILES.manual_wheelchair;
  let critical = [...(baseConfig.criticalNeeds || [])];
  let desirable = [...(baseConfig.desirableNeeds || [])];

  if (profileKey === 'custom' && customNeeds) {
    critical = [];
    desirable = [];
    Object.keys(customNeeds).forEach((k) => {
      if (customNeeds[k] === 'critical' || customNeeds[k] === true) {
        critical.push(k);
      } else if (customNeeds[k] === 'desirable') {
        desirable.push(k);
      }
    });
    // Fallback if empty custom
    if (critical.length === 0 && desirable.length === 0) {
      critical = ['stepFreeEntrance', 'wheelchairRamp', 'accessibleToilet'];
    }
  }

  const features = place.accessibilityFeature || {};
  const numberOfSteps = place.numberOfSteps || 0;
  const rampStatus = (features.wheelchairRamp || 'UNKNOWN').toUpperCase();
  const entranceStatus = (features.stepFreeEntrance || 'UNKNOWN').toUpperCase();

  const allAssessedKeys = Array.from(new Set([...critical, ...desirable]));
  if (allAssessedKeys.length === 0) {
    allAssessedKeys.push('stepFreeEntrance', 'wheelchairRamp', 'accessibleToilet');
  }

  let totalWeight = 0;
  let earnedScore = 0;
  const breakdown = [];
  const barrierWarnings = [];
  const auditorNotes = [];

  // Check critical step barrier
  if (numberOfSteps > baseConfig.maxStepTolerance && rampStatus !== 'AVAILABLE' && entranceStatus !== 'AVAILABLE') {
    barrierWarnings.push(`Physical Barrier: ${numberOfSteps} step(s) at main entry without permanent ramp.`);
  }

  // Check place limitation notes
  if (place.limitationsNotes && place.limitationsNotes.trim().length > 0) {
    const noteText = place.limitationsNotes.trim();
    const isMajorLimitation = /(no elevator|stairs only|steep gradient|cannot accommodate|not accessible|heavy threshold|no ramp|curb barrier)/i.test(noteText);
    if (isMajorLimitation) {
      barrierWarnings.push(`Auditor Warning: ${noteText}`);
    } else {
      auditorNotes.push(`Auditor Note: ${noteText}`);
    }
  }

  allAssessedKeys.forEach((key) => {
    const rawVal = (features[key] || 'UNKNOWN').toUpperCase();
    const isCritical = critical.includes(key);
    const weight = isCritical ? 2.0 : 1.0;
    totalWeight += weight;

    let points = 0;
    let matchType = 'UNKNOWN'; // MET, PARTIAL, UNMET, UNKNOWN

    if (rawVal === 'AVAILABLE') {
      points = weight;
      matchType = 'MET';
    } else if (rawVal === 'NEEDS_VERIFICATION') {
      points = weight * 0.5;
      matchType = 'PARTIAL';
    } else if (rawVal === 'NOT_AVAILABLE') {
      points = 0;
      matchType = 'UNMET';
      if (isCritical) {
        barrierWarnings.push(`Missing Critical Feature: ${FEATURE_NAMES[key] || key} is reported not available.`);
      }
    } else {
      points = 0;
      matchType = 'UNKNOWN';
    }

    earnedScore += points;

    breakdown.push({
      key,
      label: FEATURE_NAMES[key] || key,
      isCritical,
      status: rawVal,
      matchType,
      points,
      weight
    });
  });

  const rawPercent = totalWeight > 0 ? Math.round((earnedScore / totalWeight) * 100) : 50;

  // Penalty if critical barrier detected
  let finalScore = rawPercent;
  if (barrierWarnings.length > 0 && finalScore > 75) {
    finalScore = 75; // Cap score if known major barrier exists
  }

  let verdict = 'MODERATE';
  let verdictLabel = 'Moderate Fit';
  let badgeColor = 'amber';

  if (finalScore >= 85 && barrierWarnings.length === 0) {
    verdict = 'EXCELLENT';
    verdictLabel = 'High Compatibility';
    badgeColor = 'emerald';
  } else if (finalScore < 60 || barrierWarnings.length >= 2) {
    verdict = 'LIMITED';
    verdictLabel = 'Caution / Barriers Detected';
    badgeColor = 'rose';
  }

  // Combine warnings and auditor notes for user display
  const allNotices = [...barrierWarnings, ...auditorNotes];

  // Generate personalized advice
  let advice = '';
  if (verdict === 'EXCELLENT') {
    advice = `Great fit for ${baseConfig.name}. Verified step-free access and essential facilities meet your requirements.`;
  } else if (verdict === 'MODERATE') {
    advice = `Usable for ${baseConfig.name}, but some features require verification or assistance may be needed at the entry.`;
  } else {
    advice = `Significant hurdles identified for ${baseConfig.name}. Stepped thresholds or missing accessibility facilities may cause difficulty.`;
  }

  return {
    profileType: profileKey,
    profileName: baseConfig.name,
    matchScore: finalScore,
    verdict,
    verdictLabel,
    badgeColor,
    advice,
    barrierWarnings,
    auditorNotes,
    allNotices,
    breakdown,
    assessedCount: allAssessedKeys.length,
    criticalMetCount: breakdown.filter((b) => b.isCritical && b.matchType === 'MET').length,
    criticalTotalCount: critical.length
  };
}

module.exports = {
  MOBILITY_PROFILES,
  FEATURE_NAMES,
  calculatePersonalMatch
};

