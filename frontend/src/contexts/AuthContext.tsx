import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  signOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import app from '../services/firebase';

export type UserRole = 'teacher' | 'student';

interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  needsProfileSetup: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, role: UserRole) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signUpWithGoogleRole: () => Promise<void>;
  completeGoogleProfileSetup: (username: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Fetch user role from Firestore
  const fetchUserRole = async (userId: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const role = userDocSnap.data().role as UserRole;
        setUserRole(role);
        return role;
      }
    } catch (error) {
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
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, role: UserRole) => {
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
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
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
      } else {
        const role = userDocSnap.data().role as UserRole;
        setUserRole(role);
      }
      
      console.log('Google login successful');
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogleRole = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if user already has a role
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // New Google user, create temporary record and set setup flag
        await setDoc(userDocRef, {
          email: result.user.email,
          createdAt: new Date(),
          setupNeeded: true,
        });
        setNeedsProfileSetup(true);
        setUserRole(null);
      } else {
        // Existing user
        const userData = userDocSnap.data();
        if (userData.setupNeeded) {
          setNeedsProfileSetup(true);
          setUserRole(null);
        } else {
          const role = userData.role as UserRole;
          setUserRole(role);
          setNeedsProfileSetup(false);
        }
      }

      console.log('Google sign up initiated');
    } catch (error) {
      console.error('Google sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeGoogleProfileSetup = async (username: string, role: UserRole) => {
    try {
      setLoading(true);
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const userDocRef = doc(db, 'users', user.uid);
      
      // Check if username is already taken
      // For now, we'll just update the user document
      // In production, you'd want to check uniqueness first
      await setDoc(
        userDocRef,
        {
          username: username.trim(),
          role,
          setupNeeded: false,
        },
        { merge: true }
      );

      setUserRole(role);
      setNeedsProfileSetup(false);
      console.log('Profile setup completed with username and role');
    } catch (error) {
      console.error('Profile setup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUserRole(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, needsProfileSetup, loginWithEmail, signUpWithEmail, loginWithGoogle, signUpWithGoogleRole, completeGoogleProfileSetup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
