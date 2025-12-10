const mongoose = require('mongoose');
const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: String,
  totalStock: { type: Number, default: 0 },
  pricePerUnit: { type: Number, default: 0 }
});
module.exports = mongoose.model('Equipment', EquipmentSchema);
