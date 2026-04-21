// ============================================================
// CallistheniX – Analytics & Event Tracking
// Tracks user behavior for optimization and monetization
// ============================================================

export type EventCategory = 'user' | 'workout' | 'progression' | 'social' | 'monetization' | 'engagement' | 'technical';

export interface AnalyticsEvent {
  eventId: string;
  userId: string;
  category: EventCategory;
  eventName: string;
  timestamp: Date;
  properties: Record<string, any>;
  sessionId: string;
}

export interface UserSession {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  osType: string;
  appVersion: string;
  events: AnalyticsEvent[];
}

export interface AnalyticsMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  sessionCount: number;
  averageSessionDuration: number;
  conversionRate: number;
  churnRate: number;
  ltv: number; // Lifetime Value
  arpu: number; // Average Revenue Per User
}

// ============================================================
// Event Types
// ============================================================

export const EVENT_TYPES = {
  // User Events
  USER_SIGNUP: 'user_signup',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_PROFILE_COMPLETE: 'user_profile_complete',
  USER_GOAL_SET: 'user_goal_set',

  // Workout Events
  WORKOUT_START: 'workout_start',
  WORKOUT_COMPLETE: 'workout_complete',
  WORKOUT_SKIP: 'workout_skip',
  EXERCISE_COMPLETE: 'exercise_complete',
  EXERCISE_FAIL: 'exercise_fail',

  // Progression Events
  PROGRESSION_LEVEL_UP: 'progression_level_up',
  PROGRESSION_DELOAD: 'progression_deload',
  PROGRESSION_PLATEAU: 'progression_plateau',
  SKILL_STEP_COMPLETE: 'skill_step_complete',
  SKILL_PATH_START: 'skill_path_start',
  SKILL_PATH_COMPLETE: 'skill_path_complete',

  // Gamification Events
  STREAK_MILESTONE: 'streak_milestone',
  LEVEL_UP: 'level_up',
  CHALLENGE_START: 'challenge_start',
  CHALLENGE_COMPLETE: 'challenge_complete',
  UNLOCKABLE_EARNED: 'unlockable_earned',

  // Social Events
  PROGRESS_SHARED: 'progress_shared',
  FRIEND_ADDED: 'friend_added',
  CHALLENGE_SENT: 'challenge_sent',
  LEADERBOARD_VIEWED: 'leaderboard_viewed',

  // Monetization Events
  PAYWALL_SHOWN: 'paywall_shown',
  PAYWALL_DISMISSED: 'paywall_dismissed',
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_CANCELED: 'subscription_canceled',
  SUBSCRIPTION_RENEWED: 'subscription_renewed',
  TRIAL_STARTED: 'trial_started',
  TRIAL_CONVERTED: 'trial_converted',
  TRIAL_EXPIRED: 'trial_expired',

  // Engagement Events
  FEATURE_USED: 'feature_used',
  NOTIFICATION_RECEIVED: 'notification_received',
  NOTIFICATION_CLICKED: 'notification_clicked',
  COACH_RECOMMENDATION_SHOWN: 'coach_recommendation_shown',
  COACH_RECOMMENDATION_ACTED: 'coach_recommendation_acted',

  // Technical Events
  ERROR_OCCURRED: 'error_occurred',
  PERFORMANCE_ISSUE: 'performance_issue',
  OFFLINE_MODE_ENABLED: 'offline_mode_enabled',
};

// ============================================================
// Analytics Service
// ============================================================

export class AnalyticsService {
  private static events: AnalyticsEvent[] = [];
  private static currentSession: UserSession | null = null;
  private static userId: string | null = null;
  private static sessionId: string = this.generateSessionId();
  private static batchSize = 10;
  private static batchTimeout = 30000; // 30 seconds
  private static batchTimer: NodeJS.Timeout | null = null;

  /**
   * Initialize analytics service
   */
  static initialize(userId: string, appVersion: string): void {
    this.userId = userId;
    this.currentSession = {
      sessionId: this.sessionId,
      userId,
      startTime: new Date(),
      deviceType: this.getDeviceType(),
      osType: this.getOSType(),
      appVersion,
      events: [],
    };

    // Track session start
    this.trackEvent('user', EVENT_TYPES.USER_LOGIN, {
      deviceType: this.currentSession.deviceType,
      osType: this.currentSession.osType,
    });

    // Setup batch sending
    this.setupBatchSending();

    // Track page visibility
    this.setupPageVisibilityTracking();
  }

  /**
   * Track event
   */
  static trackEvent(
    category: EventCategory,
    eventName: string,
    properties: Record<string, any> = {}
  ): void {
    if (!this.userId || !this.currentSession) {
      console.warn('Analytics not initialized');
      return;
    }

    const event: AnalyticsEvent = {
      eventId: this.generateEventId(),
      userId: this.userId,
      category,
      eventName,
      timestamp: new Date(),
      properties,
      sessionId: this.sessionId,
    };

    this.events.push(event);
    this.currentSession.events.push(event);

    // Send batch if threshold reached
    if (this.events.length >= this.batchSize) {
      this.sendBatch();
    }
  }

  /**
   * Track workout completion
   */
  static trackWorkoutComplete(
    exerciseCount: number,
    duration: number,
    caloriesBurned: number,
    difficulty: string
  ): void {
    this.trackEvent('workout', EVENT_TYPES.WORKOUT_COMPLETE, {
      exerciseCount,
      duration,
      caloriesBurned,
      difficulty,
    });
  }

  /**
   * Track progression
   */
  static trackProgression(
    exerciseName: string,
    oldLevel: number,
    newLevel: number,
    progressionType: string
  ): void {
    this.trackEvent('progression', EVENT_TYPES.PROGRESSION_LEVEL_UP, {
      exerciseName,
      oldLevel,
      newLevel,
      progressionType,
    });
  }

  /**
   * Track skill completion
   */
  static trackSkillComplete(skillName: string, daysToCompletion: number): void {
    this.trackEvent('progression', EVENT_TYPES.SKILL_PATH_COMPLETE, {
      skillName,
      daysToCompletion,
    });
  }

  /**
   * Track level up
   */
  static trackLevelUp(level: number, totalXP: number): void {
    this.trackEvent('engagement', EVENT_TYPES.LEVEL_UP, {
      level,
      totalXP,
    });
  }

  /**
   * Track streak milestone
   */
  static trackStreakMilestone(streak: number): void {
    this.trackEvent('engagement', EVENT_TYPES.STREAK_MILESTONE, {
      streak,
    });
  }

  /**
   * Track paywall shown
   */
  static trackPaywallShown(feature: string, reason: string): void {
    this.trackEvent('monetization', EVENT_TYPES.PAYWALL_SHOWN, {
      feature,
      reason,
    });
  }

  /**
   * Track subscription started
   */
  static trackSubscriptionStarted(plan: 'monthly' | 'yearly', price: number): void {
    this.trackEvent('monetization', EVENT_TYPES.SUBSCRIPTION_STARTED, {
      plan,
      price,
    });
  }

  /**
   * Track subscription canceled
   */
  static trackSubscriptionCanceled(plan: string, reason: string): void {
    this.trackEvent('monetization', EVENT_TYPES.SUBSCRIPTION_CANCELED, {
      plan,
      reason,
    });
  }

  /**
   * Track feature usage
   */
  static trackFeatureUsed(featureName: string, isPremium: boolean): void {
    this.trackEvent('engagement', EVENT_TYPES.FEATURE_USED, {
      featureName,
      isPremium,
    });
  }

  /**
   * Track error
   */
  static trackError(errorMessage: string, errorStack?: string, context?: string): void {
    this.trackEvent('technical', EVENT_TYPES.ERROR_OCCURRED, {
      errorMessage,
      errorStack,
      context,
    });
  }

  /**
   * Send batch of events
   */
  private static async sendBatch(): Promise<void> {
    if (this.events.length === 0) return;

    const batch = this.events.splice(0, this.batchSize);

    try {
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: batch }),
      });

      if (!response.ok) {
        // Re-add events to queue if send failed
        this.events.unshift(...batch);
        console.error('Failed to send analytics batch');
      }
    } catch (error) {
      // Re-add events to queue if send failed
      this.events.unshift(...batch);
      console.error('Analytics send error:', error);
    }
  }

  /**
   * Setup batch sending with timer
   */
  private static setupBatchSending(): void {
    this.batchTimer = setInterval(() => {
      if (this.events.length > 0) {
        this.sendBatch();
      }
    }, this.batchTimeout);
  }

  /**
   * Setup page visibility tracking
   */
  private static setupPageVisibilityTracking(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // App backgrounded
        this.trackEvent('technical', 'app_backgrounded', {});
      } else {
        // App foregrounded
        this.trackEvent('technical', 'app_foregrounded', {});
      }
    });
  }

  /**
   * End session
   */
  static endSession(): void {
    if (this.currentSession) {
      this.currentSession.endTime = new Date();

      // Send remaining events
      this.sendBatch();

      // Send session data
      this.sendSessionData(this.currentSession);

      // Clear batch timer
      if (this.batchTimer) {
        clearInterval(this.batchTimer);
      }
    }
  }

  /**
   * Send session data
   */
  private static async sendSessionData(session: UserSession): Promise<void> {
    try {
      await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      });
    } catch (error) {
      console.error('Failed to send session data:', error);
    }
  }

  /**
   * Get device type
   */
  private static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const ua = navigator.userAgent;
    if (/mobile|android/i.test(ua)) return 'mobile';
    if (/tablet|ipad/i.test(ua)) return 'tablet';
    return 'desktop';
  }

  /**
   * Get OS type
   */
  private static getOSType(): string {
    const ua = navigator.userAgent;
    if (/windows/i.test(ua)) return 'Windows';
    if (/macintosh/i.test(ua)) return 'macOS';
    if (/linux/i.test(ua)) return 'Linux';
    if (/android/i.test(ua)) return 'Android';
    if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
    return 'Unknown';
  }

  /**
   * Generate session ID
   */
  private static generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate event ID
   */
  private static generateEventId(): string {
    return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current session ID
   */
  static getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Get events count
   */
  static getEventsCount(): number {
    return this.events.length;
  }

  /**
   * Force send all pending events
   */
  static async flushEvents(): Promise<void> {
    while (this.events.length > 0) {
      await this.sendBatch();
    }
  }
}

// ============================================================
// Analytics Utilities
// ============================================================

export function getConversionRate(conversions: number, impressions: number): number {
  if (impressions === 0) return 0;
  return (conversions / impressions) * 100;
}

export function calculateLTV(arpu: number, monthlyRetention: number, months: number = 12): number {
  let ltv = 0;
  for (let i = 0; i < months; i++) {
    ltv += arpu * Math.pow(monthlyRetention, i);
  }
  return ltv;
}

export function calculateChurn(activeUsers: number, previousActiveUsers: number): number {
  if (previousActiveUsers === 0) return 0;
  const churnedUsers = previousActiveUsers - activeUsers;
  return (churnedUsers / previousActiveUsers) * 100;
}
