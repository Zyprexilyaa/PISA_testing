import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Auth.css';
export const LoginPage = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { loginWithEmail, loginWithGoogle, loading } = useAuth();
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
            navigate('/');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleGoogleLogin = async () => {
        setError(null);
        setIsSubmitting(true);
        try {
            await loginWithGoogle();
            navigate('/');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Google login failed';
            setError(errorMessage);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { className: "auth-page", children: _jsx("div", { className: "auth-container", children: _jsxs("div", { className: "auth-card", children: [_jsx("div", { className: "auth-logo", children: _jsx("img", { src: "/assets/pisa-logo.png", alt: "PISA Insight Logo", className: "logo-img" }) }), _jsx("h2", { className: "auth-subtitle", children: t('practice') }), _jsxs("form", { onSubmit: handleEmailLogin, className: "auth-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "your@email.com", disabled: isSubmitting || loading, className: "form-input" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", disabled: isSubmitting || loading, className: "form-input" })] }), error && _jsx("div", { className: "error-alert", children: error }), _jsxs("div", { className: "login-methods", children: [_jsx("div", { className: "method-container", children: _jsxs("button", { type: "submit", disabled: isSubmitting || loading || !email || !password, className: "btn btn-primary btn-full btn-email", children: [_jsx("span", { className: "btn-icon", children: "\uD83D\uDCE7" }), _jsx("span", { className: "btn-text", children: isSubmitting ? '🔄 Logging in...' : 'Sign In with Email' })] }) }), _jsx("div", { className: "divider", children: "or" }), _jsx("div", { className: "method-container", children: _jsxs("button", { onClick: handleGoogleLogin, disabled: isSubmitting || loading, className: "btn btn-google btn-full btn-google-styled", children: [_jsx("span", { className: "btn-icon", children: "oogle" }), _jsx("span", { className: "btn-text", children: isSubmitting ? '🔄 Signing in...' : 'Sign In with Google' })] }) })] })] }), _jsxs("p", { className: "auth-footer", children: ["Don't have an account?", ' ', _jsx(Link, { to: "/signup", className: "auth-link", children: "Sign up here" })] }), _jsxs("p", { className: "auth-footer", style: { marginTop: '0.75rem', fontSize: '0.9rem' }, children: ["Are you a teacher?", ' ', _jsx(Link, { to: "/teacher-login", className: "auth-link", children: "Teacher sign in" })] })] }) }) }));
};
