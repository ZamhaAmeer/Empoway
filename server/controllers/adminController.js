const { Place, Category, Organization, AccessibilityFeature, Photograph, User, AccessibilityReport, ModerationLog } = require('../models');
const { Op } = require('sequelize');

// Admin Platform Stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalPlaces = await Place.count();
    const verifiedPlaces = await Place.count({ where: { accessibilityStatus: 'VERIFIED', approvalStatus: 'APPROVED' } });
    const communityPlaces = await Place.count({ where: { accessibilityStatus: 'COMMUNITY_REPORTED', approvalStatus: 'APPROVED' } });
    const unknownPlaces = await Place.count({ where: { accessibilityStatus: 'UNKNOWN', approvalStatus: 'APPROVED' } });
    const unassessedPlaces = await Place.count({ where: { accessibilityStatus: 'NOT_YET_ASSESSED', approvalStatus: 'APPROVED' } });
    const totalOrganizations = await Organization.count();
    
    const pendingPlaces = await Place.count({ where: { approvalStatus: 'PENDING' } });
    const approvedPlaces = await Place.count({ where: { approvalStatus: 'APPROVED' } });
    const rejectedPlaces = await Place.count({ where: { approvalStatus: 'REJECTED' } });

    const totalReports = await AccessibilityReport.count();
    const pendingReports = await AccessibilityReport.count({ where: { status: 'PENDING' } });
    const totalUsers = await User.count();
    const totalPhotographs = await Photograph.count();

    return res.json({
      success: true,
      stats: {
        totalPlaces,
        verifiedPlaces,
        communityPlaces,
        unknownPlaces,
        unassessedPlaces,
        totalOrganizations,
        pendingPlaces,
        approvedPlaces,
        rejectedPlaces,
        totalReports,
        pendingReports,
        totalUsers,
        totalPhotographs
      }
    });
  } catch (error) {
    console.error('getAdminStats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load admin stats.', error: error.message });
  }
};

// Get pending submissions
exports.getPendingSubmissions = async (req, res) => {
  try {
    const pendingPlaces = await Place.findAll({
      where: { approvalStatus: 'PENDING' },
      include: [
        { model: Category, as: 'category' },
        { model: AccessibilityFeature, as: 'accessibilityFeature' },
        { model: Photograph, as: 'photographs' },
        { model: User, as: 'submitter', attributes: ['id', 'fullName', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      success: true,
      count: pendingPlaces.length,
      places: pendingPlaces
    });
  } catch (error) {
    console.error('getPendingSubmissions error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load pending submissions.', error: error.message });
  }
};

// Approve a place submission
exports.approvePlaceSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { accessibilityStatus, verificationNotes } = req.body;

    const place = await Place.findByPk(id);
    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }

    place.approvalStatus = 'APPROVED';
    
    // If the admin verified it through a physical/authorized assessment
    if (accessibilityStatus) {
      place.accessibilityStatus = accessibilityStatus;
    }
    
    if (accessibilityStatus === 'VERIFIED') {
      place.lastVerifiedDate = new Date();
      place.verifiedById = req.user.id;
      if (verificationNotes) {
        place.verificationNotes = verificationNotes;
      }
    }

    await place.save();

    // Log moderation action
    await ModerationLog.create({
      action: 'APPROVE_PLACE',
      targetType: 'place',
      targetId: place.id,
      adminId: req.user.id,
      details: `Approved place "${place.name}". Status set to ${place.accessibilityStatus}. ${verificationNotes ? 'Notes: ' + verificationNotes : ''}`
    });

    return res.json({
      success: true,
      message: `Place "${place.name}" approved successfully.`,
      place
    });
  } catch (error) {
    console.error('approvePlaceSubmission error:', error);
    return res.status(500).json({ success: false, message: 'Failed to approve place.', error: error.message });
  }
};

// Reject a place submission
exports.rejectPlaceSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const place = await Place.findByPk(id);
    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }

    place.approvalStatus = 'REJECTED';
    await place.save();

    await ModerationLog.create({
      action: 'REJECT_PLACE',
      targetType: 'place',
      targetId: place.id,
      adminId: req.user.id,
      details: `Rejected place "${place.name}". Reason: ${reason || 'Incomplete or invalid information'}`
    });

    return res.json({
      success: true,
      message: `Place "${place.name}" was rejected.`,
      place
    });
  } catch (error) {
    console.error('rejectPlaceSubmission error:', error);
    return res.status(500).json({ success: false, message: 'Failed to reject place.', error: error.message });
  }
};

// Admin verifies a place after physical / authorized assessment
exports.verifyPlace = async (req, res) => {
  try {
    const { id } = req.params;
    const { verificationNotes, accessibilityStatus } = req.body;

    const place = await Place.findByPk(id);
    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }

    const newStatus = accessibilityStatus || 'VERIFIED';
    place.accessibilityStatus = newStatus;
    place.lastVerifiedDate = new Date();
    place.verifiedById = req.user.id;
    if (verificationNotes) {
      place.verificationNotes = verificationNotes;
    }

    await place.save();

    // Increment admin verified activity
    await User.increment('verifiedActivityCount', { by: 1, where: { id: req.user.id } });

    await ModerationLog.create({
      action: 'VERIFY_PLACE',
      targetType: 'place',
      targetId: place.id,
      adminId: req.user.id,
      details: `Updated verification for "${place.name}" to ${newStatus}. Notes: ${verificationNotes || 'On-site assessment confirmed'}`
    });

    return res.json({
      success: true,
      message: `Place "${place.name}" status updated to ${newStatus}.`,
      place
    });
  } catch (error) {
    console.error('verifyPlace error:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify place.', error: error.message });
  }
};

// Update place details and features
exports.updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findByPk(id, {
      include: [{ model: AccessibilityFeature, as: 'accessibilityFeature' }]
    });

    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }

    const {
      name,
      categoryId,
      address,
      cityOrArea,
      district,
      latitude,
      longitude,
      description,
      contactPhone,
      contactEmail,
      contactWebsite,
      organizationId,
      branchName,
      dataSource,
      institutionType,
      accessibilityStatus,
      entranceDetails,
      rampCondition,
      numberOfSteps,
      elevatorLocation,
      limitationsNotes,
      verificationNotes,
      isDemoData,
      // features
      features
    } = req.body;

    await place.update({
      name: name !== undefined ? name : place.name,
      categoryId: categoryId !== undefined ? categoryId : place.categoryId,
      organizationId: organizationId !== undefined ? (organizationId ? parseInt(organizationId) : null) : place.organizationId,
      branchName: branchName !== undefined ? branchName : place.branchName,
      dataSource: dataSource !== undefined ? dataSource : place.dataSource,
      institutionType: institutionType !== undefined ? institutionType : place.institutionType,
      address: address !== undefined ? address : place.address,
      cityOrArea: cityOrArea !== undefined ? cityOrArea : place.cityOrArea,
      district: district !== undefined ? district : place.district,
      latitude: latitude !== undefined ? parseFloat(latitude) : place.latitude,
      longitude: longitude !== undefined ? parseFloat(longitude) : place.longitude,
      description: description !== undefined ? description : place.description,
      contactPhone: contactPhone !== undefined ? contactPhone : place.contactPhone,
      contactEmail: contactEmail !== undefined ? contactEmail : place.contactEmail,
      contactWebsite: contactWebsite !== undefined ? contactWebsite : place.contactWebsite,
      accessibilityStatus: accessibilityStatus !== undefined ? accessibilityStatus : place.accessibilityStatus,
      entranceDetails: entranceDetails !== undefined ? entranceDetails : place.entranceDetails,
      rampCondition: rampCondition !== undefined ? rampCondition : place.rampCondition,
      numberOfSteps: numberOfSteps !== undefined ? parseInt(numberOfSteps) : place.numberOfSteps,
      elevatorLocation: elevatorLocation !== undefined ? elevatorLocation : place.elevatorLocation,
      limitationsNotes: limitationsNotes !== undefined ? limitationsNotes : place.limitationsNotes,
      verificationNotes: verificationNotes !== undefined ? verificationNotes : place.verificationNotes,
      isDemoData: isDemoData !== undefined ? isDemoData : place.isDemoData
    });

    if (features && place.accessibilityFeature) {
      await place.accessibilityFeature.update(features);
    }

    await ModerationLog.create({
      action: 'UPDATE_PLACE',
      targetType: 'place',
      targetId: place.id,
      adminId: req.user.id,
      details: `Admin updated place information for "${place.name}".`
    });

    return res.json({
      success: true,
      message: 'Place updated successfully.',
      place
    });
  } catch (error) {
    console.error('updatePlace error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update place.', error: error.message });
  }
};

// Delete place
exports.deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findByPk(id);

    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }

    const placeName = place.name;
    await place.destroy();

    await ModerationLog.create({
      action: 'DELETE_PLACE',
      targetType: 'place',
      targetId: id,
      adminId: req.user.id,
      details: `Admin deleted place "${placeName}".`
    });

    return res.json({
      success: true,
      message: `Place "${placeName}" deleted successfully.`
    });
  } catch (error) {
    console.error('deletePlace error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete place.', error: error.message });
  }
};

// Get all reports for admin review
exports.getAllReports = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const reports = await AccessibilityReport.findAll({
      where,
      include: [
        { model: Place, as: 'place', attributes: ['id', 'name', 'address', 'accessibilityStatus'] },
        { model: User, as: 'reporter', attributes: ['id', 'fullName', 'email'] },
        { model: User, as: 'reviewer', attributes: ['id', 'fullName'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('getAllReports error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load reports.', error: error.message });
  }
};

// Review report (Under Review, Confirmed, Resolved, Rejected, Approved)
exports.reviewReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, status, adminNotes, resolutionNotes, updateFeature, featureName, featureValue } = req.body;

    const report = await AccessibilityReport.findByPk(id, {
      include: [{ model: Place, as: 'place', include: [{ model: AccessibilityFeature, as: 'accessibilityFeature' }] }]
    });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    // Determine target status
    let newStatus = status;
    if (!newStatus) {
      if (action === 'APPROVE') newStatus = 'APPROVED';
      else if (action === 'REJECT') newStatus = 'REJECTED';
      else if (action === 'CONFIRM') newStatus = 'CONFIRMED';
      else if (action === 'RESOLVE') newStatus = 'RESOLVED';
      else if (action === 'UNDER_REVIEW') newStatus = 'UNDER_REVIEW';
      else newStatus = 'UNDER_REVIEW';
    }

    report.status = newStatus;
    if (adminNotes) report.adminNotes = adminNotes;
    if (resolutionNotes) report.resolutionNotes = resolutionNotes;
    if (newStatus === 'RESOLVED') {
      report.resolvedAt = new Date();
    }
    report.reviewedById = req.user.id;
    report.reviewedAt = new Date();
    await report.save();

    // If confirmed / approved and updateFeature requested, update the Place's AccessibilityFeature
    if (['APPROVED', 'CONFIRMED', 'RESOLVED'].includes(newStatus) && updateFeature && featureName && featureValue && report.place && report.place.accessibilityFeature) {
      const fieldMap = {
        'Step-free Entrance': 'stepFreeEntrance',
        'Wheelchair Ramp': 'wheelchairRamp',
        'Elevator': 'elevator',
        'Accessible Toilet': 'accessibleToilet',
        'Accessible Parking': 'accessibleParking',
        'Wide Doorways': 'wideDoorways',
        'Wheelchair Pathways': 'wheelchairPathways',
        'Accessible Counters': 'accessibleCounters'
      };

      const key = fieldMap[featureName] || featureName;
      if (report.place.accessibilityFeature[key] !== undefined) {
        report.place.accessibilityFeature[key] = featureValue;
        await report.place.accessibilityFeature.save();
      }
    }

    await ModerationLog.create({
      action: `REPORT_${newStatus}`,
      targetType: 'report',
      targetId: report.id,
      adminId: req.user.id,
      details: `Status set to ${newStatus} for report #${report.id} on place "${report.place ? report.place.name : ''}". Notes: ${adminNotes || resolutionNotes || 'None'}`
    });

    return res.json({
      success: true,
      message: `Report #${report.id} status updated to ${newStatus}.`,
      report
    });
  } catch (error) {
    console.error('reviewReport error:', error);
    return res.status(500).json({ success: false, message: 'Failed to review report.', error: error.message });
  }
};

// Moderation Logs
exports.getModerationLogs = async (req, res) => {
  try {
    const logs = await ModerationLog.findAll({
      include: [{ model: User, as: 'admin', attributes: ['id', 'fullName', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 100
    });

    return res.json({
      success: true,
      logs
    });
  } catch (error) {
    console.error('getModerationLogs error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load moderation logs.', error: error.message });
  }
};

// List users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'fullName', 'email', 'role', 'contributionCount', 'verifiedActivityCount', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('getUsers error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load users.', error: error.message });
  }
};

// Verify an evidence photograph
exports.verifyPhotograph = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerifiedEvidence } = req.body;

    const photo = await Photograph.findByPk(id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photograph not found.' });
    }

    photo.isVerifiedEvidence = isVerifiedEvidence !== undefined ? isVerifiedEvidence : true;
    photo.verifiedAt = photo.isVerifiedEvidence ? new Date() : null;
    await photo.save();

    await ModerationLog.create({
      action: photo.isVerifiedEvidence ? 'VERIFY_PHOTO' : 'UNVERIFY_PHOTO',
      targetType: 'photograph',
      targetId: photo.id,
      adminId: req.user.id,
      details: `${photo.isVerifiedEvidence ? 'Verified' : 'Unverified'} evidence photo #${photo.id}`
    });

    return res.json({
      success: true,
      message: `Photograph #${photo.id} verification status updated.`,
      photo
    });
  } catch (error) {
    console.error('verifyPhotograph error:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify photograph.', error: error.message });
  }
};

// ==========================================
// ORGANISATION MANAGEMENT (Admin)
// ==========================================

// Create new parent organisation
exports.createOrganization = async (req, res) => {
  try {
    const {
      name,
      code,
      categorySlug,
      sector,
      description,
      headquartersAddress,
      headquartersCity,
      website,
      contactPhone,
      contactEmail,
      dataSource
    } = req.body;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Organisation name and unique code are required.' });
    }

    const existingCode = await Organization.findOne({ where: { code: code.trim().toLowerCase() } });
    if (existingCode) {
      return res.status(400).json({ success: false, message: `An organisation with code "${code}" already exists.` });
    }

    const organization = await Organization.create({
      name: name.trim(),
      code: code.trim().toLowerCase(),
      categorySlug: categorySlug || null,
      sector: sector || 'public',
      description: description ? description.trim() : null,
      headquartersAddress: headquartersAddress ? headquartersAddress.trim() : null,
      headquartersCity: headquartersCity ? headquartersCity.trim() : 'Colombo',
      website: website ? website.trim() : null,
      contactPhone: contactPhone ? contactPhone.trim() : null,
      contactEmail: contactEmail ? contactEmail.trim() : null,
      dataSource: dataSource || 'Admin Registered'
    });

    await ModerationLog.create({
      action: 'CREATE_ORGANIZATION',
      targetType: 'organization',
      targetId: organization.id,
      adminId: req.user.id,
      details: `Admin created organisation "${organization.name}" (${organization.code}).`
    });

    return res.status(201).json({
      success: true,
      message: `Organisation "${organization.name}" created successfully.`,
      organization
    });
  } catch (error) {
    console.error('createOrganization error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create organisation.', error: error.message });
  }
};

// Get organisations for admin console
exports.getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.findAll({
      include: [
        {
          model: Place,
          as: 'branches',
          attributes: ['id', 'name', 'branchName', 'cityOrArea', 'accessibilityStatus', 'address', 'district']
        }
      ],
      order: [['name', 'ASC']]
    });

    return res.json({
      success: true,
      count: organizations.length,
      organizations
    });
  } catch (error) {
    console.error('getOrganizations error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load organisations.', error: error.message });
  }
};

// Update organisation
exports.updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const org = await Organization.findByPk(id);
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organisation not found.' });
    }

    const {
      name,
      code,
      categorySlug,
      sector,
      description,
      headquartersAddress,
      headquartersCity,
      website,
      contactPhone,
      contactEmail,
      dataSource
    } = req.body;

    if (name) org.name = name.trim();
    if (code) org.code = code.trim().toLowerCase();
    if (categorySlug !== undefined) org.categorySlug = categorySlug;
    if (sector) org.sector = sector;
    if (description !== undefined) org.description = description;
    if (headquartersAddress !== undefined) org.headquartersAddress = headquartersAddress;
    if (headquartersCity !== undefined) org.headquartersCity = headquartersCity;
    if (website !== undefined) org.website = website;
    if (contactPhone !== undefined) org.contactPhone = contactPhone;
    if (contactEmail !== undefined) org.contactEmail = contactEmail;
    if (dataSource !== undefined) org.dataSource = dataSource;

    await org.save();

    await ModerationLog.create({
      action: 'UPDATE_ORGANIZATION',
      targetType: 'organization',
      targetId: org.id,
      adminId: req.user.id,
      details: `Admin updated organisation "${org.name}".`
    });

    return res.json({
      success: true,
      message: 'Organisation updated successfully.',
      organization: org
    });
  } catch (error) {
    console.error('updateOrganization error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update organisation.', error: error.message });
  }
};

// Delete organisation
exports.deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const org = await Organization.findByPk(id);
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organisation not found.' });
    }

    const orgName = org.name;
    // Unlink branches first
    await Place.update({ organizationId: null }, { where: { organizationId: id } });
    await org.destroy();

    await ModerationLog.create({
      action: 'DELETE_ORGANIZATION',
      targetType: 'organization',
      targetId: id,
      adminId: req.user.id,
      details: `Admin deleted organisation "${orgName}". Unlinked all associated branches.`
    });

    return res.json({
      success: true,
      message: `Organisation "${orgName}" deleted successfully.`
    });
  } catch (error) {
    console.error('deleteOrganization error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete organisation.', error: error.message });
  }
};

// ==========================================
// DIRECTORY PLACE MANAGEMENT (Admin)
// ==========================================

// Directly create a new place or branch
exports.createPlace = async (req, res) => {
  try {
    const {
      name,
      organizationId,
      branchName,
      categoryId,
      address,
      cityOrArea,
      district,
      latitude,
      longitude,
      description,
      contactPhone,
      contactEmail,
      contactWebsite,
      dataSource,
      institutionType,
      accessibilityStatus,
      features
    } = req.body;

    if (!name || !address || !cityOrArea) {
      return res.status(400).json({ success: false, message: 'Place name, address and city/area are required.' });
    }

    const lat = latitude ? parseFloat(latitude) : 6.9271;
    const lng = longitude ? parseFloat(longitude) : 79.8612;

    const place = await Place.create({
      name: name.trim(),
      organizationId: organizationId ? parseInt(organizationId) : null,
      branchName: branchName ? branchName.trim() : null,
      categoryId: categoryId ? parseInt(categoryId) : 1,
      address: address.trim(),
      cityOrArea: cityOrArea.trim(),
      district: district || 'Colombo',
      latitude: lat,
      longitude: lng,
      description: description ? description.trim() : null,
      contactPhone: contactPhone ? contactPhone.trim() : null,
      contactEmail: contactEmail ? contactEmail.trim() : null,
      contactWebsite: contactWebsite ? contactWebsite.trim() : null,
      dataSource: dataSource || 'Admin Added',
      institutionType: institutionType || 'public',
      accessibilityStatus: accessibilityStatus || 'NOT_YET_ASSESSED',
      approvalStatus: 'APPROVED',
      verifiedById: req.user.id
    });

    const featObj = features || {};
    await AccessibilityFeature.create({
      placeId: place.id,
      stepFreeEntrance: featObj.stepFreeEntrance || 'UNKNOWN',
      wheelchairRamp: featObj.wheelchairRamp || 'UNKNOWN',
      elevator: featObj.elevator || 'UNKNOWN',
      accessibleToilet: featObj.accessibleToilet || 'UNKNOWN',
      accessibleParking: featObj.accessibleParking || 'UNKNOWN',
      wideDoorways: featObj.wideDoorways || 'UNKNOWN',
      wheelchairPathways: featObj.wheelchairPathways || 'UNKNOWN',
      accessibleCounters: featObj.accessibleCounters || 'UNKNOWN'
    });

    await ModerationLog.create({
      action: 'ADMIN_CREATE_PLACE',
      targetType: 'place',
      targetId: place.id,
      adminId: req.user.id,
      details: `Admin added place "${place.name}" (${place.cityOrArea}) to directory.`
    });

    return res.status(201).json({
      success: true,
      message: `Place "${place.name}" added to Colombo directory successfully.`,
      place
    });
  } catch (error) {
    console.error('createPlace error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create place.', error: error.message });
  }
};

// CSV Import Review & Duplicate Detection (Admin preview step)
exports.importCsvPlaces = async (req, res) => {
  try {
    const { csvData, rows } = req.body;

    let parsedRows = [];
    if (rows && Array.isArray(rows)) {
      parsedRows = rows;
    } else if (csvData && typeof csvData === 'string') {
      // Parse CSV text string
      const lines = csvData.trim().split('\n');
      if (lines.length < 2) {
        return res.status(400).json({ success: false, message: 'CSV data is empty or missing headers.' });
      }

      const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        // Simple comma split respecting quotes
        const match = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        const values = match.map((v) => v.trim().replace(/^"|"$/g, ''));
        const rowObj = {};
        headers.forEach((h, idx) => {
          rowObj[h] = values[idx] || '';
        });
        parsedRows.push(rowObj);
      }
    }

    if (parsedRows.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid rows found in provided CSV data.' });
    }

    // Load existing places & organizations for duplicate & reference checking
    const existingPlaces = await Place.findAll({ attributes: ['id', 'name', 'address', 'cityOrArea', 'latitude', 'longitude'] });
    const allCategories = await Category.findAll({ attributes: ['id', 'slug', 'name'] });
    const allOrgs = await Organization.findAll({ attributes: ['id', 'code', 'name'] });

    const orgMap = {};
    allOrgs.forEach((o) => {
      orgMap[o.code.toLowerCase()] = o.id;
      orgMap[o.name.toLowerCase()] = o.id;
    });

    const categoryMap = {};
    allCategories.forEach((c) => {
      categoryMap[c.slug.toLowerCase()] = c.id;
      categoryMap[c.name.toLowerCase()] = c.id;
    });

    const preview = [];
    const duplicateWarnings = [];
    let validCount = 0;

    for (let idx = 0; idx < parsedRows.length; idx++) {
      const r = parsedRows[idx];
      const name = (r.name || r.placeName || r.PlaceName || '').trim();
      const address = (r.address || r.Address || '').trim();
      const cityOrArea = (r.cityOrArea || r.area || r.City || r.Area || '').trim();
      const district = (r.district || r.District || 'Colombo').trim();
      const lat = parseFloat(r.latitude || r.lat || 0);
      const lng = parseFloat(r.longitude || r.lng || 0);
      const branchName = (r.branchName || r.branch || '').trim();
      const orgCode = (r.organizationCode || r.orgCode || r.organization || '').trim().toLowerCase();
      const catSlug = (r.categorySlug || r.category || 'government-offices').trim().toLowerCase();
      const phone = (r.contactPhone || r.phone || '').trim();
      const website = (r.contactWebsite || r.website || '').trim();
      const dataSource = (r.dataSource || r.source || 'CSV Import').trim();

      const validationErrors = [];
      if (!name) validationErrors.push('Missing place name');
      if (!address) validationErrors.push('Missing address');
      if (!cityOrArea) validationErrors.push('Missing area/city');
      if (district.toLowerCase() !== 'colombo') {
        validationErrors.push(`District "${district}" is outside Colombo District`);
      }
      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
        validationErrors.push('Invalid coordinates (lat/lng)');
      } else if (lat < 6.6 || lat > 7.15 || lng < 79.7 || lng > 80.35) {
        validationErrors.push(`Coordinates (${lat}, ${lng}) fall outside Colombo District boundaries`);
      }

      // Check duplicates against database
      const nameMatch = existingPlaces.find((p) => p.name.toLowerCase() === name.toLowerCase());
      if (nameMatch) {
        duplicateWarnings.push({
          row: idx + 1,
          placeName: name,
          existingPlaceId: nameMatch.id,
          reason: `Exact name match with place #${nameMatch.id} ("${nameMatch.name}")`
        });
      }

      const isValid = validationErrors.length === 0;
      if (isValid) validCount++;

      preview.push({
        rowNumber: idx + 1,
        name,
        branchName: branchName || null,
        organizationId: orgMap[orgCode] || null,
        organizationName: orgCode,
        categoryId: categoryMap[catSlug] || 1,
        categorySlug: catSlug,
        address,
        cityOrArea,
        district: 'Colombo',
        latitude: lat,
        longitude: lng,
        contactPhone: phone,
        contactWebsite: website,
        dataSource,
        accessibilityStatus: 'NOT_YET_ASSESSED',
        isValid,
        validationErrors,
        isDuplicate: Boolean(nameMatch)
      });
    }

    return res.json({
      success: true,
      totalRows: parsedRows.length,
      validCount,
      hasErrors: validCount < parsedRows.length,
      duplicateCount: duplicateWarnings.length,
      duplicateWarnings,
      preview
    });
  } catch (error) {
    console.error('importCsvPlaces error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process CSV file.', error: error.message });
  }
};

// Commit reviewed CSV records into directory
exports.publishCsvPlaces = async (req, res) => {
  try {
    const { places } = req.body;
    if (!places || !Array.isArray(places) || places.length === 0) {
      return res.status(400).json({ success: false, message: 'No validated places array provided for publication.' });
    }

    let createdCount = 0;
    const publishedIds = [];

    for (const p of places) {
      if (!p.isValid && p.isValid !== undefined) continue;

      const newPlace = await Place.create({
        name: p.name.trim(),
        organizationId: p.organizationId || null,
        branchName: p.branchName || null,
        categoryId: p.categoryId || 1,
        address: p.address.trim(),
        cityOrArea: p.cityOrArea.trim(),
        district: 'Colombo',
        latitude: parseFloat(p.latitude),
        longitude: parseFloat(p.longitude),
        description: p.description || null,
        contactPhone: p.contactPhone || null,
        contactEmail: p.contactEmail || null,
        contactWebsite: p.contactWebsite || null,
        dataSource: p.dataSource || 'CSV Publication Batch',
        institutionType: p.institutionType || 'public',
        accessibilityStatus: 'NOT_YET_ASSESSED',
        approvalStatus: 'APPROVED',
        verifiedById: req.user.id
      });

      await AccessibilityFeature.create({
        placeId: newPlace.id,
        stepFreeEntrance: 'UNKNOWN',
        wheelchairRamp: 'UNKNOWN',
        elevator: 'UNKNOWN',
        accessibleToilet: 'UNKNOWN',
        accessibleParking: 'UNKNOWN',
        wideDoorways: 'UNKNOWN',
        wheelchairPathways: 'UNKNOWN',
        accessibleCounters: 'UNKNOWN',
        featureNotes: 'Imported through validated Colombo District CSV directory.'
      });

      createdCount++;
      publishedIds.push(newPlace.id);
    }

    await ModerationLog.create({
      action: 'CSV_BATCH_PUBLISH',
      targetType: 'place',
      targetId: publishedIds[0] || 0,
      adminId: req.user.id,
      details: `Admin published batch of ${createdCount} verified Colombo District places from CSV.`
    });

    return res.json({
      success: true,
      message: `Successfully published ${createdCount} places to the Colombo District Directory.`,
      createdCount,
      publishedIds
    });
  } catch (error) {
    console.error('publishCsvPlaces error:', error);
    return res.status(500).json({ success: false, message: 'Failed to publish CSV places.', error: error.message });
  }
};

// Scan database for duplicate places
exports.getDuplicatePlaces = async (req, res) => {
  try {
    const places = await Place.findAll({
      attributes: ['id', 'name', 'branchName', 'address', 'cityOrArea', 'latitude', 'longitude', 'accessibilityStatus'],
      order: [['name', 'ASC']]
    });

    const duplicateGroups = [];
    const checked = new Set();

    for (let i = 0; i < places.length; i++) {
      if (checked.has(places[i].id)) continue;
      const group = [places[i]];

      for (let j = i + 1; j < places.length; j++) {
        if (checked.has(places[j].id)) continue;
        const p1 = places[i];
        const p2 = places[j];

        // Match criteria: identical normalized name OR identical address OR within 25m coordinates
        const sameName = p1.name.toLowerCase().trim() === p2.name.toLowerCase().trim();
        const sameAddr = p1.address && p2.address && p1.address.toLowerCase().trim() === p2.address.toLowerCase().trim();
        const closeCoords =
          p1.latitude && p2.latitude &&
          Math.abs(p1.latitude - p2.latitude) < 0.0003 &&
          Math.abs(p1.longitude - p2.longitude) < 0.0003;

        if (sameName || (sameAddr && closeCoords)) {
          group.push(p2);
          checked.add(p2.id);
        }
      }

      if (group.length > 1) {
        checked.add(places[i].id);
        duplicateGroups.push(group);
      }
    }

    return res.json({
      success: true,
      count: duplicateGroups.length,
      duplicateGroups
    });
  } catch (error) {
    console.error('getDuplicatePlaces error:', error);
    return res.status(500).json({ success: false, message: 'Failed to scan for duplicates.', error: error.message });
  }
};


