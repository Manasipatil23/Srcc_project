import Leave from '../models/Leave.js';
import Therapist from '../models/Therapist.js';

// GET /api/leaves — Admin gets all leaves
export const getAllLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    next(error);
  }
};

// GET /api/leaves/therapist/:userId — Therapist gets their own leaves
export const getTherapistLeaves = async (req, res, next) => {
  try {
    const therapist = await Therapist.findOne({ userId: req.params.id });
    if (!therapist) {
      return res.json({ success: true, count: 0, data: [] });
    }
    const leaves = await Leave.find({ therapistId: therapist._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    next(error);
  }
};

// POST /api/leaves — Therapist requests a leave
export const createLeave = async (req, res, next) => {
  try {
    const { therapistId, startDate, endDate, reason } = req.body;

    if (!therapistId || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const therapist = await Therapist.findOne({ userId: therapistId });
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    const leave = await Leave.create({
      therapistId: therapist._id,
      therapistName: therapist.name,
      startDate,
      endDate,
      reason,
      status: 'Pending',
    });

    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
};

// PUT /api/leaves/:id/status — Admin approves/rejects a leave
export const updateLeaveStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('leave_updated', { therapistId: leave.therapistId });
    }

    res.json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
};
