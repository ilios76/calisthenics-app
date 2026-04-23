import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WorkoutCompletion {
  xp: number;
  level: number;
  streak: number;
  totalWorkouts: number;
  lastWorkoutDate: string | null;
  trialStartDate: string | null;
  trialDaysRemaining: number;
  isPremium: boolean;
}

interface WorkoutCompletionContextType {
  completion: WorkoutCompletion;
  completeWorkout: (xpGained: number) => void;
  startTrial: () => void;
  updateTrialStatus: () => void;
  upgradeToPremium: () => void;
  getXpForNextLevel: (currentLevel: number) => number;
}

const WorkoutCompletionContext = createContext<WorkoutCompletionContextType | undefined>(undefined);

const STORAGE_KEY = 'callisthenix_completion';
const TRIAL_DAYS = 7;
const XP_PER_LEVEL = 100;

export const WorkoutCompletionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [completion, setCompletion] = useState<WorkoutCompletion>({
    xp: 0,
    level: 1,
    streak: 0,
    totalWorkouts: 0,
    lastWorkoutDate: null,
    trialStartDate: null,
    trialDaysRemaining: TRIAL_DAYS,
    isPremium: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setCompletion(data);
        // Update trial status on load
        updateTrialStatusInternal(data);
      } else {
        // First time - start trial
        startTrialInternal();
      }
    } catch (error) {
      console.error('Error loading completion data:', error);
    }
  }, []);

  const saveToStorage = (data: WorkoutCompletion) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving completion data:', error);
    }
  };

  const startTrialInternal = () => {
    const now = new Date().toISOString();
    const newCompletion: WorkoutCompletion = {
      ...completion,
      trialStartDate: now,
      trialDaysRemaining: TRIAL_DAYS,
      isPremium: false,
    };
    setCompletion(newCompletion);
    saveToStorage(newCompletion);
  };

  const startTrial = () => {
    startTrialInternal();
  };

  const updateTrialStatusInternal = (data: WorkoutCompletion) => {
    if (!data.trialStartDate || data.isPremium) return;

    const trialStart = new Date(data.trialStartDate);
    const now = new Date();
    const daysPassed = Math.floor((now.getTime() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, TRIAL_DAYS - daysPassed);

    if (daysRemaining === 0 && !data.isPremium) {
      // Trial ended - user needs to upgrade
      const updated = { ...data, trialDaysRemaining: 0 };
      setCompletion(updated);
      saveToStorage(updated);
    } else if (daysRemaining !== data.trialDaysRemaining) {
      const updated = { ...data, trialDaysRemaining: daysRemaining };
      setCompletion(updated);
      saveToStorage(updated);
    }
  };

  const updateTrialStatus = () => {
    updateTrialStatusInternal(completion);
  };

  const completeWorkout = (xpGained: number = 50) => {
    const today = new Date().toDateString();
    const lastWorkoutDateStr = completion.lastWorkoutDate ? new Date(completion.lastWorkoutDate).toDateString() : null;
    
    // Calculate streak
    let newStreak = completion.streak;
    if (lastWorkoutDateStr !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastWorkoutDateStr === yesterday.toDateString()) {
        newStreak = completion.streak + 1;
      } else if (lastWorkoutDateStr === null) {
        newStreak = 1;
      } else {
        newStreak = 1; // Streak broken, restart
      }
    }

    // Calculate new XP and level
    const newXp = completion.xp + xpGained;
    const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

    const updated: WorkoutCompletion = {
      ...completion,
      xp: newXp,
      level: newLevel,
      streak: newStreak,
      totalWorkouts: completion.totalWorkouts + 1,
      lastWorkoutDate: new Date().toISOString(),
    };

    setCompletion(updated);
    saveToStorage(updated);
  };

  const upgradeToPremium = () => {
    const updated: WorkoutCompletion = {
      ...completion,
      isPremium: true,
      trialDaysRemaining: 0,
    };
    setCompletion(updated);
    saveToStorage(updated);
  };

  const getXpForNextLevel = (currentLevel: number): number => {
    return currentLevel * XP_PER_LEVEL;
  };

  return (
    <WorkoutCompletionContext.Provider
      value={{
        completion,
        completeWorkout,
        startTrial,
        updateTrialStatus,
        upgradeToPremium,
        getXpForNextLevel,
      }}
    >
      {children}
    </WorkoutCompletionContext.Provider>
  );
};

export const useWorkoutCompletion = () => {
  const context = useContext(WorkoutCompletionContext);
  if (!context) {
    throw new Error('useWorkoutCompletion must be used within WorkoutCompletionProvider');
  }
  return context;
};
