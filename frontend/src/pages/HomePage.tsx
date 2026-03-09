import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const handlePrimaryAction = () => {
    if (userRole === 'teacher') {
      navigate('/create-classroom');
    } else if (userRole === 'student') {
      navigate('/join-classroom');
    } else {
      // Fallback: keep generic experience
      navigate('/');
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>PISA Thinking Skills Analyzer</h1>
        <p className="subtitle">
          Evaluate your analytical thinking abilities using PISA-style questions
        </p>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🎤</div>
          <h3>Voice Input</h3>
          <p>Record your answers by speaking — no typing required</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🤖</div>
          <h3>AI Analysis</h3>
          <p>Get instant feedback on your analytical thinking</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📈</div>
          <h3>Track Progress</h3>
          <p>Monitor your thinking level improvement over time</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💡</div>
          <h3>Learn Better</h3>
          <p>See example answers and understand how to improve</p>
        </div>
      </div>

      {/* Role-specific classroom actions */}
      {userRole && (
        <div className="cta-section">
          {userRole === 'teacher' ? (
            <>
              <h2>Manage your classrooms</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary btn-large"
                  onClick={() => navigate('/create-classroom')}
                >
                  Create Classroom
                </button>
                <button
                  className="btn btn-secondary btn-large"
                  onClick={() => navigate('/my-classrooms')}
                >
                  My Classrooms
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>Join and practice in your classrooms</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary btn-large"
                  onClick={() => navigate('/join-classroom')}
                >
                  Join Classroom
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {!userRole && (
        <div className="cta-section">
          <h2>Ready to get started?</h2>
          <button className="btn btn-primary btn-large" onClick={handlePrimaryAction}>
            Start Answering Questions
          </button>
        </div>
      )}

      <div className="thinking-levels-section">
        <h3>PISA Thinking Levels</h3>
        <div className="levels-grid">
          <div className="level-card level-1">
            <div className="level-number">1</div>
            <h4>Basic Understanding</h4>
            <p>Understanding simple facts and information</p>
          </div>
          <div className="level-card level-2">
            <div className="level-number">2</div>
            <h4>Simple Reasoning</h4>
            <p>Making basic connections and simple explanations</p>
          </div>
          <div className="level-card level-3">
            <div className="level-number">3</div>
            <h4>Analytical Thinking</h4>
            <p>Analyzing complex situations and making inferences</p>
          </div>
          <div className="level-card level-4">
            <div className="level-number">4</div>
            <h4>Complex Reasoning</h4>
            <p>Evaluating evidence and building sophisticated arguments</p>
          </div>
        </div>
      </div>
    </div>
  );
};
