import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';
export const SignUpPage = () => {
    const navigate = useNavigate();
    const { signUpWithEmail, signUpWithGoogleRole, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleEmailSignUp = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            if (!email || !password || !confirmPassword) {
                throw new Error('Please fill in all fields');
            }
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            await signUpWithEmail(email, password);
            // Redirect to profile setup for username and role selection
            navigate('/setup-profile');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
            setError(errorMessage);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleGoogleSignUpClick = async () => {
        setError(null);
        setIsSubmitting(true);
        try {
            await signUpWithGoogleRole();
            // Google signup requires profile setup for role selection
            navigate('/setup-profile');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Google sign up failed';
            setError(errorMessage);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { className: "auth-page", children: _jsx("div", { className: "auth-container", children: _jsxs("div", { className: "auth-card", children: [_jsx("div", { className: "auth-logo", children: _jsx("img", { src: "/assets/pisa-logo.png", alt: "PISA Insight Logo", className: "logo-img" }) }), _jsx("h2", { className: "auth-subtitle", children: "Create Account" }), _jsxs("form", { onSubmit: handleEmailSignUp, className: "auth-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "your@email.com", disabled: isSubmitting || loading, className: "form-input" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", children: "Password" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "At least 6 characters", disabled: isSubmitting || loading, className: "form-input" }), _jsx("small", { className: "form-hint", children: "Must be at least 6 characters" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "confirmPassword", children: "Confirm Password" }), _jsx("input", { id: "confirmPassword", type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", disabled: isSubmitting || loading, className: "form-input" })] }), error && _jsx("div", { className: "error-alert", children: error }), _jsxs("div", { className: "login-methods", children: [_jsxs("div", { className: "method-container", children: [_jsx("img", { src: "/assets/email-logo.png", alt: "Email", className: "method-logo" }), _jsx("button", { type: "submit", disabled: isSubmitting || loading || !email || !password || !confirmPassword, className: "btn btn-primary btn-full", children: isSubmitting ? '🔄 Creating account...' : 'Sign Up with Email' })] }), _jsx("div", { className: "divider", children: "or" }), _jsxs("div", { className: "method-container", children: [_jsx("img", { src: "/assets/google-logo.png", alt: "Google", className: "method-logo" }), _jsx("button", { onClick: handleGoogleSignUpClick, disabled: isSubmitting || loading, className: "btn btn-google btn-full", children: isSubmitting ? '🔄 Signing up...' : 'Sign Up with Google' })] })] })] }), _jsxs("p", { className: "auth-footer", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "auth-link", children: "Sign in here" })] })] }) }) }));
};
