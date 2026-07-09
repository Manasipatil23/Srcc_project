import Schedule from '../models/Schedule.js';
import Therapist from '../models/Therapist.js';
import Appointment from '../models/Appointment.js';
import Leave from '../models/Leave.js';

// Default global slots template
const DEFAULT_GLOBAL_SLOTS = [
  { time: '09:00 AM', available: true },
  { time: '09:30 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: true },
  { time: '11:30 AM', available: true },
  { time: '12:00 PM', available: true },
  { time: '12:30 PM', available: true },
  { time: '01:00 PM', available: true },
  { time: '01:30 PM', available: true },
  { time: '02:00 PM', available: true },
  { time: '02:30 PM', available: true },
  { time: '03:00 PM', available: true },
  { time: '03:30 PM', available: true },
  { time: '04:00 PM', available: true },
  { time: '04:30 PM', available: true },
  { time: '05:00 PM', available: true },
];

// GET /api/schedules/timeslots — global booking time-slot template
export const getTimeSlots = async (req, res, next) => {
  try {
    let template = await Schedule.findOne({ therapistId: null, day: null });
    if (!template) {
      template = await Schedule.create({
        therapistId: null,
        therapistName: '',
        day: null,
        slots: DEFAULT_GLOBAL_SLOTS,
      });
    }
    const slots = template.slots.map((s) => ({ time: s.time, available: s.available }));
    res.json({ success: true, count: slots.length, data: slots });
  } catch (error) {
    next(error);
  }
};

// GET /api/schedules/slots — per-therapist daily slots keyed by therapist name
export const getTherapistSlots = async (req, res, next) => {
  try {
    // 1. Fetch all active/approved therapists
    const therapists = await Therapist.find({ status: { $nin: ['Pending', 'Rejected'] } });

    // 2. Fetch the global template slots
    let template = await Schedule.findOne({ therapistId: null, day: null });
    if (!template) {
      template = await Schedule.create({
        therapistId: null,
        therapistName: '',
        day: null,
        slots: DEFAULT_GLOBAL_SLOTS,
      });
    }
    const defaultSlots = template.slots.map((s) => ({
      time: s.time,
      available: s.available,
      patientName: '',
    }));

    // 3. Ensure every approved therapist has a daily schedule document
    for (const therapist of therapists) {
      const scheduleExists = await Schedule.findOne({ therapistId: therapist._id, day: null });
      if (!scheduleExists) {
        await Schedule.create({
          therapistId: therapist._id,
          therapistName: therapist.name,
          day: null,
          slots: defaultSlots,
        });
      }
    }

    const docs = await Schedule.find({ therapistId: { $ne: null }, day: null });
    const result = {};
    for (const doc of docs) {
      result[doc.therapistName] = doc.slots.map((s) => ({
        time: s.time,
        available: s.available,
      }));
    }
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// GET /api/schedules/weekly — weekly booked entries keyed by therapist id
export const getWeeklySchedules = async (req, res, next) => {
  try {
    const docs = await Schedule.find({ therapistId: { $ne: null }, day: { $ne: null } }).sort({
      day: 1,
    });
    const result = {};
    for (const doc of docs) {
      const key = doc.therapistId.toString();
      if (!result[key]) result[key] = [];
      for (const slot of doc.slots) {
        result[key].push({ day: doc.day, time: slot.time, patient: slot.patientName });
      }
    }
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// GET /api/schedules/available — query available slots dynamically for a specific therapist and date
export const getAvailableSlotsForDate = async (req, res, next) => {
  try {
    const { therapistId, date } = req.query;

    if (!therapistId || !date) {
      return res.status(400).json({ success: false, message: 'therapistId and date are required' });
    }

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }
    const dayName = daysOfWeek[parsedDate.getUTCDay()];

    // Check if therapist is on approved leave on the selected date
    const onLeave = await Leave.findOne({
      therapistId,
      status: 'Approved',
      startDate: { $lte: date },
      endDate: { $gte: date },
    });

    if (onLeave) {
      return res.json({ success: true, count: 0, data: [] });
    }

    const hasAnyWeeklySchedule = await Schedule.exists({ therapistId, day: { $ne: null } });

    let slots = [];

    if (hasAnyWeeklySchedule) {
      const daySchedule = await Schedule.findOne({ therapistId, day: dayName });
      if (daySchedule) {
        slots = daySchedule.slots.map((s) => ({
          time: s.time,
          available: true,
        }));
      } else {
        slots = [];
      }
    } else {
      const dailySchedule = await Schedule.findOne({ therapistId, day: null });
      if (dailySchedule) {
        slots = dailySchedule.slots.map((s) => ({
          time: s.time,
          available: true,
        }));
      } else {
        slots = DEFAULT_GLOBAL_SLOTS.map((s) => ({
          time: s.time,
          available: true,
        }));
      }
    }

    const bookedAppointments = await Appointment.find({
      therapistId,
      date,
      status: 'Upcoming',
    });

    const bookedTimes = new Set(bookedAppointments.map((a) => a.time));

    const result = slots.map((slot) => ({
      time: slot.time,
      available: !bookedTimes.has(slot.time),
    }));

    res.json({ success: true, count: result.length, data: result });
  } catch (error) {
    next(error);
  }
};
