import Therapist from '../models/Therapist.js';
import Schedule from '../models/Schedule.js';

// GET /api/therapists
export const getTherapists = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.availability) filter.availability = req.query.availability;
    if (req.query.specialty) filter.specialty = new RegExp(req.query.specialty, 'i');

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

// PUT /api/therapists/:id/availability
export const updateAvailability = async (req, res, next) => {
  try {
    const { availability, slots } = req.body;

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

    if (Array.isArray(slots)) {
      await Schedule.findOneAndUpdate(
        { therapistId: therapist._id, day: null },
        {
          therapistId: therapist._id,
          therapistName: therapist.name,
          day: null,
          slots: slots.map((s) => ({
            time: s.time,
            available: Boolean(s.available),
            patientName: s.patientName || '',
          })),
        },
        { upsert: true, new: true, runValidators: true }
      );
    }

    const updatedSlots = await Schedule.findOne({ therapistId: therapist._id, day: null });
    res.json({
      success: true,
      data: therapist,
      slots: updatedSlots ? updatedSlots.slots : [],
    });
  } catch (error) {
    next(error);
  }
};
