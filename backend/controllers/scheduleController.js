import Schedule from '../models/Schedule.js';

// GET /api/schedules/timeslots — global booking time-slot template
export const getTimeSlots = async (req, res, next) => {
  try {
    const template = await Schedule.findOne({ therapistId: null, day: null });
    const slots = template
      ? template.slots.map((s) => ({ time: s.time, available: s.available }))
      : [];
    res.json({ success: true, count: slots.length, data: slots });
  } catch (error) {
    next(error);
  }
};

// GET /api/schedules/slots — per-therapist daily slots keyed by therapist name
export const getTherapistSlots = async (req, res, next) => {
  try {
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
