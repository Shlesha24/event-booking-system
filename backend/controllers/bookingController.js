import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import sendEmail from '../utils/sendEmail.js';

export const createBooking = async (req, res) => {
  try {
    const { eventId, transactionId } = req.body;

    // 🛡️ Lock: Check if this transaction or recent booking already exists
    const existingBooking = await Booking.findOne({
      $or: [
        { transactionId: transactionId },
        { 
          user: req.user._id, 
          event: eventId, 
          createdAt: { $gt: new Date(Date.now() - 5000) } 
        }
      ]
    });

    if (existingBooking) {
      return res.status(200).json({ message: "Booking already exists", booking: existingBooking });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.bookedSlots >= event.totalSlots) {
       return res.status(400).json({ message: "Sold out" });
    }

    // Create booking (Quantity removed)
    const booking = await Booking.create({ 
      user: req.user._id, 
      event: eventId,
      userEmail: req.user.email,
      transactionId: transactionId || `TXN-${Date.now()}`, 
      status: 'confirmed'
    });

    event.bookedSlots += 1;
    await event.save();

    const fullBooking = await Booking.findById(booking._id).populate('user').populate('event');

    if (fullBooking?.user?.email) {
      try {
        await sendEmail({
          email: fullBooking.user.email,
          subject: `Confirmed: ${fullBooking.event.title} 🎟️`,
          message: `Hi ${fullBooking.user.name}, your ticket for ${fullBooking.event.title} is confirmed!`,
        });
      } catch (mailErr) {
        console.error("❌ Mail Error:", mailErr.message);
      }
    }

    res.status(201).json({ message: "Ticket Booked successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};