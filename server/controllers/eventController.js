import Event from '../models/Event.js';
import RSVP from '../models/RSVP.js';
import { cloudinary, uploadToCloudinary } from '../middleware/upload.js';

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, capacity } = req.body;

    const eventData = {
      title,
      description,
      date,
      time,
      location,
      capacity: parseInt(capacity),
      creator: req.user.id,
    };

    // Add image if uploaded
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      eventData.imageUrl = result.secure_url;
      eventData.imagePublicId = result.public_id;
    }

    const event = await Event.create(eventData);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('creator', 'name email')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'name email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check ownership
    if (event.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const { title, description, date, time, location, capacity } = req.body;

    // Update fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    
    // Only allow increasing capacity or if no RSVPs
    if (capacity) {
      const newCapacity = parseInt(capacity);
      if (newCapacity < event.currentAttendees) {
        return res.status(400).json({ 
          message: 'Cannot reduce capacity below current attendees' 
        });
      }
      event.capacity = newCapacity;
    }

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary
      if (event.imagePublicId) {
        await cloudinary.uploader.destroy(event.imagePublicId);
      }
      const result = await uploadToCloudinary(req.file.buffer);
      event.imageUrl = result.secure_url;
      event.imagePublicId = result.public_id;
    }

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check ownership
    if (event.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    // Delete image from Cloudinary
    if (event.imagePublicId) {
      await cloudinary.uploader.destroy(event.imagePublicId);
    }

    // Delete all RSVPs for this event
    await RSVP.deleteMany({ event: event._id });

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};