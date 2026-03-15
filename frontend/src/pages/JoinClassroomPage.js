import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { joinClassroom, getStudentClassrooms } from '../services/classroomService';
import './Classroom.css';
export const JoinClassroomPage = () => {
    const navigate = useNavigate();
    const { user, userRole } = useAuth();
    const [classKey, setClassKey] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [joinedClassrooms, setJoinedClassrooms] = useState([]);
    // Redirect if not student
    useEffect(() => {
        if (userRole && userRole !== 'student') {
            navigate('/home');
        }
    }, [userRole, navigate]);
    // Load joined classrooms
    useEffect(() => {
        const loadClassrooms = async () => {
            if (user?.uid) {
                try {
                    const classrooms = await getStudentClassrooms(user.uid);
                    setJoinedClassrooms(classrooms);
                }
                catch (error) {
                    console.error('Error loading classrooms:', error);
                }
            }
        };
        loadClassrooms();
    }, [user?.uid]);
    const handleJoinClassroom = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!classKey.trim()) {
            setError('Please enter a classroom code');
            return;
        }
        if (!user?.uid) {
            setError('User not authenticated');
            return;
        }
        setIsJoining(true);
        try {
            const classroom = await joinClassroom(user.uid, classKey.trim().toUpperCase());
            if (classroom) {
                setSuccess(`Successfully joined "${classroom.className}"!`);
            }
            else {
                setSuccess('Successfully joined classroom!');
            }
            // Refresh classroom list
            const updatedClassrooms = await getStudentClassrooms(user.uid);
            setJoinedClassrooms(updatedClassrooms);
            setClassKey('');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to join classroom';
            setError(errorMessage);
        }
        finally {
            setIsJoining(false);
        }
    };
    if (userRole !== 'student') {
        return _jsx("div", { children: "Loading..." });
    }
    return (_jsx("div", { className: "classroom-page", children: _jsxs("div", { className: "classroom-container", children: [_jsxs("div", { className: "classroom-header", children: [_jsx("h1", { children: "\uD83C\uDF93 Student Dashboard" }), _jsx("p", { children: "Join classrooms and complete assignments" })] }), _jsxs("div", { className: "classroom-card", children: [_jsx("h2", { children: "\uD83D\uDEAA Join Classroom" }), _jsxs("form", { onSubmit: handleJoinClassroom, className: "join-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "classKey", children: "Classroom Code" }), _jsx("input", { id: "classKey", type: "text", value: classKey, onChange: (e) => setClassKey(e.target.value.toUpperCase()), placeholder: "Enter 6-character code (e.g., ABC123)", maxLength: 6, disabled: isJoining, className: "form-input" }), _jsx("small", { className: "form-hint", children: "Ask your teacher for the classroom code" })] }), error && _jsx("div", { className: "error-alert", children: error }), success && _jsx("div", { className: "success-alert", children: success }), _jsx("button", { type: "submit", disabled: isJoining || classKey.length !== 6, className: "btn btn-primary", children: isJoining ? '🔄 Joining...' : '🚪 Join Classroom' })] })] }), _jsxs("div", { className: "classroom-card", children: [_jsx("h2", { children: "\uD83D\uDCDA Your Classrooms" }), joinedClassrooms.length === 0 ? (_jsx("p", { className: "no-classrooms", children: "No classrooms joined yet. Enter a classroom code above to join!" })) : (_jsx("div", { className: "classroom-list", children: joinedClassrooms.map((classroom) => (_jsxs("div", { className: "classroom-item", children: [_jsxs("div", { className: "classroom-info", children: [_jsx("h3", { children: classroom.className }), _jsxs("p", { children: [_jsx("strong", { children: "Teacher:" }), " ", classroom.teacherName || 'Unknown'] }), _jsxs("p", { children: [_jsx("strong", { children: "Joined:" }), " ", classroom.joinedAt?.toLocaleDateString() || 'Recently'] })] }), _jsx("div", { className: "classroom-actions", children: _jsx("button", { onClick: () => navigate(`/classroom/${classroom.id}`), className: "btn btn-secondary", children: "\uD83D\uDCDD Take Quiz" }) })] }, classroom.id))) }))] }), _jsx("div", { className: "classroom-footer", children: _jsx("button", { onClick: () => navigate('/home'), className: "btn btn-outline", children: "\u2190 Back to Home" }) })] }) }));
};
