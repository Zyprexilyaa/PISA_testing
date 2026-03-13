import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getClassroomById, updateClassroomAssignments } from '../services/classroomService';
import { getPropositions } from '../services/propositionService';
import './Classroom.css';
export const ClassroomAssignPage = () => {
    const { classroomId } = useParams();
    const navigate = useNavigate();
    const { userRole } = useAuth();
    const [classroom, setClassroom] = useState(null);
    const [propositions, setPropositions] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    useEffect(() => {
        const load = async () => {
            if (!classroomId) {
                setError('Missing classroom id');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const cls = await getClassroomById(classroomId);
                setClassroom(cls);
                const props = await getPropositions('th');
                setPropositions(props);
                if (cls?.assignedPropositionIds) {
                    setSelectedIds(cls.assignedPropositionIds);
                }
            }
            catch (err) {
                console.error('Error loading assignment data', err);
                setError('Failed to load classroom or propositions');
            }
            finally {
                setLoading(false);
            }
        };
        load();
    }, [classroomId]);
    if (userRole && userRole !== 'teacher') {
        return (_jsx("div", { className: "classroom-page", children: _jsx("div", { className: "classroom-container", children: _jsx("div", { className: "error-alert", children: "Only teachers can assign problems to classrooms." }) }) }));
    }
    const toggleSelection = (id) => {
        if (!id)
            return;
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    };
    const handleSave = async () => {
        if (!classroomId)
            return;
        try {
            setSaving(true);
            setError(null);
            setSuccess(null);
            await updateClassroomAssignments(classroomId, selectedIds);
            setSuccess('Assignments saved successfully.');
        }
        catch (err) {
            console.error('Error saving assignments', err);
            setError('Failed to save assignments');
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsx("div", { className: "classroom-page", children: _jsxs("div", { className: "classroom-container", children: [_jsxs("div", { className: "classroom-header", children: [_jsx("h1", { children: "\uD83D\uDCDA Assign Problems" }), _jsx("p", { children: classroom
                                ? `Classroom: ${classroom.className}`
                                : 'Loading classroom information...' })] }), _jsxs("div", { className: "classroom-card", children: [loading && _jsx("div", { className: "loading", children: "Loading propositions..." }), !loading && error && _jsx("div", { className: "error-alert", children: error }), !loading && success && _jsx("div", { className: "success-alert", children: success }), !loading && !error && (_jsxs(_Fragment, { children: [_jsx("p", { children: "Select which problems you want students in this classroom to solve." }), _jsx("div", { className: "classroom-list", children: propositions.map((p) => (_jsxs("label", { className: "classroom-item", style: { cursor: 'pointer', alignItems: 'flex-start' }, children: [_jsxs("div", { className: "classroom-info", children: [_jsxs("h3", { children: [p.questionText.substring(0, 120), p.questionText.length > 120 ? '...' : ''] }), _jsxs("p", { children: [_jsx("strong", { children: "Category:" }), " ", p.category, " \u2022 ", _jsx("strong", { children: "Difficulty:" }), " ", p.difficulty] })] }), _jsx("div", { className: "classroom-actions", children: _jsx("input", { type: "checkbox", checked: !!(p.id && selectedIds.includes(p.id)), onChange: () => toggleSelection(p.id) }) })] }, p.id))) }), _jsxs("div", { className: "classroom-footer", children: [_jsx("button", { onClick: handleSave, className: "btn btn-primary", disabled: saving, children: saving ? 'Saving...' : 'Save Assignments' }), _jsx("button", { onClick: () => navigate('/create-classroom'), className: "btn btn-outline", style: { marginLeft: '0.75rem' }, children: "\u2190 Back to classrooms" })] })] }))] })] }) }));
};
