// backend/utils/availability.js
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Lock = require('../models/Lock');

/**
 * Simple non-atomic availability check (for UI)
 */
async function isResourceAvailable({ courtId, coachId, start, end }) {
  const conflict = await Booking.findOne({
    $or: [
      { courtId },
      coachId ? { coachId } : null
    ].filter(Boolean),
    startTime: { $lt: end },
    endTime: { $gt: start },
    status: { $ne: 'cancelled' }
  });
  return !conflict;
}

/**
 * Attempt to perform an atomic check+reserve. Strategy:
 * 1) Try using MongoDB transactions (startSession). If API not supported or fails, fall back to lock method.
 * 2) Lock method: insert Lock doc with unique key `${courtId}_${startISO}`.
 *    - If lock insert fails => conflict.
 *    - If lock insert succeeds => create booking and then KEEP the lock (or remove it after booking creation).
 *
 * Note: if booking creation fails after lock insert, we remove the lock to let others try.
 */
async function checkAndReserveAtomic({ courtId, coachId, start, end, bookingPayload }) {
  // First: try transactions (if environment supports them)
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const conflict = await Booking.findOne({
      $or: [
        { courtId },
        coachId ? { coachId } : null
      ].filter(Boolean),
      startTime: { $lt: end },
      endTime: { $gt: start },
      status: { $ne: 'cancelled' }
    }).session(session);

    if (conflict) {
      await session.abortTransaction();
      session.endSession();
      return { success: false, reason: 'conflict' };
    }

    const [created] = await Booking.create([ bookingPayload ], { session });
    await session.commitTransaction();
    session.endSession();

    return { success: true, booking: created };
  } catch (txErr) {
    // Transactions failed (likely because Mongo is standalone) — fall back to lock-based approach.
    // console.warn('Transaction attempt failed, falling back to lock method:', txErr.message);
  }

  // Fallback lock method
  const startISO = (new Date(start)).toISOString();
  const lockKey = `${String(courtId)}_${startISO}`;

  try {
    // Try to create a lock. If a duplicate key error occurs, another process holds the lock -> conflict.
    await Lock.create({ key: lockKey });

    // Now re-check conflicts (race window small because lock prevents others from creating lock)
    const conflictAfterLock = await Booking.findOne({
      $or: [
        { courtId },
        coachId ? { coachId } : null
      ].filter(Boolean),
      startTime: { $lt: end },
      endTime: { $gt: start },
      status: { $ne: 'cancelled' }
    });

    if (conflictAfterLock) {
      // remove lock and report conflict
      await Lock.deleteOne({ key: lockKey }).catch(()=>{});
      return { success: false, reason: 'conflict' };
    }

    // Create booking
    const created = await Booking.create(bookingPayload);

    // Option A: keep the lock to record that slot was reserved (harmless)
    // Option B: remove lock because the booking exists and uniqueness is enforced by booking data too.
    // We'll remove the lock to keep collection tidy:
    await Lock.deleteOne({ key: lockKey }).catch(()=>{});

    return { success: true, booking: created };
  } catch (lockErr) {
    // Duplicate key error code from MongoDB is 11000
    const isDup = (lockErr && lockErr.code === 11000) || (lockErr && /duplicate key/.test(lockErr.message || ''));
    if (isDup) {
      return { success: false, reason: 'conflict' };
    }

    // Other errors: propagate so caller can log & respond 500
    throw lockErr;
  }
}

module.exports = { isResourceAvailable, checkAndReserveAtomic };
