import React, { useEffect, useState } from 'react';
import { getExamQuestions, deleteAllExamQuestions, importPdfExamQuestions, ExamQuestionData } from '../services/examQuestionService';
import { Link } from 'react-router-dom';
import './Auth.css';

export const TeacherPropositionListPage: React.FC = () => {
  const [questions, setQuestions] = useState<ExamQuestionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const items = await getExamQuestions('th');
      setQuestions(items);
      setLoading(false);
    };
    load();
  }, []);

  const handleClearQuestions = async () => {
    if (!window.confirm('Remove all exam questions from the bank?')) {
      return;
    }

    setLoading(true);
    await deleteAllExamQuestions();
    setQuestions([]);
    setLoading(false);
  };

  const handleResetToPdfBank = async () => {
    if (!window.confirm('Reset the bank to only the 3 PDF exam questions?')) {
      return;
    }

    setLoading(true);
    await deleteAllExamQuestions();
    await importPdfExamQuestions('th');
    const items = await getExamQuestions('th');
    setQuestions(items);
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="page-container">
        <div className="page-card">
          <h2 className="auth-subtitle">Exam Question Bank</h2>

          <div className="teacher-actions">
            <Link to="/teacher/propositions/new" className="btn btn-primary">Add New Exam Question</Link>
            <button onClick={handleClearQuestions} className="btn btn-outline">Clear Question Bank</button>
            <button onClick={handleResetToPdfBank} className="btn btn-outline">Reset to PDF Bank Questions</button>
          </div>

          {loading && <div>Loading...</div>}

          {!loading && (
            <div className="proposition-list">
              {questions.map((q, idx) => (
                <div key={idx} className="proposition-item">
                  <h4>{q.title || q.questionText}</h4>
                  <p>{q.questionText}</p>
                  <div className="proposition-meta">{q.category} • {q.difficulty}</div>
                  {q.sourceType === 'pdf' && q.pdfUrl && (
                    <div style={{ marginTop: 8 }}>
                      <a href={q.pdfUrl} target="_blank" rel="noreferrer">Open PDF: {q.pdfFileName || 'question file'}</a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
