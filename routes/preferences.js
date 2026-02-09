// routes/preferences.js
// Routes for user preferences

const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preferencesController');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/preferences
 * @desc    Get user preferences
 * @access  Private
 */
router.get('/', auth, preferencesController.getPreferences);

/**
 * @route   PUT /api/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put('/', auth, preferencesController.updatePreferences);

/**
 * @route   POST /api/preferences/reset
 * @desc    Reset preferences to default
 * @access  Private
 */
router.post('/reset', auth, preferencesController.resetPreferences);

module.exports = router;
