import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getExamQuestions } from '../services/examQuestionService';
import { useAuth } from '../contexts/AuthContext';
import { QuestionPage } from './QuestionPage';
import './Auth.css';
export const PracticePage = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
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
    const filteredQuestions = selectedCategory === 'all'
        ? questions
        : questions.filter((q) => q.category === selectedCategory);
    const pickRandom = async () => {
        setLoading(true);
        const items = filteredQuestions.length > 0 ? filteredQuestions : questions;
        const randomIndex = Math.floor(Math.random() * items.length);
        setSelected(items[randomIndex] || null);
        setLoading(false);
    };
    return (_jsx("div", { className: "auth-page", children: _jsx("div", { className: "page-container", children: _jsxs("div", { className: "page-card", children: [_jsx("h2", { className: "auth-subtitle", children: "Practice Exam Questions" }), _jsxs("div", { className: "teacher-actions", children: [_jsx("button", { onClick: pickRandom, className: "btn btn-primary", style: { marginRight: 8 }, children: "Pick Random" }), _jsx(Link, { to: "/", className: "btn btn-outline", children: "Back Home" })] }), loading && _jsx("div", { children: "Loading propositions..." }), !loading && !selected && (_jsxs("div", { children: [_jsx("h3", { children: "Available Exam Questions" }), _jsxs("div", { style: { marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }, children: [_jsxs("label", { style: { marginBottom: 0 }, children: ["Subject / Category:", _jsxs("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), style: { marginLeft: 8, minWidth: 180 }, children: [_jsx("option", { value: "all", children: "All subjects" }), Array.from(new Set(questions.map((q) => q.category))).map((category) => (_jsx("option", { value: category, children: category }, category)))] })] }), _jsxs("span", { style: { color: '#555' }, children: ["Showing ", filteredQuestions.length, " of ", questions.length, " questions"] })] }), _jsx("div", { className: "proposition-list", children: filteredQuestions.map((q, idx) => (_jsxs("div", { className: "proposition-item", children: [_jsxs("h4", { children: [q.questionText.substring(0, 120), q.questionText.length > 120 ? '...' : ''] }), _jsxs("div", { className: "proposition-meta", children: [q.category, " \u2022 ", q.difficulty, q.questionNumber && ` • Q${q.questionNumber}`] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'flex-end', gap: 8 }, children: [_jsx(Link, { to: `/practice/question/${q.id || ''}`, className: "btn btn-outline", children: "Open" }), _jsx("button", { className: "btn btn-primary", onClick: () => setSelected(q), children: "Practice" })] })] }, idx))) })] })), selected && (_jsxs("div", { children: [_jsx("div", { className: "teacher-actions", style: { marginBottom: 16 }, children: _jsx("button", { onClick: () => setSelected(null), className: "btn btn-outline", children: "Back to list" }) }), _jsx(QuestionPage, { question: {
                                    id: selected.id || 'exam-q-' + Math.random().toString(36).slice(2, 10),
                                    questionText: selected.questionText,
                                    difficulty: selected.difficulty,
                                    subject: selected.category,
                                    referenceAnswer: selected.expectedAnswer,
                                    scoringGuideline: 'Use rubric and expected answer to evaluate reasoning.',
                                    createdAt: new Date(),
                                    questionImage: selected.questionImage,
                                    context: selected.sourceType === 'pdf' && selected.pdfFileName ? `PDF source: ${selected.pdfFileName}` : undefined,
                                }, studentId: studentId, proposition: selected })] }))] }) }) }));
};
