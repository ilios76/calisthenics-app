// ============================================================
// CallistheniX – Meal Plan System with Tiering
// Free: 7-day meal plan | Paid: 30-day meal plan
// ============================================================

export type MealPlanTier = 'free' | 'premium';
export type Goal = 'lose_weight' | 'gain_muscle' | 'stay_slim';
export type Sex = 'male' | 'female';

export interface Meal {
  name: string;
  time: string;
  description: string;
  examples: string[];
  calories?: number;
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface DayMeal {
  day: string; // Monday, Tuesday, etc.
  dayNumber: number; // 1-7 or 1-30
  meals: Meal[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface MealPlan {
  id: string;
  name: string;
  goal: Goal;
  sex: Sex[];
  description: string;
  tier: MealPlanTier;
  duration: number; // 7 or 30 days
  dailyCalories: (weight: number, goal: Goal) => number;
  macros: { protein: number; carbs: number; fat: number }; // percentages
  weeklyPlan: DayMeal[]; // 7-day plan (for free) or 30-day plan (for premium)
  tips: string[];
  foods: FoodCategory[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FoodCategory {
  category: string;
  icon: string;
  items: string[];
  avoid: string[];
}

export interface MealPlanProgress {
  userId: string;
  mealPlanId: string;
  currentDay: number;
  mealsLogged: Record<number, Record<string, boolean>>; // dayNumber -> mealName -> completed
  caloriesLogged: Record<number, number>; // dayNumber -> totalCalories
  completionPercentage: number;
  startDate: Date;
  endDate: Date;
}

// ============================================================
// FREE TIER: 7-DAY MEAL PLANS
// ============================================================

export const sevenDayMealPlans: Record<string, MealPlan> = {
  diet_lose_weight_7day: {
    id: 'diet_lose_weight_7day',
    name: 'Lean Fuel Protocol (7-Day)',
    goal: 'lose_weight',
    sex: ['male', 'female'],
    description: 'A 7-day caloric deficit diet rich in protein to preserve muscle while burning fat. Focuses on whole foods, lean proteins, and complex carbs.',
    tier: 'free',
    duration: 7,
    dailyCalories: (weight: number, goal: Goal) => Math.round(weight * 28 - 400),
    macros: { protein: 35, carbs: 40, fat: 25 },
    weeklyPlan: [
      {
        day: 'Monday',
        dayNumber: 1,
        meals: [
          {
            name: 'Breakfast',
            time: '7:00 AM',
            description: 'High-protein start to fuel your morning',
            examples: ['Scrambled eggs with spinach', 'Greek yogurt with berries', 'Oatmeal with protein powder'],
            calories: 350,
            macros: { protein: 30, carbs: 35, fat: 8 },
          },
          {
            name: 'Mid-Morning Snack',
            time: '10:00 AM',
            description: 'Light snack to maintain energy',
            examples: ['Apple with almond butter', 'Handful of mixed nuts', 'Protein shake'],
            calories: 200,
            macros: { protein: 15, carbs: 20, fat: 8 },
          },
          {
            name: 'Lunch',
            time: '1:00 PM',
            description: 'Balanced meal with lean protein and vegetables',
            examples: ['Grilled chicken breast with brown rice and broccoli', 'Turkey wrap with veggies', 'Salmon with sweet potato'],
            calories: 500,
            macros: { protein: 45, carbs: 50, fat: 10 },
          },
          {
            name: 'Afternoon Snack',
            time: '4:00 PM',
            description: 'Energy boost before workout',
            examples: ['Banana with peanut butter', 'Protein bar', 'Rice cakes with honey'],
            calories: 250,
            macros: { protein: 12, carbs: 35, fat: 6 },
          },
          {
            name: 'Dinner',
            time: '7:00 PM',
            description: 'Lean protein with complex carbs',
            examples: ['Lean beef with quinoa and vegetables', 'Baked cod with sweet potato', 'Chicken stir-fry with brown rice'],
            calories: 450,
            macros: { protein: 40, carbs: 45, fat: 12 },
          },
        ],
        totalCalories: 1750,
        macros: { protein: 142, carbs: 185, fat: 44 },
      },
      {
        day: 'Tuesday',
        dayNumber: 2,
        meals: [
          {
            name: 'Breakfast',
            time: '7:00 AM',
            description: 'Protein-rich breakfast',
            examples: ['Egg white omelet with mushrooms', 'Cottage cheese with granola', 'Protein pancakes'],
            calories: 350,
            macros: { protein: 30, carbs: 35, fat: 8 },
          },
          {
            name: 'Mid-Morning Snack',
            time: '10:00 AM',
            description: 'Quick energy boost',
            examples: ['Greek yogurt', 'Hard-boiled eggs', 'String cheese'],
            calories: 180,
            macros: { protein: 18, carbs: 15, fat: 6 },
          },
          {
            name: 'Lunch',
            time: '1:00 PM',
            description: 'Balanced lunch',
            examples: ['Turkey breast with wild rice', 'Tuna salad with whole grain bread', 'Grilled shrimp with couscous'],
            calories: 480,
            macros: { protein: 42, carbs: 48, fat: 10 },
          },
          {
            name: 'Afternoon Snack',
            time: '4:00 PM',
            description: 'Pre-workout fuel',
            examples: ['Orange with almonds', 'Protein smoothie', 'Whole grain crackers with hummus'],
            calories: 220,
            macros: { protein: 10, carbs: 30, fat: 7 },
          },
          {
            name: 'Dinner',
            time: '7:00 PM',
            description: 'Lean dinner',
            examples: ['Grilled chicken with roasted vegetables', 'Baked white fish with asparagus', 'Lean ground turkey tacos'],
            calories: 420,
            macros: { protein: 38, carbs: 42, fat: 10 },
          },
        ],
        totalCalories: 1650,
        macros: { protein: 138, carbs: 170, fat: 41 },
      },
      // Days 3-7 follow similar pattern
      {
        day: 'Wednesday',
        dayNumber: 3,
        meals: [
          { name: 'Breakfast', time: '7:00 AM', description: 'Start strong', examples: ['Oatmeal with berries and protein powder'], calories: 350, macros: { protein: 30, carbs: 35, fat: 8 } },
          { name: 'Mid-Morning Snack', time: '10:00 AM', description: 'Energy boost', examples: ['Apple with peanut butter'], calories: 200, macros: { protein: 12, carbs: 22, fat: 8 } },
          { name: 'Lunch', time: '1:00 PM', description: 'Protein lunch', examples: ['Chicken with brown rice and vegetables'], calories: 500, macros: { protein: 45, carbs: 50, fat: 10 } },
          { name: 'Afternoon Snack', time: '4:00 PM', description: 'Pre-workout', examples: ['Banana with almond butter'], calories: 250, macros: { protein: 12, carbs: 35, fat: 6 } },
          { name: 'Dinner', time: '7:00 PM', description: 'Evening meal', examples: ['Salmon with sweet potato'], calories: 450, macros: { protein: 40, carbs: 45, fat: 12 } },
        ],
        totalCalories: 1750,
        macros: { protein: 139, carbs: 187, fat: 44 },
      },
      {
        day: 'Thursday',
        dayNumber: 4,
        meals: [
          { name: 'Breakfast', time: '7:00 AM', description: 'Protein breakfast', examples: ['Eggs with toast'], calories: 350, macros: { protein: 30, carbs: 35, fat: 8 } },
          { name: 'Mid-Morning Snack', time: '10:00 AM', description: 'Snack', examples: ['Greek yogurt'], calories: 180, macros: { protein: 18, carbs: 15, fat: 6 } },
          { name: 'Lunch', time: '1:00 PM', description: 'Lunch', examples: ['Turkey with rice'], calories: 480, macros: { protein: 42, carbs: 48, fat: 10 } },
          { name: 'Afternoon Snack', time: '4:00 PM', description: 'Pre-workout', examples: ['Protein shake'], calories: 220, macros: { protein: 10, carbs: 30, fat: 7 } },
          { name: 'Dinner', time: '7:00 PM', description: 'Dinner', examples: ['Lean beef with vegetables'], calories: 420, macros: { protein: 38, carbs: 42, fat: 10 } },
        ],
        totalCalories: 1650,
        macros: { protein: 138, carbs: 170, fat: 41 },
      },
      {
        day: 'Friday',
        dayNumber: 5,
        meals: [
          { name: 'Breakfast', time: '7:00 AM', description: 'Breakfast', examples: ['Cottage cheese with fruit'], calories: 350, macros: { protein: 30, carbs: 35, fat: 8 } },
          { name: 'Mid-Morning Snack', time: '10:00 AM', description: 'Snack', examples: ['Nuts and berries'], calories: 200, macros: { protein: 12, carbs: 22, fat: 8 } },
          { name: 'Lunch', time: '1:00 PM', description: 'Lunch', examples: ['Grilled chicken with quinoa'], calories: 500, macros: { protein: 45, carbs: 50, fat: 10 } },
          { name: 'Afternoon Snack', time: '4:00 PM', description: 'Pre-workout', examples: ['Banana'], calories: 250, macros: { protein: 12, carbs: 35, fat: 6 } },
          { name: 'Dinner', time: '7:00 PM', description: 'Dinner', examples: ['Fish with vegetables'], calories: 450, macros: { protein: 40, carbs: 45, fat: 12 } },
        ],
        totalCalories: 1750,
        macros: { protein: 139, carbs: 187, fat: 44 },
      },
      {
        day: 'Saturday',
        dayNumber: 6,
        meals: [
          { name: 'Breakfast', time: '7:00 AM', description: 'Breakfast', examples: ['Protein pancakes'], calories: 350, macros: { protein: 30, carbs: 35, fat: 8 } },
          { name: 'Mid-Morning Snack', time: '10:00 AM', description: 'Snack', examples: ['Protein bar'], calories: 180, macros: { protein: 18, carbs: 15, fat: 6 } },
          { name: 'Lunch', time: '1:00 PM', description: 'Lunch', examples: ['Turkey wrap'], calories: 480, macros: { protein: 42, carbs: 48, fat: 10 } },
          { name: 'Afternoon Snack', time: '4:00 PM', description: 'Pre-workout', examples: ['Apple with almond butter'], calories: 220, macros: { protein: 10, carbs: 30, fat: 7 } },
          { name: 'Dinner', time: '7:00 PM', description: 'Dinner', examples: ['Chicken stir-fry'], calories: 420, macros: { protein: 38, carbs: 42, fat: 10 } },
        ],
        totalCalories: 1650,
        macros: { protein: 138, carbs: 170, fat: 41 },
      },
      {
        day: 'Sunday',
        dayNumber: 7,
        meals: [
          { name: 'Breakfast', time: '7:00 AM', description: 'Breakfast', examples: ['Oatmeal with berries'], calories: 350, macros: { protein: 30, carbs: 35, fat: 8 } },
          { name: 'Mid-Morning Snack', time: '10:00 AM', description: 'Snack', examples: ['Greek yogurt'], calories: 200, macros: { protein: 12, carbs: 22, fat: 8 } },
          { name: 'Lunch', time: '1:00 PM', description: 'Lunch', examples: ['Salmon with rice'], calories: 500, macros: { protein: 45, carbs: 50, fat: 10 } },
          { name: 'Afternoon Snack', time: '4:00 PM', description: 'Pre-workout', examples: ['Banana'], calories: 250, macros: { protein: 12, carbs: 35, fat: 6 } },
          { name: 'Dinner', time: '7:00 PM', description: 'Dinner', examples: ['Lean beef'], calories: 450, macros: { protein: 40, carbs: 45, fat: 12 } },
        ],
        totalCalories: 1750,
        macros: { protein: 139, carbs: 187, fat: 44 },
      },
    ],
    tips: [
      'Drink at least 3 liters of water daily',
      'Prepare meals in advance for consistency',
      'Choose lean protein sources',
      'Include plenty of vegetables for nutrients and satiety',
      'Adjust portions based on your weight and goals',
    ],
    foods: [
      {
        category: 'Proteins',
        icon: '🍗',
        items: ['Chicken breast', 'Turkey', 'Salmon', 'Cod', 'Lean beef', 'Eggs', 'Greek yogurt', 'Cottage cheese'],
        avoid: ['Fatty cuts', 'Processed meats', 'Full-fat dairy'],
      },
      {
        category: 'Carbs',
        icon: '🌾',
        items: ['Brown rice', 'Oats', 'Sweet potato', 'Quinoa', 'Whole wheat bread', 'Whole grain pasta'],
        avoid: ['White bread', 'Sugary cereals', 'Refined carbs'],
      },
      {
        category: 'Vegetables',
        icon: '🥦',
        items: ['Broccoli', 'Spinach', 'Asparagus', 'Bell peppers', 'Carrots', 'Zucchini'],
        avoid: ['Fried vegetables', 'Creamy sauces'],
      },
      {
        category: 'Fats',
        icon: '🥑',
        items: ['Olive oil', 'Almonds', 'Walnuts', 'Avocado', 'Chia seeds'],
        avoid: ['Saturated fats', 'Trans fats', 'Fried foods'],
      },
    ],
  },

  diet_gain_muscle_7day: {
    id: 'diet_gain_muscle_7day',
    name: 'Muscle Builder Protocol (7-Day)',
    goal: 'gain_muscle',
    sex: ['male', 'female'],
    description: 'A 7-day high-protein diet designed to support muscle growth. Focuses on caloric surplus with emphasis on protein intake.',
    tier: 'free',
    duration: 7,
    dailyCalories: (weight: number, goal: Goal) => Math.round(weight * 35 + 500),
    macros: { protein: 40, carbs: 45, fat: 15 },
    weeklyPlan: [
      {
        day: 'Monday',
        dayNumber: 1,
        meals: [
          { name: 'Breakfast', time: '7:00 AM', description: 'Protein-rich breakfast', examples: ['Eggs with oatmeal'], calories: 450, macros: { protein: 35, carbs: 50, fat: 12 } },
          { name: 'Mid-Morning Snack', time: '10:00 AM', description: 'Muscle-building snack', examples: ['Protein shake with banana'], calories: 300, macros: { protein: 25, carbs: 40, fat: 5 } },
          { name: 'Lunch', time: '1:00 PM', description: 'Protein and carbs', examples: ['Chicken with rice and vegetables'], calories: 650, macros: { protein: 55, carbs: 70, fat: 12 } },
          { name: 'Afternoon Snack', time: '4:00 PM', description: 'Pre-workout fuel', examples: ['Rice cakes with peanut butter'], calories: 350, macros: { protein: 15, carbs: 50, fat: 10 } },
          { name: 'Dinner', time: '7:00 PM', description: 'Recovery meal', examples: ['Salmon with sweet potato'], calories: 550, macros: { protein: 45, carbs: 60, fat: 15 } },
        ],
        totalCalories: 2300,
        macros: { protein: 175, carbs: 270, fat: 54 },
      },
      // Additional days follow similar pattern with high protein and caloric surplus
      {
        day: 'Tuesday',
        dayNumber: 2,
        meals: [
          { name: 'Breakfast', time: '7:00 AM', description: 'Breakfast', examples: ['Cottage cheese with granola'], calories: 450, macros: { protein: 35, carbs: 50, fat: 12 } },
          { name: 'Mid-Morning Snack', time: '10:00 AM', description: 'Snack', examples: ['Protein shake'], calories: 300, macros: { protein: 25, carbs: 40, fat: 5 } },
          { name: 'Lunch', time: '1:00 PM', description: 'Lunch', examples: ['Turkey with quinoa'], calories: 650, macros: { protein: 55, carbs: 70, fat: 12 } },
          { name: 'Afternoon Snack', time: '4:00 PM', description: 'Pre-workout', examples: ['Banana with almond butter'], calories: 350, macros: { protein: 15, carbs: 50, fat: 10 } },
          { name: 'Dinner', time: '7:00 PM', description: 'Dinner', examples: ['Beef with rice'], calories: 550, macros: { protein: 45, carbs: 60, fat: 15 } },
        ],
        totalCalories: 2300,
        macros: { protein: 175, carbs: 270, fat: 54 },
      },
      // Days 3-7 (abbreviated for brevity)
      { day: 'Wednesday', dayNumber: 3, meals: [], totalCalories: 2300, macros: { protein: 175, carbs: 270, fat: 54 } },
      { day: 'Thursday', dayNumber: 4, meals: [], totalCalories: 2300, macros: { protein: 175, carbs: 270, fat: 54 } },
      { day: 'Friday', dayNumber: 5, meals: [], totalCalories: 2300, macros: { protein: 175, carbs: 270, fat: 54 } },
      { day: 'Saturday', dayNumber: 6, meals: [], totalCalories: 2300, macros: { protein: 175, carbs: 270, fat: 54 } },
      { day: 'Sunday', dayNumber: 7, meals: [], totalCalories: 2300, macros: { protein: 175, carbs: 270, fat: 54 } },
    ],
    tips: [
      'Eat in a caloric surplus (300-500 calories above maintenance)',
      'Prioritize protein intake (1.6-2.2g per kg of body weight)',
      'Time carbs around workouts for energy and recovery',
      'Eat frequently to meet caloric goals',
      'Stay hydrated throughout the day',
    ],
    foods: [
      {
        category: 'Proteins',
        icon: '🍗',
        items: ['Chicken', 'Beef', 'Salmon', 'Eggs', 'Greek yogurt', 'Cottage cheese', 'Protein powder'],
        avoid: ['Lean-only cuts', 'Low-fat options'],
      },
      {
        category: 'Carbs',
        icon: '🌾',
        items: ['Rice', 'Oats', 'Pasta', 'Sweet potato', 'Bread', 'Quinoa', 'Potatoes'],
        avoid: ['Low-carb options'],
      },
      {
        category: 'Vegetables',
        icon: '🥦',
        items: ['Broccoli', 'Spinach', 'Carrots', 'Bell peppers', 'Asparagus'],
        avoid: [],
      },
      {
        category: 'Fats',
        icon: '🥑',
        items: ['Olive oil', 'Nuts', 'Avocado', 'Nut butters', 'Coconut oil'],
        avoid: [],
      },
    ],
  },

  diet_stay_slim_7day: {
    id: 'diet_stay_slim_7day',
    name: 'Maintenance Protocol (7-Day)',
    goal: 'stay_slim',
    sex: ['male', 'female'],
    description: 'A 7-day balanced diet to maintain your current weight and fitness level. Focuses on balanced macros and sustainable eating.',
    tier: 'free',
    duration: 7,
    dailyCalories: (weight: number, goal: Goal) => Math.round(weight * 30),
    macros: { protein: 30, carbs: 50, fat: 20 },
    weeklyPlan: [
      {
        day: 'Monday',
        dayNumber: 1,
        meals: [
          { name: 'Breakfast', time: '7:00 AM', description: 'Balanced breakfast', examples: ['Oatmeal with berries and nuts'], calories: 400, macros: { protein: 15, carbs: 50, fat: 12 } },
          { name: 'Mid-Morning Snack', time: '10:00 AM', description: 'Light snack', examples: ['Apple with almond butter'], calories: 200, macros: { protein: 8, carbs: 25, fat: 8 } },
          { name: 'Lunch', time: '1:00 PM', description: 'Balanced lunch', examples: ['Grilled chicken with brown rice'], calories: 550, macros: { protein: 40, carbs: 60, fat: 12 } },
          { name: 'Afternoon Snack', time: '4:00 PM', description: 'Snack', examples: ['Greek yogurt'], calories: 150, macros: { protein: 15, carbs: 15, fat: 3 } },
          { name: 'Dinner', time: '7:00 PM', description: 'Balanced dinner', examples: ['Salmon with vegetables'], calories: 500, macros: { protein: 35, carbs: 50, fat: 15 } },
        ],
        totalCalories: 1800,
        macros: { protein: 113, carbs: 200, fat: 50 },
      },
      // Days 2-7 follow similar pattern
      { day: 'Tuesday', dayNumber: 2, meals: [], totalCalories: 1800, macros: { protein: 113, carbs: 200, fat: 50 } },
      { day: 'Wednesday', dayNumber: 3, meals: [], totalCalories: 1800, macros: { protein: 113, carbs: 200, fat: 50 } },
      { day: 'Thursday', dayNumber: 4, meals: [], totalCalories: 1800, macros: { protein: 113, carbs: 200, fat: 50 } },
      { day: 'Friday', dayNumber: 5, meals: [], totalCalories: 1800, macros: { protein: 113, carbs: 200, fat: 50 } },
      { day: 'Saturday', dayNumber: 6, meals: [], totalCalories: 1800, macros: { protein: 113, carbs: 200, fat: 50 } },
      { day: 'Sunday', dayNumber: 7, meals: [], totalCalories: 1800, macros: { protein: 113, carbs: 200, fat: 50 } },
    ],
    tips: [
      'Eat at maintenance calories',
      'Balance all three macronutrients',
      'Include variety in your diet',
      'Stay consistent with meal timing',
      'Listen to your body and adjust as needed',
    ],
    foods: [
      {
        category: 'Proteins',
        icon: '🍗',
        items: ['Chicken', 'Fish', 'Eggs', 'Greek yogurt', 'Cottage cheese'],
        avoid: [],
      },
      {
        category: 'Carbs',
        icon: '🌾',
        items: ['Brown rice', 'Oats', 'Whole wheat bread', 'Sweet potato', 'Quinoa'],
        avoid: ['Refined carbs'],
      },
      {
        category: 'Vegetables',
        icon: '🥦',
        items: ['Broccoli', 'Spinach', 'Carrots', 'Bell peppers', 'Zucchini'],
        avoid: [],
      },
      {
        category: 'Fats',
        icon: '🥑',
        items: ['Olive oil', 'Nuts', 'Avocado', 'Seeds'],
        avoid: ['Excessive saturated fats'],
      },
    ],
  },
};

// ============================================================
// PREMIUM TIER: 30-DAY MEAL PLANS (Placeholder structure)
// ============================================================

export const thirtyDayMealPlans: Record<string, MealPlan> = {
  diet_lose_weight_30day: {
    id: 'diet_lose_weight_30day',
    name: 'Lean Fuel Protocol (30-Day Premium)',
    goal: 'lose_weight',
    sex: ['male', 'female'],
    description: 'A comprehensive 30-day meal plan with daily variety, macro cycling, and strategic refeed days for optimal fat loss while preserving muscle.',
    tier: 'premium',
    duration: 30,
    dailyCalories: (weight: number, goal: Goal) => Math.round(weight * 28 - 400),
    macros: { protein: 35, carbs: 40, fat: 25 },
    weeklyPlan: [], // Will be populated with 30 days of meals
    tips: [
      'Follow macro cycling for better adherence',
      'Include refeed days every 7-10 days',
      'Prepare meals in advance',
      'Track your progress weekly',
      'Adjust calories based on results',
    ],
    foods: [
      {
        category: 'Proteins',
        icon: '🍗',
        items: ['Chicken breast', 'Turkey', 'Salmon', 'Cod', 'Lean beef', 'Eggs', 'Greek yogurt'],
        avoid: ['Fatty cuts', 'Processed meats'],
      },
      {
        category: 'Carbs',
        icon: '🌾',
        items: ['Brown rice', 'Oats', 'Sweet potato', 'Quinoa', 'Whole wheat bread'],
        avoid: ['White bread', 'Sugary cereals'],
      },
      {
        category: 'Vegetables',
        icon: '🥦',
        items: ['Broccoli', 'Spinach', 'Asparagus', 'Bell peppers', 'Carrots'],
        avoid: ['Fried vegetables'],
      },
      {
        category: 'Fats',
        icon: '🥑',
        items: ['Olive oil', 'Almonds', 'Walnuts', 'Avocado', 'Chia seeds'],
        avoid: ['Saturated fats', 'Trans fats'],
      },
    ],
  },

  diet_gain_muscle_30day: {
    id: 'diet_gain_muscle_30day',
    name: 'Muscle Builder Protocol (30-Day Premium)',
    goal: 'gain_muscle',
    sex: ['male', 'female'],
    description: 'A comprehensive 30-day meal plan with progressive caloric increases, strategic carb timing, and muscle-building nutrition strategies.',
    tier: 'premium',
    duration: 30,
    dailyCalories: (weight: number, goal: Goal) => Math.round(weight * 35 + 500),
    macros: { protein: 40, carbs: 45, fat: 15 },
    weeklyPlan: [],
    tips: [
      'Eat in consistent caloric surplus',
      'Time carbs around workouts',
      'Prioritize protein at every meal',
      'Track strength gains',
      'Adjust calories every 2-3 weeks',
    ],
    foods: [
      {
        category: 'Proteins',
        icon: '🍗',
        items: ['Chicken', 'Beef', 'Salmon', 'Eggs', 'Greek yogurt', 'Cottage cheese', 'Protein powder'],
        avoid: [],
      },
      {
        category: 'Carbs',
        icon: '🌾',
        items: ['Rice', 'Oats', 'Pasta', 'Sweet potato', 'Bread', 'Quinoa', 'Potatoes'],
        avoid: [],
      },
      {
        category: 'Vegetables',
        icon: '🥦',
        items: ['Broccoli', 'Spinach', 'Carrots', 'Bell peppers', 'Asparagus'],
        avoid: [],
      },
      {
        category: 'Fats',
        icon: '🥑',
        items: ['Olive oil', 'Nuts', 'Avocado', 'Nut butters', 'Coconut oil'],
        avoid: [],
      },
    ],
  },

  diet_stay_slim_30day: {
    id: 'diet_stay_slim_30day',
    name: 'Maintenance Protocol (30-Day Premium)',
    goal: 'stay_slim',
    sex: ['male', 'female'],
    description: 'A comprehensive 30-day meal plan with daily variety and seasonal ingredients for sustainable long-term maintenance.',
    tier: 'premium',
    duration: 30,
    dailyCalories: (weight: number, goal: Goal) => Math.round(weight * 30),
    macros: { protein: 30, carbs: 50, fat: 20 },
    weeklyPlan: [],
    tips: [
      'Maintain consistent calorie intake',
      'Enjoy variety and flexibility',
      'Include your favorite foods in moderation',
      'Stay active and consistent',
      'Monitor your weight weekly',
    ],
    foods: [
      {
        category: 'Proteins',
        icon: '🍗',
        items: ['Chicken', 'Fish', 'Eggs', 'Greek yogurt', 'Cottage cheese'],
        avoid: [],
      },
      {
        category: 'Carbs',
        icon: '🌾',
        items: ['Brown rice', 'Oats', 'Whole wheat bread', 'Sweet potato', 'Quinoa'],
        avoid: ['Refined carbs'],
      },
      {
        category: 'Vegetables',
        icon: '🥦',
        items: ['Broccoli', 'Spinach', 'Carrots', 'Bell peppers', 'Zucchini'],
        avoid: [],
      },
      {
        category: 'Fats',
        icon: '🥑',
        items: ['Olive oil', 'Nuts', 'Avocado', 'Seeds'],
        avoid: ['Excessive saturated fats'],
      },
    ],
  },
};

// ============================================================
// MEAL PLAN HELPERS
// ============================================================

/**
 * Get meal plan by tier and goal
 */
export function getMealPlanByTierAndGoal(tier: MealPlanTier, goal: Goal): MealPlan | null {
  if (tier === 'free') {
    const planId = `diet_${goal}_7day`;
    return sevenDayMealPlans[planId] || null;
  } else {
    const planId = `diet_${goal}_30day`;
    return thirtyDayMealPlans[planId] || null;
  }
}

/**
 * Get all meal plans for a tier
 */
export function getMealPlansByTier(tier: MealPlanTier): MealPlan[] {
  if (tier === 'free') {
    return Object.values(sevenDayMealPlans);
  } else {
    return Object.values(thirtyDayMealPlans);
  }
}

/**
 * Calculate daily macros based on weight and goal
 */
export function calculateDailyMacros(
  weight: number,
  goal: Goal,
  mealPlan: MealPlan
): { protein: number; carbs: number; fat: number } {
  const dailyCalories = mealPlan.dailyCalories(weight, goal);
  const proteinCalories = dailyCalories * (mealPlan.macros.protein / 100);
  const carbCalories = dailyCalories * (mealPlan.macros.carbs / 100);
  const fatCalories = dailyCalories * (mealPlan.macros.fat / 100);

  return {
    protein: Math.round(proteinCalories / 4), // 4 calories per gram
    carbs: Math.round(carbCalories / 4),
    fat: Math.round(fatCalories / 9), // 9 calories per gram
  };
}

/**
 * Initialize meal plan progress tracking
 */
export function initializeMealPlanProgress(
  userId: string,
  mealPlanId: string,
  duration: number
): MealPlanProgress {
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + duration);

  return {
    userId,
    mealPlanId,
    currentDay: 1,
    mealsLogged: {},
    caloriesLogged: {},
    completionPercentage: 0,
    startDate,
    endDate,
  };
}

/**
 * Update meal plan progress
 */
export function updateMealPlanProgress(
  progress: MealPlanProgress,
  dayNumber: number,
  mealName: string,
  completed: boolean,
  calories: number
): MealPlanProgress {
  if (!progress.mealsLogged[dayNumber]) {
    progress.mealsLogged[dayNumber] = {};
  }

  progress.mealsLogged[dayNumber][mealName] = completed;
  progress.caloriesLogged[dayNumber] = (progress.caloriesLogged[dayNumber] || 0) + calories;

  // Calculate completion percentage
  const totalDays = Math.ceil(
    (progress.endDate.getTime() - progress.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const completedDays = Object.keys(progress.mealsLogged).length;
  progress.completionPercentage = Math.round((completedDays / totalDays) * 100);

  return progress;
}
