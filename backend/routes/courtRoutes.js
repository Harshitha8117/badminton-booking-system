const router = require('express').Router();
const { getCourts, createCourt, updateCourt, deleteCourt } = require('../controllers/courtController');
router.get('/', getCourts);
router.post('/', createCourt);
router.put('/:id', updateCourt);
router.delete('/:id', deleteCourt);
module.exports = router;
