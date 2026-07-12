import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import sendEmailUtility from '../utils/sendEmail.js';

const relativeTime = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
};

const toClientNotification = (n) => {
  const json = n.toJSON();
  return { ...json, time: relativeTime(json.time) };
};

// GET /api/notifications  (all, newest first)
export const getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ time: -1 });
    res.json({
      success: true,
      count: notifications.length,
      data: notifications.map(toClientNotification),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/notifications/:userId  (user-specific + broadcast)
export const getUserNotifications = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    const notifications = await Notification.find({
      $or: [{ targetUserId: req.params.userId }, { targetUserId: null }],
    }).sort({ time: -1 });

    res.json({
      success: true,
      count: notifications.length,
      data: notifications.map(toClientNotification),
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/notifications/:id/read
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, data: toClientNotification(notification) });
  } catch (error) {
    next(error);
  }
};

// POST /api/notifications/remind
export const sendReminders = async (req, res, next) => {
  try {
    const { patientIds, message, sendEmail, sendInApp } = req.body;

    if (!patientIds || !Array.isArray(patientIds) || patientIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least one patient' });
    }

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const users = await User.find({ _id: { $in: patientIds }, role: 'patient' });
    const results = [];

    for (const user of users) {
      let emailSuccess = false;
      let inAppSuccess = false;

      if (sendEmail) {
        try {
          const emailSent = await sendEmailUtility({
            email: user.email,
            subject: 'SRCC Hospital - Appointment Reminder',
            html: `<p>Hello ${user.name},</p><p>${message}</p>`,
          });
          emailSuccess = emailSent;
        } catch (err) {
          console.error(`Failed to send email to ${user.email}`, err);
        }
      }

      if (sendInApp) {
        try {
          await Notification.create({
            targetUserId: user._id,
            title: 'Appointment Reminder',
            message: message,
            type: 'info',
          });
          inAppSuccess = true;
        } catch (err) {
          console.error(`Failed to create notification for ${user._id}`, err);
        }
      }

      results.push({
        userId: user._id,
        name: user.name,
        emailSuccess,
        inAppSuccess
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reminders processed successfully',
      data: results
    });

  } catch (error) {
    next(error);
  }
};
