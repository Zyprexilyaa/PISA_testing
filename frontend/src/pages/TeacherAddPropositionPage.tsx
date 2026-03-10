import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProposition, PropositionData } from '../services/propositionService';
import './Auth.css';

export const TeacherAddPropositionPage: React.FC = () => {
  const navigate = useNavigate();
  const [questionText, setQuestionText] = useState('');
  const [difficulty, setDifficulty] = useState<'easy'|'medium'|'hard'>('medium');
  const [category, setCategory] = useState<'critical-thinking'|'problem-solving'|'analysis'|'comprehension'>('critical-thinking');
  const [expectedAnswer, setExpectedAnswer] = useState('');
  const [language, setLanguage] = useState<'th'|'en'>('th');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!questionText || !expectedAnswer) {
      setError('Please fill in question and expected answer');
      return;
    }

    const proposition: PropositionData = {
      questionText,
      difficulty,
      category,
      expectedAnswer,
      language,
      scoringRubric: {},
    };

    try {
      setSaving(true);
      await saveProposition(proposition);
      setSaving(false);
      navigate('/teacher/propositions');
    } catch (err) {
      setSaving(false);
      setError('Failed to save proposition');
      console.error(err);
    }
  };

  return (
    <div className="auth-page">
      <div className="page-container">
        <div className="page-card">
          <h2 className="auth-subtitle">Add Proposition</h2>

          <form onSubmit={handleSave} className="auth-form">
            <div className="form-group">
              <label>Question Text</label>
              <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="form-input" rows={4} />
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)} className="form-input">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="form-input">
                <option value="critical-thinking">Critical Thinking</option>
                <option value="problem-solving">Problem Solving</option>
                <option value="analysis">Analysis</option>
                <option value="comprehension">Comprehension</option>
              </select>
            </div>

            <div className="form-group">
              <label>Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value as any)} className="form-input">
                <option value="th">Thai</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="form-group">
              <label>Expected Answer</label>
              <textarea value={expectedAnswer} onChange={(e) => setExpectedAnswer(e.target.value)} className="form-input" rows={3} />
            </div>

            {error && <div className="error-alert">{error}</div>}

            <div className="teacher-actions">
              <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Save Proposition'}</button>
              <button type="button" onClick={() => navigate(-1)} className="btn btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
