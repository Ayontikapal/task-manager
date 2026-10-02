const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Root endpoint test
app.get('/api', (req, res) => {
  res.json({ message: 'Task Manager API is running cleanly' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running cleanly' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5001;

// Only listen when executed directly (not when required as a Vercel serverless function)
if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Task Manager Express Server running on port ${PORT}`);
  });
}

module.exports = app;
