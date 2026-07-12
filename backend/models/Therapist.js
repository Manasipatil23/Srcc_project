import mongoose from 'mongoose';

const therapistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    specialty: { type: String, required: [true, 'Specialty is required'], trim: true },
    qualification: { type: String, required: [true, 'Qualification is required'], trim: true },
    experience: { type: Number, required: true, min: 0 },
    availability: {
      type: String,
      enum: ['Available', 'Busy', 'Unavailable'],
      default: 'Available',
    },
    // Self-registered therapists start as 'Pending' and cannot log in
    // until an admin approves them; seeded/admin-created ones are 'Approved'.
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Approved',
    },
    phone: { type: String, required: true, trim: true },
    // Consultation fee in INR, used to raise a payment when a session is booked.
    fee: { type: Number, default: 500, min: 0 },
    patientsCount: { type: Number, default: 0, min: 0 },
    rating: { type: Number, default: 5.0, min: 0, max: 5 },
    image: { type: String, default: '' },
    document: { type: String, default: '' }, // Base64 string of required document (license/degree)
    rejectionReason: { type: String, default: '' },
  },
  { timestamps: true }
);

therapistSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

const Therapist = mongoose.model('Therapist', therapistSchema);
export default Therapist;
