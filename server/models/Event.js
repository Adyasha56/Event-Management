import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters'],
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date'],
  },
  time: {
    type: String,
    required: [true, 'Please add an event time'],
  },
  location: {
    type: String,
    required: [true, 'Please add a location'],
    trim: true,
  },
  capacity: {
    type: Number,
    required: [true, 'Please add capacity'],
    min: [1, 'Capacity must be at least 1'],
  },
  currentAttendees: {
    type: Number,
    default: 0,
    min: 0,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  imagePublicId: {
    type: String,
    default: '',
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Index for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ creator: 1 });

export default mongoose.model('Event', eventSchema);