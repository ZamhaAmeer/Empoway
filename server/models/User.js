const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
    validate: {
      isIn: [['user', 'admin', 'organization']]
    }
  },
  organizationName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  organizationType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  organizationPlaceId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contributionCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  verifiedActivityCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  preferredTheme: {
    type: DataTypes.STRING,
    defaultValue: 'light',
    validate: {
      isIn: [['light', 'dark']]
    }
  },
  preferredLanguage: {
    type: DataTypes.STRING,
    defaultValue: 'en',
    validate: {
      isIn: [['en', 'si', 'ta']]
    }
  },
  mobilityProfile: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      type: 'manual_wheelchair',
      customNeeds: {
        stepFreeEntrance: true,
        wheelchairRamp: true,
        elevator: true,
        accessibleToilet: true,
        accessibleParking: false,
        wideDoorways: true,
        wheelchairPathways: true,
        accessibleCounters: false
      }
    }
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.passwordHash && !user.passwordHash.startsWith('$2a$') && !user.passwordHash.startsWith('$2b$')) {
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('passwordHash') && !user.passwordHash.startsWith('$2a$') && !user.passwordHash.startsWith('$2b$')) {
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
      }
    }
  }
});

User.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = User;

