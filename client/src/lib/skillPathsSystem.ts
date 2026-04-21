// ============================================================
// CallistheniX – Skill-Based Training Paths
// Structured progressions for advanced calisthenics skills
// ============================================================

export type SkillDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export interface SkillStep {
  stepNumber: number;
  name: string;
  description: string;
  exercise: string;
  targetReps?: number;
  targetDuration?: number; // seconds
  difficulty: SkillDifficulty;
  prerequisites: number[]; // step numbers that must be completed first
  tips: string[];
  videoUrl?: string;
  imageUrl?: string;
}

export interface SkillPath {
  skillId: string;
  skillName: string;
  description: string;
  totalSteps: number;
  estimatedDuration: string; // "3-6 months"
  category: 'pull' | 'push' | 'balance' | 'core';
  difficulty: SkillDifficulty;
  steps: SkillStep[];
  benefits: string[];
}

export interface UserSkillProgress {
  userId: string;
  skillId: string;
  currentStep: number;
  completedSteps: number[];
  startDate: Date;
  lastProgressDate: Date;
  estimatedCompletionDate: Date;
  stepProgress: Record<number, StepProgress>;
}

export interface StepProgress {
  stepNumber: number;
  completedDate?: Date;
  attempts: number;
  bestPerformance: number; // reps or seconds
  notes?: string;
}

// ============================================================
// Skill Path Definitions
// ============================================================

export const SKILL_PATHS: Record<string, SkillPath> = {
  'muscle-up': {
    skillId: 'muscle-up',
    skillName: 'Muscle-Up',
    description: 'Master the explosive pull-up to dip transition',
    totalSteps: 10,
    estimatedDuration: '3-6 months',
    category: 'pull',
    difficulty: 'elite',
    benefits: [
      'Explosive upper body power',
      'Full body coordination',
      'Advanced pulling strength',
      'Impressive skill demonstration',
    ],
    steps: [
      {
        stepNumber: 1,
        name: 'Dead Hang',
        description: 'Build grip strength and shoulder stability',
        exercise: 'Dead Hang from Pull-Up Bar',
        targetDuration: 30,
        difficulty: 'beginner',
        prerequisites: [],
        tips: [
          'Hang with straight arms',
          'Engage your core',
          'Breathe steadily',
          'Start with 20-30 seconds',
        ],
      },
      {
        stepNumber: 2,
        name: 'Scapular Pull',
        description: 'Learn to engage shoulder blades',
        exercise: 'Scapular Pull-Ups',
        targetReps: 10,
        difficulty: 'beginner',
        prerequisites: [1],
        tips: [
          'Pull shoulder blades down and back',
          'Minimal arm bend',
          'Control the movement',
          'Focus on scapular engagement',
        ],
      },
      {
        stepNumber: 3,
        name: 'Negative Muscle-Up',
        description: 'Practice the lowering phase',
        exercise: 'Negative Muscle-Up',
        targetReps: 5,
        difficulty: 'beginner',
        prerequisites: [1, 2],
        tips: [
          'Jump to the top position',
          'Lower slowly (3-5 seconds)',
          'Control the transition',
          'Build eccentric strength',
        ],
      },
      {
        stepNumber: 4,
        name: 'Assisted Muscle-Up',
        description: 'Use band assistance for support',
        exercise: 'Band-Assisted Muscle-Up',
        targetReps: 5,
        difficulty: 'intermediate',
        prerequisites: [1, 2, 3],
        tips: [
          'Use a strong resistance band',
          'Focus on the pull and transition',
          'Gradually decrease band resistance',
          'Maintain strict form',
        ],
      },
      {
        stepNumber: 5,
        name: 'Jumping Muscle-Up',
        description: 'Use leg drive to assist',
        exercise: 'Jumping Muscle-Up',
        targetReps: 5,
        difficulty: 'intermediate',
        prerequisites: [1, 2, 3, 4],
        tips: [
          'Bend knees before jumping',
          'Drive legs upward',
          'Transition at the top',
          'Land softly',
        ],
      },
      {
        stepNumber: 6,
        name: 'Half Muscle-Up',
        description: 'Partial range of motion',
        exercise: 'Half Muscle-Up',
        targetReps: 5,
        difficulty: 'intermediate',
        prerequisites: [1, 2, 3, 4, 5],
        tips: [
          'Start from mid-position',
          'Focus on transition',
          'Build explosive power',
          'Increase range gradually',
        ],
      },
      {
        stepNumber: 7,
        name: 'Strict Muscle-Up',
        description: 'Full range, no momentum',
        exercise: 'Strict Muscle-Up',
        targetReps: 3,
        difficulty: 'advanced',
        prerequisites: [1, 2, 3, 4, 5, 6],
        tips: [
          'No kipping or momentum',
          'Explosive pull',
          'Clean transition',
          'Controlled dip',
        ],
      },
      {
        stepNumber: 8,
        name: 'Explosive Muscle-Up',
        description: 'Fast, controlled repetitions',
        exercise: 'Explosive Muscle-Up',
        targetReps: 5,
        difficulty: 'advanced',
        prerequisites: [1, 2, 3, 4, 5, 6, 7],
        tips: [
          'Explosive pull phase',
          'Quick transition',
          'Powerful dip',
          'Maintain control',
        ],
      },
      {
        stepNumber: 9,
        name: 'Multiple Muscle-Ups',
        description: 'Consecutive repetitions',
        exercise: 'Muscle-Up x5',
        targetReps: 5,
        difficulty: 'elite',
        prerequisites: [1, 2, 3, 4, 5, 6, 7, 8],
        tips: [
          'Chain multiple reps',
          'Maintain rhythm',
          'Minimize rest between reps',
          'Build endurance',
        ],
      },
      {
        stepNumber: 10,
        name: 'Weighted Muscle-Up',
        description: 'Advanced variation with added weight',
        exercise: 'Weighted Muscle-Up',
        targetReps: 3,
        difficulty: 'elite',
        prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        tips: [
          'Use weight belt or vest',
          'Start with light weight',
          'Maintain strict form',
          'Gradually increase weight',
        ],
      },
    ],
  },

  'handstand': {
    skillId: 'handstand',
    skillName: 'Handstand',
    description: 'Build balance and strength for freestanding handstands',
    totalSteps: 12,
    estimatedDuration: '2-4 months',
    category: 'balance',
    difficulty: 'advanced',
    benefits: [
      'Core strength and stability',
      'Shoulder mobility and strength',
      'Balance and proprioception',
      'Impressive skill demonstration',
    ],
    steps: [
      {
        stepNumber: 1,
        name: 'Wall Hold',
        description: 'Back to wall for support',
        exercise: 'Wall Hold (Back to Wall)',
        targetDuration: 30,
        difficulty: 'beginner',
        prerequisites: [],
        tips: [
          'Back against wall',
          'Hands shoulder-width apart',
          'Engage core',
          'Keep body straight',
        ],
      },
      {
        stepNumber: 2,
        name: 'Chest to Wall',
        description: 'Face toward wall for balance',
        exercise: 'Wall Hold (Chest to Wall)',
        targetDuration: 30,
        difficulty: 'beginner',
        prerequisites: [1],
        tips: [
          'Face toward wall',
          'Hands close to wall',
          'Engage shoulders',
          'Maintain hollow body',
        ],
      },
      {
        stepNumber: 3,
        name: 'Kick-up Practice',
        description: 'Practice the kick-up motion',
        exercise: 'Handstand Kick-Up Practice',
        targetReps: 10,
        difficulty: 'beginner',
        prerequisites: [1, 2],
        tips: [
          'One leg bent, one straight',
          'Explosive kick',
          'Hands placement',
          'Practice timing',
        ],
      },
      {
        stepNumber: 4,
        name: 'Wall Hold (Chest Out)',
        description: 'Hollow body position against wall',
        exercise: 'Wall Hold (Hollow Body)',
        targetDuration: 30,
        difficulty: 'intermediate',
        prerequisites: [1, 2, 3],
        tips: [
          'Engage core fully',
          'Shoulders engaged',
          'Straight line from hands to feet',
          'Breathe steadily',
        ],
      },
      {
        stepNumber: 5,
        name: 'Free Standing (Assisted)',
        description: 'Hold wall with fingertips only',
        exercise: 'Handstand (Fingertip Support)',
        targetDuration: 10,
        difficulty: 'intermediate',
        prerequisites: [1, 2, 3, 4],
        tips: [
          'Minimal wall contact',
          'Use fingertips only',
          'Build balance',
          'Increase duration gradually',
        ],
      },
      {
        stepNumber: 6,
        name: 'Free Standing (Balance)',
        description: 'Hold without wall support',
        exercise: 'Freestanding Handstand',
        targetDuration: 5,
        difficulty: 'intermediate',
        prerequisites: [1, 2, 3, 4, 5],
        tips: [
          'No wall contact',
          'Micro-adjustments',
          'Engage core',
          'Look at hands',
        ],
      },
      {
        stepNumber: 7,
        name: 'Free Standing (Stable)',
        description: 'Stable freestanding hold',
        exercise: 'Freestanding Handstand',
        targetDuration: 15,
        difficulty: 'advanced',
        prerequisites: [1, 2, 3, 4, 5, 6],
        tips: [
          'Consistent balance',
          'Minimal adjustments',
          'Relaxed shoulders',
          'Steady breathing',
        ],
      },
      {
        stepNumber: 8,
        name: 'Free Standing (Extended)',
        description: 'Extended freestanding hold',
        exercise: 'Freestanding Handstand',
        targetDuration: 30,
        difficulty: 'advanced',
        prerequisites: [1, 2, 3, 4, 5, 6, 7],
        tips: [
          'Relax into the hold',
          'Minimal energy expenditure',
          'Smooth breathing',
          'Perfect alignment',
        ],
      },
      {
        stepNumber: 9,
        name: 'Handstand Walk',
        description: 'Walk on hands',
        exercise: 'Handstand Walk',
        targetReps: 1, // 5 meters
        difficulty: 'advanced',
        prerequisites: [1, 2, 3, 4, 5, 6, 7, 8],
        tips: [
          'Small hand movements',
          'Maintain balance',
          'Controlled steps',
          'Practice on soft surface',
        ],
      },
      {
        stepNumber: 10,
        name: 'Handstand Push-Up',
        description: 'Strict form push-up in handstand',
        exercise: 'Handstand Push-Up',
        targetReps: 3,
        difficulty: 'elite',
        prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        tips: [
          'Strict form only',
          'Full range of motion',
          'Shoulder strength required',
          'Start with wall support',
        ],
      },
      {
        stepNumber: 11,
        name: 'Handstand Push-Up (Deficit)',
        description: 'Push-up on elevated surface',
        exercise: 'Deficit Handstand Push-Up',
        targetReps: 3,
        difficulty: 'elite',
        prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        tips: [
          'Increased range of motion',
          'Greater shoulder demand',
          'Use parallettes or blocks',
          'Build strength',
        ],
      },
      {
        stepNumber: 12,
        name: 'Freestanding Handstand',
        description: 'Extended freestanding hold',
        exercise: 'Freestanding Handstand Hold',
        targetDuration: 60,
        difficulty: 'elite',
        prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        tips: [
          'Relaxed and controlled',
          'Perfect balance',
          'Minimal adjustments',
          'Mastery level',
        ],
      },
    ],
  },

  'front-lever': {
    skillId: 'front-lever',
    skillName: 'Front Lever',
    description: 'Master the horizontal front lever hold',
    totalSteps: 8,
    estimatedDuration: '4-8 months',
    category: 'pull',
    difficulty: 'elite',
    benefits: [
      'Extreme pulling strength',
      'Core stability',
      'Body control',
      'Advanced skill demonstration',
    ],
    steps: [
      {
        stepNumber: 1,
        name: 'Dead Hang',
        description: 'Foundation grip strength',
        exercise: 'Dead Hang',
        targetDuration: 30,
        difficulty: 'beginner',
        prerequisites: [],
        tips: ['Straight arms', 'Engaged core', 'Steady breathing'],
      },
      {
        stepNumber: 2,
        name: 'Tuck Front Lever',
        description: 'Knees to chest position',
        exercise: 'Tuck Front Lever',
        targetDuration: 10,
        difficulty: 'beginner',
        prerequisites: [1],
        tips: ['Knees tucked', 'Elbows straight', 'Body parallel to ground'],
      },
      {
        stepNumber: 3,
        name: 'Single Leg Front Lever',
        description: 'One leg extended',
        exercise: 'Single Leg Front Lever',
        targetDuration: 10,
        difficulty: 'intermediate',
        prerequisites: [1, 2],
        tips: ['One leg extended', 'One leg tucked', 'Maintain level body'],
      },
      {
        stepNumber: 4,
        name: 'Straddle Front Lever',
        description: 'Legs wide apart',
        exercise: 'Straddle Front Lever',
        targetDuration: 10,
        difficulty: 'intermediate',
        prerequisites: [1, 2, 3],
        tips: ['Legs wide', 'Body level', 'Shoulders engaged'],
      },
      {
        stepNumber: 5,
        name: 'Advanced Tuck',
        description: 'Hips higher position',
        exercise: 'Advanced Tuck Front Lever',
        targetDuration: 15,
        difficulty: 'advanced',
        prerequisites: [1, 2, 3, 4],
        tips: ['Hips higher', 'More horizontal', 'Increased difficulty'],
      },
      {
        stepNumber: 6,
        name: 'One Leg Straddle',
        description: 'One leg extended in straddle',
        exercise: 'One Leg Straddle Front Lever',
        targetDuration: 15,
        difficulty: 'advanced',
        prerequisites: [1, 2, 3, 4, 5],
        tips: ['One leg extended', 'One leg bent', 'Maintain balance'],
      },
      {
        stepNumber: 7,
        name: 'Straddle Front Lever (Full)',
        description: 'Full straddle position',
        exercise: 'Full Straddle Front Lever',
        targetDuration: 20,
        difficulty: 'elite',
        prerequisites: [1, 2, 3, 4, 5, 6],
        tips: ['Full ROM', 'Legs wide', 'Body horizontal'],
      },
      {
        stepNumber: 8,
        name: 'Full Front Lever',
        description: 'Legs together horizontal hold',
        exercise: 'Full Front Lever',
        targetDuration: 10,
        difficulty: 'elite',
        prerequisites: [1, 2, 3, 4, 5, 6, 7],
        tips: ['Legs together', 'Fully horizontal', 'Mastery level'],
      },
    ],
  },

  'planche': {
    skillId: 'planche',
    skillName: 'Planche',
    description: 'Master the horizontal planche hold',
    totalSteps: 10,
    estimatedDuration: '6-12 months',
    category: 'push',
    difficulty: 'elite',
    benefits: [
      'Extreme pushing strength',
      'Shoulder stability',
      'Core control',
      'Advanced skill demonstration',
    ],
    steps: [
      {
        stepNumber: 1,
        name: 'Plank Hold',
        description: 'Ground plank foundation',
        exercise: 'Plank Hold',
        targetDuration: 60,
        difficulty: 'beginner',
        prerequisites: [],
        tips: ['Straight body', 'Engaged core', 'Neutral neck'],
      },
      {
        stepNumber: 2,
        name: 'Parallettes Plank',
        description: 'Elevated plank position',
        exercise: 'Parallettes Plank',
        targetDuration: 60,
        difficulty: 'beginner',
        prerequisites: [1],
        tips: ['Hands on parallettes', 'Straight body', 'Increased difficulty'],
      },
      {
        stepNumber: 3,
        name: 'Tuck Planche',
        description: 'Knees to chest',
        exercise: 'Tuck Planche',
        targetDuration: 10,
        difficulty: 'intermediate',
        prerequisites: [1, 2],
        tips: ['Knees tucked', 'Hands under shoulders', 'Lean forward'],
      },
      {
        stepNumber: 4,
        name: 'Tuck Planche (Elevated)',
        description: 'Tuck on parallettes',
        exercise: 'Tuck Planche on Parallettes',
        targetDuration: 15,
        difficulty: 'intermediate',
        prerequisites: [1, 2, 3],
        tips: ['On parallettes', 'Knees tucked', 'More horizontal'],
      },
      {
        stepNumber: 5,
        name: 'Advanced Tuck',
        description: 'Hips higher position',
        exercise: 'Advanced Tuck Planche',
        targetDuration: 15,
        difficulty: 'intermediate',
        prerequisites: [1, 2, 3, 4],
        tips: ['Hips higher', 'More lean', 'Increased difficulty'],
      },
      {
        stepNumber: 6,
        name: 'Single Leg Tuck',
        description: 'One leg extended',
        exercise: 'Single Leg Tuck Planche',
        targetDuration: 15,
        difficulty: 'advanced',
        prerequisites: [1, 2, 3, 4, 5],
        tips: ['One leg extended', 'One leg tucked', 'Balance'],
      },
      {
        stepNumber: 7,
        name: 'Straddle Planche',
        description: 'Legs wide apart',
        exercise: 'Straddle Planche',
        targetDuration: 10,
        difficulty: 'advanced',
        prerequisites: [1, 2, 3, 4, 5, 6],
        tips: ['Legs wide', 'Horizontal body', 'Shoulder strength'],
      },
      {
        stepNumber: 8,
        name: 'Planche (Full)',
        description: 'Legs together horizontal',
        exercise: 'Full Planche',
        targetDuration: 5,
        difficulty: 'elite',
        prerequisites: [1, 2, 3, 4, 5, 6, 7],
        tips: ['Legs together', 'Fully horizontal', 'Extreme strength'],
      },
      {
        stepNumber: 9,
        name: 'Planche Lean',
        description: 'Forward lean position',
        exercise: 'Planche Lean',
        targetDuration: 10,
        difficulty: 'elite',
        prerequisites: [1, 2, 3, 4, 5, 6, 7, 8],
        tips: ['Lean forward', 'Shoulders over hands', 'Advanced control'],
      },
      {
        stepNumber: 10,
        name: 'Planche Hold (Extended)',
        description: 'Extended hold mastery',
        exercise: 'Extended Planche Hold',
        targetDuration: 20,
        difficulty: 'elite',
        prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        tips: ['Extended hold', 'Perfect form', 'Mastery level'],
      },
    ],
  },
};

// ============================================================
// Utility Functions
// ============================================================

/**
 * Get skill path by ID
 */
export function getSkillPath(skillId: string): SkillPath | null {
  return SKILL_PATHS[skillId] || null;
}

/**
 * Get all skill paths
 */
export function getAllSkillPaths(): SkillPath[] {
  return Object.values(SKILL_PATHS);
}

/**
 * Get skill paths by category
 */
export function getSkillPathsByCategory(category: string): SkillPath[] {
  return Object.values(SKILL_PATHS).filter(path => path.category === category);
}

/**
 * Get skill paths by difficulty
 */
export function getSkillPathsByDifficulty(difficulty: SkillDifficulty): SkillPath[] {
  return Object.values(SKILL_PATHS).filter(path => path.difficulty === difficulty);
}

/**
 * Create initial user skill progress
 */
export function createInitialSkillProgress(
  userId: string,
  skillId: string
): UserSkillProgress {
  const skillPath = getSkillPath(skillId);
  if (!skillPath) throw new Error(`Skill path ${skillId} not found`);

  return {
    userId,
    skillId,
    currentStep: 1,
    completedSteps: [],
    startDate: new Date(),
    lastProgressDate: new Date(),
    estimatedCompletionDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
    stepProgress: {},
  };
}

/**
 * Mark skill step as completed
 */
export function completeSkillStep(
  progress: UserSkillProgress,
  stepNumber: number
): UserSkillProgress {
  const updated = { ...progress };

  if (!updated.completedSteps.includes(stepNumber)) {
    updated.completedSteps.push(stepNumber);
    updated.completedSteps.sort((a, b) => a - b);
  }

  updated.stepProgress[stepNumber] = {
    stepNumber,
    completedDate: new Date(),
    attempts: (updated.stepProgress[stepNumber]?.attempts || 0) + 1,
    bestPerformance: updated.stepProgress[stepNumber]?.bestPerformance || 0,
  };

  updated.lastProgressDate = new Date();
  updated.currentStep = Math.max(...updated.completedSteps) + 1;

  return updated;
}

/**
 * Get progress percentage
 */
export function getProgressPercentage(progress: UserSkillProgress): number {
  const skillPath = getSkillPath(progress.skillId);
  if (!skillPath) return 0;
  return (progress.completedSteps.length / skillPath.totalSteps) * 100;
}

/**
 * Get estimated days to completion
 */
export function getEstimatedDaysToCompletion(progress: UserSkillProgress): number {
  const skillPath = getSkillPath(progress.skillId);
  if (!skillPath) return 0;

  const durationMatch = skillPath.estimatedDuration.match(/(\d+)/g);
  if (!durationMatch) return 0;

  const maxMonths = parseInt(durationMatch[durationMatch.length - 1]);
  const daysPerStep = (maxMonths * 30) / skillPath.totalSteps;
  const stepsRemaining = skillPath.totalSteps - progress.completedSteps.length;

  return Math.ceil(daysPerStep * stepsRemaining);
}
