import express from 'express';
import { getAllFeedback, getTherapistFeedback, submitFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

router.get('/', getAllFeedback);
router.get('/therapist/:therapistId', getTherapistFeedback);
router.post('/', submitFeedback);

export default router;
