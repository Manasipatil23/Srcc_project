/**
 * Live data module — same export names as the old mock file, but every value
 * is now fetched from the SRCC backend (http://localhost:5001/api) at module
 * load via top-level await. Components keep importing plain arrays/objects,
 * so no layout or workflow changes are required anywhere in the app.
 *
 * If the backend is unreachable, safe empty fallbacks are exported and a
 * warning is logged so the UI renders without crashing.
 */
import {
  therapistApi,
  appointmentApi,
  notificationApi,
  scheduleApi,
  patientApi,
} from '../services/api';

const FALLBACK_PATIENT_PROFILE = {
  id: 'p0',
  name: 'John Doe',
  age: 0,
  dob: '',
  gender: '',
  bloodGroup: '',
  contact: '',
  documents: [],
};

let therapists = [];
let appointments = [];
let notifications = [];
let slots = [];
let weeklySchedules = {};
let patientProfile = FALLBACK_PATIENT_PROFILE;
let slotsByTherapist = {};

try {
  const [
    therapistsRes,
    appointmentsRes,
    notificationsRes,
    timeSlotsRes,
    weeklyRes,
    patientRes,
    therapistSlotsRes,
  ] = await Promise.all([
    therapistApi.getAll(),
    appointmentApi.getAll(),
    notificationApi.getAll(),
    scheduleApi.getTimeSlots(),
    scheduleApi.getWeeklySchedules(),
    patientApi.getDefault(),
    scheduleApi.getTherapistSlots(),
  ]);

  therapists = therapistsRes;
  appointments = appointmentsRes;
  notifications = notificationsRes;
  slots = timeSlotsRes;
  weeklySchedules = weeklyRes;
  patientProfile = patientRes;
  slotsByTherapist = therapistSlotsRes;
} catch (error) {
  console.warn(
    `[SRCC] Backend unavailable (${error.message}). ` +
      'Start it with: cd backend && npm run dev — then reload the page.'
  );
}

export const mockTherapists = therapists;
export const mockAppointments = appointments;
export const mockFeedbacks = [];
export const mockNotifications = notifications;
export const timeSlots = slots;
export const therapistSchedules = weeklySchedules;
export const mockPatientProfile = patientProfile;
export const therapistSlots = slotsByTherapist;
