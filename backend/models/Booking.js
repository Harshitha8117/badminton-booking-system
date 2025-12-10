const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userName: { type: String, required: true },

  courtId: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },

  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach', default: null },

  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },

  equipment: {
    rackets: { type: Number, default: 0 },
    shoes: { type: Number, default: 0 }
  },

  pricingBreakdown: {
    basePrice: Number,
    total: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
