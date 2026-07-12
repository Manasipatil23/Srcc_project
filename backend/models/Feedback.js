import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    appointmentId: { type: String, required: true },
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    overallRating: { type: Number, required: true, min: 1, max: 5 },
    tags: { type: [String], default: [] },
    comments: { type: String, default: '' },
    responses: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

feedbackSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
