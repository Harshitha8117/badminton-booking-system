// backend/controllers/bookingController.js
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Coach = require('../models/Coach');
const PricingRule = require('../models/PricingRule');

const calculatePrice = require('../utils/priceCalculator');
const { isResourceAvailable, checkAndReserveAtomic } = require('../utils/availability');

// GET /api/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ startTime: -1 })
      .populate('courtId')
      .populate('coachId')
      .lean();
    return res.json(bookings);
  } catch (err) {
    console.error('getAllBookings error', err);
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    // express-validator errors (route should include validators)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { userName, courtId, coachId, startTime, endTime, equipment } = req.body;

    if (!courtId || !startTime || !endTime) {
      return res.status(400).json({ error: 'courtId, startTime and endTime required' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // basic sanity
    if (start >= end) return res.status(400).json({ error: 'startTime must be before endTime' });

    // load resources
    const court = await Court.findById(courtId);
    if (!court) return res.status(400).json({ error: 'Court not found' });

    const coach = coachId ? await Coach.findById(coachId) : null;
    if (coach) {
      // check coach unavailablePeriods
      const blocked = (coach.unavailablePeriods || []).some(p => {
        const s = new Date(p.start), e = new Date(p.end);
        return (start < e && end > s);
      });
      if (blocked) return res.status(409).json({ error: 'Coach unavailable at this time' });
    }

    const rules = await PricingRule.find();

    // authoritative price calc
    const breakdown = calculatePrice({ court, coach, equipment, date: startTime, rules });

    // build booking payload (fields match Booking model)
    const bookingPayload = {
      userName: userName || 'Guest',
      courtId,
      coachId: coachId || null,
      startTime: start,
      endTime: end,
      equipment: equipment || { rackets: 0, shoes: 0 },
      pricingBreakdown: breakdown,
      status: 'confirmed'
    };

    // Atomically check & create booking via transaction helper
    const { success, booking, reason } = await checkAndReserveAtomic({
      courtId,
      coachId,
      start,
      end,
      bookingPayload
    });

    if (!success) {
      if (reason === 'conflict') return res.status(409).json({ error: 'Resource already booked at this time' });
      return res.status(500).json({ error: 'Could not create booking' });
    }

    // populate before returning
    const populated = await Booking.findById(booking._id).populate('courtId').populate('coachId');

    return res.status(201).json({ message: 'Booking successful', booking: populated });
  } catch (err) {
    console.error('createBooking transaction error', err);
    return res.status(500).json({ error: 'Booking failed' });
  }
};
