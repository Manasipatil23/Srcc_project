import Leave from '../models/Leave.js';
import Therapist from '../models/Therapist.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// POST /api/leaves - Apply for leave (Therapist)
export const applyLeave = async (req, res, next) => {
  try {
    const { therapistId, startDate, endDate, reason } = req.body;

    if (!therapistId || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'therapistId, startDate and endDate are required' });
    }

    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    const leave = await Leave.create({
      therapistId: therapist._id,
      therapistName: therapist.name,
      startDate,
      endDate,
      reason: reason || '',
      status: 'Pending'
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

// GET /api/leaves/therapist/:id - Get leaves for a therapist
export const getTherapistLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find({ therapistId: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    next(error);
  }
};

// GET /api/leaves - Get all leaves (Admin)
export const getAllLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    next(error);
  }
};

// PUT /api/leaves/:id/status - Approve or reject leave (Admin)
export const updateLeaveStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be either 'Approved' or 'Rejected'" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    leave.status = status;
    await leave.save();

    // Fetch the therapist and notify their user account
    const therapist = await Therapist.findById(leave.therapistId);
    if (therapist && therapist.userId) {
      await Notification.create({
        targetUserId: therapist.userId,
        title: `Leave Request ${status}`,
        message: `Your leave request from ${leave.startDate} to ${leave.endDate} has been ${status.toLowerCase()} by the administrator.`,
        type: status === 'Approved' ? 'success' : 'alert'
      });
    }

    res.json({ success: true, data: leave });
  } catch (error) {
    next(error);
  }
};
