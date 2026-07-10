// Port 5001: macOS AirPlay Receiver occupies port 5000
// Default to the host serving the frontend so the app also works when
// opened from another machine on the LAN (not just localhost).
const API_BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5001/api`;

const getToken = () => localStorage.getItem('srcc_token');

const request = async (path, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message = body?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }
  return body;
};

// ---------- Auth ----------
export const authApi = {
  register: (payload) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  profile: () => request('/auth/profile'),
  updateProfile: (payload) =>
    request('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  saveToken: (token) => localStorage.setItem('srcc_token', token),
  clearToken: () => localStorage.removeItem('srcc_token'),
};

// ---------- Therapists ----------
export const therapistApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/therapists${query ? `?${query}` : ''}`).then((r) => r.data);
  },
  getById: (id) => request(`/therapists/${id}`).then((r) => r.data),
  getAvailability: (id) => request(`/therapists/${id}/availability`).then((r) => r.data),
  updateAvailability: (id, payload) =>
    request(`/therapists/${id}/availability`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    request(`/therapists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }).then((r) => r.data),
  updateStatus: (id, status) =>
    request(`/therapists/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }).then((r) => r.data),
  remove: (id) => request(`/therapists/${id}`, { method: 'DELETE' }),
};

// ---------- Appointments ----------
export const appointmentApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/appointments${query ? `?${query}` : ''}`).then((r) => r.data);
  },
  book: (payload) =>
    request('/appointments/book', { method: 'POST', body: JSON.stringify(payload) }).then(
      (r) => r.data
    ),
  reschedule: (id, payload) =>
    request(`/appointments/${id}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }).then((r) => r.data),
  updateStatus: (id, status) =>
    request(`/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }).then((r) => r.data),
};

// ---------- Notifications ----------
export const notificationApi = {
  getAll: () => request('/notifications').then((r) => r.data),
  getForUser: (userId) => request(`/notifications/${userId}`).then((r) => r.data),
  markAsRead: (id) =>
    request(`/notifications/${id}/read`, { method: 'PUT' }).then((r) => r.data),
  remove: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
};

// ---------- Schedules ----------
export const scheduleApi = {
  getTimeSlots: () => request('/schedules/timeslots').then((r) => r.data),
  getTherapistSlots: () => request('/schedules/slots').then((r) => r.data),
  getWeeklySchedules: () => request('/schedules/weekly').then((r) => r.data),
  getAvailableSlots: (therapistId, date) =>
    request(`/schedules/available?therapistId=${therapistId}&date=${date}`).then((r) => r.data),
};

// ---------- Patients ----------
export const patientApi = {
  getDefault: () => request('/patients/default').then((r) => r.data),
  getById: (id) => request(`/patients/${id}`).then((r) => r.data),
  update: (id, payload) =>
    request(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }).then((r) => r.data),
  addDocument: (id, payload) =>
    request(`/patients/${id}/documents`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then((r) => r.data),
};

// ---------- Payments (accounts desk) ----------
export const paymentApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/payments${query ? `?${query}` : ''}`).then((r) => r.data);
  },
  getSummary: () => request('/payments/summary').then((r) => r.data),
  collect: (id, mode, notes) =>
    request(`/payments/${id}/collect`, {
      method: 'PUT',
      body: JSON.stringify({ mode, notes }),
    }).then((r) => r.data),
  refund: (id, notes) =>
    request(`/payments/${id}/refund`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    }).then((r) => r.data),
  waive: (id, notes) =>
    request(`/payments/${id}/waive`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    }).then((r) => r.data),
};

// ---------- Reports ----------
export const reportApi = {
  getSummary: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/reports/summary${query ? `?${query}` : ''}`).then((r) => r.data);
  },
  // Returns a URL the browser can download a CSV from directly.
  csvUrl: (report, params = {}) => {
    const query = new URLSearchParams({ ...params, format: 'csv' }).toString();
    return `${API_BASE}/reports/${report}?${query}`;
  },
};

// ---------- Leaves ----------
export const leaveApi = {
  getAll: () => request('/leaves').then((r) => r.data),
  getForTherapist: (therapistId) => request(`/leaves/therapist/${therapistId}`).then((r) => r.data),
  create: (payload) => request('/leaves', { method: 'POST', body: JSON.stringify(payload) }).then((r) => r.data),
  updateStatus: (id, status) => request(`/leaves/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }).then((r) => r.data),
};

