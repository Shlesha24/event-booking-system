import express from 'express';
import { 
  createEvent, 
  getEvents, 
  getEventById, // NEW: You need this controller function
  deleteEvent, 
  updateEvent 
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// PUBLIC ROUTES
router.get('/', getEvents);
router.get('/:id', getEventById); // ✅ ADD THIS: Needed for EventDetails.jsx

// PROTECTED ROUTES (Admin only)
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent); 
router.delete('/:id', protect, deleteEvent);

// EMAIL TEST ROUTE
router.get('/test-email', async (req, res) => {
  try {
    await sendEmail({
      email: "shleshakasoju@gmail.com",
      subject: "Test from EventBooker! 🚀",
      message: "If you are reading this, your email system is working perfectly!"
    });
    res.send("Email Sent! Check your inbox.");
  } catch (error) {
    res.status(500).send("Email failed: " + error.message);
  }
});

export default router;