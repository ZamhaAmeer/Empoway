const { Place, AccessibilityFeature, Photograph, AccessibilityReport, User } = require('../models');

// Get assigned venue for the authenticated organization
exports.getMyVenue = async (req, res) => {
  try {
    const orgUser = req.user;
    
    // Find place either linked directly or submitted by this organization
    let place = null;
    if (orgUser.organizationPlaceId) {
      place = await Place.findByPk(orgUser.organizationPlaceId, {
        include: [
          { model: AccessibilityFeature, as: 'accessibilityFeature' },
          { model: Photograph, as: 'photographs' },
          { model: AccessibilityReport, as: 'reports' }
        ]
      });
    }

    if (!place) {
      // Find place where submittedById = orgUser.id or find first relevant place
      place = await Place.findOne({
        where: { submittedById: orgUser.id },
        include: [
          { model: AccessibilityFeature, as: 'accessibilityFeature' },
          { model: Photograph, as: 'photographs' },
          { model: AccessibilityReport, as: 'reports' }
        ]
      });
    }

    // If still null and user is admin testing org portal, return first place
    if (!place && orgUser.role === 'admin') {
      place = await Place.findOne({
        include: [
          { model: AccessibilityFeature, as: 'accessibilityFeature' },
          { model: Photograph, as: 'photographs' },
          { model: AccessibilityReport, as: 'reports' }
        ]
      });
    }

    if (!place) {
      return res.status(404).json({
        success: false,
        message: 'No assigned facility found for this organization account. Please contact the EMPOWAY accreditation team.'
      });
    }

    return res.json({
      success: true,
      place,
      organizationName: orgUser.organizationName || orgUser.fullName,
      organizationType: orgUser.organizationType || 'ACCREDITED_FACILITY'
    });
  } catch (error) {
    console.error('getMyVenue error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load organization venue.', error: error.message });
  }
};

// Update venue accessibility information
exports.updateMyVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      description,
      contactPhone,
      contactEmail,
      contactWebsite,
      entranceDetails,
      rampCondition,
      numberOfSteps,
      elevatorLocation,
      limitationsNotes,
      features
    } = req.body;

    const place = await Place.findByPk(id, {
      include: [{ model: AccessibilityFeature, as: 'accessibilityFeature' }]
    });

    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }

    await place.update({
      description: description !== undefined ? description : place.description,
      contactPhone: contactPhone !== undefined ? contactPhone : place.contactPhone,
      contactEmail: contactEmail !== undefined ? contactEmail : place.contactEmail,
      contactWebsite: contactWebsite !== undefined ? contactWebsite : place.contactWebsite,
      entranceDetails: entranceDetails !== undefined ? entranceDetails : place.entranceDetails,
      rampCondition: rampCondition !== undefined ? rampCondition : place.rampCondition,
      numberOfSteps: numberOfSteps !== undefined ? parseInt(numberOfSteps) : place.numberOfSteps,
      elevatorLocation: elevatorLocation !== undefined ? elevatorLocation : place.elevatorLocation,
      limitationsNotes: limitationsNotes !== undefined ? limitationsNotes : place.limitationsNotes
    });

    if (features && place.accessibilityFeature) {
      await place.accessibilityFeature.update(features);
    }

    return res.json({
      success: true,
      message: 'Venue accessibility profile updated successfully.',
      place
    });
  } catch (error) {
    console.error('updateMyVenue error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update venue information.', error: error.message });
  }
};

// Respond to a user reported accessibility issue
exports.respondToReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { responseText, isResolved } = req.body;

    if (!responseText || !responseText.trim()) {
      return res.status(400).json({ success: false, message: 'Response text is required.' });
    }

    const report = await AccessibilityReport.findByPk(reportId);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    report.resolutionNotes = `[Official Facility Response]: ${responseText.trim()}`;
    if (isResolved) {
      report.status = 'RESOLVED';
      report.resolvedAt = new Date();
    }
    await report.save();

    return res.json({
      success: true,
      message: 'Official response logged successfully for this report.',
      report
    });
  } catch (error) {
    console.error('respondToReport error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit response.', error: error.message });
  }
};

