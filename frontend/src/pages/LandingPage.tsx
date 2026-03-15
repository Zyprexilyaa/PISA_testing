import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navbar inspired by Trae */}
      <nav className="landing-nav animate-fade-in">
        <div className="nav-container">
          <div className="logo-section">
            <img src="/assets/pisa-logo.png" alt="PISA Insight" className="landing-logo-img" />
            <span className="brand-name">PISA Insight</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <button className="btn-login-minimal" onClick={() => navigate('/login')}>Log in</button>
            <button className="btn-get-started-nav" onClick={() => navigate('/login')}>Start Free</button>
            <button className="btn-teacher" onClick={() => navigate('/teacher-login')}>Teacher Login</button>
            <button className="btn-teacher-outline" onClick={() => navigate('/teacher/propositions/new')}>Add Proposition</button>
          </div>
        </div>
      </nav>

      {/* Hero Section inspired by Trae but with Blue Theme */}
      <header className="hero-section-modern">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title animate-slide-up">
              The Future of <span className="text-gradient">Analytical Thinking</span>
            </h1>
            <p className="hero-subtitle animate-slide-up delay-1">
              PISA Insight is your AI-powered companion to master complex reasoning and analytical skills. 
              Understand. Execute. Deliver results.
            </p>
            <div className="hero-actions animate-slide-up delay-2">
              <button className="btn-primary-modern" onClick={() => navigate('/login')}>
                Get Started for Free <span className="arrow">→</span>
              </button>
              <button className="btn-outline-modern" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Features
              </button>
            </div>
          </div>
          <div className="hero-visual animate-fade-in delay-3">
            <div className="floating-card-container">
              <div className="floating-card card-1">
                <div className="card-icon">🎤</div>
                <div className="card-text">Voice Analysis</div>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">🤖</div>
                <div className="card-text">AI Feedback</div>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">📊</div>
                <div className="card-text">Level Tracking</div>
              </div>
              <div className="hero-glow"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Friendly Section inspired by StoryBuddy but Blue */}
      <section id="features" className="friendly-features">
        <div className="friendly-container">
          <div className="friendly-header">
            <h2 className="friendly-title">Designed for <span className="blue-highlight">Human</span> Learning</h2>
            <p className="friendly-subtitle">We combine cutting-edge AI with pedagogical best practices to help you grow.</p>
          </div>
          
          <div className="features-grid-modern">
            <div className="modern-feature-card">
              <div className="feature-icon-wrapper blue">🎤</div>
              <h3>Speak Naturally</h3>
              <p>Record your thoughts using voice. Our AI transcribes and understands the nuances of your reasoning in Thai and English.</p>
            </div>
            <div className="modern-feature-card">
              <div className="feature-icon-wrapper success">💡</div>
              <h3>Instant Insight</h3>
              <p>Receive immediate, constructive feedback on your thinking levels based on PISA international standards.</p>
            </div>
            <div className="modern-feature-card">
              <div className="feature-icon-wrapper accent">📈</div>
              <h3>Master Levels</h3>
              <p>Progression system from Basic Understanding (Level 1) to Complex Reasoning (Level 4).</p>
            </div>
          </div>
        </div>
        
        {/* Soft star shapes like StoryBuddy but in Blue tones */}
        <div className="soft-shape shape-1"></div>
        <div className="soft-shape shape-2"></div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="cta-box">
          <h2>Ready to unlock your potential?</h2>
          <p>Join thousands of students and teachers using PISA Insight today.</p>
          <button className="btn-white-modern" onClick={() => navigate('/login')}>
            Start Your Journey Now
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-container">
          <p>© 2026 PISA Insight Analyzer. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
