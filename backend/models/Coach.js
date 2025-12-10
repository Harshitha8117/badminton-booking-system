// backend/models/Coach.js
const mongoose = require('mongoose');

const UnavailablePeriodSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true }
}, { _id: false });

const CoachSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hourlyRate: { type: Number, default: 0 },
  availability: [{ day: Number, startHour: Number, endHour: Number }], // existing
  unavailablePeriods: { type: [UnavailablePeriodSchema], default: [] } // new
}, { timestamps: true });

module.exports = mongoose.model('Coach', CoachSchema);
