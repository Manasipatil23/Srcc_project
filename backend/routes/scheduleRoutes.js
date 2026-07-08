import express from 'express';
import {
  getTimeSlots,
  getTherapistSlots,
  getWeeklySchedules,
} from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/timeslots', getTimeSlots);
router.get('/slots', getTherapistSlots);
router.get('/weekly', getWeeklySchedules);

export default router;
