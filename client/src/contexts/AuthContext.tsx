// ============================================================
// CallistheniX – Authentication Context
// Manages auth state globally across the app
// ============================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/services/firebaseAuth';
import {
  onAuthStateChange,
  getUserProfile,
  initializePersistence,
} from '@/services/firebaseAuth';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize persistence
    initializePersistence(true).catch((err) => {
      console.error('Failed to initialize persistence:', err);
      setError('Failed to initialize session');
    });

    // Listen to auth state changes
    const unsubscribe = onAuthStateChange(async (authUser) => {
      try {
        setUser(authUser);
        setError(null);

        if (authUser) {
          // Fetch user profile
          const profile = await getUserProfile(authUser.uid);
          setUserProfile(profile);
        } else {
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
