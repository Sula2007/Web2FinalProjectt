// controllers/preferencesController.js
// Controller for user preferences management

const User = require('../models/User');

/**
 * Get user preferences
 */
exports.getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('preferences');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return default preferences if none exist
    const defaultPreferences = {
      theme: 'light',
      language: 'en',
      timezone: 'America/New_York',
      emailNotifications: true,
      deadlineReminders: true,
      taskAssignmentNotifications: true,
      weeklyDigest: false
    };

    res.json({
      success: true,
      data: user.preferences || defaultPreferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching preferences',
      error: error.message
    });
  }
};

/**
 * Update user preferences
 */
exports.updatePreferences = async (req, res) => {
  try {
    const {
      theme,
      language,
      timezone,
      emailNotifications,
      deadlineReminders,
      taskAssignmentNotifications,
      weeklyDigest
    } = req.body;

    // Validate theme
    const validThemes = ['light', 'dark', 'auto'];
    if (theme && !validThemes.includes(theme)) {
      return res.status(400).json({
        success: false,
        message: `Invalid theme. Available: ${validThemes.join(', ')}`
      });
    }

    // Validate language
    const validLanguages = ['en', 'ru', 'kk'];
    if (language && !validLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: `Invalid language. Available: ${validLanguages.join(', ')}`
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update only provided fields
    user.preferences = {
      ...user.preferences,
      ...(theme && { theme }),
      ...(language && { language }),
      ...(timezone && { timezone }),
      ...(emailNotifications !== undefined && { emailNotifications }),
      ...(deadlineReminders !== undefined && { deadlineReminders }),
      ...(taskAssignmentNotifications !== undefined && { taskAssignmentNotifications }),
      ...(weeklyDigest !== undefined && { weeklyDigest })
    };

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating preferences',
      error: error.message
    });
  }
};

/**
 * Reset preferences to default
 */
exports.resetPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Default preferences
    user.preferences = {
      theme: 'light',
      language: 'en',
      timezone: 'America/New_York',
      emailNotifications: true,
      deadlineReminders: true,
      taskAssignmentNotifications: true,
      weeklyDigest: false
    };

    await user.save();

    res.json({
      success: true,
      message: 'Preferences reset to default values',
      data: user.preferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting preferences',
      error: error.message
    });
  }
};
