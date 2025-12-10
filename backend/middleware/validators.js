// backend/middleware/validators.js
const { body } = require('express-validator');

const bookingCreationRules = [
  body('courtId').notEmpty().withMessage('courtId required'),
  body('startTime').notEmpty().withMessage('startTime required').isISO8601().toDate(),
  body('endTime').notEmpty().withMessage('endTime required').isISO8601().toDate(),
  body('equipment').optional().isObject(),
  body('coachId').optional().isMongoId()
];

module.exports = { bookingCreationRules };
