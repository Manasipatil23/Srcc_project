import express from 'express';
import {
  getAllLeaves,
  getTherapistLeaves,
  createLeave,
  updateLeaveStatus
} from '../controllers/leaveController.js';

const router = express.Router();

router.route('/')
  .get(getAllLeaves)
  .post(createLeave);

router.route('/therapist/:id')
  .get(getTherapistLeaves);

router.route('/:id/status')
  .put(updateLeaveStatus);

export default router;
