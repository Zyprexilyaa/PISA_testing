import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getClassroomById } from '../services/classroomService';
import { getFirestore, doc, getDoc, onSnapshot, query, collection, where } from 'firebase/firestore';
import app from '../services/firebase';
import './Classroom.css';
export const TeacherDashboardPage = () => {
    const { classroomId } = useParams();
    const navigate = useNavigate();
    const { user, userRole } = useAuth();
    const [classroom, setClassroom] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Redirect if not teacher
    useEffect(() => {
        if (userRole && userRole !== 'teacher') {
            navigate('/');
        }
    }, [userRole, navigate]);
    // Load classroom details and setup real-time submissions listener
    useEffect(() => {
        if (!classroomId || !user?.uid)
            return;
        let unsubscribe;
        const setupDashboard = async () => {
            try {
                setLoading(true);
                // Load classroom details
                const classroomData = await getClassroomById(classroomId);
                if (!classroomData) {
                    setError('Classroom not found');
                    setLoading(false);
                    return;
                }
                // Check if current user is the teacher
                if (classroomData.teacherId !== user.uid) {
                    setError('You do not have permission to view this classroom');
                    setLoading(false);
                    return;
                }
                setClassroom(classroomData);
                // Setup real-time listener for submissions
                const db = getFirestore(app);
                const q = query(collection(db, 'classroomSubmissions'), where('classroomId', '==', classroomId));
                unsubscribe = onSnapshot(q, async (snapshot) => {
                    const newSubmissions = [];
                    snapshot.forEach((doc) => {
                        newSubmissions.push({
                            id: doc.id,
                            ...doc.data(),
                            submittedAt: doc.data().submittedAt.toDate(),
                        });
                    });
                    // Enrich with student details
                    const submissionsWithDetails = await Promise.all(newSubmissions.map(async (sub) => {
                        try {
                            const userDocRef = doc(db, 'users', sub.studentId);
                            const userDocSnap = await getDoc(userDocRef);
                            const studentData = userDocSnap.data();
                            return {
                                ...sub,
                                studentDisplayName: studentData?.username || studentData?.displayName || studentData?.email || `Student ${sub.studentId.slice(-6)}`,
                            };
                        }
                        catch (err) {
                            console.error('Error fetching student details:', err);
                            return {
                                ...sub,
                                studentDisplayName: `Student ${sub.studentId.slice(-6)}`,
                            };
                        }
                    }));
                    // Sort by submittedAt descending
                    submissionsWithDetails.sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
                    setSubmissions(submissionsWithDetails);
                    setLoading(false);
                }, (err) => {
                    console.error("Error in real-time listener:", err);
                    setError("Failed to sync live data");
                    setLoading(false);
                });
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load classroom data';
                setError(errorMessage);
                setLoading(false);
            }
        };
        setupDashboard();
        return () => {
            if (unsubscribe)
                unsubscribe();
        };
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
    // Calculate completion rate if we knew total students
    const completionRate = classroom?.students?.length
        ? Math.round((submissions.length / classroom.students.length) * 100)
        : 0;
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
    return (_jsx("div", { className: "classroom-page", children: _jsxs("div", { className: "classroom-container", children: [_jsxs("div", { className: "classroom-header", children: [_jsxs("h1", { children: ["\uD83D\uDCCA ", classroom?.className || 'Classroom', " Dashboard"] }), _jsxs("p", { children: ["\uD83D\uDCCD Code: ", _jsx("strong", { children: classroom?.classKey }), _jsx("span", { style: { margin: '0 10px' }, children: "|" }), "\uD83D\uDC64 Owner: ", _jsx("strong", { children: classroom?.teacherName || classroom?.ownerName || 'You' })] })] }), _jsxs("div", { className: "stats-grid", children: [_jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "\uD83D\uDCE4 Submissions" }), _jsxs("div", { className: "stat-value", children: [submissions.length, " ", _jsxs("small", { style: { fontSize: '0.5em', color: '#666' }, children: ["/ ", classroom?.students?.length || 0] })] })] }), _jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "\uFFFD Completion" }), _jsxs("div", { className: "stat-value", children: [completionRate, "%"] })] }), _jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "\uD83D\uDCC8 Avg Score" }), _jsxs("div", { className: "stat-value", style: { color: getScoreColor(averageScore) }, children: [averageScore, "%"] })] }), _jsxs("div", { className: "stat-card", children: [_jsx("h3", { children: "\uD83C\uDFAF Excellent" }), _jsx("div", { className: "stat-value", style: { color: '#4CAF50' }, children: distribution.excellent })] })] }), _jsxs("div", { className: "classroom-card", children: [_jsx("h2", { children: "\uD83D\uDCDD Student Submissions" }), submissions.length === 0 ? (_jsx("p", { className: "no-submissions", children: "No submissions yet. Students need to complete quizzes in this classroom." })) : (_jsx("div", { className: "submissions-table", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Student" }), _jsx("th", { children: "Question" }), _jsx("th", { children: "Score" }), _jsx("th", { children: "Submitted" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: submissions.map((submission) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("div", { className: "student-info", children: _jsx("strong", { children: submission.studentDisplayName }) }) }), _jsx("td", { children: _jsx("div", { className: "question-preview", children: submission.questionText.length > 50
                                                            ? `${submission.questionText.substring(0, 50)}...`
                                                            : submission.questionText }) }), _jsx("td", { children: _jsxs("span", { className: "score-badge", style: { backgroundColor: getScoreColor(submission.score) }, children: [submission.score, "%"] }) }), _jsx("td", { children: submission.submittedAt.toLocaleDateString() }), _jsx("td", { children: _jsx("button", { onClick: () => navigate(`/submission/${submission.id}`), className: "btn btn-small", children: "\uD83D\uDC41\uFE0F View" }) })] }, submission.id))) })] }) }))] }), _jsx("div", { className: "classroom-footer", children: _jsx("button", { onClick: () => navigate('/create-classroom'), className: "btn btn-outline", children: "\u2190 Back to My Classrooms" }) })] }) }));
};
