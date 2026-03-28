/**
 * Notification Service
 * Handles push notifications for workouts, achievements, and reminders
 */

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
}

class NotificationService {
  private isSupported: boolean;
  private isGranted: boolean = false;

  constructor() {
    this.isSupported = 'Notification' in window;
    if (this.isSupported) {
      this.isGranted = Notification.permission === 'granted';
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notifications not supported in this browser');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.isGranted = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        this.isGranted = permission === 'granted';
        return this.isGranted;
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    }

    return false;
  }

  /**
   * Check if notifications are supported and granted
   */
  isEnabled(): boolean {
    return this.isSupported && this.isGranted;
  }

  /**
   * Send a notification
   */
  notify(options: NotificationOptions): void {
    if (!this.isEnabled()) {
      console.warn('Notifications not enabled');
      return;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
        tag: options.tag || 'calisthenix-notification',
        requireInteraction: options.requireInteraction || false,
      });

      // Close notification after 5 seconds if not requiring interaction
      if (!options.requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * Send workout reminder notification
   */
  notifyWorkoutReminder(programName: string): void {
    this.notify({
      title: '💪 Workout Time!',
      body: `Time to start your ${programName} session!`,
      tag: 'workout-reminder',
      requireInteraction: true,
    });
  }

  /**
   * Send achievement notification
   */
  notifyAchievement(achievementName: string, description: string): void {
    this.notify({
      title: '🏆 Achievement Unlocked!',
      body: `${achievementName}: ${description}`,
      tag: 'achievement',
      requireInteraction: false,
    });
  }

  /**
   * Send PR notification
   */
  notifyPersonalRecord(exerciseName: string, reps: number): void {
    this.notify({
      title: '🎯 New Personal Record!',
      body: `${exerciseName}: ${reps} reps!`,
      tag: 'personal-record',
      requireInteraction: false,
    });
  }

  /**
   * Send streak notification
   */
  notifyStreak(days: number): void {
    this.notify({
      title: '🔥 Streak Milestone!',
      body: `You've maintained a ${days}-day workout streak!`,
      tag: 'streak',
      requireInteraction: false,
    });
  }

  /**
   * Send rest day notification
   */
  notifyRestDay(): void {
    this.notify({
      title: '😴 Rest Day',
      body: 'Take it easy today! Recovery is part of progress.',
      tag: 'rest-day',
      requireInteraction: false,
    });
  }

  /**
   * Get permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported) return 'denied';
    return Notification.permission;
  }
}

export const notificationService = new NotificationService();
