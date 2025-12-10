const PricingRule = require('../models/PricingRule');
exports.getRules = async (req, res) => { const rules = await PricingRule.find(); res.json(rules); };
exports.createRule = async (req, res) => { try{ const r = await PricingRule.create(req.body); res.json(r);}catch(e){res.status(400).json({error:e.message});}};
exports.updateRule = async (req, res) => { const { id } = req.params; const updated = await PricingRule.findByIdAndUpdate(id, req.body, { new: true, runValidators:true }); if (!updated) return res.status(404).json({ error: 'Not found' }); res.json(updated); };
exports.deleteRule = async (req, res) => { const { id } = req.params; await PricingRule.findByIdAndDelete(id); res.json({ success: true }); };
