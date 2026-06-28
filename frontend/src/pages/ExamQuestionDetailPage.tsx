import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionPage } from './QuestionPage';
import { getExamQuestionById, ExamQuestionData } from '../services/examQuestionService';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export const ExamQuestionDetailPage: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [question, setQuestion] = useState<ExamQuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const studentId = user?.uid || `student-${Math.random().toString(36).slice(2, 10)}`;
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuestion = async () => {
      if (!questionId) {
        setError('Missing question id');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const q = await getExamQuestionById(questionId);
        if (!q) {
          setError('Question not found.');
        } else {
          setQuestion(q);
        }
      } catch (err) {
        setError('Unable to load the selected question.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [questionId]);

  if (loading) {
    return (
      <div className="auth-page">
        <div className="page-container">
          <div className="page-card">
            <h2>Loading question...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="auth-page">
        <div className="page-container">
          <div className="page-card">
            <h2>{error || 'Question not found.'}</h2>
            <button className="btn btn-outline" onClick={() => navigate('/practice')}>
              Back to Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  const questionProp = {
    id: question.id || `exam-q-${Math.random().toString(36).slice(2, 10)}`,
    questionText: question.questionText,
    difficulty: question.difficulty,
    subject: question.category,
    referenceAnswer: question.expectedAnswer,
    scoringGuideline: 'Use rubric and reference answer to evaluate reasoning.',
    createdAt: new Date(),
    context: question.pdfUrl ? `PDF source: ${question.pdfFileName}` : undefined,
  };

  return (
    <div className="auth-page">
      <div className="page-container">
        <div className="page-card">
          <div className="teacher-actions" style={{ marginBottom: 16 }}>
            <button onClick={() => navigate('/practice')} className="btn btn-outline">
              ← Back to Practice
            </button>
          </div>
          <QuestionPage question={questionProp} studentId={studentId} proposition={question} />
        </div>
      </div>
    </div>
  );
};