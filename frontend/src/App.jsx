import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import RoleSelection from './pages/RoleSelection';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AppointmentBooking from './pages/AppointmentBooking';
import MyAppointments from './pages/MyAppointments';
import TherapistsManagement from './pages/TherapistsManagement';
import Notifications from './pages/Notifications';
import Reschedule from './pages/Reschedule';
import ProfilePage from './pages/ProfilePage';
<<<<<<< HEAD
import FeedbackForm from './pages/FeedbackForm';
import FeedbackHistory from './pages/FeedbackHistory';

=======
import TherapistProfile from './pages/TherapistProfile';
import TherapistSchedule from './pages/TherapistSchedule';
import AdminReminders from './pages/AdminReminders';
import SchedulePatient from './pages/SchedulePatient';
import SystemSettings from './pages/SystemSettings';
>>>>>>> 1b269ef (Improved Admin Dashboard.)

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/book" element={<AppointmentBooking />} />
            <Route path="/appointments" element={<MyAppointments />} />
            <Route path="/therapists" element={<TherapistsManagement />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reschedule" element={<Reschedule />} />
            <Route path="/profile" element={<ProfilePage />} />
<<<<<<< HEAD
            <Route path="/feedback-form" element={<FeedbackForm />} />
            <Route path="/feedback" element={<FeedbackHistory />} />
=======
            <Route path="/therapists/:id" element={<TherapistProfile />} />
            <Route path="/therapists/:id/schedule" element={<TherapistSchedule />} />
            <Route path="/admin-reminders" element={<AdminReminders />} />
            <Route path="/schedule-patient" element={<SchedulePatient />} />
            <Route path="/settings" element={<SystemSettings />} />
>>>>>>> 1b269ef (Improved Admin Dashboard.)
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
