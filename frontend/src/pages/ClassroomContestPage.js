import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getClassroomById } from '../services/classroomService';
import { getPropositions } from '../services/propositionService';
import './Classroom.css';
export const ClassroomContestPage = () => {
    const { classroomId } = useParams();
    const navigate = useNavigate();
    const { userRole } = useAuth();
    const [classroom, setClassroom] = useState(null);
    const [assignedProps, setAssignedProps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const load = async () => {
            if (!classroomId) {
                setError('Missing classroomId');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const cls = await getClassroomById(classroomId);
                setClassroom(cls);
                if (!cls || !cls.assignedPropositionIds || cls.assignedPropositionIds.length === 0) {
                    setAssignedProps([]);
                    return;
                }
                const all = await getPropositions('th');
                const filtered = all.filter(p => p.id && cls.assignedPropositionIds.includes(p.id));
                setAssignedProps(filtered);
            }
            catch (err) {
                console.error('Error loading classroom contest data', err);
                setError('Failed to load classroom problems');
            }
            finally {
                setLoading(false);
            }
        };
        load();
    }, [classroomId]);
    if (userRole && userRole !== 'student') {
        return (_jsx("div", { className: "classroom-page", children: _jsx("div", { className: "classroom-container", children: _jsx("div", { className: "error-alert", children: "This view is for students only." }) }) }));
    }
    return (_jsx("div", { className: "classroom-page", children: _jsxs("div", { className: "classroom-container", children: [_jsxs("div", { className: "classroom-header", children: [_jsx("h1", { children: "\uD83D\uDCDD Classroom Problems" }), _jsx("p", { children: classroom
                                ? `Classroom: ${classroom.className}`
                                : 'Loading classroom information...' })] }), loading && (_jsx("div", { className: "classroom-card", children: _jsx("div", { className: "loading", children: "Loading assigned problems..." }) })), !loading && error && (_jsx("div", { className: "classroom-card", children: _jsx("div", { className: "error-alert", children: error }) })), !loading && !error && assignedProps.length === 0 && (_jsx("div", { className: "classroom-card", children: _jsx("p", { className: "no-classrooms", children: "Your teacher has not assigned any problems yet. Please check back later." }) })), !loading && !error && assignedProps.length > 0 && (_jsxs("div", { className: "classroom-card", children: [_jsx("h2", { children: "\uD83D\uDCDA Assigned Problems" }), _jsx("div", { className: "classroom-list", children: assignedProps.map((p) => (_jsxs("div", { className: "classroom-item", children: [_jsxs("div", { className: "classroom-info", children: [_jsxs("h3", { children: [p.questionText.substring(0, 120), p.questionText.length > 120 ? '...' : ''] }), _jsxs("p", { children: [_jsx("strong", { children: "Category:" }), " ", p.category, " \u2022 ", _jsx("strong", { children: "Difficulty:" }), " ", p.difficulty] })] }), _jsx("div", { className: "classroom-actions", children: _jsx("button", { className: "btn btn-secondary", onClick: () => navigate(`/classroom/${classroomId}/problem/${p.id}`), children: "Start" }) })] }, p.id))) })] })), _jsx("div", { className: "classroom-footer", children: _jsx("button", { onClick: () => navigate('/home'), className: "btn btn-outline", children: "\u2190 Back to Home" }) })] }) }));
};
