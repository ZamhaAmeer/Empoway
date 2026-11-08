const { AccessibilityReport, Place, User } = require('../models');

// Submit an accessibility report or barrier update
exports.createReport = async (req, res) => {
  try {
    const {
      placeId,
      reportType, // 'BARRIER_REPORT', 'UPDATE_FEATURES', 'REPORT_INCORRECT_INFO', 'PHOTO_SUBMISSION', 'GENERAL_FEEDBACK'
      barrierType, // 'DAMAGED_RAMP', 'BLOCKED_ENTRANCE', 'ELEVATOR_OUT_OF_ORDER', 'TOILET_UNAVAILABLE', 'INCORRECT_INFO', 'OTHER'
      featureName,
      reportedStatus,
      description,
      evidencePhotoUrl
    } = req.body;

    if (!placeId || !description) {
      return res.status(400).json({
        success: false,
        message: 'Place ID and a descriptive explanation are required.'
      });
    }

    const place = await Place.findByPk(placeId);
    if (!place) {
      return res.status(404).json({ success: false, message: 'Place not found.' });
    }

    const userId = req.user ? req.user.id : null;

    const report = await AccessibilityReport.create({
      placeId: parseInt(placeId),
      userId,
      reportType: reportType || (barrierType ? 'BARRIER_REPORT' : 'UPDATE_FEATURES'),
      barrierType: barrierType || null,
      featureName: featureName || null,
      reportedStatus: reportedStatus || null,
      evidencePhotoUrl: evidencePhotoUrl || null,
      description: description.trim(),
      status: 'SUBMITTED'
    });

    if (userId) {
      await User.increment('contributionCount', { by: 1, where: { id: userId } });
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your accessibility report has been logged and submitted to our physical audit and moderation team.',
      report
    });
  } catch (error) {
    console.error('createReport error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit report.', error: error.message });
  }
};

// Get reports for a place
exports.getReportsForPlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { status } = req.query;

    const where = { placeId };
    if (status) {
      where.status = status;
    }

    const reports = await AccessibilityReport.findAll({
      where,
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
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      success: true,
      reports
    });
  } catch (error) {
    console.error('getReportsForPlace error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve reports.', error: error.message });
  }
};

