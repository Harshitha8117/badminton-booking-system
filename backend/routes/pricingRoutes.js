const router = require('express').Router();
const { getRules, createRule, updateRule, deleteRule } = require('../controllers/pricingController');
router.get('/', getRules);
router.post('/', createRule);
router.put('/:id', updateRule);
router.delete('/:id', deleteRule);
module.exports = router;
