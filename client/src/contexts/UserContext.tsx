// ============================================================
// CallistheniX – User Profile Context
// Manages user profile, selected program, and workout state
// ============================================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Goal, Sex, WorkoutProgram, DietPlan } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';

export interface UserProfile {
  name: string;
  sex: Sex;
  age: number;
  weight: number; // kg
  height: number; // cm
  goal: Goal;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface WorkoutSession {
  programId: string;
  dayIndex: number;
  exerciseIndex: number;
  completedExercises: string[];
  startedAt: Date;
}

interface UserContextType {
  profile: UserProfile | null;
  setProfile: (p: UserProfile) => void;
  selectedProgram: WorkoutProgram | null;
  setSelectedProgram: (p: WorkoutProgram | null) => void;
  activeSession: WorkoutSession | null;
  setActiveSession: (s: WorkoutSession | null) => void;
  completedSessions: number;
  setCompletedSessions: (n: number) => void;
  currentView: AppView;
  setCurrentView: (v: AppView) => void;
  hasProfile: boolean;
}

export type AppView = 'onboarding' | 'dashboard' | 'programs' | 'exercises' | 'trainer' | 'diet' | 'profile' | 'progress' | 'achievements' | 'challenge' | 'settings' | 'stats' | 'subscription';

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY = 'callisthenix_user';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { userProfile: authUserProfile } = useAuth();
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentView, setCurrentView] = useState<AppView>('onboarding');

  // Sync with AuthContext userProfile (Firebase)
  useEffect(() => {
    if (!authUserProfile) return;

    // Check if the Firebase profile has enough data to skip onboarding.
    // A "complete" profile has age > 0 (set during onboarding).
    // New Google sign-ins get age: 0 from createOrUpdateUserProfile defaults,
    // so they correctly land on onboarding to fill in their details.
    const isComplete = (authUserProfile.age ?? 0) > 0;

    const userProfile: UserProfile = {
      // Firebase stores displayName, not name
      name: (authUserProfile as any).displayName || (authUserProfile as any).name || '',
      sex: (authUserProfile.sex as Sex) || 'male',
      age: authUserProfile.age || 0,
      weight: authUserProfile.weight || 0,
      height: authUserProfile.height || 0,
      goal: (authUserProfile.goal as Goal) || 'stay_slim',
      // fitnessLevel is a local concept — read from localStorage if not in Firestore
      fitnessLevel: (authUserProfile as any).fitnessLevel || (() => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          return stored ? JSON.parse(stored)?.profile?.fitnessLevel || 'beginner' : 'beginner';
        } catch { return 'beginner'; }
      })(),
    };

    setProfileState(userProfile);
    // Only go to dashboard if the profile is complete
    if (isComplete) setCurrentView('dashboard');
  }, [authUserProfile]);

  // Load from localStorage on mount (fallback)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.profile && !authUserProfile) {
          setProfileState(data.profile);
          setCurrentView('dashboard');
        }
        if (data.completedSessions) setCompletedSessions(data.completedSessions);
        if (data.selectedProgramId) {
          // Will be resolved when programs are loaded
        }
      }
    } catch {}
  }, [authUserProfile]);

  const setProfile = (p: UserProfile) => {
    setProfileState(p);
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, profile: p }));
    } catch {}
    // Don't change view here - let AppShell handle it
  };

  return (
    <UserContext.Provider value={{
      profile,
      setProfile,
      selectedProgram,
      setSelectedProgram,
      activeSession,
      setActiveSession,
      completedSessions,
      setCompletedSessions,
      currentView,
      setCurrentView,
      hasProfile: !!profile || !!authUserProfile,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
