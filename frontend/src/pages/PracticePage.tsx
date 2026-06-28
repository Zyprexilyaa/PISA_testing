import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getExamQuestions, getRandomExamQuestion, ExamQuestionData } from '../services/examQuestionService';
import { useAuth } from '../contexts/AuthContext';
import { Question } from '../types';
import { QuestionPage } from './QuestionPage';
import './Auth.css';

export const PracticePage: React.FC = () => {
  const [questions, setQuestions] = useState<ExamQuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ExamQuestionData | null>(null);
  const { user } = useAuth();

  // Use real user ID if available so teacher dashboards can track submissions
  const studentId = user?.uid || `student-${Math.random().toString(36).slice(2, 10)}`;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const items = await getExamQuestions('th');
      setQuestions(items);
      setLoading(false);
    };
    load();
  }, []);

  const pickRandom = async () => {
    setLoading(true);
    const p = await getRandomExamQuestion('th');
    setSelected(p);
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="page-container">
        <div className="page-card">
          <h2 className="auth-subtitle">Practice Exam Questions</h2>

          <div className="teacher-actions">
            <button onClick={pickRandom} className="btn btn-primary" style={{marginRight:8}}>Pick Random</button>
            <Link to="/" className="btn btn-outline">Back Home</Link>
          </div>

          {loading && <div>Loading propositions...</div>}

          {!loading && !selected && (
            <div>
              <h3>Available Exam Questions</h3>
              <div className="proposition-list">
                {questions.map((q, idx) => (
                  <div key={idx} className="proposition-item">
                    <h4>{q.questionText.substring(0,120)}{q.questionText.length>120? '...':''}</h4>
                    <div className="proposition-meta">
                      {q.category} • {q.difficulty}
                      {q.questionNumber && ` • Q${q.questionNumber}`}
                    </div>
                    <div style={{display:'flex', justifyContent:'flex-end', gap: 8}}>
                      <Link to={`/practice/question/${q.id || ''}`} className="btn btn-outline">Open</Link>
                      <button className="btn btn-primary" onClick={() => setSelected(q)}>Practice</button>
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
                  id: selected.id || 'exam-q-' + Math.random().toString(36).slice(2, 10),
                  questionText: selected.questionText,
                  difficulty: selected.difficulty,
                  subject: selected.category,
                  referenceAnswer: selected.expectedAnswer,
                  scoringGuideline: 'Use rubric and expected answer to evaluate reasoning.',
                  createdAt: new Date(),
                  context: selected.sourceType === 'pdf' && selected.pdfFileName ? `PDF source: ${selected.pdfFileName}` : undefined,
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
