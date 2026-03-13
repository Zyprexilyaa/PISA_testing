import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './Auth.css';

export const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { loginWithEmail, loginWithGoogle, loading } = useAuth();

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
      navigate('/home');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await loginWithGoogle();
      navigate('/home');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google login failed';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <img src="/assets/pisa-logo.png" alt="PISA Insight Logo" className="logo-img" />
          </div>
          <h2 className="auth-subtitle">{t('practice')}</h2>

          <form onSubmit={handleEmailLogin} className="auth-form">
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
                placeholder="••••••••"
                disabled={isSubmitting || loading}
                className="form-input"
              />
            </div>

            {error && <div className="error-alert">{error}</div>}

            <div className="login-methods">
              <div className="method-container">
                <button
                  type="submit"
                  disabled={isSubmitting || loading || !email || !password}
                  className="btn btn-primary btn-full btn-email"
                >
                  <span className="btn-icon">📧</span>
                  <span className="btn-text">
                    {isSubmitting ? '🔄 Logging in...' : 'Sign In with Email'}
                  </span>
                </button>
              </div>

              <div className="divider">or</div>

              <div className="method-container">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting || loading}
                  className="btn btn-google btn-full btn-google-styled"
                >
                  <span className="btn-icon">oogle</span>
                  <span className="btn-text">
                    {isSubmitting ? '🔄 Signing in...' : 'Sign In with Google'}
                  </span>
                </button>
              </div>
            </div>
          </form>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Sign up here
            </Link>
          </p>
          <p className="auth-footer" style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
            Are you a teacher?{' '}
            <Link to="/teacher-login" className="auth-link">
              Teacher sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
