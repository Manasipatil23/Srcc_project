import mongoose from 'mongoose';
import Feedback from '../models/Feedback.js';

// GET /api/feedback
export const getAllFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, count: feedback.length, data: feedback });
  } catch (error) {
    next(error);
  }
};

// GET /api/feedback/therapist/:therapistId
export const getTherapistFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ therapistId: req.params.therapistId }).sort({ createdAt: -1 });
    res.json({ success: true, count: feedback.length, data: feedback });
  } catch (error) {
    next(error);
  }
};

// POST /api/feedback
export const submitFeedback = async (req, res, next) => {
  try {
    const { appointmentId, therapistId, patientId, overallRating, tags, comments, responses } = req.body;

    if (!appointmentId || !therapistId || !patientId || !overallRating) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const existingFeedback = await Feedback.findOne({ appointmentId });
    if (existingFeedback) {
      existingFeedback.overallRating = overallRating;
      existingFeedback.tags = tags || [];
      existingFeedback.comments = comments || '';
      existingFeedback.responses = responses || {};
      await existingFeedback.save();
      return res.json({ success: true, data: existingFeedback });
    }

    const newFeedback = await Feedback.create({
      appointmentId,
      therapistId,
      patientId,
      overallRating,
      tags: tags || [],
      comments: comments || '',
      responses: responses || {}
    });

    res.status(201).json({ success: true, data: newFeedback });
  } catch (error) {
    next(error);
  }
};
