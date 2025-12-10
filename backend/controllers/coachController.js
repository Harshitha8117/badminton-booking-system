// backend/controllers/coachController.js
const Coach = require('../models/Coach');

exports.getCoaches = async (req, res) => {
  const coaches = await Coach.find();
  res.json(coaches);
};

exports.createCoach = async (req, res) => {
  try {
    const c = await Coach.create(req.body);
    res.json(c);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.updateCoach = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Coach.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.deleteCoach = async (req, res) => {
  const { id } = req.params;
  await Coach.findByIdAndDelete(id);
  res.json({ success: true });
};
