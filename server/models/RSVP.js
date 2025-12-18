import mongoose from 'mongoose';

const rsvpSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Compound index to ensure one RSVP per user per event
rsvpSchema.index({ event: 1, user: 1 }, { unique: true });

export default mongoose.model('RSVP', rsvpSchema);