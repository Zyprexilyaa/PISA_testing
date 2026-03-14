import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveProposition } from '../services/propositionService';
import './Auth.css';
export const TeacherAddPropositionPage = () => {
    const navigate = useNavigate();
    const [questionText, setQuestionText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [relatedLesson, setRelatedLesson] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [category, setCategory] = useState('critical-thinking');
    const [expectedAnswer, setExpectedAnswer] = useState('');
    const [language, setLanguage] = useState('th');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);
        if (!questionText || !expectedAnswer) {
            setError('Please fill in question and expected answer');
            return;
        }
        const proposition = {
            questionText,
            imageUrl,
            relatedLesson,
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
        }
        catch (err) {
            setSaving(false);
            setError('Failed to save proposition');
            console.error(err);
        }
    };
    return (_jsx("div", { className: "auth-page", children: _jsx("div", { className: "page-container", children: _jsxs("div", { className: "page-card", children: [_jsx("h2", { className: "auth-subtitle", children: "Add Proposition" }), _jsxs("form", { onSubmit: handleSave, className: "auth-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Question Text" }), _jsx("textarea", { value: questionText, onChange: (e) => setQuestionText(e.target.value), className: "form-input", rows: 4 })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Image URL (Optional)" }), _jsx("input", { type: "text", value: imageUrl, onChange: (e) => setImageUrl(e.target.value), className: "form-input", placeholder: "https://..." })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Related Lesson / Context (Optional)" }), _jsx("textarea", { value: relatedLesson, onChange: (e) => setRelatedLesson(e.target.value), className: "form-input", rows: 2, placeholder: "Brief background or lesson topic..." })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Difficulty" }), _jsxs("select", { value: difficulty, onChange: (e) => setDifficulty(e.target.value), className: "form-input", children: [_jsx("option", { value: "easy", children: "Easy" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "hard", children: "Hard" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Category" }), _jsxs("select", { value: category, onChange: (e) => setCategory(e.target.value), className: "form-input", children: [_jsx("option", { value: "critical-thinking", children: "Critical Thinking" }), _jsx("option", { value: "problem-solving", children: "Problem Solving" }), _jsx("option", { value: "analysis", children: "Analysis" }), _jsx("option", { value: "comprehension", children: "Comprehension" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Language" }), _jsxs("select", { value: language, onChange: (e) => setLanguage(e.target.value), className: "form-input", children: [_jsx("option", { value: "th", children: "Thai" }), _jsx("option", { value: "en", children: "English" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { children: "Expected Answer" }), _jsx("textarea", { value: expectedAnswer, onChange: (e) => setExpectedAnswer(e.target.value), className: "form-input", rows: 3 })] }), error && _jsx("div", { className: "error-alert", children: error }), _jsxs("div", { className: "teacher-actions", children: [_jsx("button", { type: "submit", disabled: saving, className: "btn btn-primary", children: saving ? 'Saving...' : 'Save Proposition' }), _jsx("button", { type: "button", onClick: () => navigate(-1), className: "btn btn-outline", children: "Cancel" })] })] })] }) }) }));
};
