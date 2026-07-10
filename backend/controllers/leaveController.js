import Leave from '../models/Leave.js';
import Therapist from '../models/Therapist.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// GET /api/leaves - Admin gets all leaves
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
    let leaves;
    const therapist = await Therapist.findOne({ userId: req.params.id });
    if (therapist) {
      leaves = await Leave.find({ therapistId: therapist._id }).sort({ createdAt: -1 });
    } else {
      leaves = await Leave.find({ therapistId: req.params.id }).sort({ createdAt: -1 });
    }
    res.json({ success: true, count: leaves?.length || 0, data: leaves || [] });
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

    let therapist = await Therapist.findOne({ userId: therapistId });
    if (!therapist) {
      therapist = await Therapist.findById(therapistId);
    }
    
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    const leave = await Leave.create({
      therapistId: therapist._id,
      therapistName: therapist.name,
      startDate,
      endDate,
      reason: reason || '',
      status: 'Pending',
    });

    // Notify Admins
    const admins = await User.find({ role: 'admin' }).select('_id');
    if (admins.length > 0) {
      await Notification.insertMany(
        admins.map(admin => ({
          targetUserId: admin._id,
          title: 'New Leave Request',
          message: `${therapist.name} has requested leave from ${startDate} to ${endDate}.`,
          type: 'alert'
        }))
      );
    }

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

    const therapist = await Therapist.findById(leave.therapistId);
    if (therapist && therapist.userId) {
      await Notification.create({
        targetUserId: therapist.userId,
        title: `Leave Request ${status}`,
        message: `Your leave request from ${leave.startDate} to ${leave.endDate} has been ${status.toLowerCase()} by the administrator.`,
        type: status === 'Approved' ? 'success' : 'alert'
      });
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
