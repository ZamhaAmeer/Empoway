const { sequelize } = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Organization = require('./Organization');
const Place = require('./Place');
const AccessibilityFeature = require('./AccessibilityFeature');
const Photograph = require('./Photograph');
const AccessibilityReport = require('./AccessibilityReport');
const ModerationLog = require('./ModerationLog');

// Category <-> Place
Category.hasMany(Place, { foreignKey: 'categoryId', as: 'places' });
Place.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Organization <-> Place (Parent Organization and Branches)
Organization.hasMany(Place, { foreignKey: 'organizationId', as: 'branches' });
Place.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

// User <-> Place (Submitter & Verifier)
User.hasMany(Place, { foreignKey: 'submittedById', as: 'submittedPlaces' });
Place.belongsTo(User, { foreignKey: 'submittedById', as: 'submitter' });

User.hasMany(Place, { foreignKey: 'verifiedById', as: 'verifiedPlaces' });
Place.belongsTo(User, { foreignKey: 'verifiedById', as: 'verifier' });

// Place <-> AccessibilityFeature
Place.hasOne(AccessibilityFeature, { foreignKey: 'placeId', as: 'accessibilityFeature', onDelete: 'CASCADE' });
AccessibilityFeature.belongsTo(Place, { foreignKey: 'placeId' });

// Place <-> Photograph
Place.hasMany(Photograph, { foreignKey: 'placeId', as: 'photographs', onDelete: 'CASCADE' });
Photograph.belongsTo(Place, { foreignKey: 'placeId' });

User.hasMany(Photograph, { foreignKey: 'uploadedById', as: 'uploads' });
Photograph.belongsTo(User, { foreignKey: 'uploadedById', as: 'uploader' });

// Place <-> AccessibilityReport
Place.hasMany(AccessibilityReport, { foreignKey: 'placeId', as: 'reports', onDelete: 'CASCADE' });
AccessibilityReport.belongsTo(Place, { foreignKey: 'placeId', as: 'place' });

User.hasMany(AccessibilityReport, { foreignKey: 'userId', as: 'reports' });
AccessibilityReport.belongsTo(User, { foreignKey: 'userId', as: 'reporter' });

User.hasMany(AccessibilityReport, { foreignKey: 'reviewedById', as: 'reviewedReports' });
AccessibilityReport.belongsTo(User, { foreignKey: 'reviewedById', as: 'reviewer' });

// User <-> ModerationLog
User.hasMany(ModerationLog, { foreignKey: 'adminId', as: 'moderations' });
ModerationLog.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });

module.exports = {
  sequelize,
  User,
  Category,
  Organization,
  Place,
  AccessibilityFeature,
  Photograph,
  AccessibilityReport,
  ModerationLog
};

