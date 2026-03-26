// ============================================================
// CallistheniX – Exercise & Program Data Library
// All exercise GIFs sourced from Giphy/public CDN
// ============================================================

export type Goal = 'lose_weight' | 'gain_muscle' | 'stay_slim';
export type Sex = 'male' | 'female';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'arms' | 'core' | 'legs' | 'full_body' | 'cardio';

export interface Exercise {
  id: string;
  name: string;
  muscleGroups: MuscleGroup[];
  difficulty: Difficulty;
  gifUrl: string;
  youtubeVideoId?: string;  // YouTube video ID for exercise demo
  durationSeconds?: number; // if time-based
  reps?: number;            // if rep-based
  sets: number;
  restSeconds: number;
  instructions: string[];
  tips: string[];
  calories: number; // per set/duration
}

export interface WorkoutProgram {
  id: string;
  name: string;
  description: string;
  goal: Goal;
  sex: Sex[];
  minAge: number;
  maxAge: number;
  minWeight: number;
  maxWeight: number;
  difficulty: Difficulty;
  durationWeeks: number;
  sessionsPerWeek: number;
  sessionDurationMin: number;
  days: WorkoutDay[];
  tags: string[];
}

export interface WorkoutDay {
  dayNumber: number;
  name: string;
  focus: string;
  exercises: string[]; // exercise IDs
}

export interface DietPlan {
  id: string;
  name: string;
  goal: Goal;
  sex: Sex[];
  description: string;
  dailyCalories: (weight: number, goal: Goal) => number;
  macros: { protein: number; carbs: number; fat: number }; // percentages
  meals: Meal[]; // fallback single day meals
  weeklyPlan?: DayMeal[]; // 7-day meal plan
  tips: string[];
  foods: FoodCategory[];
}

export interface Meal {
  name: string;
  time: string;
  description: string;
  examples: string[];
}

export interface DayMeal {
  day: string; // Monday, Tuesday, etc.
  meals: Meal[];
}

export interface FoodCategory {
  category: string;
  icon: string;
  items: string[];
  avoid: string[];
}

// ============================================================
// EXERCISES
// Using Giphy/WGER public GIF URLs for exercise demos
// ============================================================
export const exercises: Record<string, Exercise> = {
  push_up: {
    id: 'push_up',
    name: 'Push-Up',
    muscleGroups: ['chest', 'shoulders', 'arms'],
    difficulty: 'beginner',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHVwdnVhZzJ2MzZtNHBhcGJlZzBtNXZtNXZtNXZtNXZtNXZtNQ/3o7TKSjRrfIPjeiVyM/giphy.gif',
    youtubeVideoId: 'IODxDxX7oi4',
    reps: 15,
    sets: 3,
    restSeconds: 60,
    instructions: [
      'Start in a high plank position with hands shoulder-width apart.',
      'Lower your chest toward the floor, keeping elbows at 45° from your body.',
      'Push back up explosively until arms are fully extended.',
      'Keep your core tight and body in a straight line throughout.',
    ],
    tips: [
      'Don\'t let your hips sag or pike up.',
      'Look slightly forward, not straight down.',
      'Breathe in on the way down, out on the way up.',
    ],
    calories: 8,
  },
  pull_up: {
    id: 'pull_up',
    name: 'Pull-Up',
    muscleGroups: ['back', 'arms'],
    difficulty: 'intermediate',
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW5kZXJncm91bmQ/3oKIPrc2ngFZ6BTyww/giphy.gif',
    youtubeVideoId: 'eGo4IYlbE5g',
    reps: 8,
    sets: 3,
    restSeconds: 90,
    instructions: [
      'Hang from a bar with hands slightly wider than shoulder-width, palms facing away.',
      'Engage your core and pull your shoulder blades down and back.',
      'Pull yourself up until your chin clears the bar.',
      'Lower slowly with control — take 2-3 seconds on the way down.',
    ],
    tips: [
      'Avoid kipping or swinging — use strict form.',
      'Squeeze your lats at the top of each rep.',
      'If too hard, use a resistance band for assistance.',
    ],
    calories: 10,
  },
  dip: {
    id: 'dip',
    name: 'Parallel Bar Dip',
    muscleGroups: ['chest', 'shoulders', 'arms'],
    difficulty: 'intermediate',
    gifUrl: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
    youtubeVideoId: 'zaUqXuqiYrQ',
    reps: 10,
    sets: 3,
    restSeconds: 75,
    instructions: [
      'Grip parallel bars and support your body with straight arms.',
      'Lean slightly forward to target chest, or stay upright for triceps.',
      'Lower yourself until upper arms are parallel to the floor.',
      'Push back up powerfully to the starting position.',
    ],
    tips: [
      'Keep elbows close to your body for tricep focus.',
      'Flare elbows slightly for more chest activation.',
      'Control the descent — don\'t just drop.',
    ],
    calories: 9,
  },
  squat: {
    id: 'squat',
    name: 'Bodyweight Squat',
    muscleGroups: ['legs'],
    difficulty: 'beginner',
    gifUrl: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
    youtubeVideoId: 'aclHkVjW_2Y',
    reps: 20,
    sets: 3,
    restSeconds: 60,
    instructions: [
      'Stand with feet shoulder-width apart, toes slightly turned out.',
      'Brace your core and push your hips back and down.',
      'Lower until thighs are at least parallel to the floor.',
      'Drive through your heels to return to standing.',
    ],
    tips: [
      'Keep your chest up and back straight.',
      'Knees should track over your toes, not cave inward.',
      'Go as deep as your mobility allows.',
    ],
    calories: 7,
  },
  lunge: {
    id: 'lunge',
    name: 'Walking Lunge',
    muscleGroups: ['legs'],
    difficulty: 'beginner',
    gifUrl: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif',
    youtubeVideoId: 'QOVaHwm-Q6U',
    reps: 12,
    sets: 3,
    restSeconds: 60,
    instructions: [
      'Stand tall with feet together.',
      'Step forward with one leg and lower your back knee toward the floor.',
      'Front thigh should be parallel to the floor, back knee just above it.',
      'Push off the front foot and step forward with the other leg.',
    ],
    tips: [
      'Keep your torso upright throughout.',
      'Don\'t let your front knee travel past your toes.',
      'Take long, controlled steps.',
    ],
    calories: 6,
  },
  plank: {
    id: 'plank',
    name: 'Plank Hold',
    muscleGroups: ['core'],
    difficulty: 'beginner',
    gifUrl: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
    youtubeVideoId: 'pSHjTRCQxIw',
    durationSeconds: 45,
    sets: 3,
    restSeconds: 45,
    instructions: [
      'Start in a forearm plank with elbows directly under shoulders.',
      'Keep your body in a straight line from head to heels.',
      'Brace your core as if bracing for a punch.',
      'Hold the position, breathing steadily.',
    ],
    tips: [
      'Don\'t hold your breath.',
      'Squeeze your glutes to prevent hip sag.',
      'Look at the floor to keep your neck neutral.',
    ],
    calories: 5,
  },
  burpee: {
    id: 'burpee',
    name: 'Burpee',
    muscleGroups: ['full_body', 'cardio'],
    difficulty: 'intermediate',
    gifUrl: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
    youtubeVideoId: 'JZQA_G8KgFo',
    reps: 10,
    sets: 3,
    restSeconds: 90,
    instructions: [
      'Start standing, then squat down and place hands on the floor.',
      'Jump or step your feet back to a push-up position.',
      'Perform one push-up (optional for beginners).',
      'Jump or step feet back to hands, then jump up with arms overhead.',
    ],
    tips: [
      'Modify by stepping instead of jumping if needed.',
      'Keep your core engaged throughout.',
      'Land softly with bent knees.',
    ],
    calories: 15,
  },
  mountain_climber: {
    id: 'mountain_climber',
    name: 'Mountain Climber',
    muscleGroups: ['core', 'cardio'],
    difficulty: 'beginner',
    gifUrl: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
    youtubeVideoId: 'nmwgirgXLYM',
    durationSeconds: 30,
    sets: 3,
    restSeconds: 45,
    instructions: [
      'Start in a high plank position.',
      'Drive one knee toward your chest, then quickly switch legs.',
      'Keep your hips level and core tight.',
      'Maintain a fast, controlled pace.',
    ],
    tips: [
      'Don\'t let your hips rise or fall.',
      'Keep your shoulders over your wrists.',
      'Breathe rhythmically throughout.',
    ],
    calories: 12,
  },
  jumping_jack: {
    id: 'jumping_jack',
    name: 'Jumping Jack',
    muscleGroups: ['full_body', 'cardio'],
    difficulty: 'beginner',
    gifUrl: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
    youtubeVideoId: 'c4DqC9sKvTI',
    durationSeconds: 45,
    sets: 3,
    restSeconds: 30,
    instructions: [
      'Stand with feet together and arms at your sides.',
      'Jump while spreading your legs shoulder-width and raising arms overhead.',
      'Jump back to the starting position.',
      'Repeat at a steady, controlled pace.',
    ],
    tips: [
      'Land softly with slightly bent knees.',
      'Keep your core engaged.',
      'Use as a warm-up or active rest.',
    ],
    calories: 10,
  },
  pike_push_up: {
    id: 'pike_push_up',
    name: 'Pike Push-Up',
    muscleGroups: ['shoulders', 'arms'],
    difficulty: 'intermediate',
    gifUrl: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
    youtubeVideoId: 'Vh5tQMRUP84',
    reps: 10,
    sets: 3,
    restSeconds: 75,
    instructions: [
      'Start in a downward dog position with hips high.',
      'Bend your elbows to lower your head toward the floor.',
      'Push back up to the starting position.',
      'Keep your hips elevated throughout the movement.',
    ],
    tips: [
      'The higher your hips, the more shoulder-focused the exercise.',
      'Keep elbows pointing slightly back, not flared.',
      'This is a progression toward handstand push-ups.',
    ],
    calories: 8,
  },
  leg_raise: {
    id: 'leg_raise',
    name: 'Hanging Leg Raise',
    muscleGroups: ['core'],
    difficulty: 'intermediate',
    gifUrl: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
    youtubeVideoId: 'r4MRlMy1NRo',
    reps: 12,
    sets: 3,
    restSeconds: 60,
    instructions: [
      'Hang from a pull-up bar with straight arms.',
      'Engage your core and raise your legs to 90° (or higher).',
      'Lower slowly with control — take 2-3 seconds.',
      'Avoid swinging — use only your core.',
    ],
    tips: [
      'Tuck your pelvis under at the top for maximum ab contraction.',
      'If too hard, start with knee raises.',
      'Keep shoulders packed, not shrugged.',
    ],
    calories: 7,
  },
  diamond_push_up: {
    id: 'diamond_push_up',
    name: 'Diamond Push-Up',
    muscleGroups: ['chest', 'arms'],
    difficulty: 'intermediate',
    gifUrl: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
    youtubeVideoId: 'h4FpvMVDfWI',
    reps: 10,
    sets: 3,
    restSeconds: 75,
    instructions: [
      'Place hands close together under your chest, forming a diamond shape.',
      'Lower your chest toward your hands, keeping elbows close to your body.',
      'Push back up to full arm extension.',
      'Keep core tight and body straight throughout.',
    ],
    tips: [
      'This heavily targets the triceps.',
      'Keep your elbows from flaring out.',
      'Modify by doing them on your knees if needed.',
    ],
    calories: 9,
  },
  glute_bridge: {
    id: 'glute_bridge',
    name: 'Glute Bridge',
    muscleGroups: ['legs', 'core'],
    difficulty: 'beginner',
    gifUrl: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
    youtubeVideoId: 'wPM8ic32ufQ',
    reps: 20,
    sets: 3,
    restSeconds: 45,
    instructions: [
      'Lie on your back with knees bent and feet flat on the floor.',
      'Drive through your heels to lift your hips toward the ceiling.',
      'Squeeze your glutes at the top and hold for 1 second.',
      'Lower slowly back to the floor.',
    ],
    tips: [
      'Keep your core braced throughout.',
      'Don\'t hyperextend your lower back at the top.',
      'Progress to single-leg bridges for more challenge.',
    ],
    calories: 5,
  },
  high_knees: {
    id: 'high_knees',
    name: 'High Knees',
    muscleGroups: ['legs', 'cardio'],
    difficulty: 'beginner',
    gifUrl: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
    youtubeVideoId: 'txHRA36z19I',
    durationSeconds: 30,
    sets: 3,
    restSeconds: 30,
    instructions: [
      'Stand with feet hip-width apart.',
      'Run in place, driving your knees as high as possible.',
      'Pump your arms in rhythm with your legs.',
      'Maintain a fast, controlled pace.',
    ],
    tips: [
      'Land on the balls of your feet, not your heels.',
      'Keep your core engaged.',
      'Great for warming up or cardio intervals.',
    ],
    calories: 13,
  },
  tricep_dip: {
    id: 'tricep_dip',
    name: 'Tricep Dip (Chair)',
    muscleGroups: ['arms', 'chest'],
    difficulty: 'beginner',
    gifUrl: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
    youtubeVideoId: 'tJcgSJBcyY0',
    reps: 15,
    sets: 3,
    restSeconds: 60,
    instructions: [
      'Place hands on a chair or bench behind you, fingers forward.',
      'Extend legs in front of you.',
      'Lower your body by bending elbows to 90°.',
      'Push back up to the starting position.',
    ],
    tips: [
      'Keep your back close to the chair.',
      'Don\'t let shoulders roll forward.',
      'Bend knees to make it easier.',
    ],
    calories: 7,
  },
  superman: {
    id: 'superman',
    name: 'Superman Hold',
    muscleGroups: ['back', 'core'],
    difficulty: 'beginner',
    gifUrl: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
    youtubeVideoId: 'Btb0qkJxnKw',
    durationSeconds: 30,
    sets: 3,
    restSeconds: 45,
    instructions: [
      'Lie face down with arms extended overhead.',
      'Simultaneously lift your arms, chest, and legs off the floor.',
      'Hold the position, squeezing your back muscles.',
      'Lower slowly back to the floor.',
    ],
    tips: [
      'Keep your neck neutral — don\'t crane it up.',
      'Focus on squeezing your glutes and back.',
      'Breathe steadily throughout the hold.',
    ],
    calories: 4,
  },
};

// ============================================================
// WORKOUT PROGRAMS
// ============================================================
export const programs: WorkoutProgram[] = [
  // ── FAT LOSS PROGRAMS ──────────────────────────────────────
  {
    id: 'fat_burn_beginner_male',
    name: 'Ignite: Fat Burn Starter',
    description: 'A 6-week beginner program combining bodyweight cardio and strength circuits to maximize calorie burn and kickstart your transformation.',
    goal: 'lose_weight',
    sex: ['male'],
    minAge: 16, maxAge: 60,
    minWeight: 70, maxWeight: 999,
    difficulty: 'beginner',
    durationWeeks: 6,
    sessionsPerWeek: 4,
    sessionDurationMin: 35,
    tags: ['Fat Loss', 'Cardio', 'Full Body', 'Beginner'],
    days: [
      { dayNumber: 1, name: 'Day 1', focus: 'Full Body Circuit', exercises: ['jumping_jack', 'push_up', 'squat', 'mountain_climber', 'plank'] },
      { dayNumber: 2, name: 'Day 2', focus: 'Cardio Blast', exercises: ['high_knees', 'burpee', 'jumping_jack', 'mountain_climber', 'plank'] },
      { dayNumber: 3, name: 'Day 3', focus: 'Upper Body + Core', exercises: ['push_up', 'tricep_dip', 'pike_push_up', 'plank', 'mountain_climber'] },
      { dayNumber: 4, name: 'Day 4', focus: 'Lower Body + Cardio', exercises: ['squat', 'lunge', 'glute_bridge', 'high_knees', 'jumping_jack'] },
    ],
  },
  {
    id: 'fat_burn_beginner_female',
    name: 'Sculpt & Burn',
    description: 'A 6-week beginner program designed for women, focusing on toning, fat loss, and building a strong foundation with bodyweight movements.',
    goal: 'lose_weight',
    sex: ['female'],
    minAge: 16, maxAge: 60,
    minWeight: 50, maxWeight: 999,
    difficulty: 'beginner',
    durationWeeks: 6,
    sessionsPerWeek: 4,
    sessionDurationMin: 30,
    tags: ['Fat Loss', 'Toning', 'Full Body', 'Beginner'],
    days: [
      { dayNumber: 1, name: 'Day 1', focus: 'Full Body Tone', exercises: ['jumping_jack', 'squat', 'glute_bridge', 'plank', 'mountain_climber'] },
      { dayNumber: 2, name: 'Day 2', focus: 'Cardio & Core', exercises: ['high_knees', 'mountain_climber', 'jumping_jack', 'plank', 'superman'] },
      { dayNumber: 3, name: 'Day 3', focus: 'Upper Body', exercises: ['push_up', 'tricep_dip', 'pike_push_up', 'plank', 'superman'] },
      { dayNumber: 4, name: 'Day 4', focus: 'Lower Body', exercises: ['squat', 'lunge', 'glute_bridge', 'high_knees', 'plank'] },
    ],
  },
  // ── MUSCLE GAIN PROGRAMS ───────────────────────────────────
  {
    id: 'muscle_gain_intermediate_male',
    name: 'Iron Body: Strength Builder',
    description: 'An 8-week intermediate program focused on progressive calisthenics to build serious upper body strength and muscle mass.',
    goal: 'gain_muscle',
    sex: ['male'],
    minAge: 16, maxAge: 50,
    minWeight: 0, maxWeight: 999,
    difficulty: 'intermediate',
    durationWeeks: 8,
    sessionsPerWeek: 5,
    sessionDurationMin: 50,
    tags: ['Muscle Gain', 'Strength', 'Upper Body', 'Intermediate'],
    days: [
      { dayNumber: 1, name: 'Day 1', focus: 'Push Day', exercises: ['push_up', 'diamond_push_up', 'pike_push_up', 'dip', 'plank'] },
      { dayNumber: 2, name: 'Day 2', focus: 'Pull Day', exercises: ['pull_up', 'leg_raise', 'superman', 'plank', 'mountain_climber'] },
      { dayNumber: 3, name: 'Day 3', focus: 'Legs & Core', exercises: ['squat', 'lunge', 'glute_bridge', 'leg_raise', 'plank'] },
      { dayNumber: 4, name: 'Day 4', focus: 'Push + Core', exercises: ['dip', 'push_up', 'pike_push_up', 'mountain_climber', 'plank'] },
      { dayNumber: 5, name: 'Day 5', focus: 'Full Body Power', exercises: ['pull_up', 'dip', 'squat', 'burpee', 'leg_raise'] },
    ],
  },
  {
    id: 'muscle_gain_intermediate_female',
    name: 'Power Form: Lean Muscle',
    description: 'An 8-week intermediate program for women to build lean muscle, improve strength, and achieve a defined, athletic physique.',
    goal: 'gain_muscle',
    sex: ['female'],
    minAge: 16, maxAge: 50,
    minWeight: 0, maxWeight: 999,
    difficulty: 'intermediate',
    durationWeeks: 8,
    sessionsPerWeek: 4,
    sessionDurationMin: 45,
    tags: ['Lean Muscle', 'Strength', 'Toning', 'Intermediate'],
    days: [
      { dayNumber: 1, name: 'Day 1', focus: 'Upper Body Strength', exercises: ['push_up', 'diamond_push_up', 'pike_push_up', 'tricep_dip', 'plank'] },
      { dayNumber: 2, name: 'Day 2', focus: 'Lower Body Power', exercises: ['squat', 'lunge', 'glute_bridge', 'high_knees', 'leg_raise'] },
      { dayNumber: 3, name: 'Day 3', focus: 'Pull & Core', exercises: ['pull_up', 'superman', 'leg_raise', 'plank', 'mountain_climber'] },
      { dayNumber: 4, name: 'Day 4', focus: 'Full Body Circuit', exercises: ['burpee', 'push_up', 'squat', 'dip', 'plank'] },
    ],
  },
  // ── STAY SLIM / MAINTENANCE PROGRAMS ──────────────────────
  {
    id: 'stay_slim_all',
    name: 'Equilibrium: Stay Sharp',
    description: 'A 4-week maintenance program to keep you lean, mobile, and energized. Perfect for those who want to stay in shape without extreme training.',
    goal: 'stay_slim',
    sex: ['male', 'female'],
    minAge: 16, maxAge: 70,
    minWeight: 0, maxWeight: 999,
    difficulty: 'beginner',
    durationWeeks: 4,
    sessionsPerWeek: 3,
    sessionDurationMin: 25,
    tags: ['Maintenance', 'Flexibility', 'Full Body', 'Beginner'],
    days: [
      { dayNumber: 1, name: 'Day 1', focus: 'Full Body Flow', exercises: ['jumping_jack', 'push_up', 'squat', 'plank', 'superman'] },
      { dayNumber: 2, name: 'Day 2', focus: 'Core & Mobility', exercises: ['plank', 'mountain_climber', 'glute_bridge', 'leg_raise', 'superman'] },
      { dayNumber: 3, name: 'Day 3', focus: 'Active Recovery', exercises: ['jumping_jack', 'high_knees', 'squat', 'lunge', 'plank'] },
    ],
  },
];

// ============================================================
// DIET PLANS
// ============================================================
export const dietPlans: DietPlan[] = [
  {
    id: 'diet_lose_weight',
    name: 'Lean Fuel Protocol',
    goal: 'lose_weight',
    sex: ['male', 'female'],
    description: 'A caloric deficit diet rich in protein to preserve muscle while burning fat. Focuses on whole foods, lean proteins, and complex carbs.',
    dailyCalories: (weight: number, goal: Goal) => Math.round(weight * 28 - 400),
    macros: { protein: 35, carbs: 40, fat: 25 },
    meals: [
      { name: 'Breakfast', time: '7:00 AM', description: 'High-protein start to fuel your morning', examples: ['Scrambled eggs with spinach', 'Greek yogurt with berries', 'Oatmeal with protein powder'] },
      { name: 'Mid-Morning Snack', time: '10:00 AM', description: 'Light snack to maintain energy', examples: ['Apple with almond butter', 'Handful of mixed nuts', 'Protein shake'] },
      { name: 'Lunch', time: '1:00 PM', description: 'Balanced meal with lean protein and vegetables', examples: ['Grilled chicken salad', 'Tuna wrap with greens', 'Turkey and avocado bowl'] },
      { name: 'Pre-Workout', time: '4:00 PM', description: 'Light carbs for energy', examples: ['Banana', 'Rice cakes', 'Small sweet potato'] },
      { name: 'Dinner', time: '7:00 PM', description: 'Protein-focused evening meal', examples: ['Baked salmon with broccoli', 'Lean beef stir-fry', 'Chicken breast with quinoa'] },
    ],
    tips: [
      'Drink at least 2.5L of water daily.',
      'Eat slowly and mindfully — it takes 20 minutes to feel full.',
      'Prioritize sleep: poor sleep increases hunger hormones.',
      'Avoid liquid calories: sodas, juices, and alcohol.',
      'Meal prep on Sundays to avoid bad food choices during the week.',
    ],
    foods: [
      { category: 'Proteins', icon: '🥩', items: ['Chicken breast', 'Tuna', 'Salmon', 'Eggs', 'Greek yogurt', 'Cottage cheese', 'Turkey'], avoid: ['Processed meats', 'Fried chicken', 'Sausages'] },
      { category: 'Carbohydrates', icon: '🌾', items: ['Oats', 'Brown rice', 'Sweet potato', 'Quinoa', 'Whole grain bread', 'Lentils'], avoid: ['White bread', 'Pasta', 'Sugary cereals', 'Pastries'] },
      { category: 'Fats', icon: '🥑', items: ['Avocado', 'Almonds', 'Walnuts', 'Olive oil', 'Chia seeds', 'Flaxseed'], avoid: ['Fried foods', 'Margarine', 'Processed snacks'] },
      { category: 'Vegetables', icon: '🥦', items: ['Broccoli', 'Spinach', 'Kale', 'Cucumber', 'Bell peppers', 'Zucchini', 'Asparagus'], avoid: ['Corn (in excess)', 'Potatoes (fried)'] },
    ],
  },
  {
    id: 'diet_gain_muscle',
    name: 'Mass Engine Protocol',
    goal: 'gain_muscle',
    sex: ['male', 'female'],
    description: 'A caloric surplus diet optimized for muscle protein synthesis. High protein, strategic carb timing around workouts, and healthy fats.',
    dailyCalories: (weight: number, goal: Goal) => Math.round(weight * 33 + 300),
    macros: { protein: 30, carbs: 50, fat: 20 },
    meals: [
      { name: 'Breakfast', time: '7:00 AM', description: 'High-calorie muscle-building start', examples: ['Oatmeal with banana and protein powder', '4 eggs with whole grain toast', 'Smoothie with oats, banana, peanut butter, milk'] },
      { name: 'Mid-Morning', time: '10:00 AM', description: 'Protein and carb snack', examples: ['Cottage cheese with fruit', 'Protein bar', 'Rice cakes with peanut butter'] },
      { name: 'Lunch', time: '1:00 PM', description: 'Large balanced meal', examples: ['Chicken breast with rice and vegetables', 'Beef and sweet potato bowl', 'Salmon with quinoa and greens'] },
      { name: 'Pre-Workout', time: '4:30 PM', description: 'Fast-digesting carbs + protein', examples: ['Banana with protein shake', 'White rice with chicken', 'Sports drink + protein bar'] },
      { name: 'Post-Workout', time: '6:30 PM', description: 'Immediate recovery nutrition', examples: ['Protein shake with banana', 'Chocolate milk', 'Greek yogurt with honey'] },
      { name: 'Dinner', time: '8:00 PM', description: 'Slow-digesting protein for overnight recovery', examples: ['Steak with roasted vegetables', 'Salmon with brown rice', 'Chicken thighs with lentils'] },
    ],
    tips: [
      'Eat every 3-4 hours to maintain a positive nitrogen balance.',
      'Consume 1.6–2.2g of protein per kg of bodyweight daily.',
      'Time your carbs around workouts for maximum performance.',
      'Don\'t skip breakfast — it sets the anabolic tone for the day.',
      'Creatine monohydrate (3-5g/day) is the most evidence-backed supplement.',
    ],
    foods: [
      { category: 'Proteins', icon: '🥩', items: ['Chicken thighs', 'Beef', 'Salmon', 'Whole eggs', 'Whey protein', 'Milk', 'Tuna', 'Pork tenderloin'], avoid: ['Highly processed meats', 'Fast food'] },
      { category: 'Carbohydrates', icon: '🌾', items: ['White rice', 'Oats', 'Pasta', 'Bread', 'Potatoes', 'Banana', 'Dates', 'Corn'], avoid: ['Sugary drinks', 'Candy', 'Alcohol'] },
      { category: 'Fats', icon: '🥑', items: ['Peanut butter', 'Almonds', 'Whole milk', 'Olive oil', 'Avocado', 'Eggs (yolk)'], avoid: ['Trans fats', 'Deep-fried foods'] },
      { category: 'Supplements', icon: '💊', items: ['Whey protein', 'Creatine monohydrate', 'Vitamin D', 'Omega-3', 'Magnesium'], avoid: ['Unproven fat burners', 'Excessive pre-workouts'] },
    ],
  },
  {
    id: 'diet_stay_slim',
    name: 'Balance & Vitality Protocol',
    goal: 'stay_slim',
    sex: ['male', 'female'],
    description: 'A balanced maintenance diet that keeps you energized, lean, and healthy. Focus on whole foods, variety, and sustainable eating habits.',
    dailyCalories: (weight: number, goal: Goal) => Math.round(weight * 30),
    macros: { protein: 25, carbs: 45, fat: 30 },
    meals: [
      { name: 'Breakfast', time: '7:30 AM', description: 'Balanced and energizing', examples: ['Avocado toast with eggs', 'Smoothie bowl', 'Overnight oats with fruit'] },
      { name: 'Lunch', time: '12:30 PM', description: 'Varied and satisfying', examples: ['Mediterranean bowl', 'Grilled fish with salad', 'Veggie wrap with hummus'] },
      { name: 'Afternoon Snack', time: '3:30 PM', description: 'Light and nutritious', examples: ['Fruit and nut mix', 'Hummus with vegetables', 'Dark chocolate and almonds'] },
      { name: 'Dinner', time: '7:00 PM', description: 'Light but complete', examples: ['Grilled chicken with roasted vegetables', 'Stir-fry with tofu', 'Soup with whole grain bread'] },
    ],
    tips: [
      'Follow the 80/20 rule: eat clean 80% of the time.',
      'Stay hydrated — often thirst is mistaken for hunger.',
      'Include a variety of colorful vegetables for micronutrients.',
      'Limit processed foods and added sugars.',
      'Enjoy treats in moderation — restriction leads to binging.',
    ],
    foods: [
      { category: 'Proteins', icon: '🥩', items: ['Chicken', 'Fish', 'Eggs', 'Legumes', 'Greek yogurt', 'Tofu'], avoid: ['Processed meats', 'Fast food burgers'] },
      { category: 'Carbohydrates', icon: '🌾', items: ['Whole grains', 'Fruits', 'Vegetables', 'Legumes', 'Oats'], avoid: ['Refined sugars', 'White bread in excess'] },
      { category: 'Fats', icon: '🥑', items: ['Olive oil', 'Avocado', 'Nuts', 'Seeds', 'Fatty fish'], avoid: ['Trans fats', 'Processed snacks'] },
      { category: 'Hydration', icon: '💧', items: ['Water', 'Green tea', 'Herbal teas', 'Coconut water', 'Sparkling water'], avoid: ['Sodas', 'Energy drinks', 'Excessive alcohol'] },
    ],
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================
export function getRecommendedPrograms(sex: Sex, age: number, weight: number, goal: Goal): WorkoutProgram[] {
  return programs.filter(p =>
    p.goal === goal &&
    p.sex.includes(sex) &&
    age >= p.minAge && age <= p.maxAge &&
    weight >= p.minWeight && weight <= p.maxWeight
  );
}

export function getDietPlan(goal: Goal): DietPlan | undefined {
  return dietPlans.find(d => d.goal === goal);
}

export function getExercisesByIds(ids: string[]): Exercise[] {
  return ids.map(id => exercises[id]).filter(Boolean);
}

export function calculateBMI(weight: number, height: number): number {
  return weight / ((height / 100) ** 2);
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function getGoalLabel(goal: Goal): string {
  const labels: Record<Goal, string> = {
    lose_weight: 'Lose Weight',
    gain_muscle: 'Gain Muscle',
    stay_slim: 'Stay Slim & Tight',
  };
  return labels[goal];
}

export function getGoalDescription(goal: Goal): string {
  const descs: Record<Goal, string> = {
    lose_weight: 'Burn fat, improve cardio, and reveal your physique',
    gain_muscle: 'Build strength, add mass, and transform your body',
    stay_slim: 'Maintain your shape, stay mobile, and feel great',
  };
  return descs[goal];
}
