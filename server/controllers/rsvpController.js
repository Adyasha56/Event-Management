import mongoose from 'mongoose';
import Event from '../models/Event.js';
import RSVP from '../models/RSVP.js';

/**
 * CRITICAL: RSVP with Concurrency Control
 * 
 * This implementation uses MongoDB transactions and atomic operations
 * to prevent race conditions when multiple users RSVP simultaneously.
 * 
 * Strategy:
 * 1. Start a MongoDB session with transaction
 * 2. Use findOneAndUpdate with atomic increment
 * 3. Check capacity constraint atomically
 * 4. Rollback on failure
 */
export const createRSVP = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Check if RSVP already exists
    const existingRSVP = await RSVP.findOne({ 
      event: eventId, 
      user: userId 
    }).session(session);

    if (existingRSVP) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'You have already RSVP\'d to this event' });
    }

    // Atomic update: increment currentAttendees only if below capacity
    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        $expr: { $lt: ['$currentAttendees', '$capacity'] } // Capacity check
      },
      {
        $inc: { currentAttendees: 1 } // Atomic increment
      },
      {
        new: true,
        session, // Include in transaction
      }
    );

    if (!event) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Event is full or not found' });
    }

    // Create RSVP record
    const rsvp = await RSVP.create([{
      event: eventId,
      user: userId,
    }], { session });

    await session.commitTransaction();
    
    res.status(201).json({
      message: 'RSVP successful',
      rsvp: rsvp[0],
      event,
    });
  } catch (error) {
    await session.abortTransaction();
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already RSVP\'d to this event' });
    }
    
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

export const deleteRSVP = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    // Find and delete RSVP
    const rsvp = await RSVP.findOneAndDelete({
      event: eventId,
      user: userId,
    }).session(session);

    if (!rsvp) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'RSVP not found' });
    }

    // Atomic decrement
    await Event.findByIdAndUpdate(
      eventId,
      { $inc: { currentAttendees: -1 } },
      { session }
    );

    await session.commitTransaction();
    
    res.json({ message: 'RSVP cancelled successfully' });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

export const getUserRSVPs = async (req, res) => {
  try {
    const rsvps = await RSVP.find({ user: req.user.id })
      .populate({
        path: 'event',
        populate: { path: 'creator', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventRSVPs = async (req, res) => {
  try {
    const rsvps = await RSVP.find({ event: req.params.eventId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkUserRSVP = async (req, res) => {
  try {
    const rsvp = await RSVP.findOne({
      event: req.params.eventId,
      user: req.user.id,
    });

    res.json({ hasRSVP: !!rsvp, rsvp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};