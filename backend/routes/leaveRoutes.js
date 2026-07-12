import express from 'express';
import {
  getAllLeaves,
  getTherapistLeaves,
  createLeave,
  updateLeaveStatus,
  editLeaveRequest
} from '../controllers/leaveController.js';

const router = express.Router();

router.route('/')
  .get(getAllLeaves)
  .post(createLeave);

router.route('/therapist/:id')
  .get(getTherapistLeaves);

router.route('/:id/status')
  .put(updateLeaveStatus);

router.route('/:id/edit')
  .put(editLeaveRequest);

export default router;
