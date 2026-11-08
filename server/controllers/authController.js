const jwt = require('jsonwebtoken');
const { User, Place, AccessibilityReport } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'empoway_super_secure_jwt_secret_colombo_2026_journey';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Register
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, bio, avatarUrl } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide full name, email and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password,
      bio: bio ? bio.trim() : null,
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=b96f54,e9a58d,684638`,
      role: 'user'
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to EMPOWAY!',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        contributionCount: user.contributionCount,
        verifiedActivityCount: user.verifiedActivityCount,
        preferredTheme: user.preferredTheme || 'light',
        preferredLanguage: user.preferredLanguage || 'en',
        mobilityProfile: user.mobilityProfile || {
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
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials.' });
    }

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        contributionCount: user.contributionCount,
        verifiedActivityCount: user.verifiedActivityCount,
        preferredTheme: user.preferredTheme || 'light',
        preferredLanguage: user.preferredLanguage || 'en',
        mobilityProfile: user.mobilityProfile || {
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
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};

// Get current user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'fullName', 'email', 'role', 'avatarUrl', 'bio', 'contributionCount', 'verifiedActivityCount', 'preferredTheme', 'preferredLanguage', 'mobilityProfile', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Get user's submitted places
    const submittedPlaces = await Place.findAll({
      where: { submittedById: user.id },
      order: [['createdAt', 'DESC']]
    });

    // Get user's reports
    const submittedReports = await AccessibilityReport.findAll({
      where: { userId: user.id },
      include: [{ model: Place, as: 'place', attributes: ['id', 'name', 'address'] }],
      order: [['createdAt', 'DESC']]
    });

    return res.json({
      success: true,
      user,
      submittedPlaces,
      submittedReports
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load user profile.', error: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, bio, avatarUrl } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (fullName) user.fullName = fullName.trim();
    if (bio !== undefined) user.bio = bio ? bio.trim() : null;
    if (avatarUrl) user.avatarUrl = avatarUrl;

    await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        contributionCount: user.contributionCount,
        verifiedActivityCount: user.verifiedActivityCount,
        preferredTheme: user.preferredTheme,
        preferredLanguage: user.preferredLanguage,
        mobilityProfile: user.mobilityProfile
      }
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile.', error: error.message });
  }
};

// Update Preferences (theme, language, mobility profile)
exports.updatePreferences = async (req, res) => {
  try {
    const { preferredTheme, preferredLanguage, mobilityProfile } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (preferredTheme && ['light', 'dark'].includes(preferredTheme)) {
      user.preferredTheme = preferredTheme;
    }
    if (preferredLanguage && ['en', 'si', 'ta'].includes(preferredLanguage)) {
      user.preferredLanguage = preferredLanguage;
    }
    if (mobilityProfile && typeof mobilityProfile === 'object') {
      user.mobilityProfile = mobilityProfile;
    }

    await user.save();

    return res.json({
      success: true,
      message: 'Preferences updated successfully.',
      preferences: {
        preferredTheme: user.preferredTheme,
        preferredLanguage: user.preferredLanguage,
        mobilityProfile: user.mobilityProfile
      }
    });
  } catch (error) {
    console.error('updatePreferences error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update preferences.', error: error.message });
  }
};

// Update Dedicated Mobility & Personal Accessibility Profile
exports.updateMobilityProfile = async (req, res) => {
  try {
    const { mobilityProfile } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (!mobilityProfile || typeof mobilityProfile !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid mobility profile payload.' });
    }

    user.mobilityProfile = mobilityProfile;
    await user.save();

    return res.json({
      success: true,
      message: 'Personal mobility profile saved successfully.',
      mobilityProfile: user.mobilityProfile
    });
  } catch (error) {
    console.error('updateMobilityProfile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update mobility profile.', error: error.message });
  }
};

