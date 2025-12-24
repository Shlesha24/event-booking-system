import express from 'express';
import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import { protect } from '../middleware/authMiddleware.js';
import { createBooking } from '../controllers/bookingController.js'; 

const router = express.Router();

router.get('/my-tickets', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({
      $or: [{ user: req.user._id }, { userEmail: req.user.email }]
    }).populate('event');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching tickets' });
  }
});

router.post('/', protect, createBooking);

router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const isOwner = (booking.user && booking.user.toString() === req.user._id.toString()) || 
                    (booking.userEmail === req.user.email);
    const isAdmin = req.user.role === 'admin';

    if (isOwner || isAdmin) {
      const event = await Event.findById(booking.event);
      if (event) {
        // Restore the specific quantity booked to the event capacity
        const restoreAmount = booking.quantity || 1;
        event.bookedSlots = Math.max(0, (event.bookedSlots || 0) - restoreAmount); 
        await event.save();
      }

      await Booking.findByIdAndDelete(req.params.id); 
      res.json({ message: 'Cancelled successfully' });
    } else {
      res.status(403).json({ message: 'Not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while canceling' });
  }
});

export default router;