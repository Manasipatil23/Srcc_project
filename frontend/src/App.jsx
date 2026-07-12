import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import RoleSelection from './pages/RoleSelection';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AppointmentBooking from './pages/AppointmentBooking';
import MyAppointments from './pages/MyAppointments';
import TherapistsManagement from './pages/TherapistsManagement';
import Notifications from './pages/Notifications';
import Reschedule from './pages/Reschedule';
import ProfilePage from './pages/ProfilePage';
import TherapistProfile from './pages/TherapistProfile';
import TherapistSchedule from './pages/TherapistSchedule';
import AdminReminders from './pages/AdminReminders';
import SchedulePatient from './pages/SchedulePatient';
import SystemSettings from './pages/SystemSettings';
import FeedbackForm from './pages/FeedbackForm';
import FeedbackHistory from './pages/FeedbackHistory';
import TherapistDashboard from './pages/therapist/TherapistDashboard';
import TherapistCalendar from './pages/therapist/TherapistCalendar';
import TherapistAppointments from './pages/therapist/TherapistAppointments';
import TherapistLeave from './pages/therapist/TherapistLeave';
import AdminLeaves from './pages/AdminLeaves';
import AccountsPage from './pages/AccountsPage';
import ReportsPage from './pages/ReportsPage';
import AdminCalendar from './pages/AdminCalendar';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-calendar" element={<AdminCalendar />} />
            <Route path="/admin-reminders" element={<AdminReminders />} />
            <Route path="/admin-leaves" element={<AdminLeaves />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/book" element={<AppointmentBooking />} />
            <Route path="/appointments" element={<MyAppointments />} />
            <Route path="/therapists" element={<TherapistsManagement />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reschedule" element={<Reschedule />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/therapists/:id" element={<TherapistProfile />} />
            <Route path="/therapists/:id/schedule" element={<TherapistSchedule />} />
            <Route path="/admin-reminders" element={<AdminReminders />} />
            <Route path="/schedule-patient" element={<SchedulePatient />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="/feedback-form" element={<FeedbackForm />} />
            <Route path="/feedback-history" element={<FeedbackHistory />} />
            <Route path="/therapist/dashboard" element={<TherapistDashboard />} />
            <Route path="/therapist/calendar" element={<TherapistCalendar />} />
            <Route path="/therapist/appointments" element={<TherapistAppointments />} />
            <Route path="/therapist/leave" element={<TherapistLeave />} />
            <Route path="/therapist/settings" element={<Navigate to="/profile" replace />} />
            <Route path="/therapist/notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
