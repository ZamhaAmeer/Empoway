const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Place = sequelize.define('Place', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  district: {
    type: DataTypes.STRING,
    defaultValue: 'Colombo'
  },
  cityOrArea: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contactWebsite: {
    type: DataTypes.STRING,
    allowNull: true
  },
  organizationId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  branchName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dataSource: {
    type: DataTypes.STRING,
    allowNull: true
  },
  institutionType: {
    type: DataTypes.STRING,
    defaultValue: 'public'
  },
  accessibilityStatus: {
    type: DataTypes.STRING,
    defaultValue: 'NOT_YET_ASSESSED',
    validate: {
      isIn: [['VERIFIED', 'COMMUNITY_REPORTED', 'UNKNOWN', 'NOT_YET_ASSESSED']]
    }
  },
  approvalStatus: {
    type: DataTypes.STRING,
    defaultValue: 'APPROVED',
    validate: {
      isIn: [['PENDING', 'APPROVED', 'REJECTED']]
    }
  },
  lastVerifiedDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  verifiedById: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  verificationNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  entranceDetails: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rampCondition: {
    type: DataTypes.STRING,
    allowNull: true
  },
  numberOfSteps: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  elevatorLocation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  limitationsNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  submittedById: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  isDemoData: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

module.exports = Place;

