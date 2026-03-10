import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';
import './Auth.css';

export const GoogleProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { completeGoogleProfileSetup, loading, needsProfileSetup, user } = useAuth();

  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if user doesn't need profile setup or isn't authenticated
  React.useEffect(() => {
    if (!loading && (!user || !needsProfileSetup)) {
      navigate('/');
    }
  }, [user, needsProfileSetup, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile setup failed';
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
          <h2 className="auth-subtitle">Complete Your Profile</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Choose a Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                disabled={isSubmitting || loading}
                className="form-input"
                autoFocus
              />
              <small className="form-hint">2-30 characters, letters and numbers</small>
            </div>

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

            {error && <div className="error-alert">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting || loading || !username}
              className="btn btn-primary btn-full"
            >
              {isSubmitting ? '🔄 Setting up...' : '✅ Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
