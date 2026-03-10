import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';
export const GoogleProfileSetupPage = () => {
    const navigate = useNavigate();
    const { completeGoogleProfileSetup, loading, needsProfileSetup, user } = useAuth();
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Redirect if user doesn't need profile setup or isn't authenticated
    React.useEffect(() => {
        if (!loading && (!user || !needsProfileSetup)) {
            navigate('/');
        }
    }, [user, needsProfileSetup, loading, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            if (!username || username.trim().length === 0) {
                throw new Error('Please enter a username');
            }
            if (username.trim().length < 2) {
                throw new Error('Username must be at least 2 characters');
            }
            if (username.trim().length > 30) {
                throw new Error('Username must be less than 30 characters');
            }
            await completeGoogleProfileSetup(username.trim(), role);
            navigate('/');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Profile setup failed';
            setError(errorMessage);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { className: "auth-page", children: _jsx("div", { className: "auth-container", children: _jsxs("div", { className: "auth-card", children: [_jsx("h1", { className: "auth-title", children: "\uD83E\uDDE0 PISA Thinking Skills" }), _jsx("h2", { className: "auth-subtitle", children: "Complete Your Profile" }), _jsxs("form", { onSubmit: handleSubmit, className: "auth-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "username", children: "Choose a Username" }), _jsx("input", { id: "username", type: "text", value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Enter your username", disabled: isSubmitting || loading, className: "form-input", autoFocus: true }), _jsx("small", { className: "form-hint", children: "2-30 characters, letters and numbers" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Choose Your Role:" }), _jsxs("div", { className: "role-selector-container", children: [_jsxs("div", { className: `role-card ${role === 'student' ? 'active' : ''}`, onClick: () => setRole('student'), role: "button", tabIndex: 0, children: [_jsx("div", { className: "role-icon", children: "\uD83D\uDC68\u200D\uD83C\uDF93" }), _jsx("div", { className: "role-title", children: "Student" }), _jsx("div", { className: "role-description", children: "Learn and practice thinking skills" })] }), _jsxs("div", { className: `role-card ${role === 'teacher' ? 'active' : ''}`, onClick: () => setRole('teacher'), role: "button", tabIndex: 0, children: [_jsx("div", { className: "role-icon", children: "\uD83D\uDC69\u200D\uD83C\uDFEB" }), _jsx("div", { className: "role-title", children: "Teacher" }), _jsx("div", { className: "role-description", children: "Manage classrooms & track progress" })] })] })] }), error && _jsx("div", { className: "error-alert", children: error }), _jsx("button", { type: "submit", disabled: isSubmitting || loading || !username, className: "btn btn-primary btn-full", children: isSubmitting ? '🔄 Setting up...' : '✅ Complete Profile' })] })] }) }) }));
};
