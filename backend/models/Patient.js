import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    size: { type: String, required: true },
    date: { type: String, required: true },
    dataUrl: { type: String, required: true },
  },
  { _id: true }
);

const patientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    age: { type: Number, default: 0, min: 0 },
    dob: { type: String, default: '' },
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    bloodGroup: { type: String, default: '', trim: true },
    contact: { type: String, default: '', trim: true },
    documents: { type: [documentSchema], default: [] },
  },
  { timestamps: true }
);

patientSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    if (Array.isArray(ret.documents)) {
      ret.documents = ret.documents.map((d) => ({
        id: d._id ? d._id.toString() : undefined,
        name: d.name,
        size: d.size,
        date: d.date,
        dataUrl: d.dataUrl,
      }));
    }
    return ret;
  },
});

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
