import express from 'express';
import {
  appointmentsReport,
  paymentsReport,
  therapistUtilizationReport,
  summaryReport,
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/appointments', appointmentsReport);
router.get('/payments', paymentsReport);
router.get('/therapist-utilization', therapistUtilizationReport);
router.get('/summary', summaryReport);

export default router;
