import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ResumeProvider } from './context/ResumeContext';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import BuilderPage from './pages/BuilderPage';
import TemplatesPage from './pages/TemplatesPage';
import AnalyzerPage from './pages/AnalyzerPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisHistoryPage from './pages/AnalysisHistoryPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ResumeProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/analyzer" element={<AnalyzerPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <AnalysisHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Fullscreen Builder Route (Navbar embedded with specialized controls) */}
              <Route path="/builder" element={<BuilderPage />} />
            </Routes>
          </ResumeProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
