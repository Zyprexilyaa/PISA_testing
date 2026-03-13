import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { QuestionPage } from './QuestionPage';
import { getClassroomById, saveClassroomSubmission } from '../services/classroomService';
import { getPropositions } from '../services/propositionService';
import './Classroom.css';
export const ClassroomProblemPage = () => {
    const { classroomId, propositionId } = useParams();
    const navigate = useNavigate();
    const { user, userRole } = useAuth();
    const [proposition, setProposition] = useState(null);
    const [classroomName, setClassroomName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const studentId = user?.uid || `student-${Math.random().toString(36).slice(2, 10)}`;
    useEffect(() => {
        const load = async () => {
            if (!propositionId || !classroomId) {
                setError('Missing required parameters');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                // Load classroom name for submission
                const cls = await getClassroomById(classroomId);
                if (cls)
                    setClassroomName(cls.className);
                const all = await getPropositions('th');
                const found = all.find(p => p.id === propositionId) || null;
                setProposition(found);
                if (!found) {
                    setError('Problem not found or not assigned.');
                }
            }
            catch (err) {
                console.error('Error loading proposition', err);
                setError('Failed to load problem');
            }
            finally {
                setLoading(false);
            }
        };
        load();
    }, [propositionId, classroomId]);
    if (userRole && userRole !== 'student') {
        return (_jsx("div", { className: "classroom-page", children: _jsx("div", { className: "classroom-container", children: _jsx("div", { className: "error-alert", children: "This view is for students only." }) }) }));
    }
    if (loading) {
        return (_jsx("div", { className: "classroom-page", children: _jsx("div", { className: "classroom-container", children: _jsx("div", { className: "loading", children: "Loading problem..." }) }) }));
    }
    if (error || !proposition) {
        return (_jsx("div", { className: "classroom-page", children: _jsxs("div", { className: "classroom-container", children: [_jsx("div", { className: "error-alert", children: error || 'Problem not available.' }), _jsx("div", { className: "classroom-footer", children: _jsx("button", { onClick: () => navigate(`/classroom/${classroomId}`), className: "btn btn-outline", children: "\u2190 Back to problems" }) })] }) }));
    }
    const question = {
        id: proposition.id || propositionId,
        questionText: proposition.questionText,
        difficulty: proposition.difficulty,
        subject: proposition.category,
        referenceAnswer: proposition.expectedAnswer,
        scoringGuideline: 'Use rubric and expected answer to evaluate reasoning.',
        createdAt: new Date(),
    };
    const handleAnalysisComplete = async (result) => {
        if (!proposition || !user)
            return;
        const submission = {
            classroomId: classroomId,
            studentId,
            studentName: user?.displayName || user?.email || 'Anonymous Student',
            questionText: proposition.questionText,
            userAnswer: result.transcription,
            analysisResult: JSON.stringify(result),
            score: result.score,
            submittedAt: new Date(),
            classroomName: classroomName
        };
        try {
            await saveClassroomSubmission(submission);
            console.log('✅ Classroom submission saved automatically');
        }
        catch (err) {
            console.error('Failed to save classroom submission:', err);
        }
    };
    return (_jsx("div", { className: "classroom-page", children: _jsxs("div", { className: "classroom-container", children: [_jsxs("div", { className: "classroom-header", children: [_jsx("h1", { children: "\uD83E\uDDE0 Classroom Problem" }), _jsxs("p", { children: [proposition.questionText.substring(0, 120), proposition.questionText.length > 120 ? '...' : ''] })] }), _jsx("div", { className: "classroom-card", children: _jsx(QuestionPage, { question: question, studentId: studentId, proposition: proposition, onAnalysisComplete: handleAnalysisComplete }) }), _jsx("div", { className: "classroom-footer", children: _jsx("button", { onClick: () => navigate(`/classroom/${classroomId}`), className: "btn btn-outline", children: "\u2190 Back to problems" }) })] }) }));
};
