// ============================================================
// CallistheniX – Beginner Progression System
// Manages 6-level progression for safe, structured advancement
// ============================================================

export type ProgressionLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface ProgressionExercise {
  exerciseId: string;
  sets: number;
  reps?: number;
  duration?: number;
  restSeconds: number;
  notes?: string;
}

export interface ProgressionPhase {
  level: ProgressionLevel;
  name: string;
  description: string;
  weekRange: [number, number]; // e.g., [1, 2] for weeks 1-2
  focus: string[];
  exercises: ProgressionExercise[];
  volume: {
    setsPerExercise: number;
    repsRange: [number, number];
    restSeconds: number;
  };
  progressionCriteria: {
    minRepsPerSet: number;
    minSetsCompleted: number;
    formCheckRequired: boolean;
  };
}

export interface BeginnerProgram {
  id: string;
  name: string;
  goal: 'lose_weight' | 'gain_muscle' | 'stay_slim';
  sex: 'male' | 'female';
  description: string;
  totalWeeks: number;
  phases: ProgressionPhase[];
  expectedOutcomes: string[];
}

// ============================================================
// PROGRESSION LEVEL DEFINITIONS
// ============================================================

export const progressionLevels: Record<ProgressionLevel, Omit<ProgressionPhase, 'exercises'>> = {
  1: {
    level: 1,
    name: 'Foundation',
    description: 'Build basic movement patterns and neuromuscular control. Focus on form, breathing, and body awareness.',
    weekRange: [1, 2],
    focus: ['Form mastery', 'Breathing patterns', 'Body awareness', 'Movement quality'],
    volume: {
      setsPerExercise: 2,
      repsRange: [8, 12],
      restSeconds: 60,
    },
    progressionCriteria: {
      minRepsPerSet: 8,
      minSetsCompleted: 2,
      formCheckRequired: true,
    },
  },
  2: {
    level: 2,
    name: 'Building',
    description: 'Increase volume and work capacity. Build consistency and establish training habits.',
    weekRange: [3, 4],
    focus: ['Consistency', 'Work capacity', 'Volume increase', 'Habit formation'],
    volume: {
      setsPerExercise: 3,
      repsRange: [10, 15],
      restSeconds: 45,
    },
    progressionCriteria: {
      minRepsPerSet: 10,
      minSetsCompleted: 3,
      formCheckRequired: true,
    },
  },
  3: {
    level: 3,
    name: 'Strengthening',
    description: 'Build strength and muscle. Introduce progressive overload principles.',
    weekRange: [5, 6],
    focus: ['Progressive overload', 'Strength building', 'Muscle development', 'Form maintenance'],
    volume: {
      setsPerExercise: 3,
      repsRange: [12, 15],
      restSeconds: 45,
    },
    progressionCriteria: {
      minRepsPerSet: 12,
      minSetsCompleted: 3,
      formCheckRequired: true,
    },
  },
  4: {
    level: 4,
    name: 'Intermediate',
    description: 'Introduce intermediate exercises and more complex movement patterns.',
    weekRange: [7, 8],
    focus: ['Advanced patterns', 'Strength focus', 'Movement complexity', 'Intensity increase'],
    volume: {
      setsPerExercise: 3,
      repsRange: [8, 12],
      restSeconds: 60,
    },
    progressionCriteria: {
      minRepsPerSet: 8,
      minSetsCompleted: 3,
      formCheckRequired: true,
    },
  },
  5: {
    level: 5,
    name: 'Advanced Prep',
    description: 'Prepare for advanced movements. Focus on strength, control, and stability.',
    weekRange: [9, 10],
    focus: ['Advanced prep', 'Strength focus', 'Control', 'Stability work'],
    volume: {
      setsPerExercise: 3,
      repsRange: [5, 10],
      restSeconds: 90,
    },
    progressionCriteria: {
      minRepsPerSet: 5,
      minSetsCompleted: 3,
      formCheckRequired: true,
    },
  },
  6: {
    level: 6,
    name: 'Advanced',
    description: 'Master advanced calisthenics movements. Focus on skill, strength, and power.',
    weekRange: [11, 12],
    focus: ['Skill mastery', 'Strength', 'Power', 'Advanced techniques'],
    volume: {
      setsPerExercise: 3,
      repsRange: [3, 8],
      restSeconds: 120,
    },
    progressionCriteria: {
      minRepsPerSet: 3,
      minSetsCompleted: 3,
      formCheckRequired: true,
    },
  },
};

// ============================================================
// BEGINNER PROGRESSION PROGRAMS
// ============================================================

export const beginnerPrograms: BeginnerProgram[] = [
  {
    id: 'beginner_absolute_4week',
    name: 'Absolute Beginner: 4-Week Foundation',
    goal: 'stay_slim',
    sex: 'male',
    description: 'Perfect for complete beginners. Build foundational strength and movement patterns over 4 weeks.',
    totalWeeks: 4,
    phases: [
      {
        level: 1,
        name: 'Foundation (Weeks 1-2)',
        description: 'Establish movement patterns and build confidence.',
        weekRange: [1, 2],
        focus: ['Form mastery', 'Breathing patterns', 'Body awareness'],
        exercises: [
          { exerciseId: 'wall_push_up', sets: 3, reps: 10, restSeconds: 60, notes: 'Focus on form' },
          { exerciseId: 'scapular_pulls', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'arm_circles', sets: 3, reps: 15, restSeconds: 30 },
          { exerciseId: 'plank', sets: 3, duration: 20, restSeconds: 45 },
          { exerciseId: 'dead_bug', sets: 3, reps: 10, restSeconds: 45 },
          { exerciseId: 'bodyweight_squat', sets: 3, reps: 15, restSeconds: 60 },
          { exerciseId: 'glute_bridge', sets: 3, reps: 15, restSeconds: 45 },
          { exerciseId: 'wall_sit', sets: 3, duration: 20, restSeconds: 45 },
        ],
        volume: {
          setsPerExercise: 3,
          repsRange: [10, 15],
          restSeconds: 60,
        },
        progressionCriteria: {
          minRepsPerSet: 10,
          minSetsCompleted: 3,
          formCheckRequired: true,
        },
      },
      {
        level: 2,
        name: 'Building (Weeks 3-4)',
        description: 'Increase volume and introduce new exercises.',
        weekRange: [3, 4],
        focus: ['Consistency', 'Volume increase', 'New movements'],
        exercises: [
          { exerciseId: 'incline_push_up', sets: 3, reps: 12, restSeconds: 60 },
          { exerciseId: 'inverted_row_high', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'pike_push_up', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'plank', sets: 3, duration: 30, restSeconds: 45 },
          { exerciseId: 'bird_dog', sets: 3, reps: 10, restSeconds: 45 },
          { exerciseId: 'bodyweight_squat', sets: 4, reps: 15, restSeconds: 60 },
          { exerciseId: 'walking_lunge', sets: 3, reps: 12, restSeconds: 60 },
          { exerciseId: 'glute_bridge', sets: 4, reps: 15, restSeconds: 45 },
        ],
        volume: {
          setsPerExercise: 3,
          repsRange: [12, 15],
          restSeconds: 45,
        },
        progressionCriteria: {
          minRepsPerSet: 12,
          minSetsCompleted: 3,
          formCheckRequired: true,
        },
      },
    ],
    expectedOutcomes: [
      'Improved form and movement quality',
      'Increased work capacity',
      'Better body awareness',
      'Foundation for advanced training',
    ],
  },
  {
    id: 'beginner_8week_strength',
    name: 'Beginner to Intermediate: 8-Week Strength Builder',
    goal: 'gain_muscle',
    sex: 'male',
    description: 'Progressive 8-week program to build foundational strength and muscle.',
    totalWeeks: 8,
    phases: [
      {
        level: 1,
        name: 'Foundation (Weeks 1-2)',
        description: 'Establish movement patterns.',
        weekRange: [1, 2],
        focus: ['Form mastery', 'Movement patterns'],
        exercises: [
          { exerciseId: 'wall_push_up', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'scapular_pulls', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'plank', sets: 3, duration: 20, restSeconds: 45 },
          { exerciseId: 'bodyweight_squat', sets: 3, reps: 15, restSeconds: 60 },
          { exerciseId: 'glute_bridge', sets: 3, reps: 15, restSeconds: 45 },
          { exerciseId: 'high_knees', sets: 3, duration: 30, restSeconds: 30 },
        ],
        volume: {
          setsPerExercise: 3,
          repsRange: [10, 15],
          restSeconds: 60,
        },
        progressionCriteria: {
          minRepsPerSet: 10,
          minSetsCompleted: 3,
          formCheckRequired: true,
        },
      },
      {
        level: 2,
        name: 'Building (Weeks 3-4)',
        description: 'Increase volume and introduce new exercises.',
        weekRange: [3, 4],
        focus: ['Volume increase', 'New movements'],
        exercises: [
          { exerciseId: 'incline_push_up', sets: 3, reps: 12, restSeconds: 60 },
          { exerciseId: 'inverted_row_high', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'pike_push_up', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'plank', sets: 3, duration: 30, restSeconds: 45 },
          { exerciseId: 'bodyweight_squat', sets: 4, reps: 15, restSeconds: 60 },
          { exerciseId: 'walking_lunge', sets: 3, reps: 12, restSeconds: 60 },
          { exerciseId: 'mountain_climber', sets: 3, duration: 30, restSeconds: 45 },
        ],
        volume: {
          setsPerExercise: 3,
          repsRange: [12, 15],
          restSeconds: 45,
        },
        progressionCriteria: {
          minRepsPerSet: 12,
          minSetsCompleted: 3,
          formCheckRequired: true,
        },
      },
      {
        level: 3,
        name: 'Strengthening (Weeks 5-6)',
        description: 'Build strength and muscle with progressive overload.',
        weekRange: [5, 6],
        focus: ['Progressive overload', 'Strength building'],
        exercises: [
          { exerciseId: 'knee_push_up', sets: 3, reps: 12, restSeconds: 60 },
          { exerciseId: 'inverted_row_medium', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'pike_push_up_full', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'plank', sets: 4, duration: 30, restSeconds: 45 },
          { exerciseId: 'bodyweight_squat', sets: 4, reps: 18, restSeconds: 60 },
          { exerciseId: 'walking_lunge', sets: 4, reps: 12, restSeconds: 60 },
          { exerciseId: 'tricep_dip', sets: 3, reps: 10, restSeconds: 60 },
        ],
        volume: {
          setsPerExercise: 3,
          repsRange: [12, 15],
          restSeconds: 45,
        },
        progressionCriteria: {
          minRepsPerSet: 12,
          minSetsCompleted: 3,
          formCheckRequired: true,
        },
      },
      {
        level: 4,
        name: 'Intermediate (Weeks 7-8)',
        description: 'Introduce intermediate exercises.',
        weekRange: [7, 8],
        focus: ['Advanced patterns', 'Strength focus'],
        exercises: [
          { exerciseId: 'push_up', sets: 3, reps: 12, restSeconds: 60 },
          { exerciseId: 'assisted_pull_up', sets: 3, reps: 5, restSeconds: 90 },
          { exerciseId: 'diamond_push_up', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'pike_push_up_full', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'bodyweight_squat', sets: 4, reps: 20, restSeconds: 60 },
          { exerciseId: 'walking_lunge', sets: 4, reps: 12, restSeconds: 60 },
          { exerciseId: 'tricep_dip', sets: 3, reps: 12, restSeconds: 60 },
        ],
        volume: {
          setsPerExercise: 3,
          repsRange: [8, 12],
          restSeconds: 60,
        },
        progressionCriteria: {
          minRepsPerSet: 8,
          minSetsCompleted: 3,
          formCheckRequired: true,
        },
      },
    ],
    expectedOutcomes: [
      'Solid foundational strength',
      'Visible muscle development',
      'Improved work capacity',
      'Ready for intermediate programs',
    ],
  },
  {
    id: 'beginner_female_8week',
    name: 'Beginner to Intermediate: 8-Week Lean Muscle (Female)',
    goal: 'gain_muscle',
    sex: 'female',
    description: 'Progressive 8-week program designed for women to build lean muscle and strength.',
    totalWeeks: 8,
    phases: [
      {
        level: 1,
        name: 'Foundation (Weeks 1-2)',
        description: 'Establish movement patterns.',
        weekRange: [1, 2],
        focus: ['Form mastery', 'Movement patterns'],
        exercises: [
          { exerciseId: 'wall_push_up', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'scapular_pulls', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'plank', sets: 3, duration: 20, restSeconds: 45 },
          { exerciseId: 'bodyweight_squat', sets: 3, reps: 15, restSeconds: 60 },
          { exerciseId: 'glute_bridge', sets: 3, reps: 15, restSeconds: 45 },
          { exerciseId: 'jumping_jack', sets: 3, duration: 30, restSeconds: 30 },
        ],
        volume: {
          setsPerExercise: 3,
          repsRange: [10, 15],
          restSeconds: 60,
        },
        progressionCriteria: {
          minRepsPerSet: 10,
          minSetsCompleted: 3,
          formCheckRequired: true,
        },
      },
      {
        level: 2,
        name: 'Building (Weeks 3-4)',
        description: 'Increase volume with focus on lower body and core.',
        weekRange: [3, 4],
        focus: ['Volume increase', 'Lower body focus'],
        exercises: [
          { exerciseId: 'incline_push_up', sets: 3, reps: 12, restSeconds: 60 },
          { exerciseId: 'inverted_row_high', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'plank', sets: 3, duration: 30, restSeconds: 45 },
          { exerciseId: 'bodyweight_squat', sets: 4, reps: 15, restSeconds: 60 },
          { exerciseId: 'walking_lunge', sets: 3, reps: 12, restSeconds: 60 },
          { exerciseId: 'glute_bridge', sets: 4, reps: 15, restSeconds: 45 },
          { exerciseId: 'high_knees', sets: 3, duration: 30, restSeconds: 30 },
        ],
        volume: {
          setsPerExercise: 3,
          repsRange: [12, 15],
          restSeconds: 45,
        },
        progressionCriteria: {
          minRepsPerSet: 12,
          minSetsCompleted: 3,
          formCheckRequired: true,
        },
      },
      {
        level: 3,
        name: 'Strengthening (Weeks 5-6)',
        description: 'Build strength with progressive overload.',
        weekRange: [5, 6],
        focus: ['Progressive overload', 'Strength building'],
        exercises: [
          { exerciseId: 'knee_push_up', sets: 3, reps: 12, restSeconds: 60 },
          { exerciseId: 'inverted_row_medium', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'pike_push_up', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'plank', sets: 4, duration: 30, restSeconds: 45 },
          { exerciseId: 'bodyweight_squat', sets: 4, reps: 18, restSeconds: 60 },
          { exerciseId: 'walking_lunge', sets: 4, reps: 12, restSeconds: 60 },
          { exerciseId: 'single_leg_glute_bridge_assisted', sets: 3, reps: 10, restSeconds: 60 },
        ],
        volume: {
          setsPerExercise: 3,
          repsRange: [12, 15],
          restSeconds: 45,
        },
        progressionCriteria: {
          minRepsPerSet: 12,
          minSetsCompleted: 3,
          formCheckRequired: true,
        },
      },
      {
        level: 4,
        name: 'Intermediate (Weeks 7-8)',
        description: 'Introduce intermediate exercises.',
        weekRange: [7, 8],
        focus: ['Advanced patterns', 'Strength focus'],
        exercises: [
          { exerciseId: 'push_up', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'assisted_pull_up', sets: 3, reps: 3, restSeconds: 90 },
          { exerciseId: 'diamond_push_up', sets: 3, reps: 8, restSeconds: 60 },
          { exerciseId: 'pike_push_up', sets: 3, reps: 10, restSeconds: 60 },
          { exerciseId: 'bodyweight_squat', sets: 4, reps: 20, restSeconds: 60 },
          { exerciseId: 'walking_lunge', sets: 4, reps: 12, restSeconds: 60 },
          { exerciseId: 'single_leg_glute_bridge', sets: 3, reps: 10, restSeconds: 60 },
        ],
        volume: {
          setsPerExercise: 3,
          repsRange: [8, 12],
          restSeconds: 60,
        },
        progressionCriteria: {
          minRepsPerSet: 8,
          minSetsCompleted: 3,
          formCheckRequired: true,
        },
      },
    ],
    expectedOutcomes: [
      'Lean muscle development',
      'Improved strength and tone',
      'Better body composition',
      'Ready for intermediate programs',
    ],
  },
];

// ============================================================
// PROGRESSION TRACKING
// ============================================================

export interface ProgressionTrackingData {
  userId: string;
  programId: string;
  currentLevel: ProgressionLevel;
  currentWeek: number;
  exerciseProgress: Record<string, ExerciseProgressData>;
  readyToProgress: boolean;
  lastUpdated: Date;
}

export interface ExerciseProgressData {
  exerciseId: string;
  totalRepsCompleted: number;
  totalSetsCompleted: number;
  formChecksPassed: number;
  formChecksFailed: number;
  averageRepsPerSet: number;
  readyToProgress: boolean;
  notes: string[];
}

// ============================================================
// PROGRESSION HELPERS
// ============================================================

/**
 * Determine if user is ready to progress to next level
 */
export function isReadyForNextLevel(
  trackingData: ProgressionTrackingData,
  progressionCriteria: ProgressionPhase['progressionCriteria']
): boolean {
  const exerciseProgress = Object.values(trackingData.exerciseProgress);

  // Check if all exercises meet progression criteria
  return exerciseProgress.every((exercise) => {
    const meetsReps = exercise.averageRepsPerSet >= progressionCriteria.minRepsPerSet;
    const meetsSets = exercise.totalSetsCompleted >= progressionCriteria.minSetsCompleted * 7; // 7 days per week
    const meetsForm = !progressionCriteria.formCheckRequired || exercise.formChecksPassed >= 2;

    return meetsReps && meetsSets && meetsForm;
  });
}

/**
 * Get next progression level
 */
export function getNextProgressionLevel(currentLevel: ProgressionLevel): ProgressionLevel | null {
  if (currentLevel === 6) return null;
  return (currentLevel + 1) as ProgressionLevel;
}

/**
 * Get progression phase by level
 */
export function getProgressionPhase(level: ProgressionLevel): Omit<ProgressionPhase, 'exercises'> {
  return progressionLevels[level];
}

/**
 * Calculate progression percentage
 */
export function calculateProgressionPercentage(
  trackingData: ProgressionTrackingData,
  progressionCriteria: ProgressionPhase['progressionCriteria']
): number {
  const exerciseProgress = Object.values(trackingData.exerciseProgress);

  if (exerciseProgress.length === 0) return 0;

  const progressionScores = exerciseProgress.map((exercise) => {
    let score = 0;

    // Reps score (0-33%)
    const repsPercentage = Math.min(
      (exercise.averageRepsPerSet / progressionCriteria.minRepsPerSet) * 100,
      100
    );
    score += repsPercentage * 0.33;

    // Sets score (0-33%)
    const setsPercentage = Math.min(
      (exercise.totalSetsCompleted / (progressionCriteria.minSetsCompleted * 7)) * 100,
      100
    );
    score += setsPercentage * 0.33;

    // Form score (0-34%)
    if (progressionCriteria.formCheckRequired) {
      const formPercentage = Math.min(
        (exercise.formChecksPassed / 2) * 100,
        100
      );
      score += formPercentage * 0.34;
    } else {
      score += 34;
    }

    return score;
  });

  return Math.round(progressionScores.reduce((a, b) => a + b, 0) / progressionScores.length);
}
