import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getClassroomSubmissions } from '../services/classroomService';
import './Classroom.css';
export const TeacherDashboardPage = () => {
    const { classroomId } = useParams();
    const navigate = useNavigate();
    const { user, userRole } = useAuth();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [classroomName, setClassroomName] = useState('');
    // Redirect if not teacher
    useEffect(() => {
        if (userRole && userRole !== 'teacher') {
            navigate('/');
        }
    }, [userRole, navigate]);
    // Load classroom submissions
    useEffect(() => {
        const loadSubmissions = async () => {
            if (!classroomId || !user?.uid)
                return;
            try {
                setLoading(true);
                const classroomSubmissions = await getClassroomSubmissions(classroomId);
                // For now, we'll use student IDs as names (in a real app, you'd fetch user details)
                const submissionsWithDetails = classroomSubmissions.map(sub => ({
                    ...sub,
                    studentName: `Student ${sub.studentId.slice(-4)}`, // Last 4 chars of ID
                    studentEmail: `${sub.studentId.slice(-4)}@student.edu`, // Mock email
                    classroomName: sub.classroomName,
                }));
                setSubmissions(submissionsWithDetails);
                // Set classroom name from first submission if available
                if (submissionsWithDetails.length > 0 && submissionsWithDetails[0].classroomName) {
                    setClassroomName(submissionsWithDetails[0].classroomName);
                }
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load submissions';
                setError(errorMessage);
            }
            finally {
                setLoading(false);
            }
        };
        loadSubmissions();
    }, [classroomId, user?.uid]);
    const getScoreColor = (score) => {
        if (score >= 80)
            return '#4CAF50'; // Green
        if (score >= 60)
            return '#FF9800'; // Orange
        return '#F44336'; // Red
    };
    const getAverageScore = () => {
        if (submissions.length === 0)
            return 0;
        const total = submissions.reduce((sum, sub) => sum + sub.score, 0);
        return Math.round(total / submissions.length);
    };
    const getScoreDistribution = () => {
        const ranges = { excellent: 0, good: 0, needsImprovement: 0 };
        submissions.forEach(sub => {
            if (sub.score >= 80)
                ranges.excellent++;
            else if (sub.score >= 60)
                ranges.good++;
            else
                ranges.needsImprovement++;
        });
        return ranges;
    };
    if (userRole !== 'teacher') {
        return _jsx("div", { children: "Loading..." });
    }
    if (loading) {
        return (_jsx("div", { className: "classroom-page", children: _jsx("div", { className: "classroom-container", children: _jsx("div", { className: "loading", children: "Loading classroom data..." }) }) }));
    }
    if (error) {
        return (_jsx("div", { className: "classroom-page", children: _jsxs("div", { className: "classroom-container", children: [_jsx("div", { className: "error-alert", children: error }), _jsx("button", { onClick: () => navigate('/create-classroom'), className: "btn btn-outline", children: "\u2190 Back to Dashboard" })] }) }));
    }
    const averageScore = getAverageScore();
    const distribution = getScoreDistribution();
    return (_jsx("div", { className: "classroom-page", children: _jsxs("div", { className: "classroom-container", children: [_jsxs("div", { className: "classroom-header", children: [_jsxs("h1", { children: ["\uD83D\uDCCA ", classroomName || 'Classroom', " Dashboard"] }), _jsx("p", { children: "View student submissions and performance" })] }), _jsxs("div", { className: "stats-grid", children: [_jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "\uD83D\uDC65 Total Students" }), _jsx("div", { className: "stat-value", children: submissions.length })] }), _jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "\uD83D\uDCC8 Average Score" }), _jsxs("div", { className: "stat-value", style: { color: getScoreColor(averageScore) }, children: [averageScore, "%"] })] }), _jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "\uD83C\uDFAF Excellent (80%+)" }), _jsx("div", { className: "stat-value", children: distribution.excellent })] }), _jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "\u26A0\uFE0F Needs Improvement (<60%)" }), _jsx("div", { className: "stat-value", children: distribution.needsImprovement })] })] }), _jsxs("div", { className: "classroom-card", children: [_jsx("h2", { children: "\uD83D\uDCDD Student Submissions" }), submissions.length === 0 ? (_jsx("p", { className: "no-submissions", children: "No submissions yet. Students need to complete quizzes in this classroom." })) : (_jsx("div", { className: "submissions-table", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Student" }), _jsx("th", { children: "Question" }), _jsx("th", { children: "Score" }), _jsx("th", { children: "Submitted" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: submissions.map((submission) => (_jsxs("tr", { children: [_jsx("td", { children: _jsxs("div", { className: "student-info", children: [_jsx("strong", { children: submission.studentName }), _jsx("small", { children: submission.studentEmail })] }) }), _jsx("td", { children: _jsx("div", { className: "question-preview", children: submission.questionText.length > 50
                                                            ? `${submission.questionText.substring(0, 50)}...`
                                                            : submission.questionText }) }), _jsx("td", { children: _jsxs("span", { className: "score-badge", style: { backgroundColor: getScoreColor(submission.score) }, children: [submission.score, "%"] }) }), _jsx("td", { children: submission.submittedAt.toLocaleDateString() }), _jsx("td", { children: _jsx("button", { onClick: () => navigate(`/submission/${submission.id}`), className: "btn btn-small", children: "\uD83D\uDC41\uFE0F View" }) })] }, submission.id))) })] }) }))] }), _jsx("div", { className: "classroom-footer", children: _jsx("button", { onClick: () => navigate('/create-classroom'), className: "btn btn-outline", children: "\u2190 Back to My Classrooms" }) })] }) }));
};
