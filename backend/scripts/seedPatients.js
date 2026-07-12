import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Therapist from '../models/Therapist.js';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Payment from '../models/Payment.js';
import connectDB from '../config/db.js';

const seedPatients = async () => {
  try {
    await connectDB();
    console.log('Connected to DB...');

    // Fetch some therapists
    const therapists = await Therapist.find();
    if (therapists.length === 0) {
      console.log('No therapists found! Run seed.js first.');
      process.exit(1);
    }

    // Create a base regular patient user
    let user = await User.findOne({ email: 'regular@patient.com' });
    if (!user) {
      user = await User.create({
        name: 'Regular Patient',
        email: 'regular@patient.com',
        password: 'password123', // Will be hashed by pre-save
        role: 'patient'
      });
      console.log('Created Regular Patient user.');
    } else {
      console.log('Regular Patient user already exists.');
    }

    // Ensure they have a Patient record
    let patientRecord = await Patient.findOne({ userId: user._id });
    if (!patientRecord) {
      patientRecord = await Patient.create({
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: '999-888-7777',
        dob: '2010-05-15',
        history: 'Regularly attends occupational therapy for motor skills.'
      });
      console.log('Created Patient record.');
    }

    // Create varied appointments for this patient
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];

    // 1. A completed appointment from last week
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    await Appointment.create({
      therapistId: therapists[0]._id,
      therapistName: therapists[0].name,
      patientId: user._id,
      patientName: user.name,
      date: formatDate(lastWeek),
      time: '10:00',
      status: 'Completed',
      type: 'Regular',
      reminder24hSent: true,
      reminder1hSent: true
    });
    
    console.log('Seeded past Completed appointment.');

    // 2. An upcoming appointment tomorrow (to trigger 24h reminder soon)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    await Appointment.create({
      therapistId: therapists[0]._id,
      therapistName: therapists[0].name,
      patientId: user._id,
      patientName: user.name,
      date: formatDate(tomorrow),
      time: '14:00',
      status: 'Upcoming',
      type: 'Regular'
    });

    console.log('Seeded upcoming appointment for tomorrow.');

    // 3. A cancelled appointment
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    await Appointment.create({
      therapistId: therapists[1 % therapists.length]._id,
      therapistName: therapists[1 % therapists.length].name,
      patientId: user._id,
      patientName: user.name,
      date: formatDate(nextWeek),
      time: '09:00',
      status: 'Cancelled',
      type: 'Regular'
    });

    console.log('Seeded cancelled appointment.');

    console.log('Data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedPatients();
