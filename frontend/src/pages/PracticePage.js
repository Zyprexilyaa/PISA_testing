import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { getPropositions, getRandomProposition } from '../services/propositionService';
import './Auth.css';
import { Link } from 'react-router-dom';
export const PracticePage = () => {
    const [propositions, setPropositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const props = await getPropositions('th');
            setPropositions(props);
            setLoading(false);
        };
        load();
    }, []);
    const pickRandom = async () => {
        setLoading(true);
        const p = await getRandomProposition('th');
        setSelected(p);
        setLoading(false);
    };
    return (_jsx("div", { className: "auth-page", children: _jsx("div", { className: "page-container", children: _jsxs("div", { className: "page-card", children: [_jsx("h2", { className: "auth-subtitle", children: "Practice Propositions" }), _jsxs("div", { className: "teacher-actions", children: [_jsx("button", { onClick: pickRandom, className: "btn btn-primary", style: { marginRight: 8 }, children: "Pick Random" }), _jsx(Link, { to: "/", className: "btn btn-outline", children: "Back Home" })] }), loading && _jsx("div", { children: "Loading propositions..." }), !loading && !selected && (_jsxs("div", { children: [_jsx("h3", { children: "Available Propositions" }), _jsx("div", { className: "proposition-list", children: propositions.map((p, idx) => (_jsxs("div", { className: "proposition-item", children: [_jsxs("h4", { children: [p.questionText.substring(0, 120), p.questionText.length > 120 ? '...' : ''] }), _jsxs("div", { className: "proposition-meta", children: [p.category, " \u2022 ", p.difficulty] }), _jsx("div", { style: { display: 'flex', justifyContent: 'flex-end' }, children: _jsx("button", { className: "btn btn-outline", onClick: () => setSelected(p), children: "Practice" }) })] }, idx))) })] })), selected && (_jsxs("div", { children: [_jsx("h3", { children: "Practice" }), _jsxs("p", { children: [_jsx("strong", { children: "Question:" }), " ", selected.questionText] }), _jsxs("p", { children: [_jsx("strong", { children: "Expected answer:" }), " ", selected.expectedAnswer] }), _jsxs("div", { className: "practice-actions", children: [_jsx("button", { onClick: () => setSelected(null), className: "btn btn-outline", children: "Back to list" }), _jsx("button", { onClick: () => { alert('Start practice flow (not implemented yet)'); }, className: "btn btn-primary", children: "Start Practice" })] })] }))] }) }) }));
};
