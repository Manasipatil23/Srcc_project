import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    time: { type: String, required: true, trim: true },
    available: { type: Boolean, default: true },
    patientName: { type: String, default: '', trim: true },
  },
  { _id: false }
);

/**
 * Schedule documents come in three flavours:
 *  - Global time-slot template: therapistId = null, day = null
 *  - Per-therapist daily slots:  therapistId set, day = null
 *  - Weekly booked entries:      therapistId set, day = 'Monday' | ...
 */
const scheduleSchema = new mongoose.Schema(
  {
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist', default: null },
    therapistName: { type: String, default: '', trim: true },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', null],
      default: null,
    },
    slots: { type: [slotSchema], default: [] },
  },
  { timestamps: true }
);

scheduleSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.therapistId = ret.therapistId ? ret.therapistId.toString() : null;
    delete ret._id;
    return ret;
  },
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;
