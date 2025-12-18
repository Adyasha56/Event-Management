import express from 'express';
import {
  createRSVP,
  deleteRSVP,
  getUserRSVPs,
  getEventRSVPs,
  checkUserRSVP,
} from '../controllers/rsvpController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// User's RSVPs
router.get('/my-rsvps', protect, getUserRSVPs);

// Event RSVPs
router.route('/:eventId')
  .post(protect, createRSVP)
  .delete(protect, deleteRSVP);

router.get('/:eventId/attendees', protect, getEventRSVPs);
router.get('/:eventId/check', protect, checkUserRSVP);

export default router;