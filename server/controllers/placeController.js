const { Op } = require('sequelize');
const { Place, Category, Organization, AccessibilityFeature, Photograph, User, AccessibilityReport } = require('../models');
const { calculatePersonalMatch } = require('../services/accessibilityMatchService');
const { analyzeTransportConnections } = require('../services/transportService');

// Limited Sample Places Preview (Public for homepage, max 3 sample places)
exports.getSamplePreviewPlaces = async (req, res) => {
  try {
    const places = await Place.findAll({
      where: { approvalStatus: 'APPROVED' },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'iconName']
        },
        {
          model: AccessibilityFeature,
          as: 'accessibilityFeature',
          attributes: ['wheelchairRamp', 'stepFreeEntrance', 'elevator', 'accessibleToilet', 'accessibleParking']
        },
        {
          model: Photograph,
          as: 'photographs',
          attributes: ['id', 'url', 'caption', 'isCover']
        }
      ],
      order: [['lastVerifiedDate', 'DESC NULLS LAST'], ['createdAt', 'DESC']],
      limit: 3
    });

    return res.json({
      success: true,
      count: places.length,
      isSamplePreview: true,
      message: 'Sample place previews. Register or sign in to explore all places, interactive maps, and complete accessibility audits.',
      places
    });
  } catch (error) {
    console.error('getSamplePreviewPlaces error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve sample previews.', error: error.message });
  }
};

// Get places with rich filters, organization relations, and pagination
exports.getPlaces = async (req, res) => {
  try {
    const {
      search,
      categoryId,
      categorySlug,
      status,
      cityOrArea,
      area,
      district,
      organizationId,
      organizationSlug,
      institutionType,
      stepFreeEntrance,
      wheelchairRamp,
      elevator,
      accessibleToilet,
      accessibleParking,
      wideDoorways,
      wheelchairPathways,
      accessibleCounters,
      sortBy,
      page,
      limit
    } = req.query;

    const where = {
      approvalStatus: 'APPROVED'
    };

    const targetArea = area || cityOrArea;

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike ? Op.iLike : Op.like]: `%${search}%` } },
        { branchName: { [Op.iLike ? Op.iLike : Op.like]: `%${search}%` } },
        { address: { [Op.iLike ? Op.iLike : Op.like]: `%${search}%` } },
        { cityOrArea: { [Op.iLike ? Op.iLike : Op.like]: `%${search}%` } },
        { description: { [Op.iLike ? Op.iLike : Op.like]: `%${search}%` } }
      ];
    }

    if (status && ['VERIFIED', 'COMMUNITY_REPORTED', 'UNKNOWN', 'NOT_YET_ASSESSED'].includes(status)) {
      where.accessibilityStatus = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (organizationId) {
      where.organizationId = organizationId;
    }

    if (institutionType) {
      where.institutionType = institutionType;
    }

    if (targetArea) {
      where.cityOrArea = { [Op.iLike ? Op.iLike : Op.like]: `%${targetArea}%` };
    }

    if (district) {
      where.district = district;
    }

    // Category filter by slug if provided
    const categoryInclude = {
      model: Category,
      as: 'category',
      attributes: ['id', 'name', 'slug', 'iconName']
    };

    if (categorySlug) {
      categoryInclude.where = { slug: categorySlug };
    }

    // Parent Organization Include
    const organizationInclude = {
      model: Organization,
      as: 'organization',
      attributes: ['id', 'name', 'code', 'sector', 'website', 'logoUrl']
    };

    if (organizationSlug) {
      organizationInclude.where = { code: organizationSlug };
      organizationInclude.required = true;
    }

    // Accessibility Feature conditions
    const featureWhere = {};
    if (stepFreeEntrance) featureWhere.stepFreeEntrance = stepFreeEntrance;
    if (wheelchairRamp) featureWhere.wheelchairRamp = wheelchairRamp;
    if (elevator) featureWhere.elevator = elevator;
    if (accessibleToilet) featureWhere.accessibleToilet = accessibleToilet;
    if (accessibleParking) featureWhere.accessibleParking = accessibleParking;
    if (wideDoorways) featureWhere.wideDoorways = wideDoorways;
    if (wheelchairPathways) featureWhere.wheelchairPathways = wheelchairPathways;
    if (accessibleCounters) featureWhere.accessibleCounters = accessibleCounters;

    const featureInclude = {
      model: AccessibilityFeature,
      as: 'accessibilityFeature'
    };

    if (Object.keys(featureWhere).length > 0) {
      featureInclude.where = featureWhere;
      featureInclude.required = true;
    }

    // Sorting
    let order = [['createdAt', 'DESC']];
    if (sortBy === 'name_asc') order = [['name', 'ASC']];
    if (sortBy === 'name_desc') order = [['name', 'DESC']];
    if (sortBy === 'verified') order = [['lastVerifiedDate', 'DESC NULLS LAST'], ['createdAt', 'DESC']];

    const places = await Place.findAll({
      where,
      include: [
        categoryInclude,
        organizationInclude,
        featureInclude,
        {
          model: Photograph,
          as: 'photographs',
          attributes: ['id', 'url', 'caption', 'isCover']
        },
        {
          model: User,
          as: 'submitter',
          attributes: ['id', 'fullName', 'avatarUrl']
        },
        {
          model: User,
          as: 'verifier',
          attributes: ['id', 'fullName']
        }
      ],
      order
    });

    // Evaluate personal match & transport summary for each place
    const mobilityProfile = req.query.mobilityProfile || (req.user ? req.user.mobilityProfile : 'manual_wheelchair');
    const enrichedPlaces = places.map((p) => {
      const pJson = p.toJSON();
      const match = calculatePersonalMatch(pJson, mobilityProfile);
      const transport = analyzeTransportConnections(pJson);
      return {
        ...pJson,
        personalMatch: {
          score: match.matchScore,
          verdict: match.verdict,
          label: match.verdictLabel,
          badgeColor: match.badgeColor,
          criticalMetCount: match.criticalMetCount,
          criticalTotalCount: match.criticalTotalCount
        },
        transportSummary: transport ? {
          score: transport.transitScore,
          nearestBusStop: transport.nearestBus ? transport.nearestBus.name : null,
          nearestBusDistance: transport.nearestBus ? transport.nearestBus.formattedDistance : null,
          nearestRailStation: transport.nearestRail ? transport.nearestRail.name : null,
          nearestRailDistance: transport.nearestRail ? transport.nearestRail.formattedDistance : null,
          curbRampStatus: transport.corridor ? transport.corridor.curbRampStatus : 'MODERATE'
        } : null
      };
    });

    if (sortBy === 'personal_match') {
      enrichedPlaces.sort((a, b) => b.personalMatch.score - a.personalMatch.score);
    } else if (sortBy === 'transit_connectivity') {
      enrichedPlaces.sort((a, b) => (b.transportSummary?.score || 0) - (a.transportSummary?.score || 0));
    }

    let pagedPlaces = enrichedPlaces;
    const totalCount = enrichedPlaces.length;
    let pageNumber = 1;
    let pageSize = totalCount;
    let totalPages = 1;

    if (limit) {
      pageSize = parseInt(limit, 10) || 12;
      pageNumber = parseInt(page, 10) || 1;
      totalPages = Math.ceil(totalCount / pageSize) || 1;
      const startIndex = (pageNumber - 1) * pageSize;
      pagedPlaces = enrichedPlaces.slice(startIndex, startIndex + pageSize);
    }

    return res.json({
      success: true,
      count: pagedPlaces.length,
      totalCount,
      totalPages,
      currentPage: pageNumber,
      pageSize,
      places: pagedPlaces
    });
  } catch (error) {
    console.error('getPlaces error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve places.', error: error.message });
  }
};

// Get single place details
exports.getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;

    const place = await Place.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category'
        },
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name', 'code', 'sector', 'website', 'contactPhone', 'contactEmail', 'headquartersAddress', 'logoUrl', 'dataSource']
        },
        {
          model: AccessibilityFeature,
          as: 'accessibilityFeature'
        },
        {
          model: Photograph,
          as: 'photographs',
          include: [
            {
              model: User,
              as: 'uploader',
              attributes: ['id', 'fullName', 'avatarUrl']
            }
          ]
        },
        {
          model: User,
          as: 'submitter',
          attributes: ['id', 'fullName', 'avatarUrl', 'contributionCount']
        },
        {
          model: User,
          as: 'verifier',
          attributes: ['id', 'fullName']
        },
        {
          model: AccessibilityReport,
          as: 'reports',
          required: false,
          include: [
            {
              model: User,
              as: 'reporter',
              attributes: ['id', 'fullName', 'avatarUrl']
            },
            {
              model: User,
              as: 'reviewer',
              attributes: ['id', 'fullName']
            }
          ]
        }
      ],
      order: [
        [{ model: AccessibilityReport, as: 'reports' }, 'createdAt', 'DESC']
      ]
    });

    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }

    // Calculate transparent & documented scorecard metrics
    const featureKeys = [
      'stepFreeEntrance',
      'wheelchairRamp',
      'elevator',
      'accessibleToilet',
      'accessibleParking',
      'wideDoorways',
      'wheelchairPathways',
      'accessibleCounters'
    ];

    const featureLabels = {
      stepFreeEntrance: 'Wheelchair-accessible entrance',
      wheelchairRamp: 'Ramp availability',
      elevator: 'Elevator availability',
      accessibleToilet: 'Accessible toilet',
      accessibleParking: 'Accessible parking',
      wideDoorways: 'Wide entrance and doorways',
      wheelchairPathways: 'Wheelchair-friendly pathways',
      accessibleCounters: 'Accessible service counters'
    };

    const featuresObj = place.accessibilityFeature ? place.accessibilityFeature.toJSON() : {};
    let availableCount = 0;
    let notAvailableCount = 0;
    let unknownCount = 0;
    let needsVerificationCount = 0;

    const breakdown = featureKeys.map((key) => {
      const rawStatus = (featuresObj[key] || 'UNKNOWN').toUpperCase();
      let status = 'UNKNOWN';
      let points = 0;
      if (rawStatus === 'AVAILABLE') {
        status = 'AVAILABLE';
        points = 1.0;
        availableCount++;
      } else if (rawStatus === 'NOT_AVAILABLE') {
        status = 'NOT_AVAILABLE';
        points = 0;
        notAvailableCount++;
      } else if (rawStatus === 'NEEDS_VERIFICATION') {
        status = 'NEEDS_VERIFICATION';
        points = 0.5;
        needsVerificationCount++;
      } else {
        status = 'UNKNOWN';
        points = 0;
        unknownCount++;
      }

      return {
        key,
        label: featureLabels[key],
        status,
        points,
        description: rawStatus === 'AVAILABLE'
          ? 'Confirmed accessible & functional'
          : rawStatus === 'NOT_AVAILABLE'
            ? 'Not accessible or absent'
            : rawStatus === 'NEEDS_VERIFICATION'
              ? 'Reported by community, pending physical audit'
              : 'No verification or report on file'
      };
    });

    // Documented Transparent Formula:
    // Available features grant 1.0 point
    // Needs Verification grants 0.5 point
    // Unknown or Not Available grants 0 points (never reward missing information!)
    const pointsEarned = availableCount * 1.0 + needsVerificationCount * 0.5;
    const accessibilityScore = Math.round((pointsEarned / 8) * 100);
    const dataCompleteness = Math.round(((8 - unknownCount) / 8) * 100);

    // Group reports for barrier tracking and audit update history
    const allReports = place.reports || [];
    const activeBarriers = allReports.filter((r) =>
      ['SUBMITTED', 'UNDER_REVIEW', 'CONFIRMED', 'PENDING'].includes(r.status) &&
      (r.reportType === 'BARRIER_REPORT' || r.barrierType)
    );
    const resolvedBarriers = allReports.filter((r) =>
      ['RESOLVED', 'APPROVED'].includes(r.status) &&
      (r.reportType === 'BARRIER_REPORT' || r.barrierType)
    );
    const updatesHistory = allReports.filter((r) =>
      ['APPROVED', 'RESOLVED', 'CONFIRMED'].includes(r.status)
    );

    // Calculate Personal Accessibility Match
    const userMobilityProfile = req.query.profileType || (req.user ? req.user.mobilityProfile : 'manual_wheelchair');
    const personalMatch = calculatePersonalMatch(place, userMobilityProfile);

    // Calculate Accessible Transport Connections & Last-Mile Corridor
    const transportConnections = analyzeTransportConnections(place);

    // Fetch sibling branches if part of an organisation
    let siblingBranches = [];
    if (place.organizationId) {
      siblingBranches = await Place.findAll({
        where: {
          organizationId: place.organizationId,
          id: { [Op.ne]: place.id },
          approvalStatus: 'APPROVED'
        },
        attributes: ['id', 'name', 'branchName', 'cityOrArea', 'address', 'accessibilityStatus'],
        limit: 8
      });
    }

    return res.json({
      success: true,
      place,
      siblingBranches,
      scorecard: {
        totalFeatures: 8,
        availableCount,
        notAvailableCount,
        unknownCount,
        needsVerificationCount,
        pointsEarned,
        accessibilityScore,
        dataCompleteness,
        scoreFormula: 'Score = (Available [1.0] + Needs Verification [0.5]) / 8 total assessed features * 100%. Unknown features yield 0 points.',
        breakdown
      },
      personalMatch,
      transportConnections,
      activeBarriers,
      resolvedBarriers,
      updatesHistory
    });
  } catch (error) {
    console.error('getPlaceById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve place details.', error: error.message });
  }
};

// Submit a new place (starts as PENDING for review)
exports.submitPlace = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      address,
      district,
      cityOrArea,
      latitude,
      longitude,
      description,
      contactPhone,
      contactEmail,
      contactWebsite,
      entranceDetails,
      rampCondition,
      numberOfSteps,
      elevatorLocation,
      limitationsNotes,
      // 8 features
      stepFreeEntrance,
      wheelchairRamp,
      elevator,
      accessibleToilet,
      accessibleParking,
      wideDoorways,
      wheelchairPathways,
      accessibleCounters,
      featureNotes,
      photoUrls // stringified array or array of URLs
    } = req.body;

    if (!name || !categoryId || !address || !cityOrArea || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide place name, category, address, city/area, and map coordinates.'
      });
    }

    // Determine initial status:
    // User submissions are COMMUNITY_REPORTED with PENDING approval status
    const userId = req.user ? req.user.id : null;

    const newPlace = await Place.create({
      name: name.trim(),
      categoryId: parseInt(categoryId),
      address: address.trim(),
      district: district || 'Colombo',
      cityOrArea: cityOrArea.trim(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      description: description ? description.trim() : null,
      contactPhone: contactPhone ? contactPhone.trim() : null,
      contactEmail: contactEmail ? contactEmail.trim() : null,
      contactWebsite: contactWebsite ? contactWebsite.trim() : null,
      entranceDetails: entranceDetails ? entranceDetails.trim() : null,
      rampCondition: rampCondition ? rampCondition.trim() : null,
      numberOfSteps: numberOfSteps ? parseInt(numberOfSteps) : 0,
      elevatorLocation: elevatorLocation ? elevatorLocation.trim() : null,
      limitationsNotes: limitationsNotes ? limitationsNotes.trim() : null,
      accessibilityStatus: 'COMMUNITY_REPORTED', // community submissions start here
      approvalStatus: 'PENDING', // Prompt requirement: "New submissions must not immediately become verified. They should enter a pending review process."
      submittedById: userId,
      isDemoData: false
    });

    // Create AccessibilityFeature record
    await AccessibilityFeature.create({
      placeId: newPlace.id,
      stepFreeEntrance: stepFreeEntrance || 'UNKNOWN',
      wheelchairRamp: wheelchairRamp || 'UNKNOWN',
      elevator: elevator || 'UNKNOWN',
      accessibleToilet: accessibleToilet || 'UNKNOWN',
      accessibleParking: accessibleParking || 'UNKNOWN',
      wideDoorways: wideDoorways || 'UNKNOWN',
      wheelchairPathways: wheelchairPathways || 'UNKNOWN',
      accessibleCounters: accessibleCounters || 'UNKNOWN',
      featureNotes: featureNotes || null
    });

    // Handle uploaded file images from multer if any
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        await Photograph.create({
          placeId: newPlace.id,
          url: `/uploads/${file.filename}`,
          caption: `Photo of ${newPlace.name}`,
          uploadedById: userId,
          isCover: i === 0
        });
      }
    }

    // Handle photoUrls passed as strings or json
    if (photoUrls) {
      let urls = [];
      if (Array.isArray(photoUrls)) {
        urls = photoUrls;
      } else if (typeof photoUrls === 'string') {
        try {
          urls = JSON.parse(photoUrls);
        } catch {
          urls = [photoUrls];
        }
      }

      for (let i = 0; i < urls.length; i++) {
        if (urls[i] && urls[i].trim()) {
          await Photograph.create({
            placeId: newPlace.id,
            url: urls[i].trim(),
            caption: `Photo of ${newPlace.name}`,
            uploadedById: userId,
            isCover: !req.files || req.files.length === 0 ? i === 0 : false
          });
        }
      }
    }

    // Increment user contribution count
    if (userId) {
      await User.increment('contributionCount', { by: 1, where: { id: userId } });
    }

    return res.status(201).json({
      success: true,
      message: 'Place submitted successfully! It has entered the verification queue and will appear publicly once approved by moderators.',
      place: newPlace
    });
  } catch (error) {
    console.error('submitPlace error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit place.', error: error.message });
  }
};

// Upload additional photos for a place
exports.uploadPlacePhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findByPk(id);

    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }

    const userId = req.user ? req.user.id : null;
    const addedPhotos = [];
    const facilityType = req.body.facilityType || 'GENERAL';

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const photo = await Photograph.create({
          placeId: place.id,
          url: `/uploads/${file.filename}`,
          caption: req.body.caption || `Accessibility evidence photograph of ${place.name}`,
          facilityType,
          isVerifiedEvidence: req.user && req.user.role === 'admin',
          verifiedAt: req.user && req.user.role === 'admin' ? new Date() : null,
          uploadedById: userId,
          isCover: false
        });
        addedPhotos.push(photo);
      }
    }

    if (req.body.photoUrl) {
      const photo = await Photograph.create({
        placeId: place.id,
        url: req.body.photoUrl,
        caption: req.body.caption || `Accessibility evidence photograph of ${place.name}`,
        facilityType,
        isVerifiedEvidence: req.user && req.user.role === 'admin',
        verifiedAt: req.user && req.user.role === 'admin' ? new Date() : null,
        uploadedById: userId,
        isCover: false
      });
      addedPhotos.push(photo);
    }

    if (userId && addedPhotos.length > 0) {
      await User.increment('contributionCount', { by: 1, where: { id: userId } });
    }

    return res.status(201).json({
      success: true,
      message: `${addedPhotos.length} photo(s) added successfully.`,
      photos: addedPhotos
    });
  } catch (error) {
    console.error('uploadPlacePhotos error:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload photos.', error: error.message });
  }
};

// Get all categories with place counts
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['displayOrder', 'ASC'], ['name', 'ASC']]
    });

    // Compute active place counts for each
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Place.count({
          where: {
            categoryId: cat.id,
            approvalStatus: 'APPROVED'
          }
        });
        return {
          ...cat.toJSON(),
          placeCount: count
        };
      })
    );

    return res.json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    console.error('getCategories error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load categories.', error: error.message });
  }
};

// Compare two places side by side (Phase 2 feature)
exports.comparePlaces = async (req, res) => {
  try {
    const { place1: id1, place2: id2 } = req.query;

    if (!id1 || !id2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both place1 and place2 IDs to compare.'
      });
    }

    const [p1, p2] = await Promise.all([
      Place.findByPk(id1, {
        include: [
          { model: Category, as: 'category' },
          { model: AccessibilityFeature, as: 'accessibilityFeature' },
          { model: Photograph, as: 'photographs' }
        ]
      }),
      Place.findByPk(id2, {
        include: [
          { model: Category, as: 'category' },
          { model: AccessibilityFeature, as: 'accessibilityFeature' },
          { model: Photograph, as: 'photographs' }
        ]
      })
    ]);

    if (!p1 || !p2) {
      return res.status(404).json({
        success: false,
        message: 'One or both places could not be found.'
      });
    }

    const featureKeys = [
      { key: 'stepFreeEntrance', label: 'Entrance Accessibility / Step-free' },
      { key: 'wheelchairRamp', label: 'Ramps Availability' },
      { key: 'elevator', label: 'Elevators / Lifts' },
      { key: 'accessibleToilet', label: 'Accessible Toilets' },
      { key: 'accessibleParking', label: 'Accessible Parking' },
      { key: 'wideDoorways', label: 'Doorways & Corridors' },
      { key: 'wheelchairPathways', label: 'Wheelchair Pathways' },
      { key: 'accessibleCounters', label: 'Accessible Service Counters' }
    ];

    const calculateScorecard = (place) => {
      const f = place.accessibilityFeature ? place.accessibilityFeature.toJSON() : {};
      let available = 0, notAvailable = 0, unknown = 0, needsVerification = 0;
      featureKeys.forEach(({ key }) => {
        const val = (f[key] || 'UNKNOWN').toUpperCase();
        if (val === 'AVAILABLE') available++;
        else if (val === 'NOT_AVAILABLE') notAvailable++;
        else if (val === 'NEEDS_VERIFICATION') needsVerification++;
        else unknown++;
      });
      const score = Math.round(((available * 1.0 + needsVerification * 0.5) / 8) * 100);
      const completeness = Math.round(((8 - unknown) / 8) * 100);
      return { score, completeness, available, notAvailable, unknown, needsVerification };
    };

    const scorecard1 = calculateScorecard(p1);
    const scorecard2 = calculateScorecard(p2);

    const f1 = p1.accessibilityFeature ? p1.accessibilityFeature.toJSON() : {};
    const f2 = p2.accessibilityFeature ? p2.accessibilityFeature.toJSON() : {};

    const featureComparison = featureKeys.map(({ key, label }) => ({
      key,
      label,
      place1Status: (f1[key] || 'UNKNOWN').toUpperCase(),
      place2Status: (f2[key] || 'UNKNOWN').toUpperCase()
    }));

    return res.json({
      success: true,
      place1: { ...p1.toJSON(), scorecard: scorecard1 },
      place2: { ...p2.toJSON(), scorecard: scorecard2 },
      featureComparison
    });
  } catch (error) {
    console.error('comparePlaces error:', error);
    return res.status(500).json({ success: false, message: 'Failed to compare places.', error: error.message });
  }
};

// Dedicated endpoint to evaluate Personal Accessibility Match dynamically
exports.getPersonalMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { profileType, customNeeds } = req.query;

    const place = await Place.findByPk(id, {
      include: [
        { model: AccessibilityFeature, as: 'accessibilityFeature' },
        { model: Category, as: 'category' }
      ]
    });

    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }

    let userProfile = profileType || (req.user ? req.user.mobilityProfile : 'manual_wheelchair');
    if (customNeeds) {
      try {
        const parsedCustom = typeof customNeeds === 'string' ? JSON.parse(customNeeds) : customNeeds;
        userProfile = { type: 'custom', customNeeds: parsedCustom };
      } catch (e) {
        // Fall back to string type
      }
    }

    const match = calculatePersonalMatch(place, userProfile);

    return res.json({
      success: true,
      placeId: place.id,
      placeName: place.name,
      match
    });
  } catch (error) {
    console.error('getPersonalMatch error:', error);
    return res.status(500).json({ success: false, message: 'Failed to calculate personal match.', error: error.message });
  }
};

// Dedicated endpoint to inspect Accessible Transport Connections
exports.getTransportConnections = async (req, res) => {
  try {
    const { id } = req.params;

    const place = await Place.findByPk(id, {
      include: [
        { model: AccessibilityFeature, as: 'accessibilityFeature' },
        { model: Category, as: 'category' }
      ]
    });

    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }

    const transportData = analyzeTransportConnections(place);

    return res.json({
      success: true,
      placeId: place.id,
      placeName: place.name,
      transportConnections: transportData
    });
  } catch (error) {
    console.error('getTransportConnections error:', error);
    return res.status(500).json({ success: false, message: 'Failed to evaluate transport connections.', error: error.message });
  }
};

// Get all parent organisations with their branch counts
exports.getOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.findAll({
      include: [
        {
          model: Place,
          as: 'branches',
          attributes: ['id', 'name', 'branchName', 'cityOrArea', 'accessibilityStatus'],
          where: { approvalStatus: 'APPROVED' },
          required: false
        }
      ],
      order: [['name', 'ASC']]
    });

    const formatted = orgs.map((o) => {
      const branches = o.branches || [];
      return {
        id: o.id,
        name: o.name,
        code: o.code,
        sector: o.sector,
        categorySlug: o.categorySlug,
        website: o.website,
        contactPhone: o.contactPhone,
        headquartersAddress: o.headquartersAddress,
        branchCount: branches.length,
        verifiedBranchCount: branches.filter((b) => b.accessibilityStatus === 'VERIFIED').length,
        areas: Array.from(new Set(branches.map((b) => b.cityOrArea).filter(Boolean)))
      };
    });

    return res.json({
      success: true,
      count: formatted.length,
      organizations: formatted
    });
  } catch (error) {
    console.error('getOrganizations error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load organisations.', error: error.message });
  }
};

// Get distinct areas across Colombo District with place counts
exports.getAreas = async (req, res) => {
  try {
    const places = await Place.findAll({
      where: { approvalStatus: 'APPROVED', district: 'Colombo' },
      attributes: ['cityOrArea', 'accessibilityStatus']
    });

    const areaMap = {};
    places.forEach((p) => {
      const area = p.cityOrArea ? p.cityOrArea.trim() : 'Colombo';
      if (!areaMap[area]) {
        areaMap[area] = { name: area, totalPlaces: 0, verifiedPlaces: 0, unassessedPlaces: 0 };
      }
      areaMap[area].totalPlaces++;
      if (p.accessibilityStatus === 'VERIFIED') areaMap[area].verifiedPlaces++;
      if (p.accessibilityStatus === 'NOT_YET_ASSESSED') areaMap[area].unassessedPlaces++;
    });

    const areasList = Object.values(areaMap).sort((a, b) => b.totalPlaces - a.totalPlaces);

    return res.json({
      success: true,
      count: areasList.length,
      district: 'Colombo',
      areas: areasList
    });
  } catch (error) {
    console.error('getAreas error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load Colombo areas.', error: error.message });
  }
};



