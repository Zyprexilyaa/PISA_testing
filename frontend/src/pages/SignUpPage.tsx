import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import './Auth.css';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUpWithEmail, loginWithGoogle, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
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

      await signUpWithEmail(email, password, role);
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Google signup defaults to student role
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign up failed';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">🧠 PISA Thinking Skills</h1>
          <h2 className="auth-subtitle">Create Account</h2>

          <form onSubmit={handleEmailSignUp} className="auth-form">
            {/* Role Selection */}
            <div className="form-group">
              <label>I am a:</label>
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-btn ${role === 'student' ? 'active' : ''}`}
                  onClick={() => setRole('student')}
                  disabled={isSubmitting || loading}
                >
                  👨‍🎓 Student
                </button>
                <button
                  type="button"
                  className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
                  onClick={() => setRole('teacher')}
                  disabled={isSubmitting || loading}
                >
                  👩‍🏫 Teacher
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={isSubmitting || loading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                disabled={isSubmitting || loading}
                className="form-input"
              />
              <small className="form-hint">Must be at least 6 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isSubmitting || loading}
                className="form-input"
              />
            </div>

            {error && <div className="error-alert">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting || loading || !email || !password || !confirmPassword}
              className="btn btn-primary btn-full"
            >
              {isSubmitting ? '🔄 Creating account...' : '📧 Sign Up with Email'}
            </button>
          </form>

          <div className="divider">or</div>

          <button
            onClick={handleGoogleSignUp}
            disabled={isSubmitting || loading}
            className="btn btn-google btn-full"
          >
            {isSubmitting ? '🔄 Signing up...' : '🔗 Sign Up with Google'}
          </button>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
