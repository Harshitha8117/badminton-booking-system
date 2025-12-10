// backend/models/Lock.js
const mongoose = require('mongoose');

const LockSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. `${courtId}_${startISO}`
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

// ensure unique index on key
LockSchema.index({ key: 1 }, { unique: true });

module.exports = mongoose.model('Lock', LockSchema);
