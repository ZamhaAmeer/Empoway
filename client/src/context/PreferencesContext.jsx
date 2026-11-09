import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const PreferencesContext = createContext();

export const TRANSLATIONS = {
  en: {
    // Navigation
    home: 'Home',
    explore: 'Explore Places',
    compare: 'Compare',
    journey: 'Journey Planner',
    colomboPilot: 'Colombo Pilot',
    verifiedLocations: 'Verified Locations',
    sharePlace: 'Share a Place',
    signIn: 'Sign In',
    register: 'Create Account',
    signOut: 'Sign Out',
    myProfile: 'My Profile',
    dashboard: 'User Dashboard',
    settings: 'Settings',
    adminConsole: 'Admin Console',
    orgPortal: 'Organisation Portal',

    // Hero Section
    heroTagline: 'EMPOWAY – Empowering Every Journey',
    heroHeading1: 'Every Journey Deserves to Be',
    heroHeadingAccessible: 'Accessible.',
    heroDescription: 'Discover accessible places, explore with confidence and help make every journey more inclusive across Colombo.',
    colomboPilotPill: 'Starting in Colombo',
    colomboTaglineBadge: 'Expanding Across Sri Lanka',
    exploreBreadcrumb: 'Colombo Directory',
    sriLanka: 'Sri Lanka',
    explorePlacesBtn: 'Explore Places',
    sharePlaceBtn: 'Share a Place',
    slidePill: 'Slide',
    playingStatus: 'Playing',
    pausedStatus: 'Paused',
    slide1Tagline: 'Starting in Colombo, Expanding Across Sri Lanka',
    slide1Location: 'Colombo Fort Heritage & Modern Skyline • Colombo 01',
    slide1Highlight: 'Accessible Urban Spaces & Public Heritage',
    slide2Tagline: 'Healthcare & Medical Access',
    slide2Location: 'Hospitals & Medical Facilities • Colombo 10',
    slide2Highlight: 'Accessible Hospital Entrances & Care Support',
    slide3Tagline: 'Cultural Hubs & Higher Education',
    slide3Location: 'Universities, Libraries & Cultural Centers • Colombo 07',
    slide3Highlight: 'Spacious Aisles, Elevators & Step-Free Halls',
    slide4Tagline: 'Commercial Hubs & Shopping Centers',
    slide4Location: 'Modern Shopping Malls & Retail Hubs • Colombo',
    slide4Highlight: 'Level Store Entrances & Wide Shopping Corridors',
    slide5Tagline: 'Universal Architectural Design',
    slide5Location: 'Civic Centers & Public Institutions • Colombo',
    slide5Highlight: 'Dedicated Ramps with Double Safety Rails',

    // Search Section
    placeNameOrLandmark: 'Place Name or Landmark',
    placeNamePlaceholder: 'e.g. National Hospital, Town Hall, Asiri...',
    areaInColombo: 'Area in Colombo',
    areaPlaceholder: 'e.g. Colombo 07, Fort, Borella...',
    category: 'Category',
    allCategories: 'All Categories',
    searchButton: 'Search',
    popularAreas: 'Popular Colombo Areas:',

    // Impact Statistics
    realTimeMetrics: 'Real-Time Verification Metrics',
    pilotStatusHeading: 'Colombo Accessibility Pilot Status',
    pilotStatusDesc: 'Dynamic counts generated directly from our verified database records in the Colombo District.',
    databaseActive: 'Database Active • PostgreSQL Powered',
    totalPlacesAssessed: 'Total Places Assessed',
    physicallyVerified: 'Physically Verified',
    communityReports: 'Community Reports',
    communityAdvocates: 'Community Advocates',
    candidatePublicPlaces: 'Candidate Public Places',
    auditedAndConfirmed: 'Audited & Confirmed',
    crowdsourcedInsights: 'Crowdsourced Insights',
    activeContributors: 'Active Contributors',
    acrossColombo: 'Across Colombo 01 to 15',
    photoProof: 'Photo proof & slope checks',
    awaitingAudit: 'Awaiting physical audit',
    volunteersAndStudents: 'Volunteers, patients & students',

    // Categories Section
    browseByCategory: 'Browse by Public Category',
    exploreFacilityType: 'Explore Colombo by Facility Type',
    exploreFacilitySubtitle: 'Verified wheelchair accessibility, ramp specifications, and entrance details across essential public facilities.',
    viewFullDirectory: 'View Full Directory',
    placesCount: 'Places',
    exploreSection: 'Explore Section',
    viewPlaces: 'View Places',
    exploreSignIn: 'Explore (Sign In)',

    // Sample Preview Places Section
    featuredAudits: 'Featured Accessibility Audits',
    physicalPreviews: 'Physical Accessibility Previews',
    physicalPreviewsSubtitle: 'Preview verified public spaces in Colombo with measured ramp angles, accessible restrooms, and entrance photos.',
    viewAllPlaces: 'View All Verified Places',
    accessibilityHighlights: 'Accessibility Highlights',
    viewProfile: 'View Profile',
    viewProfileSignIn: 'View Profile (Sign In)',
    previewPill: 'Preview',
    pilotAuditPill: 'Pilot Audit',
    verifiedOnDate: 'Verified',
    communityLogged: 'Community Logged',

    // Contribution Panel
    smallContributions: 'Small Contributions. Greater Independence.',
    contributionSubtitle: 'Every accessibility detail you share helps someone make a more confident journey.',
    addLocationTitle: 'Add a Location',
    addLocationDesc: 'Help others discover public places with verified access.',
    shareDetailsTitle: 'Share Accessibility Details',
    shareDetailsDesc: 'Provide useful information about ramps, elevators and accessible facilities.',
    makeImpactTitle: 'Make an Impact',
    makeImpactDesc: 'Help build a barrier-free, more inclusive Sri Lanka.',

    // Registration Section
    bePartOfAccessibleSL: 'Be Part of a More Accessible Sri Lanka',
    registerBannerDesc: 'Create your account to share accessibility information, contribute to your community, and help others make informed decisions.',
    createAccountBtn: 'Create an Account',
    signInBtn: 'Sign In',

    // Explore Page
    exploreTitle: 'Explore Accessible Places in Colombo',
    exploreSubtitle: "Discover verified ramps, step-free access, elevators and restrooms across Colombo's public institutions.",
    grid: 'Grid',
    list: 'List',
    map: 'Map',
    filterPlaces: 'Filter Places',
    clearAll: 'Clear All',
    searchByNameOrArea: 'Search by Name or Area',
    searchExplorePlaceholder: 'e.g. National Hospital, Fort, Galle Road...',
    infoStatus: 'Information Status',
    allStatuses: 'All Statuses',
    physicalFeaturesTitle: 'Physical Accessibility Features',
    sortBy: 'Sort By',
    mostRecent: 'Most Recently Updated',
    highestScore: 'Highest Accessibility Score',
    nameAZ: 'Name: A to Z',
    placesFound: 'places found in Colombo',
    noPlacesFound: 'No Places Found',
    adjustFilters: 'Try adjusting your search criteria or resetting filters to view more locations.',
    resetFiltersBtn: 'Reset All Filters',

    // Features Checklist & Scorecard
    stepFreeEntrance: 'Wheelchair-accessible Entrance',
    wheelchairRamp: 'Ramp Availability',
    elevator: 'Elevator Availability',
    accessibleToilet: 'Accessible Toilet',
    accessibleParking: 'Accessible Parking',
    wideDoorways: 'Wide Entrance & Doorways',
    wheelchairPathways: 'Wheelchair-friendly Pathways',
    accessibleCounters: 'Accessible Service Counters',

    // Feature Descriptions
    desc_stepFreeEntrance: 'Ground-level entry with zero threshold barriers or flush threshold.',
    desc_wheelchairRamp: 'Ramped approach with safe gradient (1:12 or gentler) and sturdy handrails.',
    desc_elevator: 'Operating elevator accessing upper or multi-story public service floors.',
    desc_accessibleToilet: 'Spacious wheelchair-accessible restroom with grab rails and level entry.',
    desc_accessibleParking: 'Designated extra-wide parking bay close to main accessible entrance.',
    desc_wideDoorways: 'Doors and passageways minimum 85+ cm wide for easy wheelchair clearance.',
    desc_wheelchairPathways: 'Smooth, paved, non-slip internal corridors and level connections.',
    desc_accessibleCounters: 'Lowered reception, ticket or customer service desk (75–80 cm height).',

    // Statuses
    verified: 'Verified by Audit',
    communityReported: 'Community Reported',
    notYetAssessed: 'Not Yet Assessed',
    unknown: 'Unknown / Needs Data',
    directoryPlaceUnassessed: 'Listed in Colombo Directory • Awaiting physical audit',
    available: 'Available',
    notAvailable: 'Not Available',
    needsVerification: 'Needs Verification',

    // Directory & Filters
    colomboDistrict: 'Colombo District',
    allAreas: 'All Colombo Areas',
    allOrganizations: 'All Organizations',
    parentOrganization: 'Parent Organization',
    branch: 'Branch',
    dataSource: 'Data Source',
    sector: 'Sector',
    allSectors: 'All Sectors (Public & Private)',
    publicSector: 'Public / Government',
    privateSector: 'Private Sector',
    corporateSector: 'Corporate / Commercial',

    // Short feature labels for cards
    ramp: 'Ramp',
    stepFree: 'Step-free',
    elevatorShort: 'Elevator',
    toilet: 'Toilet',
    parking: 'Parking',
    doorways: 'Doorways',
    pathways: 'Pathways',
    counters: 'Counters',

    // Scorecard UI
    transparentAudit: 'Transparent Audit',
    physicalStandards: 'Sri Lankan Physical Standards',
    scorecardTitle: 'Accessibility Scorecard',
    multiPointEvaluation: 'Independent, multi-point evaluation for',
    scoreRatio: 'Verified Score Ratio',
    points: 'Points',
    dataCompleteness: 'Audit Data Completeness',
    verifiedCriteriaNote: 'Reflects confirmed physical accessibility based on verified and reported criteria.',
    howScoreCalculated: 'How is this score calculated?',
    scoreExplanation: 'Scores are computed transparently based on 8 physical features evaluated against Sri Lankan accessibility standards.',

    // Category Names
    cat_hospitals: 'Hospitals & Healthcare',
    cat_universities: 'Universities & Education',
    cat_banks: 'Banks & Financial Services',
    cat_government: 'Government Offices',
    cat_restaurants: 'Restaurants & Cafes',
    cat_shopping: 'Shopping & Public Spaces',
    cat_hotels: 'Hotels & Accommodation',

    // Footer
    footerDisclaimerHeading: 'Transparent Accessibility Reporting:',
    footerDisclaimerText: 'EMPOWAY is not an automatic building certification authority. We provide evidence-based, community-reported and auditor-verified accessibility details.',
    readAuditMethodology: 'Read Audit Methodology →',
    footerAboutText: 'Discover, understand and share accessibility information about public places across Sri Lanka. Built to provide reliable, dignity-first mobility clarity for wheelchair users, elderly citizens, and caregivers.',
    footerPilotCoverage: 'Initial Pilot: Colombo District, Western Province, Sri Lanka',
    designedFor: 'Designed For',
    userWheelchair: 'Wheelchair users & power chairs',
    userMobility: 'People with mobility difficulties',
    userElderly: 'Elderly citizens & grandparents',
    userInjury: 'Injury recovery & crutch users',
    userStrollers: 'Parents travelling with strollers',
    userCaregivers: 'Family caregivers & assistants',
    platform: 'Platform',
    keyCategories: 'Key Categories',
    copyrightText: 'EMPOWAY – Empowering Every Journey. Colombo Accessibility Initiative.',
    developedWith: 'Developed with',
    forInclusiveMobility: 'for inclusive mobility in Sri Lanka',
    settingsAndPreferences: 'Settings & Preferences',

    // AI Chatbot
    aiBotTitle: 'EMPOWAY AI Accessibility Assistant',
    aiBotSubtitle: 'Colombo Pilot • Instant Mobility Answers',
    aiBotGreeting: 'Ayubowan! I am your EMPOWAY AI Accessibility Assistant. Ask me about wheelchair-friendly hospitals, universities, banks, ramp gradients, accessible restrooms, or mobility tips in Colombo.',
    aiBotPlaceholder: 'Ask about ramps, lifts, restrooms in Colombo...',
    suggestion1: 'Accessible hospitals in Colombo',
    suggestion2: 'Colombo Fort station wheelchair access',
    suggestion3: 'Ramp gradient standards in Sri Lanka',
    suggestion4: 'Banks with step-free entrance',
    send: 'Send',

    // Settings Page
    settingsTitle: 'Settings & Accessibility Preferences',
    settingsSubtitle: 'Personalize your EMPOWAY experience. Choose your visual theme and preferred language for full platform navigation.',
    appearance: 'Appearance',
    appearanceDesc: 'Select how EMPOWAY looks on your screen. Light Mode provides the classic warm ivory feel, while Dark Mode provides high-contrast deep coffee tones.',
    lightMode: 'Light Mode',
    lightModeSubtitle: 'Warm Ivory & Coffee (Default)',
    lightModeDescription: 'Classic warm aesthetic with gentle contrast, comfortable for daytime viewing.',
    darkMode: 'Dark Mode',
    darkModeSubtitle: 'Deep Coffee & Sunset Tones',
    darkModeDescription: 'Rich dark espresso background with warm terracotta accents, reducing eye strain in low-light environments.',
    language: 'Language',
    languageDesc: 'Choose your preferred language. All menus, accessibility scorecards, buttons, forms, and tools will adapt immediately.',
    english: 'English',
    englishSubtitle: 'Primary international language',
    sinhala: 'සිංහල (Sinhala)',
    sinhalaSubtitle: 'ශ්‍රී ලංකාවේ ප්‍රධාන රාජ්‍ය භාෂාව',
    tamil: 'தமிழ் (Tamil)',
    tamilSubtitle: 'இலங்கையின் தேசிய மொழி',
    activeBadge: 'Currently Active',
    selectOption: 'Apply',
    guestNotice: 'Guest Mode: Your preferences are saved in this browser. Create an account to sync your settings across devices automatically.',
    accountSyncedNotice: 'Synced with your EMPOWAY profile across all your devices.',

    // Common Actions
    reportBarrier: 'Report Barrier / Inaccuracy',
    addPhotos: 'Add Photos',
    savePlace: 'Save to Favourites',
    scorecard: 'Accessibility Scorecard',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',

    // Personal Accessibility Match
    personalMatchTitle: 'Personal Accessibility Match',
    personalMatchSubtitle: 'Tailored accessibility compatibility score based on your individual mobility equipment and requirements.',
    mobilityProfileTitle: 'Mobility & Equipment Profile',
    mobilityProfileSubtitle: 'Select your mobility aid or customize your requirements to receive personalized compatibility scores across Colombo.',
    power_wheelchair: 'Power / Electric Wheelchair',
    power_wheelchair_desc: 'Requires strict step-free access, wide turning corridors, low ramp gradients, and elevator connectivity.',
    manual_wheelchair: 'Manual Wheelchair',
    manual_wheelchair_desc: 'Requires ramps or level entrances, accessible restrooms, clear pathways, and manageable thresholds.',
    walking_aid: 'Cane, Crutches or Walker',
    walking_aid_desc: 'Needs step-free routes or elevators for multi-level buildings, non-slip pathways, and close parking.',
    stroller: 'Pram or Stroller / Family',
    stroller_desc: 'Needs step-free entrance, elevator, wide doors, and clean accessible family restrooms.',
    limited_mobility: 'Senior / Limited Stamina',
    limited_mobility_desc: 'Benefits from step-free entry, elevators, close parking bays, and level continuous walking corridors.',
    custom: 'Custom Mobility Profile',
    custom_desc: 'Individually selected requirements tailored to your specific travel and mobility needs.',
    highMatch: 'High Compatibility',
    moderateMatch: 'Moderate Compatibility',
    barriersDetected: 'Barriers Detected',
    matchesYourNeeds: 'Matches Your Needs',
    cautionUnverified: 'Needs Verification / Caution',
    barrierMissing: 'Missing / Barrier',
    switchProfile: 'Test Other Mobility Aids',
    mySavedProfile: 'My Saved Profile',
    matchScoreLabel: 'Personal Match Score',
    mustHaveFeatures: 'Must-Have Features',
    niceToHaveFeatures: 'Nice-to-Have Features',

    // Accessible Transport Connection Checker
    transportTitle: 'Accessible Transport Connection Checker',
    transportSubtitle: 'Inspect nearby public bus routes, commuter rail terminals, accessible vehicle drop-offs, and last-mile corridor walkability in Colombo.',
    busConnection: 'Bus Connection',
    railConnection: 'Commuter Rail',
    dropOffConnection: 'Accessible Cab / Drop-off',
    corridorConnection: 'Sidewalk & Rolling Corridor',
    nearestStop: 'Nearest Bus Stop',
    nearestStation: 'Nearest Railway Station',
    rollingTime: 'Estimated Rolling Time',
    curbRamps: 'Dropped Kerbs Present',
    lowFloorBuses: 'Low-Floor Bus Service',
    stepFreePlatform: 'Step-Free Platform Access',
    disabledAssistance: 'Disabled Assistance On-Site',
    openWalkingRoute: 'Open Accessible Walking Route',
    callAssistance: 'Call Station Disabled Assistance',
    curbRampStatusLabel: 'Kerb Ramp Transition',
    sidewalkQualityLabel: 'Sidewalk Pavement Surface',
    transitConnectivityScore: 'Transit Connectivity Score',
    excellentTransit: 'Excellent Public Transit Hub Connectivity',
    moderateTransit: 'Good Transit Links with Pre-Arrangement',
    limitedTransit: 'Transit Distance High – Drop-off Cab Recommended'
  },

  si: {
    // Navigation
    home: 'මුල් පිටුව',
    explore: 'ස්ථාන ගවේෂණය',
    compare: 'සංසන්දනය',
    journey: 'ගමන් සැලසුම්කරු',
    colomboPilot: 'කොළඹ නියමු ව්‍යාපෘතිය',
    verifiedLocations: 'තහවුරු කළ ස්ථාන',
    sharePlace: 'ස්ථානයක් එක් කරන්න',
    signIn: 'ඇතුල් වන්න',
    register: 'ගිණුමක් සාදන්න',
    signOut: 'ඉවත් වන්න',
    myProfile: 'මගේ ගිණුම',
    dashboard: 'මගේ පුවරුව',
    settings: 'සැකසුම්',
    adminConsole: 'පරිපාලක පුවරුව',
    orgPortal: 'ආයතනික ද්වාරය',

    // Hero Section
    heroTagline: 'EMPOWAY – සෑම ගමනක්ම සවිබල ගන්වයි',
    heroHeading1: 'සෑම ගමනක්ම විය යුතුය',
    heroHeadingAccessible: 'ප්‍රවේශ විය හැකි.',
    heroDescription: 'කොළඹ නගරයේ ප්‍රවේශ විය හැකි ස්ථාන සොයා ගන්න, විශ්වාසයෙන් යුතුව ගමන් කරන්න, සහ සැමට එකමුතු ශ්‍රී ලංකාවක් ගොඩනැගීමට දායක වන්න.',
    colomboPilotPill: 'කොළඹින් ආරම්භ වී',
    colomboTaglineBadge: 'මුළු ශ්‍රී ලංකාව පුරා ව්‍යාප්ත වෙමින්',
    exploreBreadcrumb: 'කොළඹ නාමාවලිය',
    sriLanka: 'ශ්‍රී ලංකාව',
    explorePlacesBtn: 'ස්ථාන ගවේෂණය',
    sharePlaceBtn: 'ස්ථානයක් එක් කරන්න',
    slidePill: 'පින්තූරය',
    playingStatus: 'ධාවනය වේ',
    pausedStatus: 'නැවතුණි',
    slide1Tagline: 'කොළඹින් ආරම්භ වී මුළු ශ්‍රී ලංකාව පුරා ව්‍යාප්ත වෙමින්',
    slide1Location: 'කොළඹ කොටුව ඓතිහාසික සහ නවීන ක්ෂිතිජය • කොළඹ 01',
    slide1Highlight: 'ප්‍රවේශ විය හැකි නාගරික ස්ථාන සහ පොදු උරුමය',
    slide2Tagline: 'සෞඛ්‍ය සේවා සහ වෛද්‍ය ප්‍රවේශය',
    slide2Location: 'රෝහල් සහ වෛද්‍ය පහසුකම් • කොළඹ 10',
    slide2Highlight: 'ප්‍රවේශ විය හැකි රෝහල් පිවිසුම් සහ සත්කාරක සහාය',
    slide3Tagline: 'සංස්කෘතික මධ්‍යස්ථාන සහ උසස් අධ්‍යාපනය',
    slide3Location: 'විශ්වවිද්‍යාල, පුස්තකාල • කොළඹ 07',
    slide3Highlight: 'පුළුල් මාර්ග, විදුලි සෝපාන සහ ශාලා',
    slide4Tagline: 'වාණිජ මධ්‍යස්ථාන සහ සාප්පු සංකීර්ණ',
    slide4Location: 'නවීන සාප්පු සංකීර්ණ • කොළඹ',
    slide4Highlight: 'සමතලා පිවිසුම් සහ පුළුල් කොරිඩෝ',
    slide5Tagline: 'සර්වජන වාස්තු විද්‍යාත්මක සැලසුම',
    slide5Location: 'පොදු ආයතන ගොඩනැගිලි • කොළඹ',
    slide5Highlight: 'ආරක්ෂිත රේල් පීලි සහිත විශේෂ බෑවුම්',

    // Search Section
    placeNameOrLandmark: 'ස්ථානයේ නම හෝ සලකුණ',
    placeNamePlaceholder: 'උදා: ජාතික රෝහල, නගර ශාලාව, ආසිරි...',
    areaInColombo: 'කොළඹ ප්‍රදේශය',
    areaPlaceholder: 'උදා: කොළඹ 07, කොටුව, බොරැල්ල...',
    category: 'ප්‍රවර්ගය',
    allCategories: 'සියලු ප්‍රවර්ග',
    searchButton: 'සොයන්න',
    popularAreas: 'ජනප්‍රිය කොළඹ ප්‍රදේශ:',

    // Impact Statistics
    realTimeMetrics: 'තත්‍ය කාලීන තහවුරු කිරීමේ දත්ත',
    pilotStatusHeading: 'කොළඹ ප්‍රවේශ්‍යතා නියමු ව්‍යාපෘතියේ ප්‍රගතිය',
    pilotStatusDesc: 'කොළඹ දිස්ත්‍රික්කයේ තහවුරු කරන ලද දත්ත ගබඩාවෙන් සෘජුවම ලබාගත් ගණනය කිරීම්.',
    databaseActive: 'දත්ත ගබඩාව සක්‍රියයි • PostgreSQL',
    totalPlacesAssessed: 'ඇගයීමට ලක් කළ මුළු ස්ථාන',
    physicallyVerified: 'ක්ෂේත්‍ර පරීක්ෂාවෙන් තහවුරු කළ',
    communityReports: 'ප්‍රජා වාර්තා',
    communityAdvocates: 'ප්‍රජා දායකයින්',
    candidatePublicPlaces: 'අයදුම් කළ පොදු ස්ථාන',
    auditedAndConfirmed: 'විගණනය කර තහවුරු කළ',
    crowdsourcedInsights: 'ප්‍රජා තොරතුරු',
    activeContributors: 'ක්‍රියාකාරී දායකයින්',
    acrossColombo: 'කොළඹ 01 සිට 15 දක්වා',
    photoProof: 'ඡායාරූප සාක්ෂි සහ බෑවුම් මිනුම්',
    awaitingAudit: 'ක්ෂේත්‍ර පරීක්ෂාව අපේක්ෂාවෙන්',
    volunteersAndStudents: 'ස්වේච්ඡා සේවකයින් සහ සිසුන්',

    // Categories Section
    browseByCategory: 'පොදු ප්‍රවර්ග අනුව සොයන්න',
    exploreFacilityType: 'පහසුකම් වර්ගය අනුව කොළඹ ගවේෂණය කරන්න',
    exploreFacilitySubtitle: 'අත්‍යවශ්‍ය පොදු පහසුකම් සඳහා තහවුරු කළ රෝද පුටු ප්‍රවේශ්‍යතාව, බෑවුම් විස්තර සහ පිවිසුම් තොරතුරු.',
    viewFullDirectory: 'සම්පූර්ණ නාමාවලිය බලන්න',
    placesCount: 'ස්ථාන',
    exploreSection: 'අංශය ගවේෂණය',
    viewPlaces: 'ස්ථාන බලන්න',
    exploreSignIn: 'ගවේෂණය (ඇතුල් වන්න)',

    // Sample Preview Places Section
    featuredAudits: 'විශේෂ ප්‍රවේශ්‍යතා ඇගයීම්',
    physicalPreviews: 'භෞතික ප්‍රවේශ්‍යතා පූර්වදර්ශන',
    physicalPreviewsSubtitle: 'කොළඹ නගරයේ මනින ලද බෑවුම් කෝණ, ප්‍රවේශ විය හැකි වැසිකිළි සහ පිවිසුම් ඡායාරූප සහිත පොදු ස්ථාන බලන්න.',
    viewAllPlaces: 'තහවුරු කළ සියලු ස්ථාන බලන්න',
    accessibilityHighlights: 'ප්‍රවේශ්‍යතා විශේෂාංග',
    viewProfile: 'විස්තර බලන්න',
    viewProfileSignIn: 'විස්තර බලන්න (ඇතුල් වන්න)',
    previewPill: 'පූර්වදර්ශනය',
    pilotAuditPill: 'නියමු විගණනය',
    verifiedOnDate: 'තහවුරු කරන ලද්දේ',
    communityLogged: 'ප්‍රජාව විසින් සටහන් කළ',

    // Contribution Panel
    smallContributions: 'කුඩා දායකත්වයන්. උසස් ස්වාධීනත්වය.',
    contributionSubtitle: 'ඔබ බෙදාගන්නා සෑම ප්‍රවේශ්‍යතා තොරතුරක්ම තවත් අයෙකුට විශ්වාසයෙන් ගමන් කිරීමට උපකාරී වේ.',
    addLocationTitle: 'ස්ථානයක් එක් කරන්න',
    addLocationDesc: 'ප්‍රවේශ විය හැකි පොදු ස්ථාන සොයා ගැනීමට අන් අයට උදව් කරන්න.',
    shareDetailsTitle: 'ප්‍රවේශ්‍යතා තොරතුරු බෙදාගන්න',
    shareDetailsDesc: 'බෑවුම්, විදුලි සෝපාන සහ පහසුකම් පිළිබඳ ප්‍රයෝජනවත් තොරතුරු සපයන්න.',
    makeImpactTitle: 'සමාජයට බලපෑමක් කරන්න',
    makeImpactDesc: 'බාධකවලින් තොර, සැමට පහසු ශ්‍රී ලංකාවක් ගොඩනැගීමට දායක වන්න.',

    // Registration Section
    bePartOfAccessibleSL: 'වඩාත් ප්‍රවේශ විය හැකි ශ්‍රී ලංකාවක කොටස්කරුවෙකු වන්න',
    registerBannerDesc: 'ප්‍රවේශ්‍යතා තොරතුරු බෙදා ගැනීමට, ප්‍රජාවට දායක වීමට සහ තීරණ ගැනීමට අන් අයට උදව් කිරීමට ඔබගේ ගිණුම සාදන්න.',
    createAccountBtn: 'ගිණුමක් සාදන්න',
    signInBtn: 'ඇතුල් වන්න',

    // Explore Page
    exploreTitle: 'කොළඹ ප්‍රවේශ විය හැකි ස්ථාන ගවේෂණය කරන්න',
    exploreSubtitle: 'කොළඹ නගරයේ පොදු ආයතන හරහා තහවුරු කළ බෑවුම්, පඩි රහිත පිවිසුම්, විදුලි සෝපාන සහ වැසිකිළි සොයා ගන්න.',
    grid: 'කොටු දැක්ම',
    list: 'ලැයිස්තු දැක්ම',
    map: 'සිතියම',
    filterPlaces: 'ස්ථාන පෙරහන් කරන්න',
    clearAll: 'සියල්ල ඉවත් කරන්න',
    searchByNameOrArea: 'නම හෝ ප්‍රදේශය අනුව සොයන්න',
    searchExplorePlaceholder: 'උදා: ජාතික රෝහල, කොටුව, ගාලු පාර...',
    infoStatus: 'තොරතුරු තත්ත්වය',
    allStatuses: 'සියලු තත්ත්වයන්',
    physicalFeaturesTitle: 'භෞතික ප්‍රවේශ්‍යතා අංග',
    sortBy: 'අනුපිළිවෙල',
    mostRecent: 'මෑතකදී යාවත්කාලීන කළ',
    highestScore: 'ඉහළම ප්‍රවේශ්‍යතා ලකුණු',
    nameAZ: 'නම: අකාරාදී පිළිවෙල',
    placesFound: 'ස්ථාන කොළඹින් හමුවිය',
    noPlacesFound: 'ස්ථාන කිසිවක් හමු නොවීය',
    adjustFilters: 'වැඩිදුර ස්ථාන බැලීමට ඔබගේ සෙවුම් පද වෙනස් කරන්න හෝ පෙරහන් යළි සකසන්න.',
    resetFiltersBtn: 'සියලු පෙරහන් යළි සකසන්න',

    // Features Checklist & Scorecard
    stepFreeEntrance: 'පඩි රහිත පිවිසුම',
    wheelchairRamp: 'රෝද පුටු බෑවුම (Ramp)',
    elevator: 'විදුලි සෝපානය (Lift)',
    accessibleToilet: 'ප්‍රවේශ විය හැකි වැසිකිළිය',
    accessibleParking: 'විශේෂ රථගාල',
    wideDoorways: 'පුළුල් දොරටු (85cm+)',
    wheelchairPathways: 'පහසු ඇතුළත මාර්ග',
    accessibleCounters: 'පහසු සේවා කවුළු',

    // Feature Descriptions
    desc_stepFreeEntrance: 'පඩි රහිත සමතලා පිවිසුම් දොරටුව.',
    desc_wheelchairRamp: 'ආරක්ෂිත බෑවුම සහ අත්වැල් සහිත පිවිසුම.',
    desc_elevator: 'ඉහළ මහල්වලට ගමන් කළ හැකි ක්‍රියාකාරී විදුලි සෝපානය.',
    desc_accessibleToilet: 'රෝද පුටු සහිතව භාවිත කළ හැකි පහසු වැසිකිළිය.',
    desc_accessibleParking: 'පිවිසුමට ආසන්න පුළුල් වාහන නැවතුම් ඉඩකඩ.',
    desc_wideDoorways: 'රෝද පුටුවකට පහසුවෙන් ගමන් කළ හැකි 85cm+ පුළුල් දොරටු.',
    desc_wheelchairPathways: 'සුමට, ලිස්සා නොයන මට්ටම් මාර්ග.',
    desc_accessibleCounters: 'පහසුවෙන් ප්‍රවේශ විය හැකි පහත් කළ සේවා කවුළු.',

    // Statuses
    verified: 'තහවුරු කරන ලදී',
    communityReported: 'ප්‍රජාව විසින් වාර්තා කළ',
    notYetAssessed: 'තවම තක්සේරු කර නැත',
    unknown: 'තොරතුරු නොමැත',
    directoryPlaceUnassessed: 'කොළඹ නාමාවලියේ ඇතුළත් කර ඇත • ක්ෂේත්‍ර පරීක්ෂාව අපේක්ෂාවෙන්',
    available: 'පවතී',
    notAvailable: 'නොපවතී',
    needsVerification: 'තහවුරු කිරීම අවශ්‍යයි',

    // Directory & Filters
    colomboDistrict: 'කොළඹ දිස්ත්‍රික්කය',
    allAreas: 'සියලු කොළඹ ප්‍රදේශ',
    allOrganizations: 'සියලු ආයතන',
    parentOrganization: 'ප්‍රධාන ආයතනය',
    branch: 'ශාඛාව',
    dataSource: 'දත්ත මූලාශ්‍රය',
    sector: 'අංශය',
    allSectors: 'සියලු අංශ (රාජ්‍ය සහ පෞද්ගලික)',
    publicSector: 'රාජ්‍ය / රජයේ',
    privateSector: 'පෞද්ගලික අංශය',
    corporateSector: 'සංගත / ආයතනික',

    // Short feature labels for cards
    ramp: 'බෑවුම',
    stepFree: 'පඩි රහිත',
    elevatorShort: 'විදුලි සෝපානය',
    toilet: 'වැසිකිළිය',
    parking: 'රථගාල',
    doorways: 'දොරටු',
    pathways: 'මාර්ග',
    counters: 'කවුළු',

    // Scorecard UI
    transparentAudit: 'විනිවිද පෙනෙන විගණනය',
    physicalStandards: 'ශ්‍රී ලංකා භෞතික ප්‍රමිතීන්',
    scorecardTitle: 'ප්‍රවේශ්‍යතා ලකුණු පුවරුව',
    multiPointEvaluation: 'සඳහා ස්වාධීන, බහුවිධ ඇගයීම',
    scoreRatio: 'තහවුරු කළ ලකුණු අනුපාතය',
    points: 'ලකුණු',
    dataCompleteness: 'විගණන දත්තවල සම්පූර්ණත්වය',
    verifiedCriteriaNote: 'තහවුරු කළ සහ වාර්තා වූ කරුණු මත පදනම් වූ භෞතික ප්‍රවේශ්‍යතාව පිළිබිඹු කරයි.',
    howScoreCalculated: 'මෙම ලකුණු ගණනය කරන්නේ කෙසේද?',
    scoreExplanation: 'ශ්‍රී ලංකා ප්‍රවේශ්‍යතා ප්‍රමිතීන්ට අනුව ඇගයීමට ලක් කරන ලද භෞතික ලක්ෂණ 8ක් මත පදනම්ව ලකුණු විනිවිදභාවයෙන් යුතුව ගණනය කෙරේ.',

    // Category Names
    cat_hospitals: 'රෝහල් සහ සෞඛ්‍ය සේවා',
    cat_universities: 'විශ්වවිද්‍යාල සහ අධ්‍යාපනය',
    cat_banks: 'බැංකු සහ මූල්‍ය සේවා',
    cat_government: 'රාජ්‍ය ආයතන',
    cat_restaurants: 'ආපනශාලා සහ කැෆේ',
    cat_shopping: 'සාප්පු සංකීර්ණ සහ පොදු ස්ථාන',
    cat_hotels: 'හෝටල් සහ නවාතැන්',

    // Footer
    footerDisclaimerHeading: 'විනිවිද පෙනෙන ප්‍රවේශ්‍යතා වාර්තාකරණය:',
    footerDisclaimerText: 'EMPOWAY යනු ස්වයංක්‍රීය ගොඩනැගිලි සහතික කිරීමේ ආයතනයක් නොවේ. අප සපයන්නේ ප්‍රජාව විසින් වාර්තා කරන ලද සහ විගණකවරුන් විසින් තහවුරු කරන ලද කරුණු මත පදනම් වූ ප්‍රවේශ්‍යතා තොරතුරුය.',
    readAuditMethodology: 'විගණන ක්‍රමවේදය කියවන්න →',
    footerAboutText: 'ශ්‍රී ලංකාව පුරා පොදු ස්ථානවල ප්‍රවේශ්‍යතා තොරතුරු සොයා ගන්න, තේරුම් ගන්න සහ බෙදා ගන්න. රෝද පුටු භාවිතා කරන්නන්, වැඩිහිටියන් සහ රැකබලා ගන්නන් සඳහා ගෞරවනීය සංචලතා පැහැදිලි බවක් ලබා දීම අපගේ අරමුණයි.',
    footerPilotCoverage: 'මූලික නියමු ව්‍යාපෘතිය: කොළඹ දිස්ත්‍රික්කය, බස්නාහිර පළාත, ශ්‍රී ලංකාව',
    designedFor: 'විශේෂයෙන් නිර්මාණය කර ඇත්තේ',
    userWheelchair: 'රෝද පුටු සහ විදුලි පුටු භාවිතා කරන්නන්',
    userMobility: 'සංචලතා අපහසුතා ඇති පුද්ගලයින්',
    userElderly: 'වැඩිහිටි පුරවැසියන්',
    userInjury: 'තුවාල සුවය ලබන්නන් සහ කිහිලි කරු භාවිතා කරන්නන්',
    userStrollers: 'කුඩා දරුවන් රැගත් කරත්ත සහිත දෙමාපියන්',
    userCaregivers: 'පවුලේ රැකබලා ගන්නන් සහ සහායකයින්',
    platform: 'වේදිකාව',
    keyCategories: 'ප්‍රධාන ප්‍රවර්ග',
    copyrightText: 'EMPOWAY – සෑම ගමනක්ම සවිබල ගන්වයි. කොළඹ ප්‍රවේශ්‍යතා මූලාරම්භය.',
    developedWith: 'නිර්මාණය කරන ලද්දේ',
    forInclusiveMobility: 'ශ්‍රී ලංකාවේ සැමට පහසු සංචලතාව සඳහා',
    settingsAndPreferences: 'සැකසුම් සහ මනාපයන්',

    // AI Chatbot
    aiBotTitle: 'EMPOWAY AI ප්‍රවේශ්‍යතා සහායක',
    aiBotSubtitle: 'කොළඹ නියමු ව්‍යාපෘතිය • ක්ෂණික පිළිතුරු',
    aiBotGreeting: 'ආයුබෝවන්! මම ඔබගේ EMPOWAY AI ප්‍රවේශ්‍යතා සහායකයා වෙමි. කොළඹ රෝද පුටු හිතකාමී රෝහල්, විශ්වවිද්‍යාල, බැංකු, බෑවුම් කෝණ, වැසිකිළි හෝ සංචලතා උපදෙස් ගැන මගෙන් විමසන්න.',
    aiBotPlaceholder: 'කොළඹ බෑවුම්, ලිෆ්ට්, වැසිකිළි ගැන අසන්න...',
    suggestion1: 'කොළඹ ප්‍රවේශ විය හැකි රෝහල්',
    suggestion2: 'කොටුව දුම්රිය ස්ථානයේ රෝද පුටු ප්‍රවේශය',
    suggestion3: 'ශ්‍රී ලංකාවේ බෑවුම් ප්‍රමිතීන්',
    suggestion4: 'පඩි රහිත පිවිසුම් සහිත බැංකු',
    send: 'යවන්න',

    // Settings Page
    settingsTitle: 'සැකසුම් සහ ප්‍රවේශ්‍යතා මනාපයන්',
    settingsSubtitle: 'ඔබගේ EMPOWAY අත්දැකීම ඔබ කැමති පරිදි සකසන්න. පෙනුම (Theme) සහ භාෂාව (Language) පහසුවෙන්ම වෙනස් කරන්න.',
    appearance: 'පෙනුම (Appearance)',
    appearanceDesc: 'ඔබගේ තිරය සඳහා සුදුසු ආලෝක තත්ත්වය තෝරන්න. Light Mode සහ Dark Mode අතර පහසුවෙන් මාරු වන්න.',
    lightMode: 'Light Mode (ආලෝක ප්‍රකාරය)',
    lightModeSubtitle: 'මෘදු ඇත්දළ හා කෝපි පැහැය (පෙරනිමි)',
    lightModeDescription: 'දවල් කාලයේ පහසුවෙන් කියවිය හැකි මෘදු සහ පැහැදිලි පසුබිම.',
    darkMode: 'Dark Mode (අඳුරු ප්‍රකාරය)',
    darkModeSubtitle: 'ගැඹුරු කෝපි සහ ටෙරාකොටා පැහැය',
    darkModeDescription: 'රාත්‍රී කාලයේ හෝ අඩු ආලෝකයේ ඇස්වලට පහසු, ඉහළ ප්‍රතිවිරෝධතා සහිත පසුබිම.',
    language: 'භාෂාව (Language)',
    languageDesc: 'ඔබට වඩාත් පහසු භාෂාව තෝරාගන්න. මෙනු, ප්‍රවේශ්‍යතා ලකුණු පුවරු සහ මෙවලම් ක්ෂණිකව වෙනස් වේ.',
    english: 'English (ඉංග්‍රීසි)',
    englishSubtitle: 'ජාත්‍යන්තර භාෂාව',
    sinhala: 'සිංහල',
    sinhalaSubtitle: 'ශ්‍රී ලංකාවේ ප්‍රධාන රාජ්‍ය භාෂාව',
    tamil: 'தமிழ் (දෙමළ)',
    tamilSubtitle: 'இலங்கையின் தேசிய மொழி',
    activeBadge: 'සක්‍රියයි',
    selectOption: 'තෝරන්න',
    guestNotice: 'අමුත්තන්ගේ ප්‍රකාරය: ඔබගේ තේරීම් මෙම බ්‍රවුසරයේ සුරකින ලදී. සියලු උපාංග හරහා සුරැකීමට ලියාපදිංචි වන්න.',
    accountSyncedNotice: 'ඔබගේ EMPOWAY ගිණුම සමඟ සුරකින ලදී.',

    // Common Actions
    reportBarrier: 'බාධකයක් වාර්තා කරන්න',
    addPhotos: 'ඡායාරූප එක් කරන්න',
    savePlace: 'සුරකින්න',
    scorecard: 'ප්‍රවේශ්‍යතා ලකුණු පුවරුව',
    search: 'සොයන්න',
    filter: 'පෙරහන්',
    clear: 'ඉවත් කරන්න',
    back: 'ආපසු',
    save: 'සුරකින්න',
    cancel: 'අවලංගු කරන්න',
    loading: 'පූරණය වෙමින්...',

    // Personal Accessibility Match
    personalMatchTitle: 'පුද්ගලික ප්‍රවේශ්‍යතා ගැළපීම',
    personalMatchSubtitle: 'ඔබගේ චලන උපකරණ සහ විශේෂිත අවශ්‍යතා මත පදනම් වූ පුද්ගලික ප්‍රවේශ්‍යතා ගැළපුම් ලකුණු.',
    mobilityProfileTitle: 'චලන උපකරණ සහ ප්‍රවේශ්‍යතා පැතිකඩ',
    mobilityProfileSubtitle: 'ඔබගේ චලන උපකරණය තෝරන්න හෝ කොළඹ පුරා ස්ථාන සඳහා පුද්ගලික ගැළපුම බැලීමට අවශ්‍යතා සකසන්න.',
    power_wheelchair: 'විදුලි / බල රෝද පුටුව (Power Wheelchair)',
    power_wheelchair_desc: 'පඩි රහිත ප්‍රවේශය, පළල් හැරවුම් කොරිඩෝ, පහත් බෑවුම් සහ විදුලි සෝපාන පහසුකම් අත්‍යවශ්‍ය වේ.',
    manual_wheelchair: 'සාමාන්‍ය රෝද පුටුව (Manual Wheelchair)',
    manual_wheelchair_desc: 'බෑවුම් හෝ සමතලා පිවිසුම්, ප්‍රවේශ විය හැකි වැසිකිළි සහ පැහැදිලි මාර්ග අවශ්‍ය වේ.',
    walking_aid: 'හැරමිටි, කිහිලිකරු හෝ ඇවිදින ආධාරක (Walker)',
    walking_aid_desc: 'පඩි රහිත මාර්ග හෝ සෝපාන, ලිස්සා නොයන මතුපිට සහ ආසන්න රථගාල් අවශ්‍ය වේ.',
    stroller: 'ළදරු කරත්ත / පවුල් (Stroller)',
    stroller_desc: 'පඩි රහිත පිවිසුම්, සෝපාන, පළල් දොරවල් සහ පවුල් වැසිකිළි අවශ්‍ය වේ.',
    limited_mobility: 'ජ්‍යෙෂ්ඨ පුරවැසියන් / සීමිත ශක්තිය',
    limited_mobility_desc: 'පඩි රහිත පිවිසුම්, සෝපාන සහ ආසන්න රථගාල් මඟින් වැඩි පහසුවක් ලැබේ.',
    custom: 'අභිරුචි ප්‍රවේශ්‍යතා පැතිකඩ',
    custom_desc: 'ඔබගේ විශේෂිත ගමන් අවශ්‍යතාවලට ගැලපෙන ලෙස තෝරාගත් අංග.',
    highMatch: 'ඉහළ ගැළපුම',
    moderateMatch: 'මධ්‍යස්ථ ගැළපුම',
    barriersDetected: 'බාධක හඳුනාගෙන ඇත',
    matchesYourNeeds: 'ඔබගේ අවශ්‍යතාවන්ට ගැළපේ',
    cautionUnverified: 'තහවුරු කිරීම අවශ්‍යයි / ප්‍රවේශම් වන්න',
    barrierMissing: 'නොමැත / බාධකයකි',
    switchProfile: 'වෙනත් උපකරණ සඳහා පරීක්ෂා කරන්න',
    mySavedProfile: 'මගේ සුරැකි පැතිකඩ',
    matchScoreLabel: 'පුද්ගලික ගැළපුම් ලකුණු',
    mustHaveFeatures: 'අත්‍යවශ්‍ය අංග',
    niceToHaveFeatures: 'අමතර ප්‍රයෝජනවත් අංග',

    // Accessible Transport Connection Checker
    transportTitle: 'ප්‍රවේශ විය හැකි ප්‍රවාහන සබඳතා පරීක්ෂකය',
    transportSubtitle: 'ආසන්න බස් නැවතුම්, දුම්රිය ස්ථාන, ප්‍රවේශ විය හැකි කැබ් රථ බසින ස්ථාන සහ කොළඹ පදික මංතීරු තත්ත්වය පරීක්ෂා කරන්න.',
    busConnection: 'බස් රථ සබඳතාව',
    railConnection: 'දුම්රිය සබඳතාව',
    dropOffConnection: 'ප්‍රවේශ විය හැකි කැබ් / බසින ස්ථානය',
    corridorConnection: 'පදික වේදිකා සහ රෝද පුටු මංතීරුව',
    nearestStop: 'ආසන්නතම බස් නැවතුම',
    nearestStation: 'ආසන්නතම දුම්රිය ස්ථානය',
    rollingTime: 'ඇස්තමේන්තුගත ගමන් කාලය',
    curbRamps: 'බැසීම් බෑවුම් (Dropped Kerbs) ඇත',
    lowFloorBuses: 'පහත් තට්ටු බස් රථ සේවාව',
    stepFreePlatform: 'පඩි රහිත වේදිකා ප්‍රවේශය',
    disabledAssistance: 'ස්ථානීය ආබාධිත ආධාරක සේවාව',
    openWalkingRoute: 'ප්‍රවේශ විය හැකි ගමන් මාර්ගය විවෘත කරන්න',
    callAssistance: 'දුම්රිය ආධාරක සේවාව අමතන්න',
    curbRampStatusLabel: 'මංතීරු මායිම් බෑවුම් තත්ත්වය',
    sidewalkQualityLabel: 'පදික වේදිකා මතුපිට තත්ත්වය',
    transitConnectivityScore: 'ප්‍රවාහන සබඳතා ලකුණු',
    excellentTransit: 'විශිෂ්ට පොදු ප්‍රවාහන සබඳතා',
    moderateTransit: 'පෙර සූදානම සමඟ හොඳ සබඳතා',
    limitedTransit: 'දුර ප්‍රමාණය වැඩි බැවින් වාහනයකින් ගමන් කිරීම නිර්දේශ කෙරේ'
  },

  ta: {
    // Navigation
    home: 'முகப்பு',
    explore: 'இடங்களை ஆராய்க',
    compare: 'ஒப்பீடு',
    journey: 'பயண திட்டமிடுபவர்',
    colomboPilot: 'கொழும்பு முன்னோடி திட்டம்',
    verifiedLocations: 'சரிபார்க்கப்பட்ட இடங்கள்',
    sharePlace: 'இடத்தைப் பகிரவும்',
    signIn: 'உள்நுழைக',
    register: 'கணக்கை உருவாக்குக',
    signOut: 'வெளியேறுக',
    myProfile: 'என் சுயவிவரம்',
    dashboard: 'டாஷ்போர்டு',
    settings: 'அமைப்புகள்',
    adminConsole: 'நிர்வாக கன்சோல்',
    orgPortal: 'நிறுவன போர்ட்டல்',

    // Hero Section
    heroTagline: 'EMPOWAY – ஒவ்வொரு பயணத்தையும் வலுப்படுத்துகிறது',
    heroHeading1: 'ஒவ்வொரு பயணமும் இருக்க வேண்டும்',
    heroHeadingAccessible: 'அணுகக்கூடியதாக.',
    heroDescription: 'கொழும்பில் அணுகக்கூடிய இடங்களைக் கண்டறிந்து, நம்பிக்கையுடன் பயணம் செய்து, அனைவரையும் உள்ளடக்கிய இலங்கையை உருவாக்க உதவுங்கள்.',
    colomboPilotPill: 'கொழும்பில் தொடங்கி',
    colomboTaglineBadge: 'இலங்கை முழுவதும் விரிவடைகிறது',
    exploreBreadcrumb: 'கொழும்பு அடைவு',
    sriLanka: 'இலங்கை',
    explorePlacesBtn: 'இடங்களை ஆராய்க',
    sharePlaceBtn: 'இடத்தைப் பகிரவும்',
    slidePill: 'படம்',
    playingStatus: 'இயங்குகிறது',
    pausedStatus: 'நிறுத்தப்பட்டது',
    slide1Tagline: 'கொழும்பில் தொடங்கி இலங்கை முழுவதும் விரிவடைகிறது',
    slide1Location: 'கொழும்பு கோட்டை பாரம்பரியம் மற்றும் நவீன வானலை • கொழும்பு 01',
    slide1Highlight: 'அணுகக்கூடிய நகர்ப்புற இடங்கள் & பொது பாரம்பரியம்',
    slide2Tagline: 'சுகாதாரம் மற்றும் மருத்துவ அணுகல்',
    slide2Location: 'மருத்துவமனைகள் • கொழும்பு 10',
    slide2Highlight: 'அணுகக்கூடிய மருத்துவமனை நுழைவாயில்கள்',
    slide3Tagline: 'கலாச்சார மையங்கள் & உயர்கல்வி',
    slide3Location: 'பல்கலைக்கழகங்கள், நூலகங்கள் • கொழும்பு 07',
    slide3Highlight: 'அகலமான பாதைகள் மற்றும் மின்தூக்கிகள்',
    slide4Tagline: 'வணிக மையங்கள் மற்றும் வணிக வளாகங்கள்',
    slide4Location: 'நவீன வணிக வளாகங்கள் • கொழும்பு',
    slide4Highlight: 'சமதள நுழைவாயில்கள் மற்றும் அகலமான பாதைகள்',
    slide5Tagline: 'உலகளாவிய கட்டடக்கலை வடிவமைப்பு',
    slide5Location: 'பொது நிறுவனங்கள் • கொழும்பு',
    slide5Highlight: 'பாதுகாப்பு கைப்பிடிகள் கொண்ட சாய்வுதளங்கள்',

    // Search Section
    placeNameOrLandmark: 'இடத்தின் பெயர் அல்லது அடையாளம்',
    placeNamePlaceholder: 'எ.கா: தேசிய மருத்துவமனை, டவுன் ஹால்...',
    areaInColombo: 'கொழும்பு பகுதி',
    areaPlaceholder: 'எ.கா: கொழும்பு 07, கோட்டை, பொரளை...',
    category: 'வகை',
    allCategories: 'அனைத்து பிரிவுகளும்',
    searchButton: 'தேடுக',
    popularAreas: 'பிரபலமான கொழும்பு பகுதிகள்:',

    // Impact Statistics
    realTimeMetrics: 'நிகழ்நேர சரிபார்ப்பு அளவீடுகள்',
    pilotStatusHeading: 'கொழும்பு அணுகல்தன்மை முன்னோடி திட்ட நிலை',
    pilotStatusDesc: 'கொழும்பு மாவட்டத்தின் சரிபார்க்கப்பட்ட தரவுத்தள பதிவுகளிலிருந்து பெறப்பட்டது.',
    databaseActive: 'தரவுத்தளம் செயலில் உள்ளது • PostgreSQL',
    totalPlacesAssessed: 'மதிப்பிடப்பட்ட மொத்த இடங்கள்',
    physicallyVerified: 'நேரில் சரிபார்க்கப்பட்டது',
    communityReports: 'சமூக அறிக்கைகள்',
    communityAdvocates: 'சமூக பங்களிப்பாளர்கள்',
    candidatePublicPlaces: 'பரிசீலிக்கப்பட்ட பொது இடங்கள்',
    auditedAndConfirmed: 'ஆய்வு செய்து உறுதிப்படுத்தப்பட்டது',
    crowdsourcedInsights: 'சமூக உள்ளீடுகள்',
    activeContributors: 'செயலில் உள்ள பங்களிப்பாளர்கள்',
    acrossColombo: 'கொழும்பு 01 முதல் 15 வரை',
    photoProof: 'புகைப்பட சான்று & சாய்வு சோதனைகள்',
    awaitingAudit: 'நேரடி ஆய்வை எதிர்நோக்குகிறது',
    volunteersAndStudents: 'தன்னார்வலர்கள் மற்றும் மாணவர்கள்',

    // Categories Section
    browseByCategory: 'பொது பிரிவுகளின்படி உலாவுக',
    exploreFacilityType: 'வசதி வகையின்படி கொழும்பை ஆராய்க',
    exploreFacilitySubtitle: 'முக்கிய பொது வசதிகளுக்கான சரிபார்க்கப்பட்ட சக்கர நாற்காலி அணுகல், சாய்வு விவரங்கள்.',
    viewFullDirectory: 'முழு கோப்பகத்தையும் காண்க',
    placesCount: 'இடங்கள்',
    exploreSection: 'பிரிவை ஆராய்க',
    viewPlaces: 'இடங்களைப் பார்க்க',
    exploreSignIn: 'ஆராய்க (உள்நுழைக)',

    // Sample Preview Places Section
    featuredAudits: 'சிறப்பு அணுகல்தன்மை ஆய்வுகள்',
    physicalPreviews: 'நேரடி அணுகல்தன்மை மாதிரிகள்',
    physicalPreviewsSubtitle: 'அளவிடப்பட்ட சாய்வு கோணங்கள், அணுகக்கூடிய கழிப்பறைகள் மற்றும் புகைப்படங்கள் கொண்ட இடங்கள்.',
    viewAllPlaces: 'சரிபார்க்கப்பட்ட அனைத்து இடங்களையும் காண்க',
    accessibilityHighlights: 'அணுகல்தன்மை சிறப்பம்சங்கள்',
    viewProfile: 'விவரங்களைப் பார்க்க',
    viewProfileSignIn: 'விவரங்களைப் பார்க்க (உள்நுழைக)',
    previewPill: 'முன்னோட்டம்',
    pilotAuditPill: 'முன்னோடி ஆய்வு',
    verifiedOnDate: 'சரிபார்க்கப்பட்டது',
    communityLogged: 'சமூகத்தால் பதிவிடப்பட்டது',

    // Contribution Panel
    smallContributions: 'சிறு பங்களிப்புகள். சிறந்த சுதந்திரம்.',
    contributionSubtitle: 'நீங்கள் பகிரும் ஒவ்வொரு விவரமும் மற்றவர்கள் நம்பிக்கையுடன் பயணிக்க உதவுகிறது.',
    addLocationTitle: 'இடத்தைச் சேர்க்கவும்',
    addLocationDesc: 'மற்றவர்கள் அணுகக்கூடிய இடங்களைக் கண்டறிய உதவுங்கள்.',
    shareDetailsTitle: 'அணுகல்தன்மை விவரங்களைப் பகிரவும்',
    shareDetailsDesc: 'சாய்வுதளங்கள், மின்தூக்கிகள் மற்றும் கழிப்பறைகள் பற்றிய விவரங்களை வழங்கவும்.',
    makeImpactTitle: 'தாக்கத்தை ஏற்படுத்துங்கள்',
    makeImpactDesc: 'அனைவரையும் உள்ளடக்கிய இலங்கையை உருவாக்க உதவுங்கள்.',

    // Registration Section
    bePartOfAccessibleSL: 'அணுகக்கூடிய இலங்கையின் ஒரு பகுதியாக இருங்கள்',
    registerBannerDesc: 'அணுகல்தன்மை தகவலைப் பகிர, சமூகத்திற்கு பங்களிக்க உங்கள் கணக்கை உருவாக்கவும்.',
    createAccountBtn: 'கணக்கை உருவாக்குங்கள்',
    signInBtn: 'உள்நுழையவும்',

    // Explore Page
    exploreTitle: 'கொழும்பில் அணுகக்கூடிய இடங்களை ஆராய்க',
    exploreSubtitle: 'கொழும்பின் பொது நிறுவனங்களில் சரிபார்க்கப்பட்ட சாய்வுதளங்கள், மின்தூக்கிகள் மற்றும் கழிப்பறைகளைக் கண்டறியவும்.',
    grid: 'கட்டம்',
    list: 'பட்டியல்',
    map: 'வரைபடம்',
    filterPlaces: 'இடங்களை வடிகட்டவும்',
    clearAll: 'அனைத்தையும் அழிக்க',
    searchByNameOrArea: 'பெயர் அல்லது பகுதி மூலம் தேடுக',
    searchExplorePlaceholder: 'எ.கா: தேசிய மருத்துவமனை, கோட்டை...',
    infoStatus: 'தகவல் நிலை',
    allStatuses: 'அனைத்து நிலைகளும்',
    physicalFeaturesTitle: 'உடல் அணுகல்தன்மை அம்சங்கள்',
    sortBy: 'வரிசைப்படுத்து',
    mostRecent: 'சமீபத்தில் புதுப்பிக்கப்பட்டது',
    highestScore: 'அதிக அணுகல்தன்மை மதிப்பெண்',
    nameAZ: 'பெயர்: A முதல் Z',
    placesFound: 'இடங்கள் கொழும்பில் கண்டறியப்பட்டன',
    noPlacesFound: 'இடங்கள் எதுவும் கிடைக்கவில்லை',
    adjustFilters: 'கூடுதல் இடங்களைக் காண உங்கள் தேடல் அளவுகோல்களை மாற்றவும்.',
    resetFiltersBtn: 'வடிகட்டிகளை மீட்டமைக்க',

    // Features Checklist & Scorecard
    stepFreeEntrance: 'படி இல்லாத நுழைவாயில்',
    wheelchairRamp: 'சக்கர நாற்காலி சாய்வுதளம்',
    elevator: 'மின் தூக்கி (Lift)',
    accessibleToilet: 'அணுகக்கூடிய கழிப்பறை',
    accessibleParking: 'பிரத்யேக வாகன நிறுத்துமிடம்',
    wideDoorways: 'அகலமான வாசல்கள் (85cm+)',
    wheelchairPathways: 'சக்கர நாற்காலி பாதைகள்',
    accessibleCounters: 'அணுகக்கூடிய சேவை கவுண்டர்கள்',

    // Feature Descriptions
    desc_stepFreeEntrance: 'படி இல்லாத சமதள நுழைவாயில்.',
    desc_wheelchairRamp: 'பாதுகாப்பான சாய்வுதளம் மற்றும் கைப்பிடிகள்.',
    desc_elevator: 'மேல் தளங்களுக்குச் செல்லக்கூடிய மின்தூக்கி வசதி.',
    desc_accessibleToilet: 'சக்கர நாற்காலியில் அணுகக்கூடிய கழிப்பறை.',
    desc_accessibleParking: 'நுழைவாயிலுக்கு அருகிலான வாகன நிறுத்துமிடம்.',
    desc_wideDoorways: '85cm+ அகலமான கதவுகள் மற்றும் வாசல்கள்.',
    desc_wheelchairPathways: 'சமதள, வழுக்காத உள்பாதைகள்.',
    desc_accessibleCounters: 'அணுகக்கூடிய தாழ்வான சேவை கவுண்டர்கள்.',

    // Statuses
    verified: 'சரிபார்க்கப்பட்டது',
    communityReported: 'சமூகத்தால் அறிவிக்கப்பட்டது',
    notYetAssessed: 'இன்னும் மதிப்பிடப்படவில்லை',
    unknown: 'விவரங்கள் இல்லை',
    directoryPlaceUnassessed: 'கொழும்பு கோப்பகத்தில் பட்டியலிடப்பட்டுள்ளது • கள ஆய்வை எதிர்நோக்குகிறது',
    available: 'கிடைக்கக்கூடியது',
    notAvailable: 'கிடைக்கவில்லை',
    needsVerification: 'சரிபார்ப்பு தேவை',

    // Directory & Filters
    colomboDistrict: 'கொழும்பு மாவட்டம்',
    allAreas: 'அனைத்து கொழும்பு பகுதிகளும்',
    allOrganizations: 'அனைத்து நிறுவனங்களும்',
    parentOrganization: 'முதன்மை நிறுவனம்',
    branch: 'கிளை',
    dataSource: 'தரவு மூலம்',
    sector: 'துறை',
    allSectors: 'அனைத்து துறைகளும் (அரசு & தனியார்)',
    publicSector: 'அரசு துறை',
    privateSector: 'தனியார் துறை',
    corporateSector: 'கார்ப்பரேட் / வணிகம்',

    // Short feature labels for cards
    ramp: 'சாய்வுதளம்',
    stepFree: 'படி இல்லாதது',
    elevatorShort: 'மின்தூக்கி',
    toilet: 'கழிப்பறை',
    parking: 'வாகன நிறுத்தம்',
    doorways: 'வாசல்கள்',
    pathways: 'பாதைகள்',
    counters: 'கவுண்டர்கள்',

    // Scorecard UI
    transparentAudit: 'வெளிப்படையான ஆய்வு',
    physicalStandards: 'இலங்கை உடல் தரநிலைகள்',
    scorecardTitle: 'அணுகல்தன்மை மதிப்பெண் அட்டை',
    multiPointEvaluation: 'சுயாதீன மதிப்பீடு',
    scoreRatio: 'சரிபார்க்கப்பட்ட மதிப்பெண் விகிதம்',
    points: 'புள்ளிகள்',
    dataCompleteness: 'ஆய்வு தரவு முழுமை',
    verifiedCriteriaNote: 'உறுதிப்படுத்தப்பட்ட உடல் அணுகல்தன்மையை பிரதிபலிக்கிறது.',
    howScoreCalculated: 'இந்த மதிப்பெண் எவ்வாறு கணக்கிடப்படுகிறது?',
    scoreExplanation: 'இலங்கை அணுகல்தன்மை தரநிலைகளின்படி மதிப்பிடப்பட்ட 8 உடல் அம்சங்களின் அடிப்படையில் மதிப்பெண்கள் வெளிப்படையாக கணக்கிடப்படுகின்றன.',

    // Category Names
    cat_hospitals: 'மருத்துவமனைகள் & சுகாதாரம்',
    cat_universities: 'பல்கலைக்கழகங்கள் & கல்வி',
    cat_banks: 'வங்கிகள் & நிதிச் சேவைகள்',
    cat_government: 'அரசாங்க அலுவலகங்கள்',
    cat_restaurants: 'உணவகங்கள் & கஃபேக்கள்',
    cat_shopping: 'வணிக வளாகங்கள் & பொது இடங்கள்',
    cat_hotels: 'ஹோட்டல்கள் & தங்குமிடங்கள்',

    // Footer
    footerDisclaimerHeading: 'வெளிப்படையான அணுகல்தன்மை அறிக்கை:',
    footerDisclaimerText: 'EMPOWAY ஒரு சான்றிதழ் வழங்கும் அமைப்பு அல்ல. நாங்கள் சான்றுகள் அடிப்படையிலான மற்றும் சரிபார்க்கப்பட்ட அணுகல்தன்மை விவரங்களை வழங்குகிறோம்.',
    readAuditMethodology: 'ஆய்வு முறையைப் படிக்கவும் →',
    footerAboutText: 'இலங்கை முழுவதும் உள்ள பொது இடங்களின் அணுகல்தன்மை தகவல்களைக் கண்டறியவும், புரிந்துகொள்ளவும் மற்றும் பகிரவும்.',
    footerPilotCoverage: 'ஆரம்ப முன்னோடி திட்டம்: கொழும்பு மாவட்டம், மேல் மாகாணம், இலங்கை',
    designedFor: 'வடிவமைக்கப்பட்டது',
    userWheelchair: 'சக்கர நாற்காலி பயனர்கள்',
    userMobility: 'இயக்கம் கடினமாக உள்ள நபர்கள்',
    userElderly: 'முதியவர்கள்',
    userInjury: 'காயத்திலிருந்து மீள்பவர்கள்',
    userStrollers: 'குழந்தை வண்டிகளுடன் பயணிக்கும் பெற்றோர்',
    userCaregivers: 'குடும்ப பராமரிப்பாளர்கள்',
    platform: 'தளம்',
    keyCategories: 'முக்கிய பிரிவுகள்',
    copyrightText: 'EMPOWAY – ஒவ்வொரு பயணத்தையும் வலுப்படுத்துகிறது. கொழும்பு அணுகல்தன்மை திட்டம்.',
    developedWith: 'உருவாக்கப்பட்டது',
    forInclusiveMobility: 'இலங்கையில் அனைவரையும் உள்ளடக்கிய இயக்கத்திற்காக',
    settingsAndPreferences: 'அமைப்புகள் & விருப்பங்கள்',

    // AI Chatbot
    aiBotTitle: 'EMPOWAY AI அணுகல்தன்மை உதவியாளர்',
    aiBotSubtitle: 'கொழும்பு திட்டம் • உடனடி பதில்கள்',
    aiBotGreeting: 'வணக்கம்! நான் உங்கள் EMPOWAY AI அணுகல்தன்மை உதவியாளர். கொழும்பில் சக்கர நாற்காலிக்கு ஏற்ற மருத்துவமனைகள், வங்கிகள், சாய்வுதளங்கள் பற்றி என்னிடம் கேளுங்கள்.',
    aiBotPlaceholder: 'கொழும்பில் உள்ள சாய்வுதளங்கள், கழிப்பறைகள் பற்றி கேளுங்கள்...',
    suggestion1: 'கொழும்பில் அணுகக்கூடிய மருத்துவமனைகள்',
    suggestion2: 'கோட்டை ரயில் நிலைய அணுகல்',
    suggestion3: 'இலங்கையில் சாய்வுதள தரநிலைகள்',
    suggestion4: 'படி இல்லாத வங்கிகள்',
    send: 'அனுப்பு',

    // Settings Page
    settingsTitle: 'அமைப்புகள் மற்றும் அணுகல்தன்மை விருப்பங்கள்',
    settingsSubtitle: 'உங்கள் EMPOWAY அனுபவத்தைத் தனிப்பயனாக்குங்கள். தளத்தின் வண்ணத் தோற்றத்தையும் மொழியையும் எளிதில் மாற்றுங்கள்.',
    appearance: 'தோற்றம் (Appearance)',
    appearanceDesc: 'உங்கள் திரைக்கு ஏற்ற பார்வை பயன்முறையைத் தேர்ந்தெடுக்கவும். Light Mode மற்றும் Dark Mode இடையே எளிதாக மாறலாம்.',
    lightMode: 'Light Mode (ஒளி முறை)',
    lightModeSubtitle: 'மென்மையான தந்தம் மற்றும் காபி நிறம் (இயல்புநிலை)',
    lightModeDescription: 'பகல் நேர வாசிப்புக்கு வசதியான மற்றும் சுத்தமான மென்மையான பின்னணி.',
    darkMode: 'Dark Mode (இருண்ட முறை)',
    darkModeSubtitle: 'ஆழ்ந்த காபி மற்றும் டெரகோட்டா வண்ணங்கள்',
    darkModeDescription: 'இரவு நேரம் அல்லது குறைந்த வெளிச்சத்தில் கண்களுக்கு உகந்த உயர் மாறுபட்ட பின்னணி.',
    language: 'மொழி (Language)',
    languageDesc: 'உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும். மெனுக்கள், அணுகல்தன்மை மதிப்பெண் அட்டைகள் மற்றும் கருவிகள் உடனடியாக மாறும்.',
    english: 'English (ஆங்கிலம்)',
    englishSubtitle: 'சர்வதேச மொழி',
    sinhala: 'සිංහල (சிங்களம்)',
    sinhalaSubtitle: 'இலங்கையின் பிரதான அரச மொழி',
    tamil: 'தமிழ்',
    tamilSubtitle: 'இலங்கையின் உத்தியோகபூர்வ தேசிய மொழி',
    activeBadge: 'செயலில் உள்ளது',
    selectOption: 'தேர்ந்தெடு',
    guestNotice: 'விருந்தினர் முறை: உங்கள் விருப்பங்கள் இந்த உலாவியில் சேமிக்கப்பட்டுள்ளன. உங்கள் கணக்கில் ஒத்திசைக்க உள்நுழையவும்.',
    accountSyncedNotice: 'உங்கள் EMPOWAY சுயவிவரத்துடன் ஒத்திசைக்கப்பட்டது.',

    // Common Actions
    reportBarrier: 'தடையை புகாரளிக்கவும்',
    addPhotos: 'புகைப்படங்களைச் சேர்க்க',
    savePlace: 'விருப்பத்தில் சேர்க்க',
    scorecard: 'அணுகல்தன்மை மதிப்பெண்',
    search: 'தேடுக',
    filter: 'வடிகட்டி',
    clear: 'அழிக்க',
    back: 'பின்செல்க',
    save: 'சேமிக்க',
    cancel: 'ரத்துசெய்',
    loading: 'ஏற்றுகிறது...',

    // Personal Accessibility Match
    personalMatchTitle: 'தனிப்பட்ட அணுகல்தன்மை பொருத்தம்',
    personalMatchSubtitle: 'உங்கள் தனிப்பட்ட இயக்க உபகரணங்கள் மற்றும் தேவைகளின் அடிப்படையில் கணக்கிடப்பட்ட பொருத்தம்.',
    mobilityProfileTitle: 'இயக்க உபகரணங்கள் மற்றும் சுயவிவரம்',
    mobilityProfileSubtitle: 'கொழும்பு முழுவதும் தனிப்பயனாக்கப்பட்ட பொருந்தக்கூடிய தன்மையைக் காண உங்கள் உபகரணத்தைத் தேர்ந்தெடுக்கவும்.',
    power_wheelchair: 'மின்னோட்ட சக்கர நாற்காலி (Power Wheelchair)',
    power_wheelchair_desc: 'படி இல்லாத அணுகல், அகலமான தாழ்வாரங்கள், குறைந்த சாய்வுதளங்கள் மற்றும் மின்தூக்கி வசதிகள் அவசியம்.',
    manual_wheelchair: 'வழக்கமான சக்கர நாற்காலி (Manual Wheelchair)',
    manual_wheelchair_desc: 'சாய்வுதளம் அல்லது சமதரை நுழைவு, அணுகக்கூடிய கழிப்பறைகள் மற்றும் தெளிவான பாதைகள் தேவை.',
    walking_aid: 'ஊன்றுகோல் அல்லது நடக்கும் கருவி (Walker)',
    walking_aid_desc: 'படி இல்லாத பாதைகள், மின்தூக்கிகள், வழுக்காத தரை மற்றும் அருகிலுள்ள வாகன நிறுத்துமிடம் தேவை.',
    stroller: 'குழந்தை வண்டி / குடும்பம் (Stroller)',
    stroller_desc: 'படி இல்லாத நுழைவு, மின்தூக்கி, அகலமான கதவுகள் மற்றும் குடும்ப கழிப்பறைகள் தேவை.',
    limited_mobility: 'முதியவர்கள் / குறைந்த சகிப்புத்தன்மை',
    limited_mobility_desc: 'படி இல்லாத நுழைவு, மின்தூக்கிகள் மற்றும் அருகிலுள்ள வாகன நிறுத்துமிடம் மூலம் அதிக நன்மை.',
    custom: 'தனிப்பயன் அணுகல்தன்மை சுயவிவரம்',
    custom_desc: 'உங்கள் குறிப்பிட்ட பயணத் தேவைகளுக்கு ஏற்ப தேர்ந்தெடுக்கப்பட்ட அம்சங்கள்.',
    highMatch: 'உயர் பொருத்தம்',
    moderateMatch: 'மிதமான பொருத்தம்',
    barriersDetected: 'தடைகள் கண்டறியப்பட்டன',
    matchesYourNeeds: 'உங்கள் தேவைகளுக்கு பொருந்துகிறது',
    cautionUnverified: 'சரிபார்ப்பு தேவை / எச்சரிக்கை',
    barrierMissing: 'இல்லை / தடை',
    switchProfile: 'பிற உபகரணங்களை சோதிக்கவும்',
    mySavedProfile: 'என் சேமிக்கப்பட்ட சுயவிவரம்',
    matchScoreLabel: 'தனிப்பட்ட பொருத்த மதிப்பெண்',
    mustHaveFeatures: 'கட்டாய அம்சங்கள்',
    niceToHaveFeatures: 'கூடுதல் பயனுள்ள அம்சங்கள்',

    // Accessible Transport Connection Checker
    transportTitle: 'அணுகக்கூடிய போக்குவரத்து இணைப்பு சரிபார்ப்பான்',
    transportSubtitle: 'அருகிலுள்ள பஸ் நிறுத்தங்கள், ரயில் நிலையங்கள், அணுகக்கூடிய வாகன இறங்குமிடங்கள் மற்றும் கொழும்பின் நடைபாதை நிலையை சரிபார்க்கவும்.',
    busConnection: 'பஸ் இணைப்பு',
    railConnection: 'ரயில் இணைப்பு',
    dropOffConnection: 'அணுகக்கூடிய டாக்ஸி / இறங்குமிடம்',
    corridorConnection: 'நடைபாதை மற்றும் சக்கர நாற்காலி பாதை',
    nearestStop: 'அருகிலுள்ள பஸ் நிறுத்தம்',
    nearestStation: 'அருகிலுள்ள ரயில் நிலையம்',
    rollingTime: 'மதிப்பிடப்பட்ட பயண நேரம்',
    curbRamps: 'தாழ்ந்த நடைபாதை சாய்வுகள் உள்ளன',
    lowFloorBuses: 'தாழ்ந்த தரை பஸ் சேவை',
    stepFreePlatform: 'படி இல்லாத மேடை அணுகல்',
    disabledAssistance: 'நிலையத்தில் மாற்றுத்திறனாளி உதவி சேவை',
    openWalkingRoute: 'அணுகக்கூடிய நடைபாதையை திறக்கவும்',
    callAssistance: 'நிலைய உதவிக்கு அழைக்கவும்',
    curbRampStatusLabel: 'நடைபாதை சாய்வுதள நிலை',
    sidewalkQualityLabel: 'நடைபாதை மேற்பரப்பு தரம்',
    transitConnectivityScore: 'போக்குவரத்து இணைப்பு மதிப்பெண்',
    excellentTransit: 'சிறந்த பொது போக்குவரத்து இணைப்பு',
    moderateTransit: 'முன் ஏற்பாட்டுடன் கூடிய நல்ல இணைப்பு',
    limitedTransit: 'தூரம் அதிகம் – வாகனத்தில் செல்வது பரிந்துரைக்கப்படுகிறது'
  }
};

// Category mapping helper
const CATEGORY_MAP = {
  'hospitals-healthcare': 'cat_hospitals',
  'Hospitals & Healthcare': 'cat_hospitals',
  'universities-education': 'cat_universities',
  'Universities & Education': 'cat_universities',
  'banks-financial-services': 'cat_banks',
  'Banks & Financial Services': 'cat_banks',
  'government-offices': 'cat_government',
  'Government Offices': 'cat_government',
  'restaurants-cafes': 'cat_restaurants',
  'Restaurants & Cafes': 'cat_restaurants',
  'shopping-public-places': 'cat_shopping',
  'Shopping & Public Spaces': 'cat_shopping',
  'hotels-accommodation': 'cat_hotels',
  'Hotels & Accommodation': 'cat_hotels'
};

export const MOBILITY_PRESETS = [
  {
    id: 'power_wheelchair',
    nameKey: 'power_wheelchair',
    descKey: 'power_wheelchair_desc',
    badge: 'Power Chair',
    defaultNeeds: {
      stepFreeEntrance: true,
      wheelchairRamp: true,
      elevator: true,
      wideDoorways: true,
      wheelchairPathways: true,
      accessibleToilet: true,
      accessibleParking: true,
      accessibleCounters: false
    }
  },
  {
    id: 'manual_wheelchair',
    nameKey: 'manual_wheelchair',
    descKey: 'manual_wheelchair_desc',
    badge: 'Manual Chair',
    defaultNeeds: {
      stepFreeEntrance: true,
      wheelchairRamp: true,
      elevator: true,
      accessibleToilet: true,
      wheelchairPathways: true,
      wideDoorways: true,
      accessibleParking: false,
      accessibleCounters: false
    }
  },
  {
    id: 'walking_aid',
    nameKey: 'walking_aid',
    descKey: 'walking_aid_desc',
    badge: 'Cane / Walker',
    defaultNeeds: {
      stepFreeEntrance: true,
      elevator: true,
      wheelchairPathways: true,
      wheelchairRamp: false,
      accessibleParking: true,
      accessibleToilet: false,
      wideDoorways: false,
      accessibleCounters: false
    }
  },
  {
    id: 'stroller',
    nameKey: 'stroller',
    descKey: 'stroller_desc',
    badge: 'Stroller / Pram',
    defaultNeeds: {
      stepFreeEntrance: true,
      elevator: true,
      wideDoorways: true,
      wheelchairRamp: true,
      accessibleToilet: true,
      wheelchairPathways: false,
      accessibleParking: false,
      accessibleCounters: false
    }
  },
  {
    id: 'limited_mobility',
    nameKey: 'limited_mobility',
    descKey: 'limited_mobility_desc',
    badge: 'Senior / Stamina',
    defaultNeeds: {
      stepFreeEntrance: true,
      elevator: true,
      accessibleParking: true,
      wheelchairPathways: true,
      wheelchairRamp: false,
      accessibleToilet: false,
      wideDoorways: false,
      accessibleCounters: false
    }
  },
  {
    id: 'custom',
    nameKey: 'custom',
    descKey: 'custom_desc',
    badge: 'Custom Needs',
    defaultNeeds: {
      stepFreeEntrance: true,
      wheelchairRamp: true,
      elevator: true,
      accessibleToilet: true,
      accessibleParking: false,
      wideDoorways: true,
      wheelchairPathways: true,
      accessibleCounters: false
    }
  }
];

export const PreferencesProvider = ({ children }) => {
  const auth = useAuth ? useAuth() : null;
  const user = auth?.user;

  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('empoway_lang') || 'en';
  });

  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('empoway_theme') || 'light';
  });

  const [mobilityProfile, setMobilityProfileState] = useState(() => {
    const saved = localStorage.getItem('empoway_mobility');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return {
      type: 'manual_wheelchair',
      customNeeds: {
        stepFreeEntrance: true,
        wheelchairRamp: true,
        elevator: true,
        accessibleToilet: true,
        accessibleParking: false,
        wideDoorways: true,
        wheelchairPathways: true,
        accessibleCounters: false
      }
    };
  });

  const [savingNotice, setSavingNotice] = useState(null);

  const applyThemeToDOM = (newTheme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (user) {
      if (user.preferredTheme && ['light', 'dark'].includes(user.preferredTheme)) {
        if (user.preferredTheme !== theme) {
          setThemeState(user.preferredTheme);
          localStorage.setItem('empoway_theme', user.preferredTheme);
          applyThemeToDOM(user.preferredTheme);
        }
      }
      if (user.preferredLanguage && ['en', 'si', 'ta'].includes(user.preferredLanguage)) {
        if (user.preferredLanguage !== language) {
          setLanguageState(user.preferredLanguage);
          localStorage.setItem('empoway_lang', user.preferredLanguage);
          document.documentElement.lang = user.preferredLanguage;
        }
      }
      if (user.mobilityProfile && typeof user.mobilityProfile === 'object') {
        setMobilityProfileState(user.mobilityProfile);
        localStorage.setItem('empoway_mobility', JSON.stringify(user.mobilityProfile));
      }
    }
  }, [user?.id, user?.preferredTheme, user?.preferredLanguage, JSON.stringify(user?.mobilityProfile)]);

  useEffect(() => {
    applyThemeToDOM(theme);
    document.documentElement.lang = language;
  }, []);

  const setTheme = async (newTheme) => {
    if (!['light', 'dark'].includes(newTheme)) return;
    setThemeState(newTheme);
    localStorage.setItem('empoway_theme', newTheme);
    applyThemeToDOM(newTheme);

    if (user) {
      try {
        await api.updatePreferences({ preferredTheme: newTheme });
        setSavingNotice('Saved to your EMPOWAY account');
        setTimeout(() => setSavingNotice(null), 3000);
      } catch (err) {
        console.warn('[Preferences] Error persisting theme to server:', err);
      }
    } else {
      setSavingNotice('Saved locally on this device');
      setTimeout(() => setSavingNotice(null), 3000);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  const setLanguage = async (newLang) => {
    if (!['en', 'si', 'ta'].includes(newLang)) return;
    setLanguageState(newLang);
    localStorage.setItem('empoway_lang', newLang);
    document.documentElement.lang = newLang;

    if (user) {
      try {
        await api.updatePreferences({ preferredLanguage: newLang });
        setSavingNotice('Language preference synced with account');
        setTimeout(() => setSavingNotice(null), 3000);
      } catch (err) {
        console.warn('[Preferences] Error persisting language to server:', err);
      }
    } else {
      setSavingNotice('Saved locally on this device');
      setTimeout(() => setSavingNotice(null), 3000);
    }
  };

  const setMobilityProfile = async (newProfile) => {
    if (!newProfile || typeof newProfile !== 'object') return;
    setMobilityProfileState(newProfile);
    localStorage.setItem('empoway_mobility', JSON.stringify(newProfile));

    if (user) {
      try {
        await api.updateMobilityProfile(newProfile);
        setSavingNotice('Mobility profile synced with your account');
        setTimeout(() => setSavingNotice(null), 3000);
      } catch (err) {
        console.warn('[Preferences] Error persisting mobility profile to server:', err);
      }
    } else {
      setSavingNotice('Saved mobility profile locally on this device');
      setTimeout(() => setSavingNotice(null), 3000);
    }
  };

  // General translation helper
  const t = (key, fallback) => {
    if (!key) return fallback || '';
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict[key]) return langDict[key];

    // Check if key is a category slug or name
    if (CATEGORY_MAP[key]) {
      const catKey = CATEGORY_MAP[key];
      if (langDict[catKey]) return langDict[catKey];
    }

    // Fallback to English dict
    if (TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    return fallback !== undefined ? fallback : key;
  };

  // Specialized Category Translator
  const translateCategory = (catNameOrSlug) => {
    if (!catNameOrSlug) return '';
    const key = CATEGORY_MAP[catNameOrSlug];
    if (key) {
      const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
      return dict[key] || catNameOrSlug;
    }
    return catNameOrSlug;
  };

  // Status Translator
  const translateStatus = (status) => {
    const norm = (status || '').toUpperCase();
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (norm === 'VERIFIED') return dict.verified || 'Verified';
    if (norm === 'COMMUNITY_REPORTED') return dict.communityReported || 'Community Reported';
    if (norm === 'NOT_YET_ASSESSED') return dict.notYetAssessed || 'Not Yet Assessed';
    if (norm === 'UNKNOWN') return dict.unknown || 'Unknown';
    if (norm === 'AVAILABLE') return dict.available || 'Available';
    if (norm === 'NOT_AVAILABLE') return dict.notAvailable || 'Not Available';
    if (norm === 'NEEDS_VERIFICATION') return dict.needsVerification || 'Needs Verification';
    return status;
  };

  // Feature Translator
  const translateFeature = (featureKey) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[featureKey] || featureKey;
  };

  return (
    <PreferencesContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        toggleTheme,
        mobilityProfile,
        setMobilityProfile,
        mobilityPresets: MOBILITY_PRESETS,
        savingNotice,
        t,
        translateCategory,
        translateStatus,
        translateFeature
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
