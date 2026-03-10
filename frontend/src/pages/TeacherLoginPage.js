import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Auth.css';
export const TeacherLoginPage = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { loginWithEmail, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            if (!email || !password) {
                throw new Error('Please fill in all fields');
            }
            await loginWithEmail(email, password);
            // After successful login, send teachers directly to classroom dashboard
            navigate('/create-classroom');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { className: "auth-page", children: _jsx("div", { className: "auth-container", children: _jsxs("div", { className: "auth-card", children: [_jsx("h1", { className: "auth-title", children: "\uD83E\uDDD1\u200D\uD83C\uDFEB Teacher Sign In" }), _jsxs("h2", { className: "auth-subtitle", children: [t('practice'), " \u2013 Teacher Dashboard"] }), _jsxs("form", { onSubmit: handleEmailLogin, className: "auth-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Teacher Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "teacher@school.edu", disabled: isSubmitting || loading, className: "form-input" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", disabled: isSubmitting || loading, className: "form-input" })] }), error && _jsx("div", { className: "error-alert", children: error }), _jsx("button", { type: "submit", disabled: isSubmitting || loading || !email || !password, className: "btn btn-primary btn-full", children: isSubmitting ? '🔄 Logging in...' : '📧 Teacher Sign In' })] }), _jsxs("p", { className: "auth-footer", children: ["Not a teacher?", ' ', _jsx(Link, { to: "/login", className: "auth-link", children: "Back to student sign in" })] })] }) }) }));
};
