const express = require('express');
const router = express.Router();
const PricingRule = require('../models/PricingRule');

// GET all pricing rules
router.get('/', async (req, res) => {
  try {
    const rules = await PricingRule.find();
    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pricing rules' });
  }
});

// CREATE new rule
router.post('/', async (req, res) => {
  try {
    const rule = await PricingRule.create(req.body);
    res.status(201).json(rule);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create rule' });
  }
});

// UPDATE rule
router.put('/:id', async (req, res) => {
  try {
    const updated = await PricingRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update rule' });
  }
});

// DELETE rule
router.delete('/:id', async (req, res) => {
  try {
    await PricingRule.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete rule' });
  }
});

module.exports = router;
