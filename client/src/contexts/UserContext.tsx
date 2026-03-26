// ============================================================
// CallistheniX – User Profile Context
// Manages user profile, selected program, and workout state
// ============================================================
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Goal, Sex, WorkoutProgram, DietPlan } from '@/lib/data';

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

export type AppView = 'onboarding' | 'dashboard' | 'programs' | 'exercises' | 'trainer' | 'diet' | 'profile';

const UserContext = createContext<UserContextType | null>(null);

const STORAGE_KEY = 'callisthenix_user';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentView, setCurrentView] = useState<AppView>('onboarding');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.profile) {
          setProfileState(data.profile);
          setCurrentView('dashboard');
        }
        if (data.completedSessions) setCompletedSessions(data.completedSessions);
        if (data.selectedProgramId) {
          // Will be resolved when programs are loaded
        }
      }
    } catch {}
  }, []);

  const setProfile = (p: UserProfile) => {
    setProfileState(p);
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, profile: p }));
    } catch {}
    setCurrentView('dashboard');
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
      hasProfile: !!profile,
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
