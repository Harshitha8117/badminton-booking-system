const router = require('express').Router();
const { getEquipment, createEquipment, updateEquipment, deleteEquipment } = require('../controllers/equipmentController');
router.get('/', getEquipment);
router.post('/', createEquipment);
router.put('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);
module.exports = router;
