import express from 'express';
import {
  getTimeSlots,
  getTherapistSlots,
  getWeeklySchedules,
  getAvailableSlotsForDate,
} from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/timeslots', getTimeSlots);
router.get('/slots', getTherapistSlots);
router.get('/weekly', getWeeklySchedules);
router.get('/available', getAvailableSlotsForDate);

export default router;
