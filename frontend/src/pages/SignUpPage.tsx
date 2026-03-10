import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import './Auth.css';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUpWithEmail, signUpWithGoogleRole, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGoogleRoleModal, setShowGoogleRoleModal] = useState(false);
  const [googleRole, setGoogleRole] = useState<UserRole>('student');

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

  const handleGoogleSignUpClick = () => {
    setShowGoogleRoleModal(true);
  };

  const handleGoogleRoleConfirm = async (selectedRole: UserRole) => {
    setError(null);
    setIsSubmitting(true);

    try {
      await signUpWithGoogleRole(selectedRole);
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign up failed';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setShowGoogleRoleModal(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">🧠 PISA Thinking Skills</h1>
          <h2 className="auth-subtitle">Create Account</h2>

          <form onSubmit={handleEmailSignUp} className="auth-form">
            {/* Beautiful Role Selection */}
            <div className="form-group">
              <label>Choose Your Role:</label>
              <div className="role-selector-container">
                <div
                  className={`role-card ${role === 'student' ? 'active' : ''}`}
                  onClick={() => setRole('student')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="role-icon">👨‍🎓</div>
                  <div className="role-title">Student</div>
                  <div className="role-description">Learn and practice thinking skills</div>
                </div>

                <div
                  className={`role-card ${role === 'teacher' ? 'active' : ''}`}
                  onClick={() => setRole('teacher')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="role-icon">👩‍🏫</div>
                  <div className="role-title">Teacher</div>
                  <div className="role-description">Manage classrooms & track progress</div>
                </div>
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
            onClick={handleGoogleSignUpClick}
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

      {/* Google Role Selection Modal */}
      {showGoogleRoleModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2>Choose Your Role for Google Sign Up</h2>
            </div>
            <div className="modal-body">
              <p className="modal-description">
                Select your role to complete your Google sign up:
              </p>

              <div className="role-selector-container">
                <div
                  className={`role-card ${googleRole === 'student' ? 'active' : ''}`}
                  onClick={() => setGoogleRole('student')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="role-icon">👨‍🎓</div>
                  <div className="role-title">Student</div>
                  <div className="role-description">Learn and improve your thinking skills</div>
                </div>

                <div
                  className={`role-card ${googleRole === 'teacher' ? 'active' : ''}`}
                  onClick={() => setGoogleRole('teacher')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="role-icon">👩‍🏫</div>
                  <div className="role-title">Teacher</div>
                  <div className="role-description">Create classrooms and monitor students</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowGoogleRoleModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => handleGoogleRoleConfirm(googleRole)}
                disabled={isSubmitting || loading}
                className="btn btn-primary"
              >
                {isSubmitting ? '🔄...' : 'Continue with Google'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
