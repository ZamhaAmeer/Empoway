const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AccessibilityReport = sequelize.define('AccessibilityReport', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  placeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reportType: {
    type: DataTypes.STRING,
    defaultValue: 'UPDATE_FEATURES',
    validate: {
      isIn: [['BARRIER_REPORT', 'UPDATE_FEATURES', 'REPORT_INCORRECT_INFO', 'PHOTO_SUBMISSION', 'GENERAL_FEEDBACK']]
    }
  },
  barrierType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  featureName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reportedStatus: {
    type: DataTypes.STRING,
    allowNull: true
  },
  evidencePhotoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'SUBMITTED',
    validate: {
      isIn: [['SUBMITTED', 'UNDER_REVIEW', 'CONFIRMED', 'RESOLVED', 'REJECTED', 'PENDING', 'REVIEWED', 'APPROVED']]
    }
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resolutionNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reviewedById: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = AccessibilityReport;

