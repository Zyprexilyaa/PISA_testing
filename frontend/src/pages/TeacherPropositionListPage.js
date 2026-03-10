import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getPropositions } from '../services/propositionService';
import { Link } from 'react-router-dom';
import './Auth.css';
export const TeacherPropositionListPage = () => {
    const [propsList, setPropsList] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const p = await getPropositions('th');
            setPropsList(p);
            setLoading(false);
        };
        load();
    }, []);
    return (_jsx("div", { className: "auth-page", children: _jsx("div", { className: "page-container", children: _jsxs("div", { className: "page-card", children: [_jsx("h2", { className: "auth-subtitle", children: "Your Propositions" }), _jsx("div", { className: "teacher-actions", children: _jsx(Link, { to: "/teacher/propositions/new", className: "btn btn-primary", children: "Add New Proposition" }) }), loading && _jsx("div", { children: "Loading..." }), !loading && (_jsx("div", { className: "proposition-list", children: propsList.map((p, idx) => (_jsxs("div", { className: "proposition-item", children: [_jsx("h4", { children: p.questionText }), _jsxs("div", { className: "proposition-meta", children: [p.category, " \u2022 ", p.difficulty] }), _jsx("div", { style: { display: 'flex', justifyContent: 'flex-end' }, children: _jsx("button", { className: "btn btn-outline", children: "Edit" }) })] }, idx))) }))] }) }) }));
};
