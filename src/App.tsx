import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { TrackPage } from './pages/TrackPage';
import { SubmitComplaintPage } from './pages/SubmitComplaintPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { CommitteeDashboard } from './pages/CommitteeDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ComplaintProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/track" element={<TrackPage />} />
                <Route path="/submit" element={<SubmitComplaintPage />} />

                {/* Role-Based Dashboards */}
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/officer" element={<OfficerDashboard />} />
                <Route path="/committee" element={<CommitteeDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />

                {/* 404 Fallback */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </ComplaintProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
