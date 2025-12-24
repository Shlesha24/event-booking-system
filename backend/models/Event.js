import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  city: { type: String, required: true },
  location: { type: String, required: true }, // NEW: Specific Venue
  price: { type: Number, required: true },
  totalSlots: { type: Number, required: true },
  bookedSlots: { type: Number, default: 0 },
  image: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);