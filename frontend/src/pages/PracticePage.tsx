import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPropositions, PropositionData, getRandomProposition } from '../services/propositionService';
import { useAuth } from '../contexts/AuthContext';
import { Question } from '../types';
import { QuestionPage } from './QuestionPage';
import './Auth.css';

export const PracticePage: React.FC = () => {
  const [propositions, setPropositions] = useState<PropositionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PropositionData | null>(null);
  const { user } = useAuth();

  // Use real user ID if available so teacher dashboards can track submissions
  const studentId = user?.uid || `student-${Math.random().toString(36).slice(2, 10)}`;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const props = await getPropositions('th');
      setPropositions(props);
      setLoading(false);
    };
    load();
  }, []);

  const pickRandom = async () => {
    setLoading(true);
    const p = await getRandomProposition('th');
    setSelected(p);
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="page-container">
        <div className="page-card">
          <h2 className="auth-subtitle">Practice Propositions</h2>

          <div className="teacher-actions">
            <button onClick={pickRandom} className="btn btn-primary" style={{marginRight:8}}>Pick Random</button>
            <Link to="/" className="btn btn-outline">Back Home</Link>
          </div>

          {loading && <div>Loading propositions...</div>}

          {!loading && !selected && (
            <div>
              <h3>Available Propositions</h3>
              <div className="proposition-list">
                {propositions.map((p, idx) => (
                  <div key={idx} className="proposition-item">
                    <h4>{p.questionText.substring(0,120)}{p.questionText.length>120? '...':''}</h4>
                    <div className="proposition-meta">{p.category} • {p.difficulty}</div>
                    <div style={{display:'flex', justifyContent:'flex-end'}}>
                      <button className="btn btn-outline" onClick={() => setSelected(p)}>Practice</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selected && (
            <div>
              <div className="teacher-actions" style={{ marginBottom: 16 }}>
                <button onClick={() => setSelected(null)} className="btn btn-outline">
                  Back to list
                </button>
              </div>

              {/* Reuse QuestionPage to run full practice/analysis flow */}
              <QuestionPage
                question={{
                  id: selected.id || 'prop-' + Math.random().toString(36).slice(2, 10),
                  questionText: selected.questionText,
                  difficulty: selected.difficulty,
                  subject: selected.category,
                  referenceAnswer: selected.expectedAnswer,
                  scoringGuideline: 'Use rubric and expected answer to evaluate reasoning.',
                  createdAt: new Date(),
                } as Question}
                studentId={studentId}
                proposition={selected}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
