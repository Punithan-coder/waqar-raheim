import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import consultationRoutes from './routes/consultationRoutes.js';
import { testEmail } from './controllers/consultationController.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/consultation', consultationRoutes);

// Test Email Route
app.get('/api/test-email', testEmail);

// Global Error Handler for unhandled routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start Server & Connect Database
const startServer = async () => {
  try {
    // Spin up an in-memory MongoDB instance
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    console.log(`[DB Success] Connected to in-memory MongoDB at ${mongoUri}`);
    
    app.listen(PORT, () => {
      console.log(`[Server] Node.js backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[Startup Error] Failed to start server:', err);
  }
};

startServer();
