import mongoose from 'mongoose';
import Patient from '../models/Patient.js';
import User from '../models/User.js';

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

// GET /api/patients - all patients
export const getAllPatients = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'patient' }).select('-password -__v');
    res.json({ success: true, count: users.length, data: users });
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

// PUT /api/patients/:id
export const updatePatient = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid patient id' });
    }

    const { age, dob, gender, bloodGroup, contact } = req.body;
    
    const patient = await Patient.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { userId: req.params.id }] },
      { $set: { age, dob, gender, bloodGroup, contact } },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};

// POST /api/patients/:id/documents
export const addDocument = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid patient id' });
    }

    const { name, size, date, dataUrl } = req.body;

    if (!name || !size || !date || !dataUrl) {
      return res.status(400).json({ success: false, message: 'Name, size, date, and dataUrl are required' });
    }

    const patient = await Patient.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { userId: req.params.id }] },
      { $push: { documents: { name, size, date, dataUrl } } },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    res.status(201).json({ success: true, data: patient });
  } catch (error) {
    next(error);
  }
};
