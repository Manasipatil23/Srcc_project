import express from 'express';
import {
  getTherapists,
  getTherapistById,
  updateAvailability,
} from '../controllers/therapistController.js';

const router = express.Router();

router.get('/', getTherapists);
router.get('/:id', getTherapistById);
router.put('/:id/availability', updateAvailability);

export default router;
