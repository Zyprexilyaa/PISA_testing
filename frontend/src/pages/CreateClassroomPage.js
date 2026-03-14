import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createClassroom, getTeacherClassrooms } from '../services/classroomService';
import './Classroom.css';
export const CreateClassroomPage = () => {
    const navigate = useNavigate();
    const { user, userRole } = useAuth();
    const [className, setClassName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [existingClassrooms, setExistingClassrooms] = useState([]);
    // Set owner name when user loads
    useEffect(() => {
        if (user) {
            // Prioritize displayName (username) > email > 'Unknown Teacher'
            setOwnerName(user.displayName || user.email || 'Unknown Teacher');
        }
    }, [user]);
    // Redirect if not teacher
    useEffect(() => {
        if (userRole && userRole !== 'teacher') {
            navigate('/');
        }
    }, [userRole, navigate]);
    // Load existing classrooms
    useEffect(() => {
        const loadClassrooms = async () => {
            if (user?.uid) {
                try {
                    const classrooms = await getTeacherClassrooms(user.uid);
                    setExistingClassrooms(classrooms);
                }
                catch (error) {
                    console.error('Error loading classrooms:', error);
                }
            }
        };
        loadClassrooms();
    }, [user?.uid]);
    const handleCreateClassroom = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        if (!className.trim()) {
            setError('Please enter a classroom name');
            return;
        }
        if (!user?.uid) {
            setError('User not authenticated');
            return;
        }
        setIsCreating(true);
        try {
            // Use the ownerName from state, which comes from AuthContext user object
            // This ensures we capture the username set during profile setup
            const finalOwnerName = ownerName || 'Unknown Teacher';
            const classroom = await createClassroom(user.uid, className.trim(), finalOwnerName);
            setSuccess(`Classroom "${classroom.className}" created! Join code: ${classroom.classKey}`);
            setClassName('');
            // Refresh classroom list
            const updatedClassrooms = await getTeacherClassrooms(user.uid);
            setExistingClassrooms(updatedClassrooms);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create classroom';
            setError(errorMessage);
        }
        finally {
            setIsCreating(false);
        }
    };
    if (userRole !== 'teacher') {
        return _jsx("div", { children: "Loading..." });
    }
    return (_jsx("div", { className: "classroom-page", children: _jsxs("div", { className: "classroom-container", children: [_jsxs("div", { className: "classroom-header", children: [_jsx("h1", { children: "\uD83D\uDC69\u200D\uD83C\uDFEB Teacher Dashboard" }), _jsx("p", { children: "Create and manage your classrooms" })] }), _jsxs("div", { className: "classroom-card", children: [_jsx("h2", { children: "\uD83D\uDCDA Create New Classroom" }), _jsxs("form", { onSubmit: handleCreateClassroom, className: "create-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "className", children: "Classroom Name" }), _jsx("input", { id: "className", type: "text", value: className, onChange: (e) => setClassName(e.target.value), placeholder: "e.g., Math Class 2024", disabled: isCreating, className: "form-input" })] }), error && _jsx("div", { className: "error-alert", children: error }), success && _jsx("div", { className: "success-alert", children: success }), _jsx("button", { type: "submit", disabled: isCreating || !className.trim(), className: "btn btn-primary", children: isCreating ? '🔄 Creating...' : '➕ Create Classroom' })] })] }), _jsxs("div", { className: "classroom-card", children: [_jsx("h2", { children: "\uD83C\uDFEB Your Classrooms" }), existingClassrooms.length === 0 ? (_jsx("p", { className: "no-classrooms", children: "No classrooms created yet. Create your first classroom above!" })) : (_jsx("div", { className: "classroom-list", children: existingClassrooms.map((classroom) => (_jsxs("div", { className: "classroom-item", children: [_jsxs("div", { className: "classroom-info", children: [_jsx("h3", { children: classroom.className }), _jsxs("p", { children: [_jsx("strong", { children: "Join Code:" }), " ", _jsx("code", { children: classroom.classKey })] }), _jsxs("p", { children: [_jsx("strong", { children: "Students:" }), " ", classroom.students.length] }), _jsxs("p", { children: [_jsx("strong", { children: "Created:" }), " ", classroom.createdAt.toLocaleDateString()] })] }), _jsxs("div", { className: "classroom-actions", children: [_jsx("button", { onClick: () => navigate(`/teacher-dashboard/${classroom.id}`), className: "btn btn-secondary", children: "\uD83D\uDCCA View Details" }), _jsx("button", { onClick: () => navigate(`/classroom/${classroom.id}/assign`), className: "btn btn-primary", style: { marginLeft: '0.5rem' }, children: "\uD83D\uDCDD Assign Problems" })] })] }, classroom.id))) }))] }), _jsx("div", { className: "classroom-footer", children: _jsx("button", { onClick: () => navigate('/'), className: "btn btn-outline", children: "\u2190 Back to Home" }) })] }) }));
};
