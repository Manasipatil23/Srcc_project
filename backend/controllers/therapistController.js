import Therapist from '../models/Therapist.js';
import Schedule from '../models/Schedule.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// GET /api/therapists
export const getTherapists = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.availability) filter.availability = req.query.availability;
    if (req.query.specialty) filter.specialty = new RegExp(req.query.specialty, 'i');

    // Default to approved therapists only (legacy docs without a status field
    // count as approved); pass ?status=all for the admin view, or a specific status.
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    } else if (!req.query.status) {
      filter.status = { $nin: ['Pending', 'Rejected'] };
    }

    const therapists = await Therapist.find(filter).sort({ createdAt: 1 });
    res.json({ success: true, count: therapists.length, data: therapists });
  } catch (error) {
    next(error);
  }
};

// GET /api/therapists/:id
export const getTherapistById = async (req, res, next) => {
  try {
    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }
    res.json({ success: true, data: therapist });
  } catch (error) {
    next(error);
  }
};

// PUT /api/therapists/:id  (admin only) — update therapist details
export const updateTherapist = async (req, res, next) => {
  try {
    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    const { name, specialty, qualification, experience, email, phone, image } = req.body;
    if (name !== undefined) therapist.name = name;
    if (specialty !== undefined) therapist.specialty = specialty;
    if (qualification !== undefined) therapist.qualification = qualification;
    if (experience !== undefined) therapist.experience = Math.max(0, Number(experience) || 0);
    if (email !== undefined) therapist.email = email;
    if (phone !== undefined) therapist.phone = phone;
    if (image !== undefined) therapist.image = image;
    await therapist.save();

    // Keep the linked login account in sync so the therapist can still sign in.
    if (therapist.userId && (name !== undefined || email !== undefined)) {
      const update = {};
      if (name !== undefined) update.name = name;
      if (email !== undefined) update.email = email;
      await User.updateOne({ _id: therapist.userId }, update);
    }

    res.json({ success: true, data: therapist });
  } catch (error) {
    next(error);
  }
};

// PUT /api/therapists/:id/status  (admin only) — approve or reject a registration
export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Approved' or 'Rejected'",
      });
    }

    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    therapist.status = status;
    await therapist.save();

    await Notification.create({
      targetUserId: therapist.userId,
      title: status === 'Approved' ? 'Account Approved' : 'Registration Not Approved',
      message:
        status === 'Approved'
          ? 'Your therapist account has been verified by the SRCC admin. You can now sign in to the Therapist Portal.'
          : 'Your therapist registration was reviewed and not approved. Please contact the SRCC administrator for more details.',
      type: status === 'Approved' ? 'success' : 'alert',
    });

    res.json({ success: true, data: therapist });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/therapists/:id  (admin only) — remove therapist profile and login account
export const deleteTherapist = async (req, res, next) => {
  try {
    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    await Schedule.deleteMany({ therapistId: therapist._id });
    if (therapist.userId) {
      await User.deleteOne({ _id: therapist.userId });
    }
    await therapist.deleteOne();

    res.json({ success: true, message: 'Therapist removed' });
  } catch (error) {
    next(error);
  }
};

// Helper utilities for availability calculations
const parseTime = (timeStr) => {
  const cleanStr = timeStr.trim().replace(/\s+/g, ' ').toUpperCase();
  const match = cleanStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3];

  if (hours === 12) hours = 0;
  if (modifier === 'PM') hours += 12;
  return hours * 60 + minutes;
};

const formatTime = (minutes) => {
  let hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const modifier = hours >= 12 ? 'PM' : 'AM';
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(mins)} ${modifier}`;
};

const generateSlotsFromInterval = (startStr, endStr) => {
  const start = parseTime(startStr);
  const end = parseTime(endStr);
  const slots = [];
  for (let t = start; t < end; t += 30) {
    slots.push({ time: formatTime(t), available: true });
  }
  return slots;
};

const groupSlotsIntoIntervals = (slots) => {
  if (!slots || slots.length === 0) return [];
  const sortedSlots = [...slots].sort((a, b) => parseTime(a.time) - parseTime(b.time));

  const intervals = [];
  let currentStart = sortedSlots[0].time;
  let currentEnd = formatTime(parseTime(currentStart) + 30);

  for (let i = 1; i < sortedSlots.length; i++) {
    const time = sortedSlots[i].time;
    const prevTimeInMinutes = parseTime(sortedSlots[i - 1].time);
    const currentTimeInMinutes = parseTime(time);

    if (currentTimeInMinutes === prevTimeInMinutes + 30) {
      currentEnd = formatTime(currentTimeInMinutes + 30);
    } else {
      intervals.push({ start: currentStart, end: currentEnd });
      currentStart = time;
      currentEnd = formatTime(currentTimeInMinutes + 30);
    }
  }
  intervals.push({ start: currentStart, end: currentEnd });
  return intervals;
};

// GET /api/therapists/:id/availability
export const getAvailability = async (req, res, next) => {
  try {
    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    const docs = await Schedule.find({ therapistId: therapist._id, day: { $ne: null } });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const schedule = {};
    days.forEach((day) => {
      schedule[day] = { active: false, slots: [] };
    });

    for (const doc of docs) {
      if (doc.day && days.includes(doc.day) && doc.slots.length > 0) {
        schedule[doc.day] = {
          active: true,
          slots: groupSlotsIntoIntervals(doc.slots),
        };
      }
    }

    res.json({
      success: true,
      data: {
        availability: therapist.availability,
        schedule,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/therapists/:id/availability
export const updateAvailability = async (req, res, next) => {
  try {
    const { availability, weeklySchedule } = req.body;

    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) {
      return res.status(404).json({ success: false, message: 'Therapist not found' });
    }

    if (availability) {
      if (!['Available', 'Busy', 'Unavailable'].includes(availability)) {
        return res.status(400).json({
          success: false,
          message: "Availability must be one of 'Available', 'Busy', 'Unavailable'",
        });
      }
      therapist.availability = availability;
      await therapist.save();
    }

    if (weeklySchedule && typeof weeklySchedule === 'object') {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

      for (const day of days) {
        const dayData = weeklySchedule[day];

        if (dayData && dayData.active && Array.isArray(dayData.slots) && dayData.slots.length > 0) {
          const slots = [];
          dayData.slots.forEach((interval) => {
            if (interval.start && interval.end) {
              const generated = generateSlotsFromInterval(interval.start, interval.end);
              generated.forEach((s) => {
                slots.push({
                  time: s.time,
                  available: true,
                  patientName: '',
                });
              });
            }
          });

          const uniqueSlotsMap = new Map();
          slots.forEach((s) => uniqueSlotsMap.set(s.time, s));
          const sortedSlots = Array.from(uniqueSlotsMap.values()).sort(
            (a, b) => parseTime(a.time) - parseTime(b.time)
          );

          await Schedule.findOneAndUpdate(
            { therapistId: therapist._id, day },
            {
              therapistId: therapist._id,
              therapistName: therapist.name,
              day,
              slots: sortedSlots,
            },
            { upsert: true, new: true }
          );
        } else {
          await Schedule.deleteOne({ therapistId: therapist._id, day });
        }
      }
    }

    res.json({
      success: true,
      message: 'Availability updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
