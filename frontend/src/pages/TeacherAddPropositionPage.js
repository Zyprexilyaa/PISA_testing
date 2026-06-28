import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';
import { saveExamQuestion } from '../services/examQuestionService';
import './Auth.css';
export const TeacherAddPropositionPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [category, setCategory] = useState('critical-thinking');
    const [expectedAnswer, setExpectedAnswer] = useState('');
    const [language, setLanguage] = useState('th');
    const [pdfFile, setPdfFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [error, setError] = useState(null);
    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);
        if (!expectedAnswer) {
            setError('Please fill in the expected answer');
            return;
        }
        try {
            setSaving(true);
            let pdfUrl = '';
            let pdfFileName = '';
            if (pdfFile) {
                setUploadingPdf(true);
                const filePath = `exam-questions/${Date.now()}-${pdfFile.name.replace(/\s+/g, '-')}`;
                const fileRef = ref(storage, filePath);
                await uploadBytes(fileRef, pdfFile);
                pdfUrl = await getDownloadURL(fileRef);
                pdfFileName = pdfFile.name;
                setUploadingPdf(false);
            }
            const question = {
                title: title.trim() || (pdfFileName || questionText).slice(0, 80),
                questionText: questionText.trim() || (pdfFileName || 'Question from PDF'),
                difficulty,
                category,
                expectedAnswer,
                language,
                scoringRubric: {
                    excellent: { points: 3, description: 'Clear, complete, and well-supported answer' },
                    good: { points: 2, description: 'Mostly correct with some support' },
                    fair: { points: 1, description: 'Partially correct but limited explanation' },
                },
                sourceType: pdfFile ? 'pdf' : 'text',
                pdfUrl: pdfFile ? pdfUrl : undefined,
                pdfFileName: pdfFile ? pdfFileName : undefined,
            };
            await saveExamQuestion(question);
            setSaving(false);
            navigate('/teacher/propositions');
        }
        catch (err) {
            setSaving(false);
            setUploadingPdf(false);
            setError('Failed to save exam question');
            console.error(err);
        }
    };
    return (_jsx("div", { className: "auth-page", children: _jsx("div", { className: "page-container", children: _jsxs("div", { className: "page-card", children: [_jsx("h2", { className: "auth-subtitle", children: "Add Exam Question" }), _jsxs("form", { onSubmit: handleSave, className: "auth-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Question Title" }), _jsx("input", { value: title, onChange: (e) => setTitle(e.target.value), className: "form-input", placeholder: "Optional title for the exam question" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Question Text" }), _jsx("textarea", { value: questionText, onChange: (e) => setQuestionText(e.target.value), className: "form-input", rows: 4, placeholder: "Type the prompt here, or upload a PDF to make it the main question source" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Difficulty" }), _jsxs("select", { value: difficulty, onChange: (e) => setDifficulty(e.target.value), className: "form-input", children: [_jsx("option", { value: "easy", children: "Easy" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "hard", children: "Hard" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Category" }), _jsxs("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "form-input", children: [_jsx("option", { value: "critical-thinking", children: "Critical Thinking" }), _jsx("option", { value: "problem-solving", children: "Problem Solving" }), _jsx("option", { value: "analysis", children: "Analysis" }), _jsx("option", { value: "comprehension", children: "Comprehension" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Language" }), _jsxs("select", { value: language, onChange: (e) => setLanguage(e.target.value), className: "form-input", children: [_jsx("option", { value: "th", children: "Thai" }), _jsx("option", { value: "en", children: "English" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Upload PDF Question" }), _jsx("input", { type: "file", accept: "application/pdf", onChange: (e) => setPdfFile(e.target.files?.[0] || null), className: "form-input" }), pdfFile && _jsxs("div", { style: { marginTop: 8, fontSize: 14, color: '#4b5563' }, children: ["Selected PDF: ", pdfFile.name] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Expected Answer" }), _jsx("textarea", { value: expectedAnswer, onChange: (e) => setExpectedAnswer(e.target.value), className: "form-input", rows: 3 })] }), error && _jsx("div", { className: "error-alert", children: error }), _jsxs("div", { className: "teacher-actions", children: [_jsx("button", { type: "submit", disabled: saving || uploadingPdf, className: "btn btn-primary", children: saving || uploadingPdf ? 'Saving...' : 'Save Exam Question' }), _jsx("button", { type: "button", onClick: () => navigate(-1), className: "btn btn-outline", children: "Cancel" })] })] })] }) }) }));
};
