import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    message: { type: String, required: [true, 'Message is required'], trim: true },
    time: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['reminder', 'alert', 'success'],
      default: 'reminder',
    },
  },
  { timestamps: true }
);

notificationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
