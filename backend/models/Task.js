const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { _id: true });

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    category: {
      type: String,
      enum: ['Work', 'Personal', 'Shopping', 'Health', 'Finance', 'Other'],
      default: 'Work'
    },
    dueDate: {
      type: Date,
      default: null
    },
    subtasks: [subtaskSchema],
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true
  }
);

// Add index for fast querying by user, status, priority, category
taskSchema.index({ user: 1, status: 1, priority: 1, category: 1 });

module.exports = mongoose.model('Task', taskSchema);
