// Push Notifications Service for CallistheniX
// Handles Day 1, 2, 3, and trial end notifications

export interface NotificationMessage {
  day: number;
  title: string;
  message: string;
  icon: string;
}

export const NOTIFICATION_SCHEDULE: NotificationMessage[] = [
  {
    day: 1,
    title: 'Your Day 2 workout is ready',
    message: 'Time to keep the momentum going! 💪',
    icon: '📅',
  },
  {
    day: 2,
    title: "Don't break your streak 🔥",
    message: 'You are 2 days in. Keep it up!',
    icon: '🔥',
  },
  {
    day: 3,
    title: 'You were 1 workout away from leveling up',
    message: 'Complete today to reach the next level! 📈',
    icon: '⚡',
  },
];

export const TRIAL_END_NOTIFICATION: NotificationMessage = {
  day: 7,
  title: 'Your plan pauses today',
  message: 'Upgrade to Premium to continue training. Limited offer: Save 60% on yearly! 🎁',
  icon: '⏸️',
};

class NotificationService {
  private notificationsSent: Record<number, boolean> = {};
  private readonly STORAGE_KEY = 'callisthenix_notifications';

  constructor() {
    this.loadNotificationHistory();
  }

  private loadNotificationHistory() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.notificationsSent = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading notification history:', error);
    }
  }

  private saveNotificationHistory() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.notificationsSent));
    } catch (error) {
      console.error('Error saving notification history:', error);
    }
  }

  /**
   * Check if a notification should be sent based on day
   */
  shouldSendNotification(dayNumber: number): boolean {
    return !this.notificationsSent[dayNumber];
  }

  /**
   * Send a notification (browser notification API)
   */
  async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(title, options);
      }
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return Notification.permission;
    }

    return await Notification.requestPermission();
  }

  /**
   * Send daily notification based on workout day
   */
  async sendDailyNotification(dayNumber: number): Promise<void> {
    if (!this.shouldSendNotification(dayNumber)) {
      return;
    }

    let notification: NotificationMessage | null = null;

    if (dayNumber <= 3) {
      notification = NOTIFICATION_SCHEDULE[dayNumber - 1];
    } else if (dayNumber === 7) {
      notification = TRIAL_END_NOTIFICATION;
    }

    if (notification) {
      await this.sendNotification(notification.title, {
        body: notification.message,
        icon: notification.icon,
        tag: `notification-day-${dayNumber}`,
        requireInteraction: dayNumber === 7, // Trial end is important
      });

      this.notificationsSent[dayNumber] = true;
      this.saveNotificationHistory();
    }
  }

  /**
   * Send custom notification
   */
  async sendCustomNotification(title: string, message: string, icon?: string): Promise<void> {
    await this.sendNotification(title, {
      body: message,
      icon: icon || '💪',
    });
  }

  /**
   * Reset notification history (for testing)
   */
  resetNotificationHistory(): void {
    this.notificationsSent = {};
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Get notification history
   */
  getNotificationHistory(): Record<number, boolean> {
    return { ...this.notificationsSent };
  }
}

export const notificationService = new NotificationService();
