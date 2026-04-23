import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CoachMessage {
  id: string;
  type: 'motivation' | 'guidance' | 'form_tip' | 'encouragement' | 'achievement' | 'challenge';
  content: string;
  emoji: string;
  timestamp: Date;
  exerciseName?: string;
  impact?: 'high' | 'medium' | 'low';
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  category: 'streak' | 'xp' | 'workout' | 'consistency' | 'skill';
  requirement: number;
  currentProgress: number;
}

interface CoachContextType {
  dailyMessage: CoachMessage | null;
  achievements: AchievementBadge[];
  unlockedAchievements: AchievementBadge[];
  generatePreWorkoutMessage: (exerciseName: string, streak: number, level: number) => CoachMessage;
  generatePostWorkoutMessage: (workoutDuration: number, xpGained: number, streak: number) => CoachMessage;
  generateFormTip: (exerciseName: string) => CoachMessage;
  generateMotivationMessage: (context: 'morning' | 'evening' | 'struggle' | 'breakthrough') => CoachMessage;
  checkAchievements: (stats: { streak: number; totalXp: number; totalWorkouts: number; level: number }) => void;
  unlockAchievement: (achievementId: string) => void;
  getDailyChallenge: () => CoachMessage;
}

const CoachContext = createContext<CoachContextType | undefined>(undefined);

const ACHIEVEMENT_DEFINITIONS: AchievementBadge[] = [
  // Streak achievements
  {
    id: 'streak_3',
    name: '🔥 On Fire',
    description: '3-day workout streak',
    icon: '🔥',
    category: 'streak',
    requirement: 3,
    currentProgress: 0,
  },
  {
    id: 'streak_7',
    name: '🌟 Week Warrior',
    description: '7-day workout streak',
    icon: '⭐',
    category: 'streak',
    requirement: 7,
    currentProgress: 0,
  },
  {
    id: 'streak_30',
    name: '💪 Legend',
    description: '30-day workout streak',
    icon: '💪',
    category: 'streak',
    requirement: 30,
    currentProgress: 0,
  },
  // XP achievements
  {
    id: 'xp_500',
    name: '⚡ Rising Star',
    description: 'Earn 500 XP',
    icon: '⚡',
    category: 'xp',
    requirement: 500,
    currentProgress: 0,
  },
  {
    id: 'xp_2000',
    name: '🏆 XP Master',
    description: 'Earn 2000 XP',
    icon: '🏆',
    category: 'xp',
    requirement: 2000,
    currentProgress: 0,
  },
  // Workout achievements
  {
    id: 'workouts_10',
    name: '💯 Dedicated',
    description: 'Complete 10 workouts',
    icon: '💯',
    category: 'workout',
    requirement: 10,
    currentProgress: 0,
  },
  {
    id: 'workouts_50',
    name: '🎯 Unstoppable',
    description: 'Complete 50 workouts',
    icon: '🎯',
    category: 'workout',
    requirement: 50,
    currentProgress: 0,
  },
  // Level achievements
  {
    id: 'level_5',
    name: '🚀 Leveling Up',
    description: 'Reach Level 5',
    icon: '🚀',
    category: 'skill',
    requirement: 5,
    currentProgress: 0,
  },
  {
    id: 'level_10',
    name: '👑 Elite',
    description: 'Reach Level 10',
    icon: '👑',
    category: 'skill',
    requirement: 10,
    currentProgress: 0,
  },
];

const MOTIVATION_MESSAGES = {
  morning: [
    { content: 'Good morning, champion! 🌅 Today is your day to shine. Let\'s crush this workout!', emoji: '🌅' },
    { content: 'Rise and grind! 💪 Your future self will thank you for showing up today.', emoji: '💪' },
    { content: 'The early bird gets the gains! 🐦 Let\'s get to work!', emoji: '🐦' },
  ],
  evening: [
    { content: 'Evening grind time! 🌙 One more workout before you rest. You got this!', emoji: '🌙' },
    { content: 'Let\'s finish strong! 🔥 Your body is ready for this.', emoji: '🔥' },
    { content: 'Night mode activated! 🌟 Time to earn those gains.', emoji: '🌟' },
  ],
  struggle: [
    { content: 'I know it\'s tough, but you\'re tougher! 💪 Push through this set.', emoji: '💪' },
    { content: 'Every rep counts. You\'re building something amazing. Keep going! 🚀', emoji: '🚀' },
    { content: 'This is where champions are made. Don\'t quit now! 🏆', emoji: '🏆' },
  ],
  breakthrough: [
    { content: 'WOW! You just broke through! 🎉 This is what dedication looks like!', emoji: '🎉' },
    { content: 'You\'re leveling up! 🌟 Keep this momentum going!', emoji: '🌟' },
    { content: 'That\'s incredible! 🔥 You\'re becoming unstoppable!', emoji: '🔥' },
  ],
};

const FORM_TIPS = {
  'Push Up': 'Keep your core tight and body in a straight line. Lower until your chest nearly touches the ground.',
  'Diamond Push-Up': 'Form a diamond with your hands. Keep elbows close to your body for maximum chest activation.',
  'Pike Push-Up': 'Hips high, head down. This targets your shoulders more than regular push-ups.',
  'Dip': 'Lean slightly forward for chest activation. Control the descent and push through your palms.',
  'Pull Up': 'Full range of motion: dead hang to chin over bar. Engage your lats, not just your arms.',
  'Handstand Push-Up': 'Practice against a wall first. Keep your core engaged and body aligned.',
};

const DAILY_CHALLENGES = [
  { content: 'Today\'s Challenge: Complete your workout 10% faster than yesterday! ⚡', emoji: '⚡' },
  { content: 'Today\'s Challenge: Add 2 extra reps to each set! 💪', emoji: '💪' },
  { content: 'Today\'s Challenge: No rest between exercises! 🔥', emoji: '🔥' },
  { content: 'Today\'s Challenge: Perfect your form on every rep! 🎯', emoji: '🎯' },
];

export const CoachProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<AchievementBadge[]>(ACHIEVEMENT_DEFINITIONS);
  const [unlockedAchievements, setUnlockedAchievements] = useState<AchievementBadge[]>([]);
  const [dailyMessage, setDailyMessage] = useState<CoachMessage | null>(null);

  useEffect(() => {
    // Generate daily message on mount
    const hour = new Date().getHours();
    const context = hour < 12 ? 'morning' : 'evening';
    const message = generateMotivationMessage(context);
    setDailyMessage(message);
  }, []);

  const generatePreWorkoutMessage = (exerciseName: string, streak: number, level: number): CoachMessage => {
    const messages = [
      `Let's go! You're on a ${streak}-day streak! 🔥 Keep it alive!`,
      `You're level ${level} now! Time to show what you've got! 💪`,
      `${exerciseName} is next. You've trained for this. Let's do it! 🎯`,
      `This is your moment. Show me what you're made of! 🚀`,
    ];
    const content = messages[Math.floor(Math.random() * messages.length)];

    return {
      id: `pre_${Date.now()}`,
      type: 'motivation',
      content,
      emoji: '🔥',
      timestamp: new Date(),
      exerciseName,
      impact: 'high',
    };
  };

  const generatePostWorkoutMessage = (workoutDuration: number, xpGained: number, streak: number): CoachMessage => {
    const messages = [
      `Incredible! You just earned ${xpGained} XP! Your streak is now ${streak} days! 🔥`,
      `${workoutDuration} minutes of pure dedication! You're unstoppable! 💪`,
      `That was AMAZING! Keep this energy going tomorrow! 🌟`,
      `You just proved you're a champion! ${xpGained} XP earned! 🏆`,
    ];
    const content = messages[Math.floor(Math.random() * messages.length)];

    return {
      id: `post_${Date.now()}`,
      type: 'achievement',
      content,
      emoji: '🏆',
      timestamp: new Date(),
      impact: 'high',
    };
  };

  const generateFormTip = (exerciseName: string): CoachMessage => {
    const tip = FORM_TIPS[exerciseName as keyof typeof FORM_TIPS] || 'Focus on controlled movements and proper form!';

    return {
      id: `tip_${Date.now()}`,
      type: 'form_tip',
      content: `Form Tip: ${tip}`,
      emoji: '💡',
      timestamp: new Date(),
      exerciseName,
      impact: 'medium',
    };
  };

  const generateMotivationMessage = (context: 'morning' | 'evening' | 'struggle' | 'breakthrough'): CoachMessage => {
    const messages = MOTIVATION_MESSAGES[context];
    const selected = messages[Math.floor(Math.random() * messages.length)];

    return {
      id: `motivation_${Date.now()}`,
      type: 'motivation',
      content: selected.content,
      emoji: selected.emoji,
      timestamp: new Date(),
      impact: 'medium',
    };
  };

  const getDailyChallenge = (): CoachMessage => {
    const challenge = DAILY_CHALLENGES[Math.floor(Math.random() * DAILY_CHALLENGES.length)];

    return {
      id: `challenge_${Date.now()}`,
      type: 'challenge',
      content: challenge.content,
      emoji: challenge.emoji,
      timestamp: new Date(),
      impact: 'high',
    };
  };

  const checkAchievements = (stats: { streak: number; totalXp: number; totalWorkouts: number; level: number }) => {
    const newUnlocked: AchievementBadge[] = [];

    achievements.forEach(achievement => {
      const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
      if (isUnlocked) return;

      let currentProgress = 0;
      let shouldUnlock = false;

      if (achievement.category === 'streak') {
        currentProgress = stats.streak;
        shouldUnlock = stats.streak >= achievement.requirement;
      } else if (achievement.category === 'xp') {
        currentProgress = stats.totalXp;
        shouldUnlock = stats.totalXp >= achievement.requirement;
      } else if (achievement.category === 'workout') {
        currentProgress = stats.totalWorkouts;
        shouldUnlock = stats.totalWorkouts >= achievement.requirement;
      } else if (achievement.category === 'skill') {
        currentProgress = stats.level;
        shouldUnlock = stats.level >= achievement.requirement;
      }

      if (shouldUnlock) {
        newUnlocked.push({
          ...achievement,
          currentProgress,
          unlockedAt: new Date(),
        });
      }
    });

    if (newUnlocked.length > 0) {
      setUnlockedAchievements([...unlockedAchievements, ...newUnlocked]);
    }
  };

  const unlockAchievement = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !unlockedAchievements.find(a => a.id === achievementId)) {
      setUnlockedAchievements([
        ...unlockedAchievements,
        { ...achievement, unlockedAt: new Date() },
      ]);
    }
  };

  return (
    <CoachContext.Provider
      value={{
        dailyMessage,
        achievements,
        unlockedAchievements,
        generatePreWorkoutMessage,
        generatePostWorkoutMessage,
        generateFormTip,
        generateMotivationMessage,
        checkAchievements,
        unlockAchievement,
        getDailyChallenge,
      }}
    >
      {children}
    </CoachContext.Provider>
  );
};

export const useCoach = () => {
  const context = useContext(CoachContext);
  if (!context) {
    throw new Error('useCoach must be used within CoachProvider');
  }
  return context;
};
