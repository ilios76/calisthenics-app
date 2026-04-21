// ============================================================
// CallistheniX – Gamification System
// Streaks, Levels, Challenges, Unlockables
// ============================================================

export type ChallengeType = 'personal' | 'global' | 'friend';
export type UnlockableType = 'workout' | 'badge' | 'feature' | 'skill_path';

// ============================================================
// Streak System
// ============================================================

export interface StreakData {
  userId: string;
  currentStreak: number; // consecutive days
  longestStreak: number;
  lastWorkoutDate: Date;
  streakBrokenCount: number; // total times broken
  streakHistory: StreakRecord[];
}

export interface StreakRecord {
  startDate: Date;
  endDate: Date;
  length: number;
}

export class StreakManager {
  /**
   * Create initial streak data
   */
  static createInitialStreak(userId: string): StreakData {
    return {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      lastWorkoutDate: new Date(0), // Very old date
      streakBrokenCount: 0,
      streakHistory: [],
    };
  }

  /**
   * Update streak after workout
   */
  static updateStreak(streak: StreakData): StreakData {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastWorkout = new Date(streak.lastWorkoutDate);
    lastWorkout.setHours(0, 0, 0, 0);

    const daysSinceLastWorkout = Math.floor(
      (today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newStreak = streak.currentStreak;

    if (daysSinceLastWorkout === 0) {
      // Worked out today already
      return streak;
    } else if (daysSinceLastWorkout === 1) {
      // Consecutive day
      newStreak = streak.currentStreak + 1;
    } else {
      // Streak broken
      if (streak.currentStreak > 0) {
        streak.streakHistory.push({
          startDate: new Date(today.getTime() - streak.currentStreak * 24 * 60 * 60 * 1000),
          endDate: lastWorkout,
          length: streak.currentStreak,
        });
      }
      newStreak = 1;
      streak.streakBrokenCount++;
    }

    return {
      ...streak,
      currentStreak: newStreak,
      longestStreak: Math.max(streak.longestStreak, newStreak),
      lastWorkoutDate: today,
    };
  }

  /**
   * Get streak milestones
   */
  static getStreakMilestones(): number[] {
    return [7, 14, 30, 60, 100, 365];
  }

  /**
   * Check if streak reached milestone
   */
  static isStreakMilestone(streak: number): boolean {
    return this.getStreakMilestones().includes(streak);
  }

  /**
   * Get next streak milestone
   */
  static getNextMilestone(currentStreak: number): number {
    const milestones = this.getStreakMilestones();
    return milestones.find(m => m > currentStreak) || 365;
  }
}

// ============================================================
// Level System
// ============================================================

export type UserLevel = 1 | 2 | 3 | 4 | 5;

export interface LevelData {
  userId: string;
  currentLevel: UserLevel;
  experiencePoints: number;
  nextLevelXP: number;
  totalXP: number;
  levelHistory: LevelRecord[];
}

export interface LevelRecord {
  level: UserLevel;
  achievedDate: Date;
  totalXPAtLevel: number;
}

export const LEVEL_THRESHOLDS: Record<UserLevel, { minXP: number; maxXP: number; name: string; description: string }> = {
  1: {
    minXP: 0,
    maxXP: 500,
    name: 'Beginner',
    description: 'Just starting your calisthenics journey',
  },
  2: {
    minXP: 500,
    maxXP: 1500,
    name: 'Intermediate',
    description: 'Building solid strength foundation',
  },
  3: {
    minXP: 1500,
    maxXP: 3500,
    name: 'Advanced',
    description: 'Mastering challenging exercises',
  },
  4: {
    minXP: 3500,
    maxXP: 7000,
    name: 'Elite',
    description: 'Pushing the limits of strength',
  },
  5: {
    minXP: 7000,
    maxXP: Infinity,
    name: 'Master',
    description: 'Legendary calisthenics athlete',
  },
};

export const XP_REWARDS = {
  completeWorkout: 50,
  completeSkillStep: 100,
  breakStreak: 10,
  reachNewPR: 50,
  completeChallenge: 200,
  achieveLevel: 300,
  skillPathCompletion: 500,
};

export class LevelManager {
  /**
   * Create initial level data
   */
  static createInitialLevel(userId: string): LevelData {
    return {
      userId,
      currentLevel: 1,
      experiencePoints: 0,
      nextLevelXP: 500,
      totalXP: 0,
      levelHistory: [
        {
          level: 1,
          achievedDate: new Date(),
          totalXPAtLevel: 0,
        },
      ],
    };
  }

  /**
   * Add XP and check for level up
   */
  static addXP(level: LevelData, xpAmount: number): LevelData {
    const updated = { ...level };
    updated.totalXP += xpAmount;
    updated.experiencePoints += xpAmount;

    // Check for level up
    while (
      updated.currentLevel < 5 &&
      updated.totalXP >= LEVEL_THRESHOLDS[updated.currentLevel as UserLevel].maxXP
    ) {
      updated.currentLevel = (updated.currentLevel + 1) as UserLevel;
      updated.levelHistory.push({
        level: updated.currentLevel,
        achievedDate: new Date(),
        totalXPAtLevel: updated.totalXP,
      });
    }

    // Update next level XP
    const nextThreshold = LEVEL_THRESHOLDS[updated.currentLevel as UserLevel];
    updated.nextLevelXP = nextThreshold.maxXP - updated.totalXP;

    return updated;
  }

  /**
   * Get level info
   */
  static getLevelInfo(level: UserLevel): typeof LEVEL_THRESHOLDS[1] {
    return LEVEL_THRESHOLDS[level];
  }

  /**
   * Get progress to next level (0-100%)
   */
  static getProgressToNextLevel(level: LevelData): number {
    const currentThreshold = LEVEL_THRESHOLDS[level.currentLevel];
    const nextThreshold = LEVEL_THRESHOLDS[Math.min(5, level.currentLevel + 1) as UserLevel];

    const currentRangeMin = currentThreshold.minXP;
    const currentRangeMax = nextThreshold.minXP;
    const currentProgress = level.totalXP - currentRangeMin;
    const totalRange = currentRangeMax - currentRangeMin;

    return (currentProgress / totalRange) * 100;
  }
}

// ============================================================
// Challenge System
// ============================================================

export interface Challenge {
  challengeId: string;
  name: string;
  description: string;
  type: ChallengeType;
  category: string; // "push", "pull", "core", "skill", "consistency"
  duration: number; // days
  target: number; // reps, days, etc.
  targetUnit: string; // "reps", "days", "workouts"
  reward: number; // XP
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  startDate: Date;
  endDate: Date;
  imageUrl?: string;
}

export interface UserChallenge {
  userId: string;
  challengeId: string;
  progress: number;
  completed: boolean;
  completedDate?: Date;
  startDate: Date;
}

export const PREDEFINED_CHALLENGES: Challenge[] = [
  {
    challengeId: 'push-1000',
    name: '30-Day Push-Up Challenge',
    description: 'Complete 1000 push-ups in 30 days',
    type: 'global',
    category: 'push',
    duration: 30,
    target: 1000,
    targetUnit: 'reps',
    reward: 200,
    difficulty: 'hard',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    challengeId: 'pull-100',
    name: '100 Pull-Ups Challenge',
    description: 'Complete 100 pull-ups as fast as possible',
    type: 'personal',
    category: 'pull',
    duration: 7,
    target: 100,
    targetUnit: 'reps',
    reward: 150,
    difficulty: 'hard',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    challengeId: 'streak-7',
    name: '7-Day Streak Challenge',
    description: 'Complete a workout every day for 7 days',
    type: 'personal',
    category: 'consistency',
    duration: 7,
    target: 7,
    targetUnit: 'days',
    reward: 100,
    difficulty: 'easy',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    challengeId: 'skill-master',
    name: 'Skill Master Challenge',
    description: 'Complete 3 skill path steps',
    type: 'personal',
    category: 'skill',
    duration: 30,
    target: 3,
    targetUnit: 'steps',
    reward: 300,
    difficulty: 'hard',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    challengeId: 'consistency-20',
    name: 'Consistency Challenge',
    description: 'Complete 20 workouts in 30 days',
    type: 'personal',
    category: 'consistency',
    duration: 30,
    target: 20,
    targetUnit: 'workouts',
    reward: 250,
    difficulty: 'medium',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
];

export class ChallengeManager {
  /**
   * Get all available challenges
   */
  static getAllChallenges(): Challenge[] {
    return PREDEFINED_CHALLENGES;
  }

  /**
   * Get challenges by type
   */
  static getChallengesByType(type: ChallengeType): Challenge[] {
    return PREDEFINED_CHALLENGES.filter(c => c.type === type);
  }

  /**
   * Get challenges by difficulty
   */
  static getChallengesByDifficulty(difficulty: string): Challenge[] {
    return PREDEFINED_CHALLENGES.filter(c => c.difficulty === difficulty);
  }

  /**
   * Update challenge progress
   */
  static updateProgress(userChallenge: UserChallenge, amount: number): UserChallenge {
    const updated = { ...userChallenge };
    updated.progress += amount;

    const challenge = PREDEFINED_CHALLENGES.find(c => c.challengeId === userChallenge.challengeId);
    if (challenge && updated.progress >= challenge.target) {
      updated.completed = true;
      updated.completedDate = new Date();
    }

    return updated;
  }

  /**
   * Get progress percentage
   */
  static getProgressPercentage(userChallenge: UserChallenge): number {
    const challenge = PREDEFINED_CHALLENGES.find(c => c.challengeId === userChallenge.challengeId);
    if (!challenge) return 0;
    return (userChallenge.progress / challenge.target) * 100;
  }
}

// ============================================================
// Unlockable System
// ============================================================

export interface Unlockable {
  unlockableId: string;
  name: string;
  description: string;
  type: UnlockableType;
  unlockedAt: number; // level or XP threshold
  unlockedAtType: 'level' | 'xp' | 'streak' | 'challenge';
  reward: string;
  imageUrl?: string;
}

export const UNLOCKABLES: Unlockable[] = [
  {
    unlockableId: 'advanced-pushups',
    name: 'Advanced Push-Up Variations',
    description: 'Unlock diamond push-ups, archer push-ups, and more',
    type: 'workout',
    unlockedAt: 2,
    unlockedAtType: 'level',
    reward: 'Advanced Push-Up Variations',
  },
  {
    unlockableId: 'skill-paths',
    name: 'Skill Paths',
    description: 'Unlock structured progressions for advanced skills',
    type: 'feature',
    unlockedAt: 3,
    unlockedAtType: 'level',
    reward: 'Skill Paths Feature',
  },
  {
    unlockableId: 'coach-ai',
    name: 'Coach AI Recommendations',
    description: 'Get personalized AI-powered recommendations',
    type: 'feature',
    unlockedAt: 30,
    unlockedAtType: 'streak',
    reward: 'Coach AI Feature',
  },
  {
    unlockableId: 'handstand-training',
    name: 'Handstand Training',
    description: 'Unlock the complete handstand skill path',
    type: 'skill_path',
    unlockedAt: 500,
    unlockedAtType: 'xp',
    reward: 'Handstand Skill Path',
  },
  {
    unlockableId: 'muscle-up-training',
    name: 'Muscle-Up Training',
    description: 'Unlock the complete muscle-up skill path',
    type: 'skill_path',
    unlockedAt: 1000,
    unlockedAtType: 'xp',
    reward: 'Muscle-Up Skill Path',
  },
  {
    unlockableId: 'elite-badge',
    name: 'Elite Badge',
    description: 'Reach level 4 and earn the Elite badge',
    type: 'badge',
    unlockedAt: 4,
    unlockedAtType: 'level',
    reward: 'Elite Badge',
  },
  {
    unlockableId: 'master-badge',
    name: 'Master Badge',
    description: 'Reach level 5 and become a Master',
    type: 'badge',
    unlockedAt: 5,
    unlockedAtType: 'level',
    reward: 'Master Badge',
  },
];

export class UnlockableManager {
  /**
   * Get all unlockables
   */
  static getAllUnlockables(): Unlockable[] {
    return UNLOCKABLES;
  }

  /**
   * Get unlockables by type
   */
  static getByType(type: UnlockableType): Unlockable[] {
    return UNLOCKABLES.filter(u => u.type === type);
  }

  /**
   * Check if user has unlocked something
   */
  static isUnlocked(
    unlockable: Unlockable,
    userLevel: number,
    userXP: number,
    userStreak: number
  ): boolean {
    switch (unlockable.unlockedAtType) {
      case 'level':
        return userLevel >= unlockable.unlockedAt;
      case 'xp':
        return userXP >= unlockable.unlockedAt;
      case 'streak':
        return userStreak >= unlockable.unlockedAt;
      default:
        return false;
    }
  }

  /**
   * Get next unlockables
   */
  static getNextUnlockables(
    userLevel: number,
    userXP: number,
    userStreak: number
  ): Unlockable[] {
    return UNLOCKABLES.filter(u => !this.isUnlocked(u, userLevel, userXP, userStreak));
  }

  /**
   * Get progress to unlock
   */
  static getProgressToUnlock(
    unlockable: Unlockable,
    userLevel: number,
    userXP: number,
    userStreak: number
  ): number {
    switch (unlockable.unlockedAtType) {
      case 'level':
        return (userLevel / unlockable.unlockedAt) * 100;
      case 'xp':
        return (userXP / unlockable.unlockedAt) * 100;
      case 'streak':
        return (userStreak / unlockable.unlockedAt) * 100;
      default:
        return 0;
    }
  }
}

// ============================================================
// Gamification Manager (Unified)
// ============================================================

export interface GamificationState {
  streak: StreakData;
  level: LevelData;
  challenges: UserChallenge[];
  unlockedItems: string[]; // unlockable IDs
}

export class GamificationManager {
  /**
   * Create initial gamification state
   */
  static createInitialState(userId: string): GamificationState {
    return {
      streak: StreakManager.createInitialStreak(userId),
      level: LevelManager.createInitialLevel(userId),
      challenges: [],
      unlockedItems: [],
    };
  }

  /**
   * Complete workout and update all systems
   */
  static completeWorkout(state: GamificationState, xpEarned: number = 50): GamificationState {
    const updated = { ...state };

    // Update streak
    updated.streak = StreakManager.updateStreak(updated.streak);

    // Add XP and check level up
    updated.level = LevelManager.addXP(updated.level, xpEarned);

    // Update challenges
    updated.challenges = updated.challenges.map(uc => {
      if (!uc.completed) {
        return ChallengeManager.updateProgress(uc, 1);
      }
      return uc;
    });

    // Check for new unlockables
    updated.unlockedItems = UNLOCKABLES
      .filter(u =>
        UnlockableManager.isUnlocked(
          u,
          updated.level.currentLevel,
          updated.level.totalXP,
          updated.streak.currentStreak
        )
      )
      .map(u => u.unlockableId);

    return updated;
  }
}
