import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { GoogleProfileSetupPage } from './pages/GoogleProfileSetupPage';
import { MainApp } from './pages/MainApp';
import { LandingPage } from './pages/LandingPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CreateClassroomPage } from './pages/CreateClassroomPage';
import { JoinClassroomPage } from './pages/JoinClassroomPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { TeacherLoginPage } from './pages/TeacherLoginPage';
import { TeacherAddPropositionPage } from './pages/TeacherAddPropositionPage';
import { TeacherPropositionListPage } from './pages/TeacherPropositionListPage';
import { PracticePage } from './pages/PracticePage';
import { ClassroomContestPage } from './pages/ClassroomContestPage';
import { ClassroomProblemPage } from './pages/ClassroomProblemPage';
import { ClassroomAssignPage } from './pages/ClassroomAssignPage';
function App() {
    return (_jsx(Router, { children: _jsx(LanguageProvider, { children: _jsx(AuthProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/teacher-login", element: _jsx(TeacherLoginPage, {}) }), _jsx(Route, { path: "/signup", element: _jsx(SignUpPage, {}) }), _jsx(Route, { path: "/setup-profile", element: _jsx(ProtectedRoute, { children: _jsx(GoogleProfileSetupPage, {}) }) }), _jsx(Route, { path: "/create-classroom", element: _jsx(ProtectedRoute, { allowedRoles: ['teacher'], children: _jsx(CreateClassroomPage, {}) }) }), _jsx(Route, { path: "/my-classrooms", element: _jsx(ProtectedRoute, { allowedRoles: ['teacher'], children: _jsx(CreateClassroomPage, {}) }) }), _jsx(Route, { path: "/join-classroom", element: _jsx(ProtectedRoute, { allowedRoles: ['student'], children: _jsx(JoinClassroomPage, {}) }) }), _jsx(Route, { path: "/classroom/:classroomId", element: _jsx(ProtectedRoute, { allowedRoles: ['student'], children: _jsx(ClassroomContestPage, {}) }) }), _jsx(Route, { path: "/classroom/:classroomId/problem/:propositionId", element: _jsx(ProtectedRoute, { allowedRoles: ['student'], children: _jsx(ClassroomProblemPage, {}) }) }), _jsx(Route, { path: "/classroom/:classroomId/assign", element: _jsx(ProtectedRoute, { allowedRoles: ['teacher'], children: _jsx(ClassroomAssignPage, {}) }) }), _jsx(Route, { path: "/teacher-dashboard/:classroomId", element: _jsx(ProtectedRoute, { allowedRoles: ['teacher'], children: _jsx(TeacherDashboardPage, {}) }) }), _jsx(Route, { path: "/teacher/propositions", element: _jsx(ProtectedRoute, { allowedRoles: ['teacher'], children: _jsx(TeacherPropositionListPage, {}) }) }), _jsx(Route, { path: "/teacher/propositions/new", element: _jsx(ProtectedRoute, { allowedRoles: ['teacher'], children: _jsx(TeacherAddPropositionPage, {}) }) }), _jsx(Route, { path: "/practice", element: _jsx(ProtectedRoute, { allowedRoles: ['student'], children: _jsx(PracticePage, {}) }) }), _jsx(Route, { path: "/", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/*", element: _jsx(ProtectedRoute, { children: _jsx(MainApp, {}) }) })] }) }) }) }));
}
export default App;
