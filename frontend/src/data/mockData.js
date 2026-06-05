export const mockTherapists = [
  { id: 't1', name: 'Dr. Sarah Jenkins', specialty: 'Clinical Psychologist', qualification: 'PhD Psychology', experience: 8, availability: 'Available', email: 'sarah.jenkins@srcc.com', phone: '+91 9876543210', patientsCount: 12, rating: 4.8, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 't2', name: 'Dr. Michael Chen', specialty: 'Psychiatrist', qualification: 'MD Psychiatry', experience: 12, availability: 'Busy', email: 'michael.chen@srcc.com', phone: '+91 9876543211', patientsCount: 28, rating: 4.9, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
  { id: 't3', name: 'Dr. Emily Carter', specialty: 'Couples Therapist', qualification: 'MSc Counseling Psychology', experience: 6, availability: 'Available', email: 'emily.carter@srcc.com', phone: '+91 9876543212', patientsCount: 8, rating: 4.7, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
  { id: 't4', name: 'Dr. James Wilson', specialty: 'Child Psychologist', qualification: 'PhD Child Psychology', experience: 10, availability: 'Unavailable', email: 'james.wilson@srcc.com', phone: '+91 9876543213', patientsCount: 15, rating: 4.6, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704g' },
  { id: 't5', name: 'Dr. Olivia Martinez', specialty: 'Cognitive Behavioral Therapist', qualification: 'PhD Clinical Psychology', experience: 9, availability: 'Available', email: 'olivia.martinez@srcc.com', phone: '+91 9876543214', patientsCount: 19, rating: 4.9, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704h' },
  { id: 't6', name: 'Dr. Robert Taylor', specialty: 'Addiction Counselor', qualification: 'MA Addiction Counseling', experience: 11, availability: 'Available', email: 'robert.taylor@srcc.com', phone: '+91 9876543215', patientsCount: 22, rating: 4.5, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704i' },
  { id: 't7', name: 'Dr. Sophia Anderson', specialty: 'Clinical Social Worker', qualification: 'MSW (Clinical)', experience: 13, availability: 'Busy', email: 'sophia.anderson@srcc.com', phone: '+91 9876543216', patientsCount: 30, rating: 4.8, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704j' },
  { id: 't8', name: 'Dr. William Thomas', specialty: 'Family Therapist', qualification: 'MFT (Marriage & Family Therapy)', experience: 7, availability: 'Available', email: 'william.thomas@srcc.com', phone: '+91 9876543217', patientsCount: 14, rating: 4.7, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704k' },
];

export const mockAppointments = [
  {
    id: 'a1',
    therapistId: 't1',
    therapistName: 'Dr. Sarah Jenkins',
    patientName: 'John Doe',
    date: '2026-06-01',
    time: '10:00 AM',
    status: 'Upcoming',
    type: 'Initial Consultation'
  },
  {
    id: 'a2',
    therapistId: 't2',
    therapistName: 'Dr. Michael Chen',
    patientName: 'Emma Wilson',
    date: '2026-06-03',
    time: '02:30 PM',
    status: 'Upcoming',
    type: 'Follow-up'
  },
  {
    id: 'a3',
    therapistId: 't5',
    therapistName: 'Dr. Olivia Martinez',
    patientName: 'Michael Brown',
    date: '2026-05-28',
    time: '11:00 AM',
    status: 'Completed',
    type: 'CBT Session'
  },
  {
    id: 'a4',
    therapistId: 't3',
    therapistName: 'Dr. Emily Carter',
    patientName: 'Sophia Davis',
    date: '2026-05-25',
    time: '04:00 PM',
    status: 'Cancelled',
    type: 'Couples Therapy'
  },
  {
    id: 'a5',
    therapistId: 't4',
    therapistName: 'Dr. James Wilson',
    patientName: 'Liam Johnson',
    date: '2026-06-05',
    time: '09:30 AM',
    status: 'Upcoming',
    type: 'Child Counseling'
  },
  {
    id: 'a6',
    therapistId: 't6',
    therapistName: 'Dr. Robert Taylor',
    patientName: 'Ava Garcia',
    date: '2026-05-22',
    time: '03:00 PM',
    status: 'Completed',
    type: 'Addiction Recovery Session'
  },
  {
    id: 'a7',
    therapistId: 't7',
    therapistName: 'Dr. Sophia Anderson',
    patientName: 'Noah Martinez',
    date: '2026-06-07',
    time: '01:00 PM',
    status: 'Upcoming',
    type: 'Mental Health Assessment'
  },
  {
    id: 'a8',
    therapistId: 't8',
    therapistName: 'Dr. William Thomas',
    patientName: 'Olivia Harris',
    date: '2026-06-08',
    time: '05:00 PM',
    status: 'Upcoming',
    type: 'Family Therapy'
  }
];

export const mockFeedbacks = [];

export const mockNotifications = [
  { id: 'n1', title: 'Upcoming Appointment', message: 'You have a session with Dr. Sarah Jenkins tomorrow at 10:00 AM.', time: '2 hours ago', read: false, type: 'reminder' },
  { id: 'n2', title: 'Therapist Unavailable', message: 'Dr. James Wilson has cancelled appointments for today. Please reschedule.', time: '1 day ago', read: true, type: 'alert' },
  { id: 'n3', title: 'Appointment Rescheduled', message: 'Your session with Dr. Michael Chen has been successfully rescheduled.', time: '2 days ago', read: true, type: 'success' },
  { id: 'n4', title: 'Patient Arrived', message: 'John Doe has arrived for the 10:00 AM therapy session.', time: '5 mins ago', read: false, type: 'success' },
  { id: 'n5', title: 'Schedule Updated', message: 'Dr. Sarah Jenkins updated her availability schedule.', time: '15 mins ago', read: false, type: 'alert' }
];

export const timeSlots = [
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
  { time: '04:30 PM', available: false }
];

export const therapistSchedules = {
  t1: [
    { day: 'Monday', time: '09:00 AM', patient: 'John Doe' },
    { day: 'Monday', time: '11:00 AM', patient: 'Emma Wilson' },
    { day: 'Wednesday', time: '02:00 PM', patient: 'Alex Smith' }
  ],

  t2: [
    { day: 'Tuesday', time: '10:00 AM', patient: 'Michael Brown' },
    { day: 'Thursday', time: '01:00 PM', patient: 'Sarah Lee' }
  ],

  t3: [
    { day: 'Friday', time: '03:00 PM', patient: 'David Johnson' }
  ]
};

export const mockPatientProfile = {
  id: 'p1',
  name: 'John Doe',
  age: 14,
  dob: '2012-05-14',
  gender: 'Male',
  bloodGroup: 'O+',
  contact: '+91 9876543210',
  documents: [
    { id: 'd1', name: 'Previous_Medical_History.pdf', size: '2.4 MB', date: '2026-05-15' },
    { id: 'd2', name: 'Blood_Test_Reports.pdf', size: '1.1 MB', date: '2026-05-20' },
    { id: 'd3', name: 'Vaccination_Record.jpg', size: '850 KB', date: '2026-01-10' }
  ]
};

export const therapistSlots = {
  "Dr. Sarah Jenkins": [
    { time: "09:00 AM", available: true },
    { time: "09:30 AM", available: false },
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: false },
    { time: "11:00 AM", available: true },
    { time: "11:30 AM", available: true }
  ],

  "Dr. Michael Chen": [
    { time: "09:00 AM", available: false },
    { time: "09:30 AM", available: false },
    { time: "10:00 AM", available: true },
    { time: "10:30 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "11:30 AM", available: true }
  ],

  "Dr. Emily Carter": [
    { time: "12:00 PM", available: true },
    { time: "12:30 PM", available: true },
    { time: "01:00 PM", available: false },
    { time: "01:30 PM", available: true },
    { time: "02:00 PM", available: true },
    { time: "02:30 PM", available: false }
  ],

  "Dr. James Wilson": [
    { time: "09:00 AM", available: false },
    { time: "09:30 AM", available: false },
    { time: "10:00 AM", available: false },
    { time: "10:30 AM", available: false },
    { time: "11:00 AM", available: false },
    { time: "11:30 AM", available: false }
  ],

  "Dr. Olivia Martinez": [
    { time: "01:00 PM", available: true },
    { time: "01:30 PM", available: true },
    { time: "02:00 PM", available: true },
    { time: "02:30 PM", available: false },
    { time: "03:00 PM", available: true },
    { time: "03:30 PM", available: true }
  ],

  "Dr. Robert Taylor": [
    { time: "09:00 AM", available: true },
    { time: "09:30 AM", available: true },
    { time: "10:00 AM", available: false },
    { time: "10:30 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "11:30 AM", available: true }
  ],

  "Dr. Sophia Anderson": [
    { time: "12:00 PM", available: false },
    { time: "12:30 PM", available: true },
    { time: "01:00 PM", available: false },
    { time: "01:30 PM", available: true },
    { time: "02:00 PM", available: false },
    { time: "02:30 PM", available: true }
  ],

  "Dr. William Thomas": [
    { time: "03:00 PM", available: true },
    { time: "03:30 PM", available: true },
    { time: "04:00 PM", available: false },
    { time: "04:30 PM", available: true },
    { time: "05:00 PM", available: true },
    { time: "05:30 PM", available: false }
  ]
};

