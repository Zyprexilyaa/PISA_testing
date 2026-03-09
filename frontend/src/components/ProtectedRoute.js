import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, userRole, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }, children: _jsx("div", { style: { textAlign: 'center' }, children: _jsx("h2", { children: "Loading..." }) }) }));
    }
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // Check if user has required role
    if (allowedRoles && allowedRoles.length > 0) {
        if (!userRole || !allowedRoles.includes(userRole)) {
            // Redirect to home if user doesn't have the required role
            return _jsx(Navigate, { to: "/", replace: true });
        }
    }
    return _jsx(_Fragment, { children: children });
};
