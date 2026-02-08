// routes/admin.js
// Admin routes for user and system management

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/roleCheck');
const auth = require('../middleware/auth');
const { adminLimiter } = require('../middleware/rateLimiter');

// All admin routes are protected with auth + isAdmin middleware
// And have rate limiting

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Admin only
 */
router.get('/users', auth, isAdmin, adminLimiter, adminController.getAllUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get specific user
 * @access  Admin only
 */
router.get('/users/:id', auth, isAdmin, adminLimiter, adminController.getUserById);

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Change user role (user/premium/admin)
 * @access  Admin only
 */
router.put('/users/:id/role', auth, isAdmin, adminLimiter, adminController.updateUserRole);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Admin only
 */
router.delete('/users/:id', auth, isAdmin, adminLimiter, adminController.deleteUser);

/**
 * @route   GET /api/admin/tasks
 * @desc    Get all tasks from all users
 * @access  Admin only
 */
router.get('/tasks', auth, isAdmin, adminLimiter, adminController.getAllTasks);

/**
 * @route   DELETE /api/admin/tasks/:id
 * @desc    Delete any task (even not own)
 * @access  Admin only
 */
router.delete('/tasks/:id', auth, isAdmin, adminLimiter, adminController.deleteAnyTask);

/**
 * @route   GET /api/admin/stats
 * @desc    Get system statistics
 * @access  Admin only
 */
router.get('/stats', auth, isAdmin, adminLimiter, adminController.getSystemStats);

module.exports = router;
