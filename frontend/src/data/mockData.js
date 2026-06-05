export const mockTherapists = [
  { id: 't1', name: 'Dr. Sarah Jenkins', specialty: 'Clinical Psychologist', availability: 'Available', patientsCount: 12, rating: 4.8, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 't2', name: 'Dr. Michael Chen', specialty: 'Psychiatrist', availability: 'Busy', patientsCount: 28, rating: 4.9, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
  { id: 't3', name: 'Dr. Emily Carter', specialty: 'Couples Therapist', availability: 'Available', patientsCount: 8, rating: 4.7, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
  { id: 't4', name: 'Dr. James Wilson', specialty: 'Child Psychologist', availability: 'Unavailable', patientsCount: 15, rating: 4.6, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704g' },
  { id: 't5', name: 'Dr. Olivia Martinez', specialty: 'Cognitive Behavioral Therapist', availability: 'Available', patientsCount: 19, rating: 4.9, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704h' },
  { id: 't6', name: 'Dr. Robert Taylor', specialty: 'Addiction Counselor', availability: 'Available', patientsCount: 22, rating: 4.5, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704i' },
  { id: 't7', name: 'Dr. Sophia Anderson', specialty: 'Clinical Social Worker', availability: 'Busy', patientsCount: 30, rating: 4.8, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704j' },
  { id: 't8', name: 'Dr. William Thomas', specialty: 'Family Therapist', availability: 'Available', patientsCount: 14, rating: 4.7, image: 'https://i.pravatar.cc/150?u=a042581f4e29026704k' },
];

export const mockAppointments = [
  { id: 'a1', therapistId: 't1', therapistName: 'Dr. Sarah Jenkins', date: '2026-06-01', time: '10:00 AM', status: 'Upcoming', type: 'Initial Consultation' },
  { id: 'a2', therapistId: 't2', therapistName: 'Dr. Michael Chen', date: '2026-06-03', time: '02:30 PM', status: 'Upcoming', type: 'Follow-up' },
  { id: 'a3', therapistId: 't5', therapistName: 'Dr. Olivia Martinez', date: '2026-05-28', time: '11:00 AM', status: 'Completed', type: 'CBT Session' },
  { id: 'a4', therapistId: 't3', therapistName: 'Dr. Emily Carter', date: '2026-05-25', time: '04:00 PM', status: 'Cancelled', type: 'Couples Therapy' },
];

export const mockFeedbacks = [];

export const mockNotifications = [
  { id: 'n1', title: 'Upcoming Appointment', message: 'You have a session with Dr. Sarah Jenkins tomorrow at 10:00 AM.', time: '2 hours ago', read: false, type: 'reminder' },
  { id: 'n2', title: 'Therapist Unavailable', message: 'Dr. James Wilson has cancelled appointments for today. Please reschedule.', time: '1 day ago', read: true, type: 'alert' },
  { id: 'n3', title: 'Appointment Rescheduled', message: 'Your session with Dr. Michael Chen has been successfully rescheduled.', time: '2 days ago', read: true, type: 'success' },
];

export const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

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

