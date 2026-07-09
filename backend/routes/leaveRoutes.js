import express from 'express';
import {
  applyLeave,
  getTherapistLeaves,
  getAllLeaves,
  updateLeaveStatus
} from '../controllers/leaveController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', applyLeave);
router.get('/therapist/:id', getTherapistLeaves);
router.get('/', protect, authorize('admin'), getAllLeaves);
router.put('/:id/status', protect, authorize('admin'), updateLeaveStatus);

export default router;
