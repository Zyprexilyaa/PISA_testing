import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { GoogleProfileSetupPage } from './pages/GoogleProfileSetupPage';
import { MainApp } from './pages/MainApp';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CreateClassroomPage } from './pages/CreateClassroomPage';
import { JoinClassroomPage } from './pages/JoinClassroomPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { TeacherLoginPage } from './pages/TeacherLoginPage';
import { TeacherAddPropositionPage } from './pages/TeacherAddPropositionPage';
import { TeacherPropositionListPage } from './pages/TeacherPropositionListPage';
import { PracticePage } from './pages/PracticePage';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/teacher-login" element={<TeacherLoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            
            {/* Google Profile Setup Route */}
            <Route path="/setup-profile" element={
              <ProtectedRoute>
                <GoogleProfileSetupPage />
              </ProtectedRoute>
            } />
            
            {/* Protected Routes - Classroom Features */}
            <Route path="/create-classroom" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <CreateClassroomPage />
              </ProtectedRoute>
            } />
            <Route path="/my-classrooms" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <CreateClassroomPage />
              </ProtectedRoute>
            } />
            
            <Route path="/join-classroom" element={
              <ProtectedRoute allowedRoles={['student']}>
                <JoinClassroomPage />
              </ProtectedRoute>
            } />
            
            <Route path="/classroom/:classroomId" element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            } />
            
            <Route path="/teacher-dashboard/:classroomId" element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboardPage />
              </ProtectedRoute>
            } />

            {/* Proposition Management */}
            <Route path="/teacher/propositions" element={
              <ProtectedRoute allowedRoles={[ 'teacher' ]}>
                <TeacherPropositionListPage />
              </ProtectedRoute>
            } />

            <Route path="/teacher/propositions/new" element={
              <ProtectedRoute allowedRoles={[ 'teacher' ]}>
                <TeacherAddPropositionPage />
              </ProtectedRoute>
            } />

            {/* Student Practice */}
            <Route path="/practice" element={
              <ProtectedRoute allowedRoles={[ 'student' ]}>
                <PracticePage />
              </ProtectedRoute>
            } />
            
            {/* Main App Route */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;