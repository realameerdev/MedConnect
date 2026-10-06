import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  user: User | null;
  userRole: 'patient' | 'doctor' | 'admin' | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, country: string, age: number, role: 'patient' | 'doctor') => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  completeProfile: (name: string, country: string, age: number, role: 'patient' | 'doctor') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure session persists securely across browser refreshes and tabs
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn("Auth persistence error:", err);
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists() && userDoc.data().role) {
            setUserRole(userDoc.data().role);
          } else {
            // Fallback role so authenticated users are recognized immediately without forced sign-up prompts
            setUserRole('patient');
          }
        } catch (e) {
          console.error("Error fetching user role:", e);
          setUserRole('patient');
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user') {
        console.log('Sign-in popup was closed by the user.');
      } else {
        throw error;
      }
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, country: string, age: number, role: 'patient' | 'doctor') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userDocRef, {
      uid: userCredential.user.uid,
      name,
      email,
      country,
      age,
      role,
      createdAt: new Date().toISOString()
    });
    setUserRole(role);

    if (role === 'doctor') {
      const doctorDocRef = doc(db, 'doctors', userCredential.user.uid);
      await setDoc(doctorDocRef, {
        uid: userCredential.user.uid,
        name,
        specialty: 'General Practice',
        availability: 'available',
        rating: 5.0,
        imageUrl: `https://picsum.photos/seed/${userCredential.user.uid}/200/200`
      });
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const completeProfile = async (name: string, country: string, age: number, role: 'patient' | 'doctor') => {
    if (!user) throw new Error('No authenticated user found');
    
    const userDocRef = doc(db, 'users', user.uid);
    const data = {
      uid: user.uid,
      name,
      email: user.email || '',
      country,
      age,
      role,
      createdAt: new Date().toISOString()
    };
    
    await setDoc(userDocRef, data, { merge: true });
    setUserRole(role);

    if (role === 'doctor') {
      const doctorDocRef = doc(db, 'doctors', user.uid);
      await setDoc(doctorDocRef, {
        uid: user.uid,
        name,
        specialty: 'General Practice',
        availability: 'available',
        rating: 5.0,
        imageUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`
      }, { merge: true });
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, sendPasswordReset, completeProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
