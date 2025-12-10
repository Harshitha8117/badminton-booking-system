const router = require('express').Router();
const { getCoaches, createCoach, updateCoach, deleteCoach } = require('../controllers/coachController');
router.get('/', getCoaches);
router.post('/', createCoach);
router.put('/:id', updateCoach);
router.delete('/:id', deleteCoach);
module.exports = router;
