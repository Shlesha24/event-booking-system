import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false 
  },
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'Event' 
  },
  userEmail: { 
    type: String, 
    required: true 
  },
  // ✅ ADDED: Quantity field
  quantity: { 
    type: Number, 
    default: 1, 
    required: true 
  },
  transactionId: { 
    type: String, 
    required: true,
    unique: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending' 
  },
  bookedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;