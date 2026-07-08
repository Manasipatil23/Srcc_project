import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import Therapist from '../models/Therapist.js';
import Schedule from '../models/Schedule.js';
import Notification from '../models/Notification.js';

// GET /api/appointments?userId=&therapistId=&status=
export const getAppointments = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.therapistId && mongoose.isValidObjectId(req.query.therapistId)) {
      filter.therapistId = req.query.therapistId;
    }
    if (req.query.userId && mongoose.isValidObjectId(req.query.userId)) {
      filter.patientId = req.query.userId;
    }
    if (req.query.status) filter.status = req.query.status;

    const appointments = await Appointment.find(filter).sort({ date: 1, time: 1 });
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    next(error);
  }
};

// POST /api/appointments/book
export const bookAppointment = async (req, res, next) => {
  try {
    const { therapistId, patientId, patientName, date, time, type } = req.body;

    if (!therapistId || !patientName || !date || !time || !type) {
      return res.status(400).json({
        success: false,
        message: 'therapistId, patientName, date, time and type are required',
      });
    }

    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    const clash = await Appointment.findOne({
      therapistId: therapist._id,
      date,
      time,
      status: 'Upcoming',
    });
    if (clash) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked for the selected therapist',
      });
    }

    const appointment = await Appointment.create({
      therapistId: therapist._id,
      therapistName: therapist.name,
      patientId: patientId && mongoose.isValidObjectId(patientId) ? patientId : null,
      patientName,
      date,
      time,
      status: 'Upcoming',
      type,
    });

    // Mark the therapist slot as unavailable
    await Schedule.findOneAndUpdate(
      { therapistId: therapist._id, day: null, 'slots.time': time },
      { $set: { 'slots.$.available': false, 'slots.$.patientName': patientName } }
    );

    await Notification.create({
      targetUserId: appointment.patientId,
      title: 'Appointment Booked',
      message: `Your ${type} with ${therapist.name} is confirmed for ${date} at ${time}.`,
      type: 'success',
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// PUT /api/appointments/:id/reschedule
export const rescheduleAppointment = async (req, res, next) => {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ success: false, message: 'date and time are required' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    if (appointment.status !== 'Upcoming') {
      return res.status(400).json({ success: false, message: 'Only upcoming appointments can be rescheduled' });
    }

    const clash = await Appointment.findOne({
      _id: { $ne: appointment._id },
      therapistId: appointment.therapistId,
      date,
      time,
      status: 'Upcoming',
    });
    if (clash) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked for the selected therapist',
      });
    }

    // Release the old slot, claim the new one
    await Schedule.findOneAndUpdate(
      { therapistId: appointment.therapistId, day: null, 'slots.time': appointment.time },
      { $set: { 'slots.$.available': true, 'slots.$.patientName': '' } }
    );
    await Schedule.findOneAndUpdate(
      { therapistId: appointment.therapistId, day: null, 'slots.time': time },
      { $set: { 'slots.$.available': false, 'slots.$.patientName': appointment.patientName } }
    );

    appointment.date = date;
    appointment.time = time;
    await appointment.save();

    await Notification.create({
      targetUserId: appointment.patientId,
      title: 'Appointment Rescheduled',
      message: `Your session with ${appointment.therapistName} has been moved to ${date} at ${time}.`,
      type: 'success',
    });

    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

// PUT /api/appointments/:id/status
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Upcoming', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be one of 'Upcoming', 'Completed', 'Cancelled'",
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    // Release the slot if the appointment was cancelled
    if (status === 'Cancelled') {
      await Schedule.findOneAndUpdate(
        { therapistId: appointment.therapistId, day: null, 'slots.time': appointment.time },
        { $set: { 'slots.$.available': true, 'slots.$.patientName': '' } }
      );

      await Notification.create({
        targetUserId: appointment.patientId,
        title: 'Appointment Cancelled',
        message: `Your session with ${appointment.therapistName} on ${appointment.date} at ${appointment.time} has been cancelled.`,
        type: 'alert',
      });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};
