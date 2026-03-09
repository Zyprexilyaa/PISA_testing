import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Auth.css';

export const TeacherLoginPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { loginWithEmail, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">🧑‍🏫 Teacher Sign In</h1>
          <h2 className="auth-subtitle">
            {t('practice')} – Teacher Dashboard
          </h2>

          <form onSubmit={handleEmailLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Teacher Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@school.edu"
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
                placeholder="••••••••"
                disabled={isSubmitting || loading}
                className="form-input"
              />
            </div>

            {error && <div className="error-alert">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting || loading || !email || !password}
              className="btn btn-primary btn-full"
            >
              {isSubmitting ? '🔄 Logging in...' : '📧 Teacher Sign In'}
            </button>
          </form>

          <p className="auth-footer">
            Not a teacher?{' '}
            <Link to="/login" className="auth-link">
              Back to student sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

