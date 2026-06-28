import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionPage } from './QuestionPage';
import { getExamQuestionById } from '../services/examQuestionService';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';
export const ExamQuestionDetailPage = () => {
    const { questionId } = useParams();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
                }
                else {
                    setQuestion(q);
                }
            }
            catch (err) {
                setError('Unable to load the selected question.');
            }
            finally {
                setLoading(false);
            }
        };
        loadQuestion();
    }, [questionId]);
    if (loading) {
        return (_jsx("div", { className: "auth-page", children: _jsx("div", { className: "page-container", children: _jsx("div", { className: "page-card", children: _jsx("h2", { children: "Loading question..." }) }) }) }));
    }
    if (error || !question) {
        return (_jsx("div", { className: "auth-page", children: _jsx("div", { className: "page-container", children: _jsxs("div", { className: "page-card", children: [_jsx("h2", { children: error || 'Question not found.' }), _jsx("button", { className: "btn btn-outline", onClick: () => navigate('/practice'), children: "Back to Practice" })] }) }) }));
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
    return (_jsx("div", { className: "auth-page", children: _jsx("div", { className: "page-container", children: _jsxs("div", { className: "page-card", children: [_jsx("div", { className: "teacher-actions", style: { marginBottom: 16 }, children: _jsx("button", { onClick: () => navigate('/practice'), className: "btn btn-outline", children: "\u2190 Back to Practice" }) }), _jsx(QuestionPage, { question: questionProp, studentId: studentId, proposition: question })] }) }) }));
};
