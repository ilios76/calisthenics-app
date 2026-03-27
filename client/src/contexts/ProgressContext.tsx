// ============================================================
// CallistheniX – Progress Tracking Context
// Manages workout history, PRs, streaks, and achievements
// ============================================================
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WorkoutSession {
  id: string;
  date: string; // ISO date
  programId: string;
  dayName: string;
  exercises: {
    name: string;
    sets: number;
    reps?: number;
    duration?: number;
    completed: boolean;
  }[];
  totalDuration: number; // minutes
  caloriesBurned: number;
  completed: boolean;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  reps?: number;
  duration?: number;
  date: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedDate?: string;
  progress?: number; // for multi-step achievements
  maxProgress?: number;
}

export interface ProgressStats {
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate?: string;
  achievements: Achievement[];
  personalRecords: PersonalRecord[];
}

interface ProgressContextType {
  stats: ProgressStats;
  sessions: WorkoutSession[];
  addWorkoutSession: (session: WorkoutSession) => void;
  updatePersonalRecord: (exerciseId: string, exerciseName: string, reps?: number, duration?: number) => void;
  getExercisePR: (exerciseId: string) => PersonalRecord | undefined;
  unlockAchievement: (achievementId: string) => void;
  calculateStreak: () => number;
  getProgressData: () => ProgressStats;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalWorkouts: 0,
    totalMinutes: 0,
    totalCalories: 0,
    currentStreak: 0,
    longestStreak: 0,
    achievements: [],
    personalRecords: [],
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('callisthenix_progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSessions(data.sessions || []);
        setStats(data.stats || stats);
      } catch (error) {
        console.error('Failed to load progress data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('callisthenix_progress', JSON.stringify({ sessions, stats }));
  }, [sessions, stats]);

  const calculateStreak = (): number => {
    if (sessions.length === 0) return 0;

    const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
        currentDate = new Date(sessionDate);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const addWorkoutSession = (session: WorkoutSession) => {
    const newSessions = [...sessions, { ...session, id: Date.now().toString() }];
    setSessions(newSessions);

    // Update stats
    const currentStreak = calculateStreak();
    const longestStreak = Math.max(stats.longestStreak, currentStreak);

    setStats(prev => ({
      ...prev,
      totalWorkouts: prev.totalWorkouts + 1,
      totalMinutes: prev.totalMinutes + session.totalDuration,
      totalCalories: prev.totalCalories + session.caloriesBurned,
      currentStreak,
      longestStreak,
      lastWorkoutDate: session.date,
    }));

    // Check for achievements
    checkAchievements(newSessions, currentStreak);
  };

  const updatePersonalRecord = (exerciseId: string, exerciseName: string, reps?: number, duration?: number) => {
    const existingPR = stats.personalRecords.find(pr => pr.exerciseId === exerciseId);

    let isNewPR = false;
    if (!existingPR) {
      isNewPR = true;
    } else {
      if (reps && (!existingPR.reps || reps > existingPR.reps)) {
        isNewPR = true;
      }
      if (duration && (!existingPR.duration || duration > existingPR.duration)) {
        isNewPR = true;
      }
    }

    if (isNewPR) {
      const newPRs = stats.personalRecords.filter(pr => pr.exerciseId !== exerciseId);
      newPRs.push({
        exerciseId,
        exerciseName,
        reps,
        duration,
        date: new Date().toISOString(),
      });

      setStats(prev => ({
        ...prev,
        personalRecords: newPRs,
      }));
    }
  };

  const getExercisePR = (exerciseId: string): PersonalRecord | undefined => {
    return stats.personalRecords.find(pr => pr.exerciseId === exerciseId);
  };

  const unlockAchievement = (achievementId: string) => {
    const existing = stats.achievements.find(a => a.id === achievementId);
    if (!existing) {
      const newAchievement: Achievement = {
        id: achievementId,
        name: achievementId,
        description: '',
        icon: '🏆',
        unlockedDate: new Date().toISOString(),
      };

      setStats(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement],
      }));
    }
  };

  const checkAchievements = (allSessions: WorkoutSession[], currentStreak: number) => {
    const achievements = [
      { id: 'first_workout', name: 'First Step', description: 'Complete your first workout', icon: '🎯', check: () => allSessions.length >= 1 },
      { id: 'week_warrior', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', check: () => currentStreak >= 7 },
      { id: 'month_master', name: 'Month Master', description: 'Maintain a 30-day streak', icon: '⭐', check: () => currentStreak >= 30 },
      { id: 'ten_workouts', name: 'Double Digits', description: 'Complete 10 workouts', icon: '💪', check: () => allSessions.length >= 10 },
      { id: 'fifty_workouts', name: 'Fitness Fanatic', description: 'Complete 50 workouts', icon: '🚀', check: () => allSessions.length >= 50 },
    ];

    achievements.forEach(ach => {
      if (ach.check() && !stats.achievements.find(a => a.id === ach.id)) {
        unlockAchievement(ach.id);
      }
    });
  };

  const getProgressData = (): ProgressStats => {
    return {
      ...stats,
      currentStreak: calculateStreak(),
    };
  };

  return (
    <ProgressContext.Provider
      value={{
        stats: getProgressData(),
        sessions,
        addWorkoutSession,
        updatePersonalRecord,
        getExercisePR,
        unlockAchievement,
        calculateStreak,
        getProgressData,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
