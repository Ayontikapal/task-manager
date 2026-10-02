const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// All task routes are protected
router.use(protect);

// @route   GET /api/tasks/stats
// @desc    Get task statistics for dashboard widgets
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'Completed').length;
    const pending = tasks.filter(t => t.status === 'Pending').length;
    const inProgress = tasks.filter(t => t.status === 'In Progress').length;
    const highPriority = tasks.filter(t => t.priority === 'High').length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const categoryCounts = {
      Work: tasks.filter(t => t.category === 'Work').length,
      Personal: tasks.filter(t => t.category === 'Personal').length,
      Shopping: tasks.filter(t => t.category === 'Shopping').length,
      Health: tasks.filter(t => t.category === 'Health').length,
      Finance: tasks.filter(t => t.category === 'Finance').length,
      Other: tasks.filter(t => t.category === 'Other').length
    };

    res.json({
      success: true,
      data: {
        total,
        completed,
        pending,
        inProgress,
        highPriority,
        completionRate,
        categoryCounts
      }
    });
  } catch (error) {
    console.error('Fetch task stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch task stats' });
  }
});

// @route   GET /api/tasks
// @desc    Get user tasks with search, status, priority, category filter and sorting
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, priority, category, search, sortBy } = req.query;

    let query = { user: req.user._id };

    // Filter by status if specified and not 'All'
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by priority if specified and not 'All'
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Filter by category if specified and not 'All'
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search query matching title or description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Sort options
    let sort = { createdAt: -1 }; // Default: newest first
    if (sortBy === 'dueDate') {
      sort = { dueDate: 1, createdAt: -1 };
    } else if (sortBy === 'priority') {
      // Custom priority sort strategy handled or basic
      sort = { priority: 1, createdAt: -1 };
    } else if (sortBy === 'title') {
      sort = { title: 1 };
    } else if (sortBy === 'oldest') {
      sort = { createdAt: 1 };
    }

    const tasks = await Task.find(query).sort(sort);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching tasks' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate, subtasks, tags } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description: description || '',
      status: status || 'Pending',
      priority: priority || 'Medium',
      category: category || 'Work',
      dueDate: dueDate || null,
      subtasks: subtasks || [],
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ success: false, message: 'Server error creating task' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching task' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { title, description, status, priority, category, dueDate, subtasks, tags } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (subtasks !== undefined) task.subtasks = subtasks;
    if (tags !== undefined) task.tags = tags;

    const updatedTask = await task.save();

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ success: false, message: 'Server error updating task' });
  }
});

// @route   PATCH /api/tasks/:id/toggle
// @desc    Quick toggle task status (Pending <-> Completed)
// @access  Private
router.patch('/:id/toggle', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
    const updatedTask = await task.save();

    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error toggling task status' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting task' });
  }
});

// @route   POST /api/tasks/seed
// @desc    Seed demo tasks for instant testing
// @access  Private
router.post('/seed', async (req, res) => {
  try {
    // Delete existing tasks for user if seed requested
    await Task.deleteMany({ user: req.user._id });

    const seedTasks = [
      {
        user: req.user._id,
        title: 'Design Task Manager UI Wireframes',
        description: 'Create glassmorphism design layouts in Figma with dark theme components.',
        status: 'Completed',
        priority: 'High',
        category: 'Work',
        dueDate: new Date(Date.now() + 86400000 * 1),
        subtasks: [
          { title: 'Color palette selection', completed: true },
          { title: 'Typography pairing', completed: true }
        ],
        tags: ['Design', 'Figma']
      },
      {
        user: req.user._id,
        title: 'Implement Express JWT Authentication',
        description: 'Build secure login and register endpoints with password hashing.',
        status: 'Completed',
        priority: 'High',
        category: 'Work',
        dueDate: new Date(Date.now() + 86400000 * 2),
        subtasks: [
          { title: 'Setup auth middleware', completed: true },
          { title: 'Add bcrypt hashing', completed: true }
        ],
        tags: ['Backend', 'Security']
      },
      {
        user: req.user._id,
        title: 'Setup MongoDB Task Schema & Routes',
        description: 'Configure CRUD API routes with filtering parameters for status, priority, and category.',
        status: 'In Progress',
        priority: 'High',
        category: 'Work',
        dueDate: new Date(Date.now() + 86400000 * 3),
        subtasks: [
          { title: 'Create Mongoose schema', completed: true },
          { title: 'Write query filter logic', completed: false }
        ],
        tags: ['Database', 'Express']
      },
      {
        user: req.user._id,
        title: 'Weekly Grocery & Pantry Restock',
        description: 'Buy fresh vegetables, whole grains, almond milk, and coffee beans.',
        status: 'Pending',
        priority: 'Medium',
        category: 'Shopping',
        dueDate: new Date(Date.now() + 86400000 * 4),
        subtasks: [
          { title: 'Organic produce', completed: false },
          { title: 'Dark roast coffee beans', completed: false }
        ],
        tags: ['Personal', 'Grocery']
      },
      {
        user: req.user._id,
        title: '30-Minute Evening Cardio & Stretch',
        description: 'Complete high-intensity intervals followed by full-body yoga stretch.',
        status: 'Pending',
        priority: 'Low',
        category: 'Health',
        dueDate: new Date(Date.now() + 86400000 * 1),
        subtasks: [
          { title: 'Warm-up 5 min', completed: false },
          { title: 'Interval run 20 min', completed: false }
        ],
        tags: ['Fitness', 'Routine']
      },
      {
        user: req.user._id,
        title: 'Review Monthly Budget & Subscriptions',
        description: 'Audit recurring SaaS expenses and update savings targets.',
        status: 'In Progress',
        priority: 'Medium',
        category: 'Finance',
        dueDate: new Date(Date.now() + 86400000 * 5),
        subtasks: [
          { title: 'Download bank statements', completed: true },
          { title: 'Cancel unused subscriptions', completed: false }
        ],
        tags: ['Money', 'Planning']
      }
    ];

    const inserted = await Task.insertMany(seedTasks);

    res.status(201).json({
      success: true,
      message: 'Demo tasks seeded successfully',
      data: inserted
    });
  } catch (error) {
    console.error('Seed tasks error:', error);
    res.status(500).json({ success: false, message: 'Failed to seed demo tasks' });
  }
});

module.exports = router;
