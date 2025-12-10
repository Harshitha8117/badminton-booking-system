const Equipment = require('../models/Equipment');
exports.getEquipment = async (req, res) => { const items = await Equipment.find(); res.json(items); };
exports.createEquipment = async (req, res) => { try{ const it = await Equipment.create(req.body); res.json(it);}catch(e){res.status(400).json({error:e.message});}};
exports.updateEquipment = async (req, res) => { const { id } = req.params; const updated = await Equipment.findByIdAndUpdate(id, req.body, { new: true, runValidators:true }); if (!updated) return res.status(404).json({ error: 'Not found' }); res.json(updated); };
exports.deleteEquipment = async (req, res) => { const { id } = req.params; await Equipment.findByIdAndDelete(id); res.json({ success: true }); };
