const mongoose = require('mongoose');
const CourtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['indoor','outdoor'], required: true },
  basePrice: { type: Number, default: 10, required: true },
  isActive: { type: Boolean, default: true }
});
module.exports = mongoose.model('Court', CourtSchema);
