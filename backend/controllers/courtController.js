const Court = require('../models/Court');
exports.getCourts = async (req, res) => { const courts = await Court.find(); res.json(courts); };
exports.createCourt = async (req, res) => { try { const court = await Court.create(req.body); res.json(court); } catch(e){ res.status(400).json({error:e.message}); } };
exports.updateCourt = async (req, res) => { const { id } = req.params; const updated = await Court.findByIdAndUpdate(id, req.body, { new: true, runValidators:true }); if (!updated) return res.status(404).json({ error: 'Not found' }); res.json(updated); };
exports.deleteCourt = async (req, res) => { const { id } = req.params; await Court.findByIdAndDelete(id); res.json({ success: true }); };
