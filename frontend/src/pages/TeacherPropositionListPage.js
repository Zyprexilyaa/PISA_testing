import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getExamQuestions, deleteAllExamQuestions } from '../services/examQuestionService';
import { Link } from 'react-router-dom';
import './Auth.css';
export const TeacherPropositionListPage = () => {
    const [questions, setQuestions] = useState([]);
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
        await deleteAllExamQuestions();
        setQuestions([]);
    };
    return (_jsx("div", { className: "auth-page", children: _jsx("div", { className: "page-container", children: _jsxs("div", { className: "page-card", children: [_jsx("h2", { className: "auth-subtitle", children: "Exam Question Bank" }), _jsxs("div", { className: "teacher-actions", children: [_jsx(Link, { to: "/teacher/propositions/new", className: "btn btn-primary", children: "Add New Exam Question" }), _jsx("button", { onClick: handleClearQuestions, className: "btn btn-outline", children: "Clear Question Bank" })] }), loading && _jsx("div", { children: "Loading..." }), !loading && (_jsx("div", { className: "proposition-list", children: questions.map((q, idx) => (_jsxs("div", { className: "proposition-item", children: [_jsx("h4", { children: q.title || q.questionText }), _jsx("p", { children: q.questionText }), _jsxs("div", { className: "proposition-meta", children: [q.category, " \u2022 ", q.difficulty] }), q.sourceType === 'pdf' && q.pdfUrl && (_jsx("div", { style: { marginTop: 8 }, children: _jsxs("a", { href: q.pdfUrl, target: "_blank", rel: "noreferrer", children: ["Open PDF: ", q.pdfFileName || 'question file'] }) }))] }, idx))) }))] }) }) }));
};
