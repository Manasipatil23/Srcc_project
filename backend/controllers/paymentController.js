import mongoose from 'mongoose';
import Payment from '../models/Payment.js';

const generateReceiptNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Payment.countDocuments({ receiptNumber: { $ne: null } });
  return `SRCC-${year}-${String(count + 1).padStart(5, '0')}`;
};

// GET /api/payments?status=&patientId=&from=&to=
export const getPayments = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.patientId && mongoose.isValidObjectId(req.query.patientId)) {
      filter.patientId = req.query.patientId;
    }
    if (req.query.from || req.query.to) {
      filter.appointmentDate = {};
      if (req.query.from) filter.appointmentDate.$gte = req.query.from;
      if (req.query.to) filter.appointmentDate.$lte = req.query.to;
    }

    const payments = await Payment.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    next(error);
  }
};

// PUT /api/payments/:id/collect  { mode, notes? }
export const collectPayment = async (req, res, next) => {
  try {
    const { mode, notes } = req.body;
    if (!['Cash', 'Card', 'UPI', 'Cheque'].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "mode must be one of 'Cash', 'Card', 'UPI', 'Cheque'",
      });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    if (payment.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Only pending payments can be collected (current status: ${payment.status})`,
      });
    }

    payment.mode = mode;
    payment.status = 'Paid';
    payment.receiptNumber = await generateReceiptNumber();
    payment.collectedAt = new Date();
    if (notes) payment.notes = notes;
    await payment.save();

    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// PUT /api/payments/:id/refund  { notes? }
export const refundPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    if (payment.status !== 'Paid') {
      return res.status(400).json({
        success: false,
        message: `Only paid payments can be refunded (current status: ${payment.status})`,
      });
    }

    payment.status = 'Refunded';
    if (req.body?.notes) payment.notes = req.body.notes;
    await payment.save();

    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// PUT /api/payments/:id/waive  { notes? }
export const waivePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    if (payment.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Only pending payments can be waived (current status: ${payment.status})`,
      });
    }

    payment.status = 'Waived';
    if (req.body?.notes) payment.notes = req.body.notes;
    await payment.save();

    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// GET /api/payments/summary
export const getPaymentsSummary = async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const monthStart = today.slice(0, 8) + '01';

    const [rows] = await Payment.aggregate([
      {
        $facet: {
          collectedToday: [
            { $match: { status: 'Paid', appointmentDate: today } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
          ],
          collectedThisMonth: [
            { $match: { status: 'Paid', appointmentDate: { $gte: monthStart, $lte: today } } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
          ],
          byStatus: [
            { $group: { _id: '$status', total: { $sum: '$amount' }, count: { $sum: 1 } } },
          ],
        },
      },
    ]);

    const statusMap = Object.fromEntries(
      rows.byStatus.map((s) => [s._id, { total: s.total, count: s.count }])
    );

    res.json({
      success: true,
      data: {
        collectedToday: rows.collectedToday[0] || { total: 0, count: 0 },
        collectedThisMonth: rows.collectedThisMonth[0] || { total: 0, count: 0 },
        paid: statusMap.Paid || { total: 0, count: 0 },
        pending: statusMap.Pending || { total: 0, count: 0 },
        refunded: statusMap.Refunded || { total: 0, count: 0 },
        waived: statusMap.Waived || { total: 0, count: 0 },
      },
    });
  } catch (error) {
    next(error);
  }
};
