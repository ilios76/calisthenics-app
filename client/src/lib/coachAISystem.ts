// ============================================================
// CallistheniX – Coach AI System
// Rule-based intelligent recommendations and guidance
// ============================================================

export type RecommendationType = 'motivation' | 'warning' | 'suggestion' | 'celebration' | 'recovery';
export type RecommendationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface CoachRecommendation {
  id: string;
  type: RecommendationType;
  priority: RecommendationPriority;
  title: string;
  message: string;
  action?: string; // "start_light_workout", "take_rest_day", etc.
  actionLabel?: string;
  timestamp: Date;
  read: boolean;
}

export interface CoachContext {
  userId: string;
  currentStreak: number; // consecutive days
  totalWorkouts: number;
  recentPerformance: number[]; // last 7 days performance %
  plateauDays: number;
  lastWorkoutDate: Date;
  lastRestDay: Date;
  averageRecoveryTime: number; // hours
  currentLevel: number;
  goalType: 'lose_weight' | 'gain_muscle' | 'stay_slim';
  skillPathsInProgress: string[]; // skill IDs
  totalXP: number;
  level: number;
}

// ============================================================
// Coach Rules Engine
// ============================================================

export class CoachAIEngine {
  /**
   * Generate recommendations based on user context
   */
  static generateRecommendations(context: CoachContext): CoachRecommendation[] {
    const recommendations: CoachRecommendation[] = [];

    // Rule 1: Performance Decline Warning
    const performanceWarning = this.checkPerformanceDecline(context);
    if (performanceWarning) recommendations.push(performanceWarning);

    // Rule 2: Plateau Breakthrough
    const plateauSuggestion = this.checkPlateau(context);
    if (plateauSuggestion) recommendations.push(plateauSuggestion);

    // Rule 3: Streak Celebration
    const streakCelebration = this.checkStreakMilestone(context);
    if (streakCelebration) recommendations.push(streakCelebration);

    // Rule 4: Recovery Suggestion
    const recoverySuggestion = this.checkRecoveryNeeded(context);
    if (recoverySuggestion) recommendations.push(recoverySuggestion);

    // Rule 5: Motivation Boost
    const motivationBoost = this.checkMotivationNeeded(context);
    if (motivationBoost) recommendations.push(motivationBoost);

    // Rule 6: Goal Alignment
    const goalAlignment = this.checkGoalAlignment(context);
    if (goalAlignment) recommendations.push(goalAlignment);

    // Rule 7: Skill Path Encouragement
    const skillEncouragement = this.checkSkillPathProgress(context);
    if (skillEncouragement) recommendations.push(skillEncouragement);

    // Rule 8: Recovery Time Warning
    const recoveryWarning = this.checkRecoveryTime(context);
    if (recoveryWarning) recommendations.push(recoveryWarning);

    return recommendations;
  }

  /**
   * Rule 1: Performance Decline Warning
   * IF: Last 3 workouts < 80% of target
   * THEN: "You seem tired. How about a lighter session today?"
   */
  private static checkPerformanceDecline(context: CoachContext): CoachRecommendation | null {
    if (context.recentPerformance.length < 3) return null;

    const lastThree = context.recentPerformance.slice(-3);
    const allBelow80 = lastThree.every(perf => perf < 80);

    if (allBelow80) {
      return {
        id: `perf-decline-${Date.now()}`,
        type: 'warning',
        priority: 'high',
        title: 'Performance Decline Detected',
        message: 'You seem tired lately. Your last 3 workouts were below 80% of your target. How about a lighter session today? Your body might need some recovery.',
        action: 'start_light_workout',
        actionLabel: 'Start Light Workout',
        timestamp: new Date(),
        read: false,
      };
    }

    return null;
  }

  /**
   * Rule 2: Plateau Breakthrough
   * IF: No progression for 14 days
   * THEN: "Let's try a different variation to break through!"
   */
  private static checkPlateau(context: CoachContext): CoachRecommendation | null {
    if (context.plateauDays >= 14) {
      return {
        id: `plateau-${Date.now()}`,
        type: 'suggestion',
        priority: 'medium',
        title: 'Break Through Your Plateau',
        message: `You've been at the same level for ${context.plateauDays} days. Let's try a different variation or increase the difficulty to break through this plateau!`,
        action: 'suggest_variation',
        actionLabel: 'View Variations',
        timestamp: new Date(),
        read: false,
      };
    }

    return null;
  }

  /**
   * Rule 3: Streak Celebration
   * IF: Streak >= 7 days
   * THEN: "🔥 Amazing! 7-day streak! Keep it up!"
   */
  private static checkStreakMilestone(context: CoachContext): CoachRecommendation | null {
    const milestones = [7, 14, 30, 60, 100];

    if (milestones.includes(context.currentStreak)) {
      const emoji = this.getStreakEmoji(context.currentStreak);
      return {
        id: `streak-${context.currentStreak}-${Date.now()}`,
        type: 'celebration',
        priority: 'low',
        title: `${emoji} ${context.currentStreak}-Day Streak!`,
        message: `Incredible! You've maintained a ${context.currentStreak}-day workout streak! This consistency is exactly what builds strength and habits. Keep this momentum going!`,
        timestamp: new Date(),
        read: false,
      };
    }

    return null;
  }

  /**
   * Rule 4: Recovery Suggestion
   * IF: Streak >= 20 days AND performance declining
   * THEN: "You've been grinding hard. Take a deload week (60% volume)"
   */
  private static checkRecoveryNeeded(context: CoachContext): CoachRecommendation | null {
    if (context.currentStreak >= 20 && context.recentPerformance.length > 0) {
      const avgPerformance = context.recentPerformance.reduce((a, b) => a + b, 0) / context.recentPerformance.length;

      if (avgPerformance < 85) {
        return {
          id: `recovery-${Date.now()}`,
          type: 'recovery',
          priority: 'high',
          title: 'Time for a Deload Week',
          message: `You've been training hard for ${context.currentStreak} days and your performance is declining. Your body needs recovery. Consider a deload week with 60% of your normal volume. This will help you come back stronger!`,
          action: 'suggest_deload_week',
          actionLabel: 'Start Deload Week',
          timestamp: new Date(),
          read: false,
        };
      }
    }

    return null;
  }

  /**
   * Rule 5: Motivation Boost
   * IF: Streak == 0 AND last_workout > 3 days ago
   * THEN: "Let's get back on track! Start with a light session"
   */
  private static checkMotivationNeeded(context: CoachContext): CoachRecommendation | null {
    const daysSinceLastWorkout = Math.floor(
      (Date.now() - context.lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (context.currentStreak === 0 && daysSinceLastWorkout > 3) {
      return {
        id: `motivation-${Date.now()}`,
        type: 'motivation',
        priority: 'medium',
        title: 'Let\'s Get Back on Track',
        message: `It's been ${daysSinceLastWorkout} days since your last workout. Don't worry, it happens! Let's ease back in with a light session. You'll feel great after!`,
        action: 'start_comeback_workout',
        actionLabel: 'Start Comeback Workout',
        timestamp: new Date(),
        read: false,
      };
    }

    return null;
  }

  /**
   * Rule 6: Goal Alignment
   * IF: Goal == "lose_weight" AND completed_workout == true
   * THEN: "Great! Keep this up for consistent results"
   */
  private static checkGoalAlignment(context: CoachContext): CoachRecommendation | null {
    const daysSinceLastWorkout = Math.floor(
      (Date.now() - context.lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastWorkout === 0) { // Completed workout today
      const goalMessages: Record<string, string> = {
        'lose_weight': 'Great workout! Keep this consistency up and you\'ll see amazing fat loss results. Remember: consistency beats intensity!',
        'gain_muscle': 'Excellent work! Progressive overload + consistency = muscle gains. You\'re on the right track!',
        'stay_slim': 'Perfect! You\'re maintaining your fitness level. Keep up this sustainable routine!',
      };

      return {
        id: `goal-align-${Date.now()}`,
        type: 'motivation',
        priority: 'low',
        title: 'You\'re Crushing Your Goal',
        message: goalMessages[context.goalType] || 'Great workout!',
        timestamp: new Date(),
        read: false,
      };
    }

    return null;
  }

  /**
   * Rule 7: Skill Path Encouragement
   * IF: User on skill path AND completed_step == true
   * THEN: "Step {X} complete! {Y} steps remaining to mastery"
   */
  private static checkSkillPathProgress(context: CoachContext): CoachRecommendation | null {
    if (context.skillPathsInProgress.length > 0) {
      const skillCount = context.skillPathsInProgress.length;
      return {
        id: `skill-path-${Date.now()}`,
        type: 'motivation',
        priority: 'low',
        title: 'You\'re Mastering Advanced Skills',
        message: `You're working on ${skillCount} advanced skill path${skillCount > 1 ? 's' : ''}! This is where the magic happens. Keep progressing and you'll unlock incredible abilities!`,
        timestamp: new Date(),
        read: false,
      };
    }

    return null;
  }

  /**
   * Rule 8: Recovery Time Warning
   * IF: Average recovery time < 24 hours AND streak > 10
   * THEN: "Your body needs more rest. Consider 48-hour recovery"
   */
  private static checkRecoveryTime(context: CoachContext): CoachRecommendation | null {
    if (context.averageRecoveryTime < 24 && context.currentStreak > 10) {
      return {
        id: `recovery-time-${Date.now()}`,
        type: 'warning',
        priority: 'high',
        title: 'Increase Recovery Time',
        message: `Your average recovery time is only ${context.averageRecoveryTime} hours. With a ${context.currentStreak}-day streak, your body needs more rest. Consider taking 48 hours between intense sessions.`,
        action: 'suggest_extended_rest',
        actionLabel: 'Schedule Rest Day',
        timestamp: new Date(),
        read: false,
      };
    }

    return null;
  }

  /**
   * Get emoji for streak milestone
   */
  private static getStreakEmoji(streak: number): string {
    if (streak >= 100) return '🔥🔥🔥';
    if (streak >= 60) return '🔥🔥';
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '💪';
    return '✅';
  }

  /**
   * Get personalized daily tip
   */
  static getDailyTip(context: CoachContext): string {
    const tips = [
      'Progressive overload is key: gradually increase reps, sets, or difficulty.',
      'Rest days are when your muscles grow. Don\'t skip them!',
      'Form over ego: perfect form beats sloppy reps every time.',
      'Consistency beats intensity. Show up regularly, even for light sessions.',
      'Track your workouts. What gets measured gets managed.',
      'Eat enough protein to support your training goals.',
      'Sleep is when your body recovers and adapts. Aim for 7-9 hours.',
      'Warm up properly before intense training to prevent injury.',
      'Stretch and foam roll after workouts for better recovery.',
      'Listen to your body. Pain is a signal, not weakness.',
    ];

    const index = Math.floor(Math.random() * tips.length);
    return tips[index];
  }

  /**
   * Get next milestone for user
   */
  static getNextMilestone(context: CoachContext): {
    type: string;
    target: number;
    current: number;
    label: string;
  } {
    const streakMilestones = [7, 14, 30, 60, 100];
    const nextStreakMilestone = streakMilestones.find(m => m > context.currentStreak) || 100;

    const xpMilestones = [500, 1500, 3500, 7000];
    const nextXPMilestone = xpMilestones.find(m => m > context.totalXP) || 7000;

    const levelMilestones = [2, 3, 4, 5];
    const nextLevelMilestone = levelMilestones.find(m => m > context.level) || 5;

    // Determine which milestone is closest
    const streakProgress = nextStreakMilestone - context.currentStreak;
    const xpProgress = nextXPMilestone - context.totalXP;
    const levelProgress = nextLevelMilestone - context.level;

    if (streakProgress <= xpProgress && streakProgress <= levelProgress) {
      return {
        type: 'streak',
        target: nextStreakMilestone,
        current: context.currentStreak,
        label: `${nextStreakMilestone}-Day Streak`,
      };
    } else if (xpProgress <= levelProgress) {
      return {
        type: 'xp',
        target: nextXPMilestone,
        current: context.totalXP,
        label: `Level ${nextLevelMilestone}`,
      };
    } else {
      return {
        type: 'level',
        target: nextLevelMilestone,
        current: context.level,
        label: `Level ${nextLevelMilestone}`,
      };
    }
  }

  /**
   * Get personalized message based on performance
   */
  static getPerformanceMessage(performancePercent: number): string {
    if (performancePercent >= 120) return '🚀 Absolutely crushing it!';
    if (performancePercent >= 110) return '💪 Excellent work!';
    if (performancePercent >= 100) return '✅ Perfect execution!';
    if (performancePercent >= 90) return '👍 Good effort!';
    if (performancePercent >= 80) return '💯 Keep pushing!';
    if (performancePercent >= 70) return '🎯 You\'re getting there!';
    return '⚡ Don\'t give up!';
  }
}

// ============================================================
// Recommendation Manager
// ============================================================

export class RecommendationManager {
  private recommendations: CoachRecommendation[] = [];

  /**
   * Add recommendation
   */
  addRecommendation(rec: CoachRecommendation): void {
    this.recommendations.push(rec);
  }

  /**
   * Get unread recommendations
   */
  getUnreadRecommendations(): CoachRecommendation[] {
    return this.recommendations.filter(rec => !rec.read);
  }

  /**
   * Get recommendations by priority
   */
  getByPriority(priority: RecommendationPriority): CoachRecommendation[] {
    return this.recommendations.filter(rec => rec.priority === priority);
  }

  /**
   * Get recommendations by type
   */
  getByType(type: RecommendationType): CoachRecommendation[] {
    return this.recommendations.filter(rec => rec.type === type);
  }

  /**
   * Mark recommendation as read
   */
  markAsRead(id: string): void {
    const rec = this.recommendations.find(r => r.id === id);
    if (rec) rec.read = true;
  }

  /**
   * Clear old recommendations (older than 7 days)
   */
  clearOldRecommendations(): void {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.recommendations = this.recommendations.filter(rec => rec.timestamp > sevenDaysAgo);
  }

  /**
   * Get all recommendations
   */
  getAll(): CoachRecommendation[] {
    return this.recommendations;
  }
}
