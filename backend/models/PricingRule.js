const mongoose = require('mongoose');
const PricingRuleSchema = new mongoose.Schema({
  name: String,
  type: String,
  startHour: Number,
  endHour: Number,
  multiplier: { type: Number, default: 1 },
  surcharge: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true }
});
module.exports = mongoose.model('PricingRule', PricingRuleSchema);
