import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import app from '../services/firebase';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth(app);
    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log('Auth state changed:', currentUser?.email || 'No user');
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, [auth]);
    const loginWithEmail = async (email, password) => {
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Login successful');
        }
        catch (error) {
            console.error('Login error:', error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    };
    const signUpWithEmail = async (email, password) => {
        try {
            setLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('Sign up successful');
        }
        catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    };
    const loginWithGoogle = async () => {
        try {
            setLoading(true);
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            console.log('Google login successful');
        }
        catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    };
    const logout = async () => {
        try {
            setLoading(true);
            await signOut(auth);
            console.log('Logout successful');
        }
        catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx(AuthContext.Provider, { value: { user, loading, loginWithEmail, signUpWithEmail, loginWithGoogle, logout }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
