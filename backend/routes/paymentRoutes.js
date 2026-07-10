import express from 'express';
import {
  getPayments,
  collectPayment,
  refundPayment,
  waivePayment,
  getPaymentsSummary,
} from '../controllers/paymentController.js';

const router = express.Router();

router.get('/', getPayments);
router.get('/summary', getPaymentsSummary);
router.put('/:id/collect', collectPayment);
router.put('/:id/refund', refundPayment);
router.put('/:id/waive', waivePayment);

export default router;
