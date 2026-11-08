const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AccessibilityFeature = sequelize.define('AccessibilityFeature', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  placeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stepFreeEntrance: {
    type: DataTypes.STRING,
    defaultValue: 'UNKNOWN',
    validate: {
      isIn: [['AVAILABLE', 'NOT_AVAILABLE', 'UNKNOWN', 'NEEDS_VERIFICATION']]
    }
  },
  wheelchairRamp: {
    type: DataTypes.STRING,
    defaultValue: 'UNKNOWN',
    validate: {
      isIn: [['AVAILABLE', 'NOT_AVAILABLE', 'UNKNOWN', 'NEEDS_VERIFICATION']]
    }
  },
  elevator: {
    type: DataTypes.STRING,
    defaultValue: 'UNKNOWN',
    validate: {
      isIn: [['AVAILABLE', 'NOT_AVAILABLE', 'UNKNOWN', 'NEEDS_VERIFICATION']]
    }
  },
  accessibleToilet: {
    type: DataTypes.STRING,
    defaultValue: 'UNKNOWN',
    validate: {
      isIn: [['AVAILABLE', 'NOT_AVAILABLE', 'UNKNOWN', 'NEEDS_VERIFICATION']]
    }
  },
  accessibleParking: {
    type: DataTypes.STRING,
    defaultValue: 'UNKNOWN',
    validate: {
      isIn: [['AVAILABLE', 'NOT_AVAILABLE', 'UNKNOWN', 'NEEDS_VERIFICATION']]
    }
  },
  wideDoorways: {
    type: DataTypes.STRING,
    defaultValue: 'UNKNOWN',
    validate: {
      isIn: [['AVAILABLE', 'NOT_AVAILABLE', 'UNKNOWN', 'NEEDS_VERIFICATION']]
    }
  },
  wheelchairPathways: {
    type: DataTypes.STRING,
    defaultValue: 'UNKNOWN',
    validate: {
      isIn: [['AVAILABLE', 'NOT_AVAILABLE', 'UNKNOWN', 'NEEDS_VERIFICATION']]
    }
  },
  accessibleCounters: {
    type: DataTypes.STRING,
    defaultValue: 'UNKNOWN',
    validate: {
      isIn: [['AVAILABLE', 'NOT_AVAILABLE', 'UNKNOWN', 'NEEDS_VERIFICATION']]
    }
  },
  featureNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = AccessibilityFeature;

