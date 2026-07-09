import express from 'express';
import {
  getTherapists,
  getTherapistById,
  getAvailability,
  updateAvailability,
  updateTherapist,
  updateStatus,
  deleteTherapist,
} from '../controllers/therapistController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTherapists);
router.get('/:id', getTherapistById);
router.get('/:id/availability', getAvailability);
router.put('/:id/availability', updateAvailability);
router.put('/:id/status', protect, authorize('admin'), updateStatus);
router.put('/:id', protect, authorize('admin'), updateTherapist);
router.delete('/:id', protect, authorize('admin'), deleteTherapist);

export default router;
