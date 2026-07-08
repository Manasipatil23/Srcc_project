import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Therapist from '../models/Therapist.js';
import Appointment from '../models/Appointment.js';
import Notification from '../models/Notification.js';
import Schedule from '../models/Schedule.js';
import Patient from '../models/Patient.js';

const THERAPISTS = [
  { name: 'Dr. Sarah Jenkins', specialty: 'Clinical Psychologist', qualification: 'PhD Psychology', experience: 8, availability: 'Available', email: 'sarah.jenkins@srcc.com', phone: '+91 9876543210', patientsCount: 12, rating: 4.8, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { name: 'Dr. Michael Chen', specialty: 'Psychiatrist', qualification: 'MD Psychiatry', experience: 12, availability: 'Busy', email: 'michael.chen@srcc.com', phone: '+91 9876543211', patientsCount: 28, rating: 4.9, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
  { name: 'Dr. Emily Carter', specialty: 'Couples Therapist', qualification: 'MSc Counseling Psychology', experience: 6, availability: 'Available', email: 'emily.carter@srcc.com', phone: '+91 9876543212', patientsCount: 8, rating: 4.7, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
  { name: 'Dr. James Wilson', specialty: 'Child Psychologist', qualification: 'PhD Child Psychology', experience: 10, availability: 'Unavailable', email: 'james.wilson@srcc.com', phone: '+91 9876543213', patientsCount: 15, rating: 4.6, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704g' },
  { name: 'Dr. Olivia Martinez', specialty: 'Cognitive Behavioral Therapist', qualification: 'PhD Clinical Psychology', experience: 9, availability: 'Available', email: 'olivia.martinez@srcc.com', phone: '+91 9876543214', patientsCount: 19, rating: 4.9, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704h' },
  { name: 'Dr. Robert Taylor', specialty: 'Addiction Counselor', qualification: 'MA Addiction Counseling', experience: 11, availability: 'Available', email: 'robert.taylor@srcc.com', phone: '+91 9876543215', patientsCount: 22, rating: 4.5, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704i' },
  { name: 'Dr. Sophia Anderson', specialty: 'Clinical Social Worker', qualification: 'MSW (Clinical)', experience: 13, availability: 'Busy', email: 'sophia.anderson@srcc.com', phone: '+91 9876543216', patientsCount: 30, rating: 4.8, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704j' },
  { name: 'Dr. William Thomas', specialty: 'Family Therapist', qualification: 'MFT (Marriage & Family Therapy)', experience: 7, availability: 'Available', email: 'william.thomas@srcc.com', phone: '+91 9876543217', patientsCount: 14, rating: 4.7, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704k' },
];

const APPOINTMENTS = [
  { therapistName: 'Dr. Sarah Jenkins', patientName: 'John Doe', date: '2026-06-01', time: '10:00 AM', status: 'Upcoming', type: 'Initial Consultation' },
  { therapistName: 'Dr. Michael Chen', patientName: 'Emma Wilson', date: '2026-06-03', time: '02:30 PM', status: 'Upcoming', type: 'Follow-up' },
  { therapistName: 'Dr. Olivia Martinez', patientName: 'Michael Brown', date: '2026-05-28', time: '11:00 AM', status: 'Completed', type: 'CBT Session' },
  { therapistName: 'Dr. Emily Carter', patientName: 'Sophia Davis', date: '2026-05-25', time: '04:00 PM', status: 'Cancelled', type: 'Couples Therapy' },
  { therapistName: 'Dr. James Wilson', patientName: 'Liam Johnson', date: '2026-06-05', time: '09:30 AM', status: 'Upcoming', type: 'Child Counseling' },
  { therapistName: 'Dr. Robert Taylor', patientName: 'Ava Garcia', date: '2026-05-22', time: '03:00 PM', status: 'Completed', type: 'Addiction Recovery Session' },
  { therapistName: 'Dr. Sophia Anderson', patientName: 'Noah Martinez', date: '2026-06-07', time: '01:00 PM', status: 'Upcoming', type: 'Mental Health Assessment' },
  { therapistName: 'Dr. William Thomas', patientName: 'Olivia Harris', date: '2026-06-08', time: '05:00 PM', status: 'Upcoming', type: 'Family Therapy' },
];

const GLOBAL_TIME_SLOTS = [
  { time: '09:00 AM', available: true },
  { time: '09:30 AM', available: false },
  { time: '10:00 AM', available: true },
  { time: '10:30 AM', available: false },
  { time: '11:00 AM', available: true },
  { time: '11:30 AM', available: true },
  { time: '12:00 PM', available: true },
  { time: '12:30 PM', available: true },
  { time: '01:00 PM', available: false },
  { time: '01:30 PM', available: true },
  { time: '02:00 PM', available: true },
  { time: '02:30 PM', available: false },
  { time: '03:00 PM', available: false },
  { time: '03:30 PM', available: true },
  { time: '04:00 PM', available: true },
  { time: '04:30 PM', available: false },
];

const THERAPIST_SLOTS = {
  'Dr. Sarah Jenkins': [
    { time: '09:00 AM', available: true },
    { time: '09:30 AM', available: false },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: false },
    { time: '11:00 AM', available: true },
    { time: '11:30 AM', available: true },
  ],
  'Dr. Michael Chen': [
    { time: '09:00 AM', available: false },
    { time: '09:30 AM', available: false },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '11:30 AM', available: true },
  ],
  'Dr. Emily Carter': [
    { time: '12:00 PM', available: true },
    { time: '12:30 PM', available: true },
    { time: '01:00 PM', available: false },
    { time: '01:30 PM', available: true },
    { time: '02:00 PM', available: true },
    { time: '02:30 PM', available: false },
  ],
  'Dr. James Wilson': [
    { time: '09:00 AM', available: false },
    { time: '09:30 AM', available: false },
    { time: '10:00 AM', available: false },
    { time: '10:30 AM', available: false },
    { time: '11:00 AM', available: false },
    { time: '11:30 AM', available: false },
  ],
  'Dr. Olivia Martinez': [
    { time: '01:00 PM', available: true },
    { time: '01:30 PM', available: true },
    { time: '02:00 PM', available: true },
    { time: '02:30 PM', available: false },
    { time: '03:00 PM', available: true },
    { time: '03:30 PM', available: true },
  ],
  'Dr. Robert Taylor': [
    { time: '09:00 AM', available: true },
    { time: '09:30 AM', available: true },
    { time: '10:00 AM', available: false },
    { time: '10:30 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '11:30 AM', available: true },
  ],
  'Dr. Sophia Anderson': [
    { time: '12:00 PM', available: false },
    { time: '12:30 PM', available: true },
    { time: '01:00 PM', available: false },
    { time: '01:30 PM', available: true },
    { time: '02:00 PM', available: false },
    { time: '02:30 PM', available: true },
  ],
  'Dr. William Thomas': [
    { time: '03:00 PM', available: true },
    { time: '03:30 PM', available: true },
    { time: '04:00 PM', available: false },
    { time: '04:30 PM', available: true },
    { time: '05:00 PM', available: true },
    { time: '05:30 PM', available: false },
  ],
};

const WEEKLY_SCHEDULES = {
  'Dr. Sarah Jenkins': [
    { day: 'Monday', time: '09:00 AM', patient: 'John Doe' },
    { day: 'Monday', time: '11:00 AM', patient: 'Emma Wilson' },
    { day: 'Wednesday', time: '02:00 PM', patient: 'Alex Smith' },
  ],
  'Dr. Michael Chen': [
    { day: 'Tuesday', time: '10:00 AM', patient: 'Michael Brown' },
    { day: 'Thursday', time: '01:00 PM', patient: 'Sarah Lee' },
  ],
  'Dr. Emily Carter': [
    { day: 'Friday', time: '03:00 PM', patient: 'David Johnson' },
  ],
};

const hoursAgo = (h) => new Date(Date.now() - h * 60 * 60 * 1000);
const minutesAgo = (m) => new Date(Date.now() - m * 60 * 1000);
const daysAgo = (d) => new Date(Date.now() - d * 24 * 60 * 60 * 1000);

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
  ]);

  console.log('Creating users...');
  const admin = await User.create({
    name: 'Hospital Admin',
    email: 'admin@srcc.com',
    password: 'admin123',
    role: 'admin',
  });

  const patientUser = await User.create({
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'patient123',
    role: 'patient',
  });

  console.log('Creating therapists...');
  const therapistDocs = [];
  for (const t of THERAPISTS) {
    const user = await User.create({
      name: t.name,
      email: t.email,
      password: 'therapist123',
      role: 'therapist',
    });
    const therapist = await Therapist.create({ ...t, userId: user._id });
    therapistDocs.push(therapist);
  }
  const therapistByName = Object.fromEntries(therapistDocs.map((t) => [t.name, t]));

  console.log('Creating patient profile...');
  await Patient.create({
    userId: patientUser._id,
    name: 'John Doe',
    age: 14,
    dob: '2012-05-14',
    gender: 'Male',
    bloodGroup: 'O+',
    contact: '+91 9876543210',
    documents: [
      { name: 'Previous_Medical_History.pdf', size: '2.4 MB', date: '2026-05-15' },
      { name: 'Blood_Test_Reports.pdf', size: '1.1 MB', date: '2026-05-20' },
      { name: 'Vaccination_Record.jpg', size: '850 KB', date: '2026-01-10' },
    ],
  });

  console.log('Creating appointments...');
  await Appointment.insertMany(
    APPOINTMENTS.map((a) => ({
      ...a,
      therapistId: therapistByName[a.therapistName]._id,
      patientId: a.patientName === 'John Doe' ? patientUser._id : null,
    }))
  );

  console.log('Creating notifications...');
  await Notification.insertMany([
    { targetUserId: patientUser._id, title: 'Upcoming Appointment', message: 'You have a session with Dr. Sarah Jenkins tomorrow at 10:00 AM.', time: hoursAgo(2), read: false, type: 'reminder' },
    { targetUserId: patientUser._id, title: 'Therapist Unavailable', message: 'Dr. James Wilson has cancelled appointments for today. Please reschedule.', time: daysAgo(1), read: true, type: 'alert' },
    { targetUserId: patientUser._id, title: 'Appointment Rescheduled', message: 'Your session with Dr. Michael Chen has been successfully rescheduled.', time: daysAgo(2), read: true, type: 'success' },
    { targetUserId: therapistByName['Dr. Sarah Jenkins'].userId, title: 'Patient Arrived', message: 'John Doe has arrived for the 10:00 AM therapy session.', time: minutesAgo(5), read: false, type: 'success' },
    { targetUserId: admin._id, title: 'Schedule Updated', message: 'Dr. Sarah Jenkins updated her availability schedule.', time: minutesAgo(15), read: false, type: 'alert' },
  ]);

  console.log('Creating schedules...');
  await Schedule.create({
    therapistId: null,
    therapistName: '',
    day: null,
    slots: GLOBAL_TIME_SLOTS.map((s) => ({ ...s, patientName: '' })),
  });

  for (const [name, slots] of Object.entries(THERAPIST_SLOTS)) {
    await Schedule.create({
      therapistId: therapistByName[name]._id,
      therapistName: name,
      day: null,
      slots: slots.map((s) => ({ ...s, patientName: '' })),
    });
  }

  for (const [name, entries] of Object.entries(WEEKLY_SCHEDULES)) {
    const byDay = {};
    for (const e of entries) {
      if (!byDay[e.day]) byDay[e.day] = [];
      byDay[e.day].push({ time: e.time, available: false, patientName: e.patient });
    }
    for (const [day, slots] of Object.entries(byDay)) {
      await Schedule.create({
        therapistId: therapistByName[name]._id,
        therapistName: name,
        day,
        slots,
      });
    }
  }

  const counts = {
    users: await User.countDocuments(),
    therapists: await Therapist.countDocuments(),
    appointments: await Appointment.countDocuments(),
    notifications: await Notification.countDocuments(),
    schedules: await Schedule.countDocuments(),
    patients: await Patient.countDocuments(),
  };
  console.log('Seed complete:', counts);
  console.log('Login credentials -> admin@srcc.com/admin123, john.doe@example.com/patient123, <therapist-email>/therapist123');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await mongoose.connection.close();
  process.exit(1);
});
