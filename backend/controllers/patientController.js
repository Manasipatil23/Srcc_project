import mongoose from 'mongoose';
import Patient from '../models/Patient.js';

// GET /api/patients/default — the primary seeded patient profile
export const getDefaultPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findOne().sort({ createdAt: 1 });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'No patient profile found' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

// GET /api/patients/:id — by patient id or linked user id
export const getPatientById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid patient id' });
    }

    const patient = await Patient.findOne({
      $or: [{ _id: req.params.id }, { userId: req.params.id }],
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};
