import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
  {
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', required: true },
    therapistName: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    reason: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

leaveSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.therapistId = ret.therapistId ? ret.therapistId.toString() : null;
    delete ret._id;
    return ret;
  },
});

const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;
