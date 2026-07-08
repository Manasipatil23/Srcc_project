import express from 'express';
import {
  getAppointments,
  bookAppointment,
  updateAppointmentStatus,
  rescheduleAppointment,
} from '../controllers/appointmentController.js';

const router = express.Router();

router.get('/', getAppointments);
router.post('/book', bookAppointment);
router.put('/:id/status', updateAppointmentStatus);
router.put('/:id/reschedule', rescheduleAppointment);

export default router;
