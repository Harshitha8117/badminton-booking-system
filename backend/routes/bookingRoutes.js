// backend/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { bookingCreationRules } = require('../middleware/validators');

router.post('/', bookingCreationRules, bookingController.createBooking);
router.get('/', bookingController.getAllBookings);

module.exports = router;
