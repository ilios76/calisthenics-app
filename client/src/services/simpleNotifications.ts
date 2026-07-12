// Simple Notification Service for CallistheniX
// Works with browser Notification API - no service worker required for basic functionality

export interface SimpleNotification {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: Record<string, any>;
  delay?: number; // milliseconds to delay notification
}

export class SimpleNotificationService {
  private static isSupported = typeof window !== 'undefined' && 'Notification' in window;

  /**
   * Request notification permission
   */
  static async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  /**
   * Send a simple notification
   */
  static async sendNotification(notification: SimpleNotification): Promise<void> {
    if (!this.isSupported) {
      console.warn('Notifications not supported');
      return;
    }

    if (Notification.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    const delay = notification.delay || 0;

    setTimeout(() => {
      try {
        new Notification(notification.title, {
          body: notification.body,
          icon: notification.icon || '/icon-192x192.png',
          badge: '/badge-72x72.png',
          tag: notification.tag || 'notification',
          data: notification.data || {},
        });
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    }, delay);
  }

  /**
   * Send workout reminder notification
   */
  static async sendWorkoutReminder(date: string, exerciseName?: string): Promise<void> {
    const dateObj = new Date(date + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('el-GR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    await this.sendNotification({
      title: '💪 Workout Scheduled',
      body: `Workout scheduled for ${formattedDate}${exerciseName ? ` - ${exerciseName}` : ''}`,
      tag: `workout-${date}`,
      data: { date, exerciseName },
    });
  }

  /**
   * Send streak milestone notification
   */
  static async sendStreakMilestone(streak: number): Promise<void> {
    await this.sendNotification({
      title: '🔥 Streak Milestone!',
      body: `Amazing! You've hit a ${streak} day streak! Keep it up!`,
      tag: `streak-${streak}`,
      data: { streak },
    });
  }

  /**
   * Send achievement notification
   */
  static async sendAchievement(achievement: string): Promise<void> {
    await this.sendNotification({
      title: '🏆 Achievement Unlocked!',
      body: `You've unlocked: ${achievement}`,
      tag: `achievement-${achievement}`,
      data: { achievement },
    });
  }

  /**
   * Send scheduled notification
   */
  static scheduleNotification(
    notification: SimpleNotification,
    scheduledTime: Date
  ): NodeJS.Timeout {
    const now = new Date();
    const delay = Math.max(0, scheduledTime.getTime() - now.getTime());

    return setTimeout(() => {
      this.sendNotification(notification);
    }, delay);
  }

  /**
   * Check if notifications are enabled
   */
  static isEnabled(): boolean {
    return this.isSupported && Notification.permission === 'granted';
  }
}
