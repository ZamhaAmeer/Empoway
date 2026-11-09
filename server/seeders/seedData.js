const { sequelize, User, Category, Place, AccessibilityFeature, Photograph, AccessibilityReport, ModerationLog } = require('../models');
const { initDatabase } = require('../config/database');

const seedDatabase = async () => {
  try {
    await initDatabase();
    console.log('[Seed] Synchronizing database tables...');
    await sequelize.sync({ force: true });
    console.log('[Seed] Database tables dropped and recreated.');

    // 1. Create Users (Admin & Community Contributors)
    console.log('[Seed] Creating demo users...');
    const adminUser = await User.create({
      fullName: 'Arundathi Perera (Lead Auditor)',
      email: 'admin@empoway.lk',
      passwordHash: 'Password123!',
      role: 'admin',
      bio: 'Accessibility & Universal Design Consultant for EMPOWAY Colombo Pilot Project.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      contributionCount: 18,
      verifiedActivityCount: 22
    });

    const user1 = await User.create({
      fullName: 'Kavindi Jayawardena',
      email: 'kavindi@empoway.lk',
      passwordHash: 'Password123!',
      role: 'user',
      bio: 'Wheelchair user, accessibility advocate and Colombo commuter.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      contributionCount: 9,
      verifiedActivityCount: 3
    });

    const user2 = await User.create({
      fullName: 'Arjun Fernando',
      email: 'arjun@empoway.lk',
      passwordHash: 'Password123!',
      role: 'user',
      bio: 'Physical therapist and universal mobility researcher in Sri Lanka.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      contributionCount: 6,
      verifiedActivityCount: 2
    });

    const user3 = await User.create({
      fullName: 'Dilshan Senanayake',
      email: 'dilshan@empoway.lk',
      passwordHash: 'Password123!',
      role: 'user',
      bio: 'Urban geography student documenting step-free pathways across Colombo.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      contributionCount: 4,
      verifiedActivityCount: 1
    });

    // 2. Categories
    console.log('[Seed] Creating categories...');
    const categoriesData = [
      {
        name: 'Hospitals and Healthcare',
        slug: 'hospitals-healthcare',
        iconName: 'Hospital',
        description: 'Hospitals, specialty clinics, diagnostics and healthcare centers.',
        displayOrder: 1
      },
      {
        name: 'Universities and Education',
        slug: 'universities-education',
        iconName: 'GraduationCap',
        description: 'Higher education faculties, campus libraries and technical institutes.',
        displayOrder: 2
      },
      {
        name: 'Banks and Financial Services',
        slug: 'banks-financial-services',
        iconName: 'Landmark',
        description: 'Commercial bank branches, ATM lobbies and financial headquarters.',
        displayOrder: 3
      },
      {
        name: 'Government Offices',
        slug: 'government-offices',
        iconName: 'Building2',
        description: 'Municipal buildings, administrative complexes, ministry offices and courts.',
        displayOrder: 4
      },
      {
        name: 'Restaurants and Cafes',
        slug: 'restaurants-cafes',
        iconName: 'Utensils',
        description: 'Eateries, bakeries, coffee lounges and dining spaces.',
        displayOrder: 5
      },
      {
        name: 'Shopping and Public Places',
        slug: 'shopping-public-places',
        iconName: 'ShoppingBag',
        description: 'Shopping malls, public parks, promenades and community centers.',
        displayOrder: 6
      },
      {
        name: 'Hotels and Accommodation',
        slug: 'hotels-accommodation',
        iconName: 'Hotel',
        description: 'Hotels, guest houses and accessible lodging facilities.',
        displayOrder: 7
      }
    ];

    const categoryMap = {};
    for (const cat of categoriesData) {
      const created = await Category.create(cat);
      categoryMap[cat.slug] = created.id;
    }

    // 3. Candidate Places in Colombo (Pilot Dataset: 35 realistic candidate places)
    console.log('[Seed] Creating Colombo candidate places with accessibility profiles...');

    const placesData = [
      // HOSPITALS
      {
        name: 'National Hospital of Sri Lanka (NHSL) – Outpatient Department',
        categorySlug: 'hospitals-healthcare',
        address: 'E. W. Perera Mawatha, Colombo 01000',
        district: 'Colombo',
        cityOrArea: 'Borella / Colombo 10',
        latitude: 6.9197,
        longitude: 79.8687,
        description: 'The premier tertiary healthcare hospital in Sri Lanka. The new Outpatient Department (OPD) wing features dedicated ramp access, wide entrance corridors, and elevator connectivity to clinic floors.',
        contactPhone: '+94 11 269 1111',
        contactEmail: 'info@nhsl.health.gov.lk',
        contactWebsite: 'https://nhsl.health.gov.lk',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-09-15',
        verifiedById: adminUser.id,
        verificationNotes: 'On-site physical audit completed for New OPD complex. Ramp has 1:12 gradient with dual safety handrails. Main elevators feature tactile floor markings.',
        entranceDetails: 'Step-free entrance with automatic sliding doors on the OPD ground floor. 1 concrete ramp at emergency junction.',
        rampCondition: 'Smooth textured concrete, standard 1:12 slope with dual continuous handrails.',
        numberOfSteps: 0,
        elevatorLocation: 'Central atrium lobby opposite pharmacy counter, 4 elevators with wide door clearance.',
        limitationsNotes: 'Older historic wards behind the main wing have steps without ramps. Request patient assistance transfer at main gate.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'AVAILABLE',
          notes: 'Lowered registration window available at Counter 04.'
        },
        photos: [
          { url: '/places/national-hospital-colombo.jpg', caption: 'NHSL Modern OPD Entrance and Drop-off Zone', isCover: true }
        ]
      },
      {
        name: 'Asiri Central Hospital',
        categorySlug: 'hospitals-healthcare',
        address: '114 Norris Canal Rd, Colombo 01000',
        district: 'Colombo',
        cityOrArea: 'Norris Canal / Colombo 10',
        latitude: 6.9248,
        longitude: 79.8659,
        description: 'Multi-specialty private hospital in Colombo with comprehensive mobility accommodations, covered ambulance drop-off, and multiple elevator banks.',
        contactPhone: '+94 11 466 5500',
        contactWebsite: 'https://asirihealth.com',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-08-20',
        verifiedById: adminUser.id,
        verificationNotes: 'Complete accessibility inspection confirmed step-free drop-off, dedicated wheelchair bays, and accessible restrooms on every floor.',
        entranceDetails: 'Porte-cochere drop-off with zero elevation difference to reception lobby. Glass automatic doors.',
        rampCondition: 'Level ground transition with non-slip tiled thresholds.',
        numberOfSteps: 0,
        elevatorLocation: 'Six high-speed elevators in main lobby with audio announcements and braille floor buttons.',
        limitationsNotes: 'Underground parking ramp has steep incline; wheelchair users are advised to be dropped off at the main porch first.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'AVAILABLE',
          notes: 'Wheelchair assistance team stationed at the entrance lobby.'
        },
        photos: [
          { url: '/places/asiri-central-hospital.jpg', caption: 'Asiri Central Hospital Norris Canal Road multi-storey medical center', isCover: true }
        ]
      },
      {
        name: 'Colombo South Teaching Hospital (Kalubowila)',
        categorySlug: 'hospitals-healthcare',
        address: 'Hospital Road, Kalubowila, Dehiwala-Mount Lavinia',
        district: 'Colombo',
        cityOrArea: 'Kalubowila',
        latitude: 6.8711,
        longitude: 79.8821,
        description: 'Major state teaching hospital serving southern Colombo. Features recent accessibility upgrades in the new multi-story clinical building.',
        contactPhone: '+94 11 276 3060',
        accessibilityStatus: 'COMMUNITY_REPORTED',
        lastVerifiedDate: null,
        verificationNotes: 'Reported by community users. Clinical block 2 has ramps; older psychiatric and ward paths have uneven paving stones.',
        entranceDetails: 'Main gate has ramped pedestrian lane alongside vehicle driveway.',
        rampCondition: 'Paved ramp with 1:10 slope, single metal handrail on left side.',
        numberOfSteps: 2,
        elevatorLocation: 'New Clinical Building has 2 patient elevators.',
        limitationsNotes: 'Outdoor pathways between wards have puddles during heavy monsoon rains and uneven curbs.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'NOT_AVAILABLE',
          accessibleParking: 'UNKNOWN',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'NOT_AVAILABLE',
          accessibleCounters: 'UNKNOWN',
          notes: 'Restrooms in older wings require modernization for wheelchair turn radius.'
        },
        photos: [
          { url: '/places/kalubowila-hospital.jpg', caption: 'Colombo South Teaching Hospital (Kalubowila) main clinical complex approach', isCover: true }
        ]
      },
      {
        name: 'Lady Ridgeway Hospital for Children (LRH)',
        categorySlug: 'hospitals-healthcare',
        address: 'Dr Danister De Silva Mawatha, Colombo 00800',
        district: 'Colombo',
        cityOrArea: 'Borella / Colombo 08',
        latitude: 6.9209,
        longitude: 79.8752,
        description: 'Largest pediatric hospital in Sri Lanka. Ramped entrances provided for strollers and pediatric wheelchairs at main reception.',
        contactPhone: '+94 11 269 3711',
        accessibilityStatus: 'COMMUNITY_REPORTED',
        lastVerifiedDate: null,
        verificationNotes: 'Community report awaiting physical audit. Stroller and wheelchair access confirmed at Outpatient cardiology clinic.',
        entranceDetails: 'Ramped gate entry with non-slip tiles.',
        rampCondition: 'Gentle gradient ramp with yellow edge safety indicators.',
        numberOfSteps: 0,
        elevatorLocation: 'Cardiology and neurology blocks equipped with elevators.',
        limitationsNotes: 'Very crowded corridors during peak morning clinic hours (8:00 AM – 11:30 AM).',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'NOT_AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'UNKNOWN'
        },
        photos: [
          { url: '/places/lady-ridgeway-hospital.jpg', caption: 'Lady Ridgeway Hospital for Children Borella pediatric complex entrance', isCover: true }
        ]
      },
      {
        name: 'Castle Street Hospital for Women',
        categorySlug: 'hospitals-healthcare',
        address: 'Castle Street, Colombo 00800',
        district: 'Colombo',
        cityOrArea: 'Borella / Colombo 08',
        latitude: 6.9135,
        longitude: 79.8824,
        description: 'Dedicated maternal and women healthcare hospital. Accessibility conditions are currently unassessed.',
        contactPhone: '+94 11 269 6231',
        accessibilityStatus: 'UNKNOWN',
        lastVerifiedDate: null,
        verificationNotes: 'Needs formal on-site accessibility assessment. Community inputs requested.',
        entranceDetails: 'Entrance observed to have small raised threshold curb.',
        rampCondition: 'Unknown ramp condition at front entrance.',
        numberOfSteps: 1,
        elevatorLocation: 'Elevator status unknown.',
        limitationsNotes: 'Assessment pending.',
        features: {
          stepFreeEntrance: 'UNKNOWN',
          wheelchairRamp: 'UNKNOWN',
          elevator: 'UNKNOWN',
          accessibleToilet: 'UNKNOWN',
          accessibleParking: 'UNKNOWN',
          wideDoorways: 'UNKNOWN',
          wheelchairPathways: 'UNKNOWN',
          accessibleCounters: 'UNKNOWN'
        },
        photos: [
          { url: '/places/castle-street-hospital.jpg', caption: 'Castle Street Hospital for Women Borella entrance and maternity care complex', isCover: true }
        ]
      },

      // UNIVERSITIES & EDUCATION
      {
        name: 'University of Colombo – College House (Senate Building)',
        categorySlug: 'universities-education',
        address: '94 Cumaratunga Munidasa Mawatha, Colombo 00300',
        district: 'Colombo',
        cityOrArea: 'Cinnamon Gardens / Colombo 03',
        latitude: 6.9011,
        longitude: 79.8606,
        description: 'The administrative heart of the University of Colombo, housed in a heritage colonial building with recent ground floor accessibility modifications.',
        contactPhone: '+94 11 258 1835',
        contactWebsite: 'https://cmb.ac.lk',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-07-14',
        verifiedById: adminUser.id,
        verificationNotes: 'Heritage building audited. Side entrance ramp provides step-free access to ground floor administrative desks. Upper senate chamber has no elevator.',
        entranceDetails: 'Front entrance has 5 historic stone steps. Wheelchair access is via the north courtyard ramp.',
        rampCondition: 'Smooth concrete ramp with handrails leading directly into ground floor registrar hallway.',
        numberOfSteps: 5,
        elevatorLocation: 'No elevator in this historic two-story structure.',
        limitationsNotes: 'First-floor senate room and vice chancellor meeting room are accessible only via historic wooden staircase.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'NOT_AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'NOT_AVAILABLE',
          notes: 'Ground floor staff assist with all registrar services.'
        },
        photos: [
          { url: '/places/uoc-college-house.jpg', caption: 'University of Colombo College House heritage administration building and ramp approach', isCover: true }
        ]
      },
      {
        name: 'University of Colombo – Faculty of Science Complex',
        categorySlug: 'universities-education',
        address: 'Kumaratunga Munidasa Mawatha, Colombo 00700',
        district: 'Colombo',
        cityOrArea: 'Cinnamon Gardens / Colombo 07',
        latitude: 6.9029,
        longitude: 79.8614,
        description: 'Features modern lecture theater complexes with ramped auditorium entrances and accessible chemistry & physics laboratory benches.',
        contactPhone: '+94 11 258 6424',
        contactWebsite: 'https://science.cmb.ac.lk',
        accessibilityStatus: 'COMMUNITY_REPORTED',
        lastVerifiedDate: null,
        verificationNotes: 'Student community report. Ground floor lecture halls LTH 1 and 2 are wheelchair accessible with dedicated front-row wheelchair spots.',
        entranceDetails: 'Wide ramp at main science quadrangle entrance.',
        rampCondition: 'Tiled exterior ramp, 1:12 slope with sturdy stainless steel handrails.',
        numberOfSteps: 0,
        elevatorLocation: 'New Technology building elevator accessible with student RFID or security bypass.',
        limitationsNotes: 'Older chemistry lab block lacks elevator; practical sessions are arranged on ground floor upon notice.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'UNKNOWN'
        },
        photos: [
          { url: '/places/uoc-science-faculty.jpg', caption: 'University of Colombo Faculty of Science Kumaratunga Munidasa Mawatha campus', isCover: true }
        ]
      },
      {
        name: 'University of Colombo – Main Library',
        categorySlug: 'universities-education',
        address: 'Reid Avenue, Colombo 00700',
        district: 'Colombo',
        cityOrArea: 'Cinnamon Gardens / Colombo 07',
        latitude: 6.9038,
        longitude: 79.8622,
        description: 'Multi-story central university library with Braille collection and digital screen reading facilities.',
        contactPhone: '+94 11 258 6432',
        accessibilityStatus: 'COMMUNITY_REPORTED',
        lastVerifiedDate: null,
        verificationNotes: 'Ground floor lending desk has a ramped porch. Community reported that the main reading room elevator is operational.',
        entranceDetails: 'Ramped approach beside main revolving door.',
        rampCondition: 'Concrete ramp with painted friction strips.',
        numberOfSteps: 3,
        elevatorLocation: 'Rear elevator accessing floors 1 through 4.',
        limitationsNotes: 'Aisle width between older reference book stacks is narrower than 80 cm in certain sections.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'UNKNOWN',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'NOT_AVAILABLE',
          accessibleCounters: 'AVAILABLE'
        },
        photos: [
          { url: '/places/uoc-science-faculty.jpg', caption: 'University of Colombo Main Library study commons and accessible ground entrance', isCover: true }
        ]
      },
      {
        name: 'SLIIT Metro Campus – Colombo City',
        categorySlug: 'universities-education',
        address: 'BoC Merchant Tower, St Michael\'s Rd, Colombo 00300',
        district: 'Colombo',
        cityOrArea: 'Kollupitiya / Colombo 03',
        latitude: 6.9152,
        longitude: 79.8519,
        description: 'Modern urban high-rise campus located inside BoC Merchant Tower, featuring full commercial elevator accessibility and step-free class access.',
        contactPhone: '+94 11 754 4801',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-09-02',
        verifiedById: adminUser.id,
        verificationNotes: 'Verified commercial tower accessibility. Covered drop-off, automatic sliding glass doors, 4 high capacity elevators.',
        entranceDetails: 'Zero-step entrance from tower forecourt with smooth granite flooring.',
        rampCondition: 'Level threshold, no ramp required.',
        numberOfSteps: 0,
        elevatorLocation: 'Tower core lobby, accessible floors 12 to 16.',
        limitationsNotes: 'Security turnstiles require security guard to open the wide handicap gate for wheelchair users.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'AVAILABLE'
        },
        photos: [
          { url: '/places/sliit-malabe-campus.jpg', caption: 'SLIIT Metro Campus Kollupitiya Colombo city academic facility', isCover: true }
        ]
      },

      // BANKS & FINANCIAL SERVICES
      {
        name: 'Bank of Ceylon (BOC) Head Office – BOC Tower',
        categorySlug: 'banks-financial-services',
        address: '4 Bank of Ceylon Mawatha, Colombo 00100',
        district: 'Colombo',
        cityOrArea: 'Colombo Fort / Colombo 01',
        latitude: 6.9344,
        longitude: 79.8448,
        description: 'Twin-tower landmark headquarters in Colombo Fort. Ground floor customer service lobby, corporate banking hall and ATM center.',
        contactPhone: '+94 11 244 6790',
        contactWebsite: 'https://boc.lk',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-08-11',
        verifiedById: adminUser.id,
        verificationNotes: 'Full audit of public areas. Wheelchair ramp positioned at North Entrance facing York Street. Security assists with automated door entry.',
        entranceDetails: 'Wide granite ramp with brushed steel railings at entrance.',
        rampCondition: 'Smooth gentle slope, fully sheltered from rain.',
        numberOfSteps: 0,
        elevatorLocation: '12 high-capacity elevators serving all tower levels.',
        limitationsNotes: 'ATM lobby has a small 2-inch curb; use the accessible ATM located inside the main banking branch.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'AVAILABLE',
          notes: 'Special priority teller counter for senior citizens and mobility-impaired customers.'
        },
        photos: [
          { url: '/places/boc-tower-colombo.jpg', caption: 'Bank of Ceylon (BOC) Head Office Tower Colombo Fort plaza and ramp access', isCover: true }
        ]
      },
      {
        name: 'People\'s Bank Head Office',
        categorySlug: 'banks-financial-services',
        address: '75 Sir Chittampalam A Gardiner Mawatha, Colombo 00200',
        district: 'Colombo',
        cityOrArea: 'Slave Island / Colombo 02',
        latitude: 6.9288,
        longitude: 79.8517,
        description: 'Headquarters of People\'s Bank in central Colombo. Ground banking floor features broad marble pathways and digital self-service kiosks.',
        contactPhone: '+94 11 245 8111',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-09-08',
        verifiedById: adminUser.id,
        verificationNotes: 'Verified step-free access via rear courtyard ramp and level front lobby. Accessible customer service counter at counter 01.',
        entranceDetails: 'Street level front access with non-slip tactile guiding tiles.',
        rampCondition: 'Standard 1:12 ramp with guardrails.',
        numberOfSteps: 0,
        elevatorLocation: 'Main banking foyer elevators with braille indicators.',
        limitationsNotes: 'Customer car park is frequently congested on weekday mornings.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'AVAILABLE'
        },
        photos: [
          { url: '/places/peoples-bank-head-office.jpg', caption: 'People\'s Bank Head Office facade and approach', isCover: true }
        ]
      },
      {
        name: 'Commercial Bank – Kollupitiya Branch',
        categorySlug: 'banks-financial-services',
        address: '416 Galle Road, Colombo 00300',
        district: 'Colombo',
        cityOrArea: 'Kollupitiya / Colombo 03',
        latitude: 6.9056,
        longitude: 79.8518,
        description: 'High-traffic branch on Galle Road with 24/7 automated banking machines and priority customer counters.',
        contactPhone: '+94 11 257 5275',
        accessibilityStatus: 'COMMUNITY_REPORTED',
        lastVerifiedDate: null,
        verificationNotes: 'Community contributor reported steep ramp at street sidewalk transition.',
        entranceDetails: 'Front entrance has a tiled ramp directly off Galle Road pavement.',
        rampCondition: 'Somewhat steep slope (~1:8); assistance recommended if using a manual wheelchair without push handles.',
        numberOfSteps: 2,
        elevatorLocation: 'Ground floor only branch; no elevator needed.',
        limitationsNotes: 'Heavy pedestrian footfall on Galle Road pavement makes entry turn tight.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'NOT_AVAILABLE',
          accessibleToilet: 'NOT_AVAILABLE',
          accessibleParking: 'NOT_AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'NOT_AVAILABLE'
        },
        photos: [
          { url: '/places/commercial-bank-head-office.jpg', caption: 'Commercial Bank Kollupitiya Branch Galle Road banking facility', isCover: true }
        ]
      },
      {
        name: 'Sampath Bank – Colombo Fort Branch',
        categorySlug: 'banks-financial-services',
        address: '110 Sir Baron Jayathilake Mawatha, Colombo 00100',
        district: 'Colombo',
        cityOrArea: 'Colombo Fort / Colombo 01',
        latitude: 6.9351,
        longitude: 79.8436,
        description: 'Colonial-era heritage building branch in the financial district. Accessibility information remains unconfirmed.',
        contactPhone: '+94 11 232 0262',
        accessibilityStatus: 'UNKNOWN',
        lastVerifiedDate: null,
        verificationNotes: 'Site has 4 stone steps at the front portico. Unconfirmed whether a portable ramp or rear entrance is available.',
        entranceDetails: '4 stone steps leading to double wooden doors.',
        rampCondition: 'No ramp observed at front facade.',
        numberOfSteps: 4,
        elevatorLocation: 'Unknown.',
        limitationsNotes: 'Assessment pending.',
        features: {
          stepFreeEntrance: 'NOT_AVAILABLE',
          wheelchairRamp: 'UNKNOWN',
          elevator: 'UNKNOWN',
          accessibleToilet: 'UNKNOWN',
          accessibleParking: 'NOT_AVAILABLE',
          wideDoorways: 'UNKNOWN',
          wheelchairPathways: 'UNKNOWN',
          accessibleCounters: 'UNKNOWN'
        },
        photos: [
          { url: '/places/sampath-bank-head-office.webp', caption: 'Sampath Bank Colombo Fort historic commercial banking center', isCover: true }
        ]
      },

      // GOVERNMENT OFFICES
      {
        name: 'Colombo Municipal Council (Town Hall)',
        categorySlug: 'government-offices',
        address: 'Town Hall, F. R. Senanayake Mawatha, Colombo 00700',
        district: 'Colombo',
        cityOrArea: 'Cinnamon Gardens / Colombo 07',
        latitude: 6.9147,
        longitude: 79.8664,
        description: 'The historic headquarters of the Colombo Municipal Council overlooking Viharamahadevi Park. Main administrative public services operate on the ground floor.',
        contactPhone: '+94 11 268 4290',
        contactWebsite: 'https://colombo.mc.gov.lk',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-09-22',
        verifiedById: adminUser.id,
        verificationNotes: 'On-site audit completed. Southern side entrance has a permanent concrete ramp with safety rails giving step-free entry to rates and tax payment halls.',
        entranceDetails: 'Grand front staircase has 14 steps; accessible entry is located at the South Wing portico via concrete ramp.',
        rampCondition: 'Gentle gradient concrete ramp with steel handrails and protective curbs.',
        numberOfSteps: 14,
        elevatorLocation: 'Hydraulic lift installed in 2023 for council chamber access.',
        limitationsNotes: 'Front monumental portico is stepped; visitors in wheelchairs must use the clearly signposted South Gate entrance.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'AVAILABLE',
          notes: 'Special help desk staff assist visitors with payment forms and public inquiries.'
        },
        photos: [
          { url: '/places/colombo-town-hall.jpg', caption: 'Colombo Municipal Council Town Hall iconic white facade and Viharamahadevi Park approach', isCover: true },
          { url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80', caption: 'Accessible south wing entry ramp and doorway', isCover: false }
        ]
      },
      {
        name: 'Colombo Divisional Secretariat',
        categorySlug: 'government-offices',
        address: 'Dam Street, Colombo 01200',
        district: 'Colombo',
        cityOrArea: 'Pettah / Colombo 12',
        latitude: 6.9372,
        longitude: 79.8561,
        description: 'Key divisional administration office for certificates, identity documents, and social welfare distribution in Colombo city.',
        contactPhone: '+94 11 232 5815',
        accessibilityStatus: 'COMMUNITY_REPORTED',
        lastVerifiedDate: null,
        verificationNotes: 'Community submission. Ground floor has level entrance from Dam Street courtyard. Elevator reported for senior welfare floor.',
        entranceDetails: 'Step-free courtyard gate leading to service lobby.',
        rampCondition: 'Short paved threshold ramp at entrance foyer.',
        numberOfSteps: 0,
        elevatorLocation: 'One passenger elevator near the central courtyard.',
        limitationsNotes: 'Waiting area has high visitor congestion; aisle space can be constricted during passport token distribution hours.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'UNKNOWN',
          accessibleParking: 'NOT_AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'AVAILABLE'
        },
        photos: [
          { url: '/places/colombo-town-hall.jpg', caption: 'Administrative service counters and waiting hall', isCover: true }
        ]
      },
      {
        name: 'Department of Immigration & Emigration (Suhurupaya)',
        categorySlug: 'government-offices',
        address: 'Suhurupaya, Subhuthipura Road, Battaramulla',
        district: 'Colombo',
        cityOrArea: 'Battaramulla',
        latitude: 6.8996,
        longitude: 79.9198,
        description: 'Modern administrative complex housing passport issuance, citizenship services and overseas visas. Purpose-built with universal accessibility design.',
        contactPhone: '+94 11 532 9000',
        contactWebsite: 'https://immigration.gov.lk',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-10-05',
        verifiedById: adminUser.id,
        verificationNotes: 'Comprehensive audit. Dedicated disabled parking bays directly adjacent to main elevators, low service counters at biometric capture stations.',
        entranceDetails: 'Wide automated sliding doors with flush thresholds and tactile guiding paths.',
        rampCondition: 'Spacious gently sloped external pedestrian ramps connecting parking directly to concourse.',
        numberOfSteps: 0,
        elevatorLocation: 'Bank of 8 high-capacity passenger elevators with floor voice alerts and Braille buttons.',
        limitationsNotes: 'Large building footprint; distance from visitor car park to main lobby is approximately 120 meters.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'AVAILABLE',
          notes: 'Priority token counter 01 dedicated to people with disabilities and elderly citizens.'
        },
        photos: [
          { url: '/places/peoples-bank-head-office.jpg', caption: 'Suhurupaya Administrative Complex Battaramulla', isCover: true }
        ]
      },
      {
        name: 'Sethsiripaya Administrative Complex – Stage II',
        categorySlug: 'government-offices',
        address: 'Denzil Kobbekaduwa Mawatha, Battaramulla',
        district: 'Colombo',
        cityOrArea: 'Battaramulla',
        latitude: 6.9015,
        longitude: 79.9234,
        description: 'Major governmental office tower complex housing multiple ministries and urban development authority divisions.',
        contactPhone: '+94 11 287 4000',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-08-30',
        verifiedById: adminUser.id,
        verificationNotes: 'Audited by universal design team. Step-free security foyer, compliant elevator controls, and accessible visitor restrooms on lobby level.',
        entranceDetails: 'Level entrance through security screening gates.',
        rampCondition: 'Smooth asphalt ramp from parking lot to entrance concourse.',
        numberOfSteps: 0,
        elevatorLocation: 'Central lobby elevator bank serving all 14 floors.',
        limitationsNotes: 'Security bag scanner conveyor belt has a narrow passage; security provides side lane gate for wheelchairs.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'UNKNOWN'
        },
        photos: [
          { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80', caption: 'Sethsiripaya Stage II entrance lobby', isCover: true }
        ]
      },
      {
        name: 'Supreme Court Complex of Sri Lanka',
        categorySlug: 'government-offices',
        address: 'Hulftsdorp Street, Colombo 01200',
        district: 'Colombo',
        cityOrArea: 'Hulftsdorp / Colombo 12',
        latitude: 6.9388,
        longitude: 79.8601,
        description: 'The highest court of Sri Lanka situated on Hulftsdorp hill. Historic legal complex with complex topography and varying accessibility across blocks.',
        contactPhone: '+94 11 243 5149',
        accessibilityStatus: 'UNKNOWN',
        lastVerifiedDate: null,
        verificationNotes: 'Hulftsdorp hill slope presents significant elevation changes. Specific courtroom ramps require on-site assessment before verification.',
        entranceDetails: 'Front gate has security checkpoint on a steep incline.',
        rampCondition: 'Incline road without separate pedestrian safety barrier.',
        numberOfSteps: 6,
        elevatorLocation: 'New Court of Appeal wing has elevator; historic Superior Court wing unconfirmed.',
        limitationsNotes: 'Steep hill road and uneven heritage flagstones.',
        features: {
          stepFreeEntrance: 'UNKNOWN',
          wheelchairRamp: 'UNKNOWN',
          elevator: 'UNKNOWN',
          accessibleToilet: 'UNKNOWN',
          accessibleParking: 'NOT_AVAILABLE',
          wideDoorways: 'UNKNOWN',
          wheelchairPathways: 'NOT_AVAILABLE',
          accessibleCounters: 'UNKNOWN'
        },
        photos: [
          { url: '/places/supreme-court-colombo.jpg', caption: 'Hulftsdorp Court complex entrance', isCover: true }
        ]
      },

      // SHOPPING & PUBLIC PLACES
      {
        name: 'Colombo City Centre (CCC)',
        categorySlug: 'shopping-public-places',
        address: '137 Sir James Pieris Mawatha, Colombo 00200',
        district: 'Colombo',
        cityOrArea: 'Kollupitiya / Colombo 02',
        latitude: 6.9192,
        longitude: 79.8569,
        description: 'Modern luxury retail, dining and cinema complex overlooking Beira Lake. Designed to international accessible building standards.',
        contactPhone: '+94 11 208 3000',
        contactWebsite: 'https://colombocitycentre.lk',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-10-12',
        verifiedById: adminUser.id,
        verificationNotes: 'Fully verified high-standard accessibility. Dedicated mobility parking with direct lift foyer access, step-free retail floors, cinema wheelchair bays.',
        entranceDetails: 'Wide automated revolving doors with adjacent step-free push-button automatic access door.',
        rampCondition: 'All exterior and underground parking transitions feature gentle slopes with tactile pavement.',
        numberOfSteps: 0,
        elevatorLocation: 'Multiple passenger elevator banks with braille floor buttons and voice announcements.',
        limitationsNotes: 'Lakeside promenade exit has a slight threshold drop; use the main revolving door side passage.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'AVAILABLE',
          notes: 'Complimentary visitor wheelchairs available at customer service desk on ground floor.'
        },
        photos: [
          { url: 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=1000&q=80', caption: 'Colombo City Centre main mall atrium and elevators', isCover: true },
          { url: '/places/colombo-city-centre.jpg', caption: 'Spacious accessible corridors and retail storefronts', isCover: false }
        ]
      },
      {
        name: 'One Galle Face Mall (Shangri-La Complex)',
        categorySlug: 'shopping-public-places',
        address: '1A Centre Road, Galle Face, Colombo 00200',
        district: 'Colombo',
        cityOrArea: 'Galle Face / Colombo 02',
        latitude: 6.9261,
        longitude: 79.8456,
        description: 'Largest international shopping mall in Colombo. Spans seven levels of retail, dining, supermarket, and entertainment facilities with universal accessibility.',
        contactPhone: '+94 11 786 8688',
        contactWebsite: 'https://onegalleface.com',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-10-18',
        verifiedById: adminUser.id,
        verificationNotes: 'Verified highest accessibility grade. Spacious dedicated family and handicap restrooms on every floor with emergency pull cords.',
        entranceDetails: 'Level access from Galle Face front plaza and covered taxi drop-off.',
        rampCondition: 'Smooth continuous polished marble without steps or thresholds.',
        numberOfSteps: 0,
        elevatorLocation: 'Prominent glass capsule elevators in central atrium plus service elevators in all 4 corners.',
        limitationsNotes: 'None identified. Excellent wheelchair maneuverability throughout.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'AVAILABLE',
          notes: 'Customer service desk provides mobility assistance and wheelchair loans.'
        },
        photos: [
          { url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1000&q=80', caption: 'One Galle Face Mall atrium and glass elevators', isCover: true }
        ]
      },
      {
        name: 'Galle Face Green Promenade',
        categorySlug: 'shopping-public-places',
        address: 'Galle Main Road, Colombo 00300',
        district: 'Colombo',
        cityOrArea: 'Galle Face / Colombo 03',
        latitude: 6.9238,
        longitude: 79.8441,
        description: 'Famous 500m oceanfront urban park and seaside promenade in the heart of Colombo. Popular for evening strolls and sunset views.',
        accessibilityStatus: 'COMMUNITY_REPORTED',
        lastVerifiedDate: null,
        verificationNotes: 'Community contributor assessment. Promenade path is wide and paved, but roadside pavement curbs lack drop kerbs in certain parking sections.',
        entranceDetails: 'Pedestrian access points along Galle Road. Ramp access available near Galle Face Hotel entrance.',
        rampCondition: 'Paved ramp near south roundabout; northern stairs near army camp have no ramp.',
        numberOfSteps: 3,
        elevatorLocation: 'Open outdoor public park; no elevator needed.',
        limitationsNotes: 'Lawn area has sandy and uneven turf; wheelchair users should stay on the paved sea promenade.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'NOT_AVAILABLE',
          accessibleToilet: 'NOT_AVAILABLE',
          accessibleParking: 'UNKNOWN',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'NOT_AVAILABLE',
          notes: 'Public restrooms along promenade have narrow doors and 2 entry steps.'
        },
        photos: [
          { url: '/places/galle-face-green.jpg', caption: 'Galle Face Green oceanfront promenade at sunset', isCover: true }
        ]
      },
      {
        name: 'Independence Memorial Hall & Arcade',
        categorySlug: 'shopping-public-places',
        address: 'Independence Square, Colombo 00700',
        district: 'Colombo',
        cityOrArea: 'Cinnamon Gardens / Colombo 07',
        latitude: 6.9042,
        longitude: 79.8674,
        description: 'National monument commemorating the independence of Sri Lanka, surrounded by walking tracks, green lawns and the Arcade shopping precinct.',
        accessibilityStatus: 'COMMUNITY_REPORTED',
        lastVerifiedDate: null,
        verificationNotes: 'Arcade shopping precinct has ramped courtyard entries. The main historic elevated Memorial pavilion has stone steps surrounding all sides.',
        entranceDetails: 'Paved perimeter walking paths are completely level and stroller/wheelchair friendly.',
        rampCondition: 'Arcade courtyard ramps are well-maintained with brick paving.',
        numberOfSteps: 6,
        elevatorLocation: 'Underground museum at Independence Hall has ramped tunnel entry.',
        limitationsNotes: 'The historic open-air monument hall is raised on a stone plinth with steps on all four sides with no ramp.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'NOT_AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'NOT_AVAILABLE',
          notes: 'Independence Square jogging track and Arcade shops are fully step-free.'
        },
        photos: [
          { url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80', caption: 'Independence Memorial Arcade courtyard and walking tracks', isCover: true }
        ]
      },
      {
        name: 'Viharamahadevi Park',
        categorySlug: 'shopping-public-places',
        address: 'Cinnamon Gardens, Colombo 00700',
        district: 'Colombo',
        cityOrArea: 'Cinnamon Gardens / Colombo 07',
        latitude: 6.9126,
        longitude: 79.8631,
        description: 'The oldest and largest public park in Colombo, situated opposite the Town Hall. Features botanical gardens, water fountains and paved walking loops.',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-09-10',
        verifiedById: adminUser.id,
        verificationNotes: 'Audited park perimeter and central trails. All four main gates have flush pedestrian access. Paved tracks are well surfaced.',
        entranceDetails: 'Wide open gates with no steps or turnstiles from Town Hall side and Museum side.',
        rampCondition: 'Smooth paved pathways with gentle cross-slopes for drainage.',
        numberOfSteps: 0,
        elevatorLocation: 'Open park; no elevators required.',
        limitationsNotes: 'Suspension bridge feature across pond has steps; bypass paved trail available around the lake.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'NOT_AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'NOT_AVAILABLE'
        },
        photos: [
          { url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1000&q=80', caption: 'Paved tree-lined paths in Viharamahadevi Park', isCover: true }
        ]
      },

      // RESTAURANTS & CAFES
      {
        name: 'Barefoot Garden Cafe',
        categorySlug: 'restaurants-cafes',
        address: '704 Galle Road, Colombo 00300',
        district: 'Colombo',
        cityOrArea: 'Kollupitiya / Colombo 03',
        latitude: 6.8927,
        longitude: 79.8558,
        description: 'Iconic open-air courtyard cafe, handloom textile gallery and bookstore. Known for peaceful garden atmosphere and live jazz.',
        contactPhone: '+94 11 258 9305',
        contactWebsite: 'https://barefootceylon.com',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-09-28',
        verifiedById: adminUser.id,
        verificationNotes: 'Audited garden cafe. Street entry from Galle Road has level gate. Courtyard dining tables are spaced with ample wheelchair clearance.',
        entranceDetails: 'Wide gate directly off Galle Road with smooth terracotta tiles leading to garden courtyard.',
        rampCondition: 'Short paved threshold ramp between gallery and outdoor cafe.',
        numberOfSteps: 0,
        elevatorLocation: 'Ground level venue; second floor loft gallery has stairs only.',
        limitationsNotes: 'Second-floor loft exhibition space is not wheelchair accessible (steep wooden stairs). Main cafe, bookstore, and restrooms are ground level.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'NOT_AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'NOT_AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'AVAILABLE'
        },
        photos: [
          { url: '/places/barefoot-garden-cafe.jpg', caption: 'Barefoot garden cafe open courtyard seating', isCover: true }
        ]
      },
      {
        name: 'The Gallery Café (Paradise Road)',
        categorySlug: 'restaurants-cafes',
        address: '2 Alfred House Road, Colombo 00300',
        district: 'Colombo',
        cityOrArea: 'Kollupitiya / Colombo 03',
        latitude: 6.8974,
        longitude: 79.8549,
        description: 'Renowned restaurant designed by master architect Geoffrey Bawa in his former office. Features courtyard reflection pools and art gallery.',
        contactPhone: '+94 11 258 2162',
        accessibilityStatus: 'COMMUNITY_REPORTED',
        lastVerifiedDate: null,
        verificationNotes: 'Reported by local diners. Entrance corridor has 2 low granite steps; staff provide assistance. Internal reflecting pool pathways are gravel.',
        entranceDetails: 'Two wide granite steps at Alfred House Road entrance porch.',
        rampCondition: 'No permanent ramp at front portico.',
        numberOfSteps: 2,
        elevatorLocation: 'Ground level dining venue.',
        limitationsNotes: 'Loose gravel walkways surrounding the reflection pond can pose resistance for manual wheelchairs with narrow front casters.',
        features: {
          stepFreeEntrance: 'NOT_AVAILABLE',
          wheelchairRamp: 'NOT_AVAILABLE',
          elevator: 'NOT_AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'UNKNOWN',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'NOT_AVAILABLE',
          accessibleCounters: 'UNKNOWN'
        },
        photos: [
          { url: '/places/the-gallery-cafe-colombo.webp', caption: 'Courtyard dining pavilion and reflection pool', isCover: true }
        ]
      },
      {
        name: 'Department of Coffee',
        categorySlug: 'restaurants-cafes',
        address: '10A Philip Gunawardena Mawatha, Colombo 00700',
        district: 'Colombo',
        cityOrArea: 'Cinnamon Gardens / Colombo 07',
        latitude: 6.9068,
        longitude: 79.8655,
        description: 'Specialty artisan coffee bar with open workspace environment, wide doorways and level concrete floor transitions.',
        contactPhone: '+94 11 268 0080',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-10-01',
        verifiedById: adminUser.id,
        verificationNotes: 'Ground floor cafe inspected. Step-free access from private parking slots directly to cafe sliding doors.',
        entranceDetails: 'Flush transition with sliding glass entrance.',
        rampCondition: 'Level ground, zero steps.',
        numberOfSteps: 0,
        elevatorLocation: 'Single-story building.',
        limitationsNotes: 'Restroom door is 75 cm wide, which may be tight for wide motorized chairs.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'NOT_AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'AVAILABLE'
        },
        photos: [
          { url: '/places/colombo-city-centre.jpg', caption: 'Artisan coffee bar seating and wide aisles', isCover: true }
        ]
      },
      {
        name: 'Java Lounge – Bambalapitiya',
        categorySlug: 'restaurants-cafes',
        address: '498 Galle Road, Colombo 00400',
        district: 'Colombo',
        cityOrArea: 'Bambalapitiya / Colombo 04',
        latitude: 6.8921,
        longitude: 79.8542,
        description: 'Popular coffeehouse chain branch on Galle Road. Status currently unknown.',
        contactPhone: '+94 11 250 8880',
        accessibilityStatus: 'UNKNOWN',
        lastVerifiedDate: null,
        verificationNotes: 'Needs verification. Observed 3 front steps from Galle Road pavement.',
        entranceDetails: '3 ceramic tile steps leading up from pavement.',
        rampCondition: 'No ramp visible.',
        numberOfSteps: 3,
        elevatorLocation: 'Unknown.',
        limitationsNotes: 'Physical assessment pending.',
        features: {
          stepFreeEntrance: 'NOT_AVAILABLE',
          wheelchairRamp: 'UNKNOWN',
          elevator: 'UNKNOWN',
          accessibleToilet: 'UNKNOWN',
          accessibleParking: 'NOT_AVAILABLE',
          wideDoorways: 'UNKNOWN',
          wheelchairPathways: 'UNKNOWN',
          accessibleCounters: 'UNKNOWN'
        },
        photos: [
          { url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80', caption: 'Coffee shop exterior on Galle Road', isCover: true }
        ]
      },

      // HOTELS & ACCOMMODATION
      {
        name: 'Galle Face Hotel',
        categorySlug: 'hotels-accommodation',
        address: '2 Galle Road, Colombo 00300',
        district: 'Colombo',
        cityOrArea: 'Galle Face / Colombo 03',
        latitude: 6.9202,
        longitude: 79.8447,
        description: 'Historic luxury heritage hotel established in 1864 facing the Indian Ocean. Grand colonial architecture with ramped side entrances and elevators.',
        contactPhone: '+94 11 254 1010',
        contactWebsite: 'https://gallefacehotel.com',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-09-18',
        verifiedById: adminUser.id,
        verificationNotes: 'Heritage audit completed. North porch ramp provides seamless access into the grand lobby and museum corridors. Historic elevators fitted with braille controls.',
        entranceDetails: 'North driveway entrance features a dedicated ramp leading directly to the front reception foyer.',
        rampCondition: 'Gentle 1:14 slope with ornate heritage brass handrails.',
        numberOfSteps: 0,
        elevatorLocation: 'Historic lifts in both Classic and Regency wings.',
        limitationsNotes: 'The historic sea-spray wooden verandah has a single 4-inch step; portable ramp available upon request from concierge.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'AVAILABLE',
          notes: 'Dedicated accessible oceanfront rooms with roll-in showers available.'
        },
        photos: [
          { url: '/places/galle-face-hotel.jpg', caption: 'Galle Face Hotel grand colonial entrance and ocean porch', isCover: true }
        ]
      },
      {
        name: 'Cinnamon Grand Colombo',
        categorySlug: 'hotels-accommodation',
        address: '77 Galle Road, Colombo 00300',
        district: 'Colombo',
        cityOrArea: 'Kollupitiya / Colombo 03',
        latitude: 6.9168,
        longitude: 79.8495,
        description: 'Five-star business and convention hotel connected to Crescat Boulevard shopping center. Comprehensive accessibility features throughout banquet and dining halls.',
        contactPhone: '+94 11 243 7437',
        contactWebsite: 'https://cinnamonhotels.com',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-10-08',
        verifiedById: adminUser.id,
        verificationNotes: 'Full universal access confirmed. Valet drop-off with wheelchair assistance, step-free access to all 14 restaurants and banquet halls.',
        entranceDetails: 'Spacious porte-cochere drop-off with automatic sliding glass doors.',
        rampCondition: 'Level marble flooring throughout public spaces.',
        numberOfSteps: 0,
        elevatorLocation: 'Six central lobby elevators with clear voice enunciators and tactile keypads.',
        limitationsNotes: 'Outdoor poolside garden terrace has 2 decorative steps; accessible ramp path around through Coffee Stop.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'AVAILABLE'
        },
        photos: [
          { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80', caption: 'Cinnamon Grand grand atrium lobby', isCover: true }
        ]
      },
      {
        name: 'The Kingsbury Colombo',
        categorySlug: 'hotels-accommodation',
        address: '48 Janadhipathi Mawatha, Colombo 00100',
        district: 'Colombo',
        cityOrArea: 'Colombo Fort / Colombo 01',
        latitude: 6.9366,
        longitude: 79.8422,
        description: 'Five-star waterfront hotel in Colombo Fort overlooking the harbor and port city development.',
        contactPhone: '+94 11 242 1221',
        accessibilityStatus: 'COMMUNITY_REPORTED',
        lastVerifiedDate: null,
        verificationNotes: 'Community verified. Level driveway access, multiple elevator banks, wide restaurant aisles.',
        entranceDetails: 'Step-free front entrance with revolving door and side accessible swing door.',
        rampCondition: 'Smooth paving with non-skid treatments.',
        numberOfSteps: 0,
        elevatorLocation: 'Main tower elevators serving all guest floors and rooftop Sky Lounge.',
        limitationsNotes: 'Rooftop sky lounge has one raised bar section with steps; lower lounge area is completely level.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'UNKNOWN'
        },
        photos: [
          { url: '/places/the-kingsbury-colombo.jpg', caption: 'The Kingsbury waterfront facade and porte-cochere', isCover: true }
        ]
      },
      {
        name: 'Shangri-La Colombo',
        categorySlug: 'hotels-accommodation',
        address: '1 Galle Face, Colombo 00200',
        district: 'Colombo',
        cityOrArea: 'Galle Face / Colombo 02',
        latitude: 6.9275,
        longitude: 79.8449,
        description: 'Ultra-luxury modern hotel property located on Galle Face Green with state-of-the-art accessibility provisions.',
        contactPhone: '+94 11 788 8888',
        accessibilityStatus: 'VERIFIED',
        lastVerifiedDate: '2026-10-14',
        verifiedById: adminUser.id,
        verificationNotes: 'Fully audited. Built to top international universal accessibility codes. Zero threshold barriers from vehicle arrival to suites.',
        entranceDetails: 'Wide automated doors, zero grade transitions.',
        rampCondition: 'Flush transitions everywhere.',
        numberOfSteps: 0,
        elevatorLocation: 'Eight main guest elevators plus dedicated accessible service lifts.',
        limitationsNotes: 'None.',
        features: {
          stepFreeEntrance: 'AVAILABLE',
          wheelchairRamp: 'AVAILABLE',
          elevator: 'AVAILABLE',
          accessibleToilet: 'AVAILABLE',
          accessibleParking: 'AVAILABLE',
          wideDoorways: 'AVAILABLE',
          wheelchairPathways: 'AVAILABLE',
          accessibleCounters: 'AVAILABLE'
        },
        photos: [
          { url: '/places/shangri-la-colombo.jpg', caption: 'Shangri-La Colombo grand driveway and lobby concourse', isCover: true }
        ]
      }
    ];

    for (const placeItem of placesData) {
      const categoryId = categoryMap[placeItem.categorySlug];
      const createdPlace = await Place.create({
        name: placeItem.name,
        categoryId,
        address: placeItem.address,
        district: placeItem.district,
        cityOrArea: placeItem.cityOrArea,
        latitude: placeItem.latitude,
        longitude: placeItem.longitude,
        description: placeItem.description,
        contactPhone: placeItem.contactPhone || null,
        contactEmail: placeItem.contactEmail || null,
        contactWebsite: placeItem.contactWebsite || null,
        accessibilityStatus: placeItem.accessibilityStatus,
        approvalStatus: 'APPROVED',
        lastVerifiedDate: placeItem.lastVerifiedDate || null,
        verifiedById: placeItem.verifiedById || null,
        verificationNotes: placeItem.verificationNotes || null,
        entranceDetails: placeItem.entranceDetails || null,
        rampCondition: placeItem.rampCondition || null,
        numberOfSteps: placeItem.numberOfSteps || 0,
        elevatorLocation: placeItem.elevatorLocation || null,
        limitationsNotes: placeItem.limitationsNotes || null,
        submittedById: adminUser.id,
        isDemoData: true // Labeled clearly as demonstration data per prompt!
      });

      // Accessibility Features
      await AccessibilityFeature.create({
        placeId: createdPlace.id,
        stepFreeEntrance: placeItem.features.stepFreeEntrance,
        wheelchairRamp: placeItem.features.wheelchairRamp,
        elevator: placeItem.features.elevator,
        accessibleToilet: placeItem.features.accessibleToilet,
        accessibleParking: placeItem.features.accessibleParking,
        wideDoorways: placeItem.features.wideDoorways,
        wheelchairPathways: placeItem.features.wheelchairPathways,
        accessibleCounters: placeItem.features.accessibleCounters,
        featureNotes: placeItem.features.notes || null
      });

      // Photographs
      if (placeItem.photos && placeItem.photos.length > 0) {
        for (const photo of placeItem.photos) {
          await Photograph.create({
            placeId: createdPlace.id,
            url: photo.url,
            caption: photo.caption,
            uploadedById: adminUser.id,
            isCover: photo.isCover
          });
        }
      }
    }

    // 4. Create a couple of Pending Submissions to showcase Admin Review workflow!
    console.log('[Seed] Creating sample pending place submissions for admin moderation demo...');
    const pendingPlace1 = await Place.create({
      name: 'Nawaloka Hospital Specialist Center',
      categoryId: categoryMap['hospitals-healthcare'],
      address: '23 Deshamanya H. K. Dharmadasa Mawatha, Colombo 00200',
      district: 'Colombo',
      cityOrArea: 'Slave Island / Colombo 02',
      latitude: 6.9234,
      longitude: 79.8552,
      description: 'Newly constructed multi-story outpatient specialist center with automated wheelchair lifts.',
      contactPhone: '+94 11 557 7111',
      accessibilityStatus: 'COMMUNITY_REPORTED',
      approvalStatus: 'PENDING', // Awaiting admin approval
      submittedById: user1.id,
      isDemoData: true,
      entranceDetails: 'Wide ramp with non-slip tiles and dual automatic sliding doors.',
      rampCondition: 'Modern 1:12 ramp with stainless steel handrails.',
      numberOfSteps: 0,
      elevatorLocation: 'Four high-speed glass elevators in center lobby.'
    });

    await AccessibilityFeature.create({
      placeId: pendingPlace1.id,
      stepFreeEntrance: 'AVAILABLE',
      wheelchairRamp: 'AVAILABLE',
      elevator: 'AVAILABLE',
      accessibleToilet: 'AVAILABLE',
      accessibleParking: 'AVAILABLE',
      wideDoorways: 'AVAILABLE',
      wheelchairPathways: 'AVAILABLE',
      accessibleCounters: 'AVAILABLE'
    });

    await Photograph.create({
      placeId: pendingPlace1.id,
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Nawaloka Specialist Center entrance',
      uploadedById: user1.id,
      isCover: true
    });

    // 5. Create sample Accessibility Reports (Moderation queue demo)
    console.log('[Seed] Creating sample accessibility reports...');
    const nhslPlace = await Place.findOne({ where: { name: { [require('sequelize').Op.like]: '%NHSL%' } } });
    if (nhslPlace) {
      await AccessibilityReport.create({
        placeId: nhslPlace.id,
        userId: user1.id,
        reportType: 'UPDATE_FEATURES',
        featureName: 'Accessible Counters',
        reportedStatus: 'AVAILABLE',
        description: 'New low-height service counter opened at Clinic 07 for wheelchair users.',
        status: 'PENDING'
      });

      await AccessibilityReport.create({
        placeId: nhslPlace.id,
        userId: user2.id,
        reportType: 'REPORT_INCORRECT_INFO',
        featureName: 'Accessible Parking',
        reportedStatus: 'NOT_AVAILABLE',
        description: 'Two accessible parking slots were temporarily blocked by construction materials for the new MRI suite.',
        status: 'PENDING'
      });
    }

    // 6. Moderation Log records
    console.log('[Seed] Creating moderation audit logs...');
    await ModerationLog.create({
      action: 'SYSTEM_SEED',
      targetType: 'system',
      targetId: 1,
      adminId: adminUser.id,
      details: 'Initialized Colombo Pilot Project baseline dataset with candidate locations across 7 key urban categories.'
    });

    console.log('[Seed] Database successfully seeded with Colombo Pilot accessibility data!');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('[Seed] Process finished.');
    process.exit(0);
  });
}

module.exports = seedDatabase;

