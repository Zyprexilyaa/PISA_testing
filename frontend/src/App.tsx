import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { MainApp } from './pages/MainApp';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CreateClassroomPage } from './pages/CreateClassroomPage';
import { JoinClassroomPage } from './pages/JoinClassroomPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            
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