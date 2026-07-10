import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Therapist from '../models/Therapist.js';
import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';
import Schedule from '../models/Schedule.js';
import Patient from '../models/Patient.js';
import Payment from '../models/Payment.js';

const seed = async () => {
  await connectDB();

  console.log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Therapist.deleteMany({}),
    Appointment.deleteMany({}),
    Notification.deleteMany({}),
    Schedule.deleteMany({}),
    Patient.deleteMany({}),
    Payment.deleteMany({}),
  ]);

  console.log('Creating admin user...');
  await User.create({
    name: 'SRCC Admin',
    email: 'admin@srcc.com',
    password: 'admin123',
    role: 'admin',
  });

  const counts = {
    users: await User.countDocuments(),
    therapists: await Therapist.countDocuments(),
    appointments: await Appointment.countDocuments(),
    notifications: await Notification.countDocuments(),
    schedules: await Schedule.countDocuments(),
    patients: await Patient.countDocuments(),
    payments: await Payment.countDocuments(),
  };
  console.log('Seed complete. All dummy data removed.');
  console.log('Current collection counts:', counts);
  console.log('Login credentials -> admin@srcc.com/admin123');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await mongoose.connection.close();
  process.exit(1);
});
