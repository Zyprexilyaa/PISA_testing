import React, { useState } from 'react';
import './App.css';
import { HomePage } from './pages/HomePage';
import { QuestionPage } from './pages/QuestionPage';
import { Question } from './types';

// Sample question for demo
const sampleQuestion: Question = {
  id: 'q1',
  questionText: 'How does water pollution affect aquatic ecosystems and the communities that depend on them?',
  difficulty: 'hard',
  subject: 'Environmental Science',
  referenceAnswer: 'Water pollution harms aquatic ecosystems by introducing toxic substances that poison organisms, reduce oxygen levels (eutrophication), and disrupt food chains. This affects both the ecosystem health and human communities that depend on fishing, drinking water, and recreation.',
  scoringGuideline: 'Award points for: (1) identifying specific types of harm to organisms, (2) explaining mechanisms like oxygen depletion, (3) discussing ecosystem disruption, (4) connecting to human impact.',
  createdAt: new Date(),
};

type PageType = 'home' | 'question' | 'dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [studentId] = useState('student-' + Math.random().toString(36).substr(2, 9));

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🧠 PISA Thinking Skills</h1>
          <nav className="navigation">
            <button
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentPage('home')}
            >
              Home
            </button>
            <button
              className={`nav-link ${currentPage === 'question' ? 'active' : ''}`}
              onClick={() => setCurrentPage('question')}
            >
              Practice
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {currentPage === 'home' && (
          <HomePage />
        )}
        {currentPage === 'question' && (
          <QuestionPage question={sampleQuestion} studentId={studentId} />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 PISA Thinking Skills Analyzer | AI-Powered Learning</p>
      </footer>
    </div>
  );
}

export default App;
