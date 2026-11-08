const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Photograph = sequelize.define('Photograph', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  placeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  caption: {
    type: DataTypes.STRING,
    allowNull: true
  },
  uploadedById: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  facilityType: {
    type: DataTypes.STRING,
    defaultValue: 'GENERAL'
  },
  isVerifiedEvidence: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isCover: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

module.exports = Photograph;

