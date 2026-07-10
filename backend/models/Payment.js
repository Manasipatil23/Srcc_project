import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    patientName: { type: String, required: true, trim: true },
    therapistName: { type: String, required: true, trim: true },
    serviceType: { type: String, required: true, trim: true },
    appointmentDate: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
    },
    amount: { type: Number, required: true, min: 0 },
    mode: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Cheque', null],
      default: null,
    },
    // Pending -> Paid -> Refunded; Waived per SRCC philosophy that no child
    // is refused treatment for want of money; Cancelled when the appointment is.
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded', 'Waived', 'Cancelled'],
      default: 'Pending',
    },
    receiptNumber: { type: String, default: null },
    collectedAt: { type: Date, default: null },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

paymentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    ret.appointmentId = ret.appointmentId ? ret.appointmentId.toString() : null;
    delete ret._id;
    return ret;
  },
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
