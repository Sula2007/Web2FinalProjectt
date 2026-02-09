// controllers/adminController.js
// Controller for admin functionality

const User = require('../models/User');
const Task = require('../models/Task');
const { sendRoleUpgradeEmail } = require('../config/email');

/**
 * Get all users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;

    // Filters
    let filter = {};
    if (role) {
      filter.role = role;
    }
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

/**
 * Get user by ID
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's task statistics
    const taskStats = await Task.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        user,
        taskStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

/**
 * Change user role
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role
    const validRoles = ['user', 'premium', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed: ${validRoles.join(', ')}`
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Cannot change own role
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Send email notification about role upgrade
    if ((role === 'premium' || role === 'admin') && oldRole !== role) {
      await sendRoleUpgradeEmail(user.email, user.username, role);
    }

    res.json({
      success: true,
      message: `User role for ${user.username} changed from ${oldRole} to ${role}`,
      data: {
        userId: user._id,
        username: user.username,
        oldRole,
        newRole: role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing role',
      error: error.message
    });
  }
};

/**
 * Delete user
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Cannot delete yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account through admin panel'
      });
    }

    // Delete all user's tasks
    const deletedTasks = await Task.deleteMany({ userId: user._id });

    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `User ${user.username} and ${deletedTasks.deletedCount} tasks deleted`,
      data: {
        deletedUser: user.username,
        deletedTasksCount: deletedTasks.deletedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

/**
 * Get all tasks from all users
 */
exports.getAllTasks = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, priority, userId } = req.query;

    // Filters
    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (userId) filter.userId = userId;

    const tasks = await Task.find(filter)
      .populate('userId', 'username email role')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

/**
 * Delete any task (admin privilege)
 */
exports.deleteAnyTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Task "${task.title}" deleted by administrator`,
      data: {
        deletedTask: task.title,
        taskId: task._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};

/**
 * Get system statistics
 */
exports.getSystemStats = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // Users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Total tasks
    const totalTasks = await Task.countDocuments();

    // Tasks by status
    const tasksByStatus = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Tasks by priority
    const tasksByPriority = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top 5 most active users
    const topUsers = await Task.aggregate([
      {
        $group: {
          _id: '$userId',
          taskCount: { $sum: 1 }
        }
      },
      { $sort: { taskCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.username',
          email: '$user.email',
          taskCount: 1
        }
      }
    ]);

    // Tasks created in last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentTasks = await Task.countDocuments({
      createdAt: { $gte: weekAgo }
    });

    // New users in last 7 days
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: weekAgo }
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          byRole: usersByRole,
          recentRegistrations: recentUsers
        },
        tasks: {
          total: totalTasks,
          byStatus: tasksByStatus,
          byPriority: tasksByPriority,
          recentlyCreated: recentTasks
        },
        topUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};
