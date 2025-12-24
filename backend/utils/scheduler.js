import cron from 'node-cron';
import Booking from '../models/Booking.js';
import sendEmail from './sendEmail.js';

const startScheduler = () => {
  // Set to '0 * * * *' to run once every hour at the 0th minute (e.g., 10:00, 11:00)
  cron.schedule('0 * * * *', async () => {
    console.log("⏰ [Scheduler] Checking for events happening tomorrow...");

    try {
      // 1. Define the 24-hour window for "Tomorrow"
      const tomorrowStart = new Date();
      tomorrowStart.setDate(tomorrowStart.getDate() + 1);
      tomorrowStart.setHours(0, 0, 0, 0); // 12:00 AM Tomorrow

      const tomorrowEnd = new Date(tomorrowStart);
      tomorrowEnd.setHours(23, 59, 59, 999); // 11:59 PM Tomorrow

      // 2. Query MongoDB for bookings within that date range
      const reminders = await Booking.find()
        .populate({
          path: 'event',
          match: {
            date: { $gte: tomorrowStart, $lte: tomorrowEnd }
          }
        })
        .populate('user');

      const validReminders = reminders.filter(b => b.event !== null);

      if (validReminders.length === 0) return;

      console.log(`🔔 [Scheduler] Sending ${validReminders.length} daily reminders.`);

      // 3. Send the emails
      for (const booking of validReminders) {
        await sendEmail({
          email: booking.user.email,
          subject: `Reminder: ${booking.event.title} is Tomorrow! 🚀`,
          message: `Hi ${booking.user.name},\n\nThis is a friendly reminder that your event "${booking.event.title}" is happening tomorrow!\n\n📍 Location: ${booking.event.location}\n\nWe look forward to seeing you there!`
        });
      }
    } catch (error) {
      console.error("❌ [Scheduler Error]:", error.message);
    }
  });

  console.log("🚀 Scheduler initialized: Running hourly checks for tomorrow's events.");
};

export default startScheduler;