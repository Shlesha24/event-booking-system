import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Booking from '../models/Booking.js'; 
import Event from '../models/Event.js'; 
import sendEmail from '../utils/sendEmail.js'; 

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { event, userEmail, userId } = req.body; 

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr', 
          product_data: { name: event.title, images: [event.image] },
          unit_amount: event.price * 100, 
        },
        quantity: 1, // This is Stripe's internal counter, keep it at 1
      }],
      mode: 'payment',
      metadata: { userId, eventId: event._id }, 
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/success?session_id={CHECKOUT_SESSION_ID}&eventId=${event._id}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cancel`,
      customer_email: userEmail,
    });
    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify-payment', async (req, res) => {
  try {
    const { sessionId, eventId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // 🛡️ PREVENTS DOUBLE BOOKING
      let booking = await Booking.findOne({ transactionId: sessionId });
      
      if (!booking) {
        booking = new Booking({
          user: session.metadata.userId,
          event: eventId,
          userEmail: session.customer_details.email,
          status: 'confirmed',
          transactionId: sessionId,
        });
        await booking.save();

        const event = await Event.findById(eventId);
        if (event) {
          event.bookedSlots += 1;
          await event.save();
        }

        try {
          await sendEmail({
            email: session.customer_details.email,
            subject: `Confirmed: ${event.title} 🎟️`,
            message: `Your ticket is confirmed!\n\nEvent: ${event.title}\nTicket ID: ${booking._id}`
          });
        } catch (mailErr) { console.log("Email failed"); }
      }
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; // THIS IS THE MOST IMPORTANT LINE