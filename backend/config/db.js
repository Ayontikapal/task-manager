const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';
  
  try {
    // Set strictQuery true/false for mongoose 8
    mongoose.set('strictQuery', false);
    
    console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000 // Quick timeout if local Mongo daemon isn't running
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Primary MongoDB Connection failed: ${error.message}`);
    console.log('Starting MongoMemoryServer fallback for hassle-free out-of-the-box execution...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`Fallback In-Memory MongoDB Connected: ${conn.connection.host}`);
    } catch (memErr) {
      console.error(`MongoDB Fallback connection failed: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
