import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import app from '../services/firebase';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth(app);
    const db = getFirestore(app);
    // Fetch user role from Firestore
    const fetchUserRole = async (userId) => {
        try {
            const userDocRef = doc(db, 'users', userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const role = userDocSnap.data().role;
                setUserRole(role);
                return role;
            }
        }
        catch (error) {
            console.error('Error fetching user role:', error);
        }
        return null;
    };
    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            console.log('Auth state changed:', currentUser?.email || 'No user');
            setUser(currentUser);
            if (currentUser) {
                await fetchUserRole(currentUser.uid);
            }
            else {
                setUserRole(null);
            }
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
    const signUpWithEmail = async (email, password, role) => {
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Save user role to Firestore
            const userDocRef = doc(db, 'users', userCredential.user.uid);
            await setDoc(userDocRef, {
                email,
                role,
                createdAt: new Date(),
            });
            setUserRole(role);
            console.log('Sign up successful with role:', role);
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
            const result = await signInWithPopup(auth, provider);
            // Check if user already has a role, if not default to student
            const userDocRef = doc(db, 'users', result.user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (!userDocSnap.exists()) {
                // New Google user, default to student
                await setDoc(userDocRef, {
                    email: result.user.email,
                    role: 'student',
                    createdAt: new Date(),
                });
                setUserRole('student');
            }
            else {
                const role = userDocSnap.data().role;
                setUserRole(role);
            }
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
            setUserRole(null);
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
    return (_jsx(AuthContext.Provider, { value: { user, userRole, loading, loginWithEmail, signUpWithEmail, loginWithGoogle, logout }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
