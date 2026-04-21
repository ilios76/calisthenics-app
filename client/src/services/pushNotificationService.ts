// ============================================================
// CallistheniX – Push Notification System
// Handles workout reminders, streak milestones, and coach recommendations
// ============================================================

export type NotificationType = 
  | 'workout_reminder'
  | 'streak_milestone'
  | 'coach_recommendation'
  | 'daily_engagement'
  | 'achievement_unlocked'
  | 'friend_challenge'
  | 'leaderboard_update'
  | 'trial_expiring'
  | 'subscription_renewal';

export interface PushNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag: string;
  data: Record<string, any>;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface NotificationPreferences {
  userId: string;
  workoutReminders: {
    enabled: boolean;
    time: string; // HH:mm format
    frequency: 'daily' | 'every_other_day' | 'weekly';
  };
  streakMilestones: {
    enabled: boolean;
    notify: boolean[];
  };
  coachRecommendations: {
    enabled: boolean;
    frequency: 'daily' | 'every_other_day' | 'weekly';
  };
  dailyEngagement: {
    enabled: boolean;
    time: string;
  };
  achievements: {
    enabled: boolean;
  };
  social: {
    enabled: boolean;
    friendChallenges: boolean;
    leaderboardUpdates: boolean;
  };
  quiet_hours: {
    enabled: boolean;
    start: string; // HH:mm
    end: string;   // HH:mm
  };
}

export interface NotificationSchedule {
  id: string;
  userId: string;
  type: NotificationType;
  scheduledTime: Date;
  sent: boolean;
  sentTime?: Date;
  data: Record<string, any>;
}

// ============================================================
// Notification Templates
// ============================================================

export const NOTIFICATION_TEMPLATES = {
  workout_reminder: {
    title: '💪 Time to Train!',
    body: 'Your {exercise} workout is ready. Let\'s crush it!',
    icon: '💪',
  },
  streak_milestone: {
    title: '🔥 Streak Milestone!',
    body: 'Amazing! You\'ve hit {streak} day streak! Keep going!',
    icon: '🔥',
  },
  coach_recommendation: {
    title: '🤖 Coach Tip',
    body: '{recommendation}',
    icon: '🤖',
  },
  daily_engagement: {
    title: '✨ Daily Challenge',
    body: 'Complete today\'s workout to earn {xp} XP',
    icon: '✨',
  },
  achievement_unlocked: {
    title: '🏆 Achievement Unlocked!',
    body: 'You\'ve unlocked: {achievement}',
    icon: '🏆',
  },
  friend_challenge: {
    title: '⚡ Friend Challenge',
    body: '{friend} challenged you to {challenge}',
    icon: '⚡',
  },
  leaderboard_update: {
    title: '📊 Leaderboard Update',
    body: 'You\'re now #{rank} on the leaderboard!',
    icon: '📊',
  },
  trial_expiring: {
    title: '⏰ Trial Ending Soon',
    body: 'Your trial ends in {days} days. Upgrade to Pro!',
    icon: '⏰',
  },
  subscription_renewal: {
    title: '✅ Subscription Renewed',
    body: 'Your Pro subscription has been renewed. Thanks!',
    icon: '✅',
  },
};

// ============================================================
// Push Notification Service
// ============================================================

export class PushNotificationService {
  private static registration: ServiceWorkerRegistration | null = null;
  private static userId: string | null = null;
  private static preferences: NotificationPreferences | null = null;

  /**
   * Initialize push notifications
   */
  static async initialize(userId: string): Promise<void> {
    this.userId = userId;

    // Check browser support
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      console.warn('Push notifications not supported');
      return;
    }

    // Request permission
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return;
      }
    }

    // Register service worker
    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');

      // Subscribe to push
      await this.subscribeToPush();
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }

    // Load preferences
    await this.loadPreferences();
  }

  /**
   * Subscribe to push notifications
   */
  private static async subscribeToPush(): Promise<void> {
    if (!this.registration) return;

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY
        ),
      });

      // Send subscription to backend
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.userId,
          subscription: subscription.toJSON(),
        }),
      });

      console.log('Subscribed to push notifications');
    } catch (error) {
      console.error('Push subscription failed:', error);
    }
  }

  /**
   * Load user preferences
   */
  private static async loadPreferences(): Promise<void> {
    try {
      const response = await fetch(`/api/notifications/preferences/${this.userId}`);
      if (response.ok) {
        this.preferences = await response.json();
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }

  /**
   * Send local notification (for testing)
   */
  static async sendLocalNotification(
    type: NotificationType,
    data: Record<string, any>
  ): Promise<void> {
    if (!this.registration) return;

    const template = NOTIFICATION_TEMPLATES[type];
    if (!template) return;

    // Replace placeholders
    let title = template.title;
    let body = template.body;

    Object.entries(data).forEach(([key, value]) => {
      title = title.replace(`{${key}}`, String(value));
      body = body.replace(`{${key}}`, String(value));
    });

    await this.registration.showNotification(title, {
      body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      tag: type,
      data,
    });
  }

  /**
   * Schedule workout reminder
   */
  static async scheduleWorkoutReminder(
    exerciseName: string,
    time: string
  ): Promise<void> {
    if (!this.preferences?.workoutReminders.enabled) return;

    await fetch('/api/notifications/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        type: 'workout_reminder',
        scheduledTime: this.getNextScheduleTime(time),
        data: { exerciseName },
      }),
    });
  }

  /**
   * Notify streak milestone
   */
  static async notifyStreakMilestone(streak: number): Promise<void> {
    if (!this.preferences?.streakMilestones.enabled) return;

    const milestones = [7, 14, 30, 60, 100];
    if (!milestones.includes(streak)) return;

    await this.sendLocalNotification('streak_milestone', {
      streak,
    });

    // Track in analytics
    await fetch('/api/notifications/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: this.userId,
        type: 'streak_milestone',
        data: { streak },
      }),
    });
  }

  /**
   * Send coach recommendation
   */
  static async sendCoachRecommendation(recommendation: string): Promise<void> {
    if (!this.preferences?.coachRecommendations.enabled) return;

    if (this.isInQuietHours()) return;

    await this.sendLocalNotification('coach_recommendation', {
      recommendation,
    });
  }

  /**
   * Send daily engagement notification
   */
  static async sendDailyEngagement(): Promise<void> {
    if (!this.preferences?.dailyEngagement.enabled) return;

    if (this.isInQuietHours()) return;

    const xp = Math.floor(Math.random() * 100) + 50; // 50-150 XP

    await this.sendLocalNotification('daily_engagement', {
      xp,
    });
  }

  /**
   * Notify achievement
   */
  static async notifyAchievement(achievement: string): Promise<void> {
    if (!this.preferences?.achievements.enabled) return;

    await this.sendLocalNotification('achievement_unlocked', {
      achievement,
    });
  }

  /**
   * Notify friend challenge
   */
  static async notifyFriendChallenge(
    friendName: string,
    challenge: string
  ): Promise<void> {
    if (!this.preferences?.social.friendChallenges) return;

    await this.sendLocalNotification('friend_challenge', {
      friend: friendName,
      challenge,
    });
  }

  /**
   * Notify leaderboard update
   */
  static async notifyLeaderboardUpdate(rank: number): Promise<void> {
    if (!this.preferences?.social.leaderboardUpdates) return;

    await this.sendLocalNotification('leaderboard_update', {
      rank,
    });
  }

  /**
   * Update preferences
   */
  static async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<void> {
    try {
      const response = await fetch(`/api/notifications/preferences/${this.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        this.preferences = {
          ...this.preferences!,
          ...preferences,
        };
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  }

  /**
   * Get notification history
   */
  static async getNotificationHistory(limit: number = 50): Promise<PushNotification[]> {
    try {
      const response = await fetch(
        `/api/notifications/history/${this.userId}?limit=${limit}`
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to get notification history:', error);
    }
    return [];
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  /**
   * Check if in quiet hours
   */
  private static isInQuietHours(): boolean {
    if (!this.preferences?.quiet_hours.enabled) return false;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const start = this.preferences.quiet_hours.start;
    const end = this.preferences.quiet_hours.end;

    if (start < end) {
      return currentTime >= start && currentTime < end;
    } else {
      // Quiet hours span midnight
      return currentTime >= start || currentTime < end;
    }
  }

  /**
   * Get next schedule time
   */
  private static getNextScheduleTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    const scheduled = new Date();

    scheduled.setHours(hours, minutes, 0, 0);

    if (scheduled <= now) {
      scheduled.setDate(scheduled.getDate() + 1);
    }

    return scheduled;
  }

  /**
   * Convert VAPID key
   */
  private static urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  /**
   * Unsubscribe from notifications
   */
  static async unsubscribe(): Promise<void> {
    if (!this.registration) return;

    const subscription = await this.registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      console.log('Unsubscribed from push notifications');
    }
  }
}

// ============================================================
// Notification Scheduling
// ============================================================

export class NotificationScheduler {
  private static schedules: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Schedule daily notification
   */
  static scheduleDailyNotification(
    id: string,
    time: string,
    callback: () => Promise<void>
  ): void {
    const [hours, minutes] = time.split(':').map(Number);

    const scheduleNext = () => {
      const now = new Date();
      const scheduled = new Date();
      scheduled.setHours(hours, minutes, 0, 0);

      if (scheduled <= now) {
        scheduled.setDate(scheduled.getDate() + 1);
      }

      const delay = scheduled.getTime() - now.getTime();

      const timeout = setTimeout(async () => {
        await callback();
        scheduleNext(); // Schedule next occurrence
      }, delay);

      this.schedules.set(id, timeout);
    };

    scheduleNext();
  }

  /**
   * Cancel scheduled notification
   */
  static cancelSchedule(id: string): void {
    const timeout = this.schedules.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.schedules.delete(id);
    }
  }

  /**
   * Cancel all schedules
   */
  static cancelAll(): void {
    this.schedules.forEach((timeout) => clearTimeout(timeout));
    this.schedules.clear();
  }
}
