import mongoose from 'mongoose';
import Appointment from '../models/Appointment.js';
import Therapist from '../models/Therapist.js';
import Schedule from '../models/Schedule.js';
import Notification from '../models/Notification.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

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

    // Raise a pending payment so the accounts desk can collect it at the centre.
    const payment = await Payment.create({
      appointmentId: appointment._id,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      therapistName: therapist.name,
      serviceType: type,
      appointmentDate: date,
      amount: therapist.fee ?? 500,
    });

    await Notification.create({
      targetUserId: appointment.patientId,
      title: 'Appointment Booked',
      message: `Your ${type} with ${therapist.name} is confirmed for ${date} at ${time}. Consultation fee: ₹${payment.amount} (payable at the centre).`,
      type: 'success',
    });

    // Send email notifications
    try {
      // 1. To Patient
      if (appointment.patientId) {
        const patientUser = await User.findById(appointment.patientId);
        if (patientUser && patientUser.email) {
          const patientMsg = `
            <h2>Appointment Confirmed</h2>
            <p>Dear ${patientName},</p>
            <p>Your appointment for <strong>${type}</strong> with therapist <strong>${therapist.name}</strong> has been successfully booked.</p>
            <p><strong>Date:</strong> ${date}<br/>
            <strong>Time:</strong> ${time}<br/>
            <strong>Consultation Fee:</strong> ₹${payment.amount} (payable at the centre)</p>
            <p>Thank you for choosing SRCC Hospital.</p>
          `;
          await sendEmail({
            email: patientUser.email,
            subject: 'SRCC Hospital - Appointment Confirmed',
            html: patientMsg,
          });
        }
      }

      // 2. To Therapist
      if (therapist.email) {
        const therapistMsg = `
          <h2>New Appointment Booked</h2>
          <p>Dear ${therapist.name},</p>
          <p>A new appointment has been scheduled with you.</p>
          <p><strong>Patient Name:</strong> ${patientName}<br/>
          <strong>Service Type:</strong> ${type}<br/>
          <strong>Date:</strong> ${date}<br/>
          <strong>Time:</strong> ${time}</p>
          <p>Please log in to your portal to view details.</p>
        `;
        await sendEmail({
          email: therapist.email,
          subject: 'SRCC Hospital - New Appointment Booked',
          html: therapistMsg,
        });
      }
    } catch (err) {
      console.error('Failed to send appointment confirmation emails:', err);
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('appointment_updated', { therapistId: therapist._id });
    }

    res.status(201).json({ success: true, data: appointment, payment });
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

    appointment.date = date;
    appointment.time = time;
    await appointment.save();

    await Notification.create({
      targetUserId: appointment.patientId,
      title: 'Appointment Rescheduled',
      message: `Your session with ${appointment.therapistName} has been moved to ${date} at ${time}.`,
      type: 'success',
    });

    // Send email notifications
    try {
      // 1. To Patient
      if (appointment.patientId) {
        const patientUser = await User.findById(appointment.patientId);
        if (patientUser && patientUser.email) {
          const patientMsg = `
            <h2>Appointment Rescheduled</h2>
            <p>Dear ${appointment.patientName},</p>
            <p>Your appointment with therapist <strong>${appointment.therapistName}</strong> has been rescheduled.</p>
            <p><strong>New Date:</strong> ${date}<br/>
            <strong>New Time:</strong> ${time}</p>
            <p>Please log in to your portal to review any updates.</p>
          `;
          await sendEmail({
            email: patientUser.email,
            subject: 'SRCC Hospital - Appointment Rescheduled',
            html: patientMsg,
          });
        }
      }

      // 2. To Therapist
      if (appointment.therapistId) {
        const therapist = await Therapist.findById(appointment.therapistId);
        if (therapist && therapist.email) {
          const therapistMsg = `
            <h2>Appointment Rescheduled</h2>
            <p>Dear ${therapist.name},</p>
            <p>Your appointment with patient <strong>${appointment.patientName}</strong> has been rescheduled.</p>
            <p><strong>New Date:</strong> ${date}<br/>
            <strong>New Time:</strong> ${time}</p>
            <p>Please log in to your portal to review details.</p>
          `;
          await sendEmail({
            email: therapist.email,
            subject: 'SRCC Hospital - Appointment Rescheduled',
            html: therapistMsg,
          });
        }
      }
    } catch (err) {
      console.error('Failed to send reschedule notification emails:', err);
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('appointment_updated', { therapistId: appointment.therapistId });
    }

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
      // Drop any uncollected payment for this appointment; paid ones stay
      // on the books so the accounts desk can process a refund explicitly.
      await Payment.updateMany(
        { appointmentId: appointment._id, status: 'Pending' },
        { status: 'Cancelled' }
      );
      await Notification.create({
        targetUserId: appointment.patientId,
        title: 'Appointment Cancelled',
        message: `Your session with ${appointment.therapistName} on ${appointment.date} at ${appointment.time} has been cancelled.`,
        type: 'alert',
      });

      // Send cancellation emails
      try {
        // 1. To Patient
        if (appointment.patientId) {
          const patientUser = await User.findById(appointment.patientId);
          if (patientUser && patientUser.email) {
            const patientMsg = `
              <h2>Appointment Cancelled</h2>
              <p>Dear ${appointment.patientName},</p>
              <p>Your appointment with therapist <strong>${appointment.therapistName}</strong> scheduled for <strong>${appointment.date}</strong> at <strong>${appointment.time}</strong> has been cancelled.</p>
              <p>If you have any questions or would like to reschedule, please visit our portal or contact the support desk.</p>
            `;
            await sendEmail({
              email: patientUser.email,
              subject: 'SRCC Hospital - Appointment Cancelled',
              html: patientMsg,
            });
          }
        }

        // 2. To Therapist
        if (appointment.therapistId) {
          const therapist = await Therapist.findById(appointment.therapistId);
          if (therapist && therapist.email) {
            const therapistMsg = `
              <h2>Appointment Cancelled</h2>
              <p>Dear ${therapist.name},</p>
              <p>The appointment scheduled with you by patient <strong>${appointment.patientName}</strong> for <strong>${appointment.date}</strong> at <strong>${appointment.time}</strong> has been cancelled.</p>
            `;
            await sendEmail({
              email: therapist.email,
              subject: 'SRCC Hospital - Appointment Cancelled',
              html: therapistMsg,
            });
          }
        }
      } catch (err) {
        console.error('Failed to send cancellation notification emails:', err);
      }
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('appointment_updated', { therapistId: appointment.therapistId });
    }

    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};
