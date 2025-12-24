import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; 
import startScheduler from './utils/scheduler.js';

// Import your routes
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; // Already imported correctly!

dotenv.config();

// 1. Connect to Database
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// 2. Routes (MOVE PAYMENT ROUTE HERE)
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
console.log("💳 Payment routes registered at /api/payments");
app.use('/api/payments', paymentRoutes); // <--- Moved this up!

// Test Route
app.get('/test', (req, res) => {
  res.json({ message: "Backend server is working perfectly!" });
});

const PORT = process.env.PORT || 5000;

// 3. Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("Server running...");
  
  // Initialize the scheduler
  startScheduler(); 
});