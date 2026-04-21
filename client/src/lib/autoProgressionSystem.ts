// ============================================================
// CallistheniX – Auto Progression System
// Intelligent workout progression with adaptive difficulty
// ============================================================

export type ProgressionLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface ProgressionMetrics {
  exerciseId: string;
  userId: string;
  
  // Performance tracking
  completedReps: number;
  targetReps: number;
  completedSets: number;
  targetSets: number;
  
  // Progression state
  currentLevel: ProgressionLevel;
  progressionStreak: number; // Days of consistent progression
  plateauDays: number; // Days without improvement
  
  // Adaptive difficulty
  difficultyMultiplier: number; // 0.8 - 1.2
  lastProgressionDate: Date;
  lastDeloadDate: Date;
  
  // History
  history: WorkoutRecord[];
}

export interface WorkoutRecord {
  date: Date;
  reps: number;
  sets: number;
  completed: boolean;
  performancePercent: number; // (reps/target) * 100
}

export interface ProgressionAction {
  type: 'progression' | 'deload' | 'maintain' | 'volume_increase' | 'variation_suggest';
  message: string;
  newLevel?: ProgressionLevel;
  newTargetReps?: number;
  newTargetSets?: number;
  suggestion?: string;
}

// ============================================================
// Progression Rules Engine
// ============================================================

export class ProgressionEngine {
  /**
   * Analyze workout performance and determine progression action
   */
  static analyzeProgression(metrics: ProgressionMetrics): ProgressionAction {
    // Rule 1: Auto Progression (Success)
    if (this.shouldProgressUp(metrics)) {
      return {
        type: 'progression',
        message: '🎉 Great work! You\'re ready for the next level!',
        newLevel: Math.min(6, metrics.currentLevel + 1) as ProgressionLevel,
        newTargetReps: Math.ceil(metrics.targetReps * 1.1),
      };
    }

    // Rule 2: Deload (Fatigue)
    if (this.shouldDeload(metrics)) {
      return {
        type: 'deload',
        message: '💪 You\'re working hard. Let\'s take it easy for a bit.',
        newLevel: Math.max(1, metrics.currentLevel - 1) as ProgressionLevel,
        newTargetReps: Math.ceil(metrics.targetReps * 0.85),
        suggestion: 'Take 2-3 days of rest and come back stronger.',
      };
    }

    // Rule 3: Adaptive Difficulty (Performance)
    if (this.shouldIncreaseVolume(metrics)) {
      return {
        type: 'volume_increase',
        message: '💯 You\'re crushing it! Let\'s add more volume.',
        newTargetSets: metrics.targetSets + 1,
      };
    }

    // Rule 4: Plateau Break
    if (this.shouldSuggestVariation(metrics)) {
      return {
        type: 'variation_suggest',
        message: '🔄 Let\'s try a different variation to break through!',
        suggestion: this.suggestVariation(metrics.exerciseId),
      };
    }

    // Rule 5: Maintain
    return {
      type: 'maintain',
      message: '✅ Keep up the good work!',
    };
  }

  /**
   * Rule 1: Auto Progression
   * Condition: User completes 120% of target reps for 3 consecutive sessions
   */
  private static shouldProgressUp(metrics: ProgressionMetrics): boolean {
    if (metrics.history.length < 3) return false;

    const lastThree = metrics.history.slice(-3);
    const allAbove120 = lastThree.every(record => 
      record.performancePercent >= 120 && record.completed
    );

    return allAbove120 && metrics.plateauDays === 0;
  }

  /**
   * Rule 2: Deload
   * Condition: User fails to complete 80% of target reps for 3 consecutive sessions
   */
  private static shouldDeload(metrics: ProgressionMetrics): boolean {
    if (metrics.history.length < 3) return false;

    const lastThree = metrics.history.slice(-3);
    const allBelow80 = lastThree.every(record => 
      record.performancePercent < 80
    );

    return allBelow80;
  }

  /**
   * Rule 3: Adaptive Difficulty
   * Condition: User completes exactly target reps (±5%) for 3 consecutive sessions
   */
  private static shouldIncreaseVolume(metrics: ProgressionMetrics): boolean {
    if (metrics.history.length < 3) return false;

    const lastThree = metrics.history.slice(-3);
    const allConsistent = lastThree.every(record => 
      record.performancePercent >= 95 && 
      record.performancePercent <= 105 && 
      record.completed
    );

    return allConsistent;
  }

  /**
   * Rule 4: Plateau Break
   * Condition: No progression for 14 days
   */
  private static shouldSuggestVariation(metrics: ProgressionMetrics): boolean {
    return metrics.plateauDays >= 14;
  }

  /**
   * Suggest exercise variation based on exercise type
   */
  private static suggestVariation(exerciseId: string): string {
    const variations: Record<string, string> = {
      'pushup': 'Try Diamond Push-Ups or Archer Push-Ups',
      'pullup': 'Try Chin-Ups or Wide-Grip Pull-Ups',
      'dip': 'Try Archer Dips or Ring Dips',
      'squat': 'Try Pistol Squats or Jump Squats',
      'plank': 'Try Side Planks or Plank Variations',
      'handstand': 'Try Handstand Hold against wall',
      'muscleup': 'Try Explosive Pull-Ups',
      'frontlever': 'Try Tuck Front Lever',
    };

    return variations[exerciseId] || 'Try a different variation of this exercise';
  }

  /**
   * Calculate difficulty multiplier based on performance
   */
  static calculateDifficultyMultiplier(metrics: ProgressionMetrics): number {
    const recentPerformance = metrics.history.slice(-7);
    const avgPerformance = recentPerformance.reduce((sum, record) => 
      sum + record.performancePercent, 0
    ) / recentPerformance.length;

    if (avgPerformance >= 120) return 1.2; // Increase difficulty
    if (avgPerformance >= 110) return 1.1;
    if (avgPerformance >= 100) return 1.0; // Maintain
    if (avgPerformance >= 90) return 0.95;
    if (avgPerformance >= 80) return 0.9;
    return 0.8; // Decrease difficulty
  }

  /**
   * Get progression streak (consecutive days of 100%+ performance)
   */
  static getProgressionStreak(metrics: ProgressionMetrics): number {
    let streak = 0;
    for (let i = metrics.history.length - 1; i >= 0; i--) {
      if (metrics.history[i].performancePercent >= 100 && metrics.history[i].completed) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  /**
   * Get plateau days (consecutive days without improvement)
   */
  static getPlateauDays(metrics: ProgressionMetrics): number {
    if (metrics.history.length < 2) return 0;

    const maxReps = Math.max(...metrics.history.map(r => r.reps));
    let plateauDays = 0;

    for (let i = metrics.history.length - 1; i >= 0; i--) {
      if (metrics.history[i].reps < maxReps) {
        break;
      }
      plateauDays++;
    }

    return plateauDays;
  }

  /**
   * Estimate days to next progression
   */
  static estimateDaysToProgression(metrics: ProgressionMetrics): number {
    const avgPerformance = metrics.history.slice(-7).reduce((sum, record) => 
      sum + record.performancePercent, 0
    ) / Math.min(7, metrics.history.length);

    if (avgPerformance >= 120) return 1;
    if (avgPerformance >= 110) return 3;
    if (avgPerformance >= 100) return 7;
    if (avgPerformance >= 90) return 14;
    return 30;
  }

  /**
   * Get next level targets
   */
  static getNextLevelTargets(metrics: ProgressionMetrics): {
    targetReps: number;
    targetSets: number;
    estimatedDays: number;
  } {
    const nextReps = Math.ceil(metrics.targetReps * 1.1);
    const nextSets = metrics.targetSets;
    const estimatedDays = this.estimateDaysToProgression(metrics);

    return {
      targetReps: nextReps,
      targetSets: nextSets,
      estimatedDays,
    };
  }
}

// ============================================================
// Level Definitions
// ============================================================

export const PROGRESSION_LEVELS: Record<ProgressionLevel, {
  name: string;
  description: string;
  minReps: number;
  maxReps: number;
}> = {
  1: {
    name: 'Beginner',
    description: 'Just starting out',
    minReps: 1,
    maxReps: 5,
  },
  2: {
    name: 'Novice',
    description: 'Building foundation',
    minReps: 5,
    maxReps: 10,
  },
  3: {
    name: 'Intermediate',
    description: 'Getting stronger',
    minReps: 10,
    maxReps: 15,
  },
  4: {
    name: 'Advanced',
    description: 'Very strong',
    minReps: 15,
    maxReps: 25,
  },
  5: {
    name: 'Elite',
    description: 'Top performer',
    minReps: 25,
    maxReps: 50,
  },
  6: {
    name: 'Master',
    description: 'Legendary status',
    minReps: 50,
    maxReps: Infinity,
  },
};

// ============================================================
// Utility Functions
// ============================================================

/**
 * Create initial progression metrics for a new exercise
 */
export function createInitialMetrics(
  exerciseId: string,
  userId: string,
  targetReps: number = 10,
  targetSets: number = 3
): ProgressionMetrics {
  return {
    exerciseId,
    userId,
    completedReps: 0,
    targetReps,
    completedSets: 0,
    targetSets,
    currentLevel: 1,
    progressionStreak: 0,
    plateauDays: 0,
    difficultyMultiplier: 1.0,
    lastProgressionDate: new Date(),
    lastDeloadDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    history: [],
  };
}

/**
 * Record a workout and update metrics
 */
export function recordWorkout(
  metrics: ProgressionMetrics,
  reps: number,
  sets: number,
  completed: boolean
): ProgressionMetrics {
  const performancePercent = (reps / metrics.targetReps) * 100;

  const updatedMetrics = {
    ...metrics,
    completedReps: reps,
    completedSets: sets,
    history: [
      ...metrics.history,
      {
        date: new Date(),
        reps,
        sets,
        completed,
        performancePercent,
      },
    ],
  };

  // Update progression streak and plateau days
  updatedMetrics.progressionStreak = ProgressionEngine.getProgressionStreak(updatedMetrics);
  updatedMetrics.plateauDays = ProgressionEngine.getPlateauDays(updatedMetrics);
  updatedMetrics.difficultyMultiplier = ProgressionEngine.calculateDifficultyMultiplier(updatedMetrics);

  return updatedMetrics;
}

/**
 * Apply progression action to metrics
 */
export function applyProgressionAction(
  metrics: ProgressionMetrics,
  action: ProgressionAction
): ProgressionMetrics {
  const updated = { ...metrics };

  if (action.newLevel) {
    updated.currentLevel = action.newLevel;
    updated.lastProgressionDate = new Date();
  }

  if (action.newTargetReps) {
    updated.targetReps = action.newTargetReps;
  }

  if (action.newTargetSets) {
    updated.targetSets = action.newTargetSets;
  }

  if (action.type === 'deload') {
    updated.lastDeloadDate = new Date();
  }

  return updated;
}
