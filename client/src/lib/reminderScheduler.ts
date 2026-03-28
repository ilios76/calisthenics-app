/**
 * Reminder Scheduler
 * Manages workout reminders and achievement notifications
 */

import { notificationService } from './notificationService';

export interface WorkoutReminder {
  id: string;
  programName: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  time: string; // HH:mm format
  enabled: boolean;
}

class ReminderScheduler {
  private reminders: Map<string, WorkoutReminder> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private storageKey = 'calisthenix-reminders';

  constructor() {
    this.loadReminders();
    this.startScheduler();
  }

  /**
   * Add a workout reminder
   */
  addReminder(reminder: WorkoutReminder): void {
    this.reminders.set(reminder.id, reminder);
    this.saveReminders();
    this.scheduleReminder(reminder);
  }

  /**
   * Remove a reminder
   */
  removeReminder(id: string): void {
    this.reminders.delete(id);
    this.saveReminders();
    this.cancelReminder(id);
  }

  /**
   * Update a reminder
   */
  updateReminder(reminder: WorkoutReminder): void {
    this.reminders.set(reminder.id, reminder);
    this.saveReminders();
    this.cancelReminder(reminder.id);
    this.scheduleReminder(reminder);
  }

  /**
   * Get all reminders
   */
  getReminders(): WorkoutReminder[] {
    return Array.from(this.reminders.values());
  }

  /**
   * Schedule a single reminder
   */
  private scheduleReminder(reminder: WorkoutReminder): void {
    if (!reminder.enabled) return;

    const timer = this.calculateNextReminderTime(reminder);
    if (timer > 0) {
      const timeoutId = setTimeout(() => {
        if (notificationService.isEnabled()) {
          notificationService.notifyWorkoutReminder(reminder.programName);
        }
        // Reschedule for next week
        this.scheduleReminder(reminder);
      }, timer);

      this.timers.set(reminder.id, timeoutId);
    }
  }

  /**
   * Cancel a reminder
   */
  private cancelReminder(id: string): void {
    const timeoutId = this.timers.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timers.delete(id);
    }
  }

  /**
   * Calculate milliseconds until next reminder
   */
  private calculateNextReminderTime(reminder: WorkoutReminder): number {
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const now = new Date();
    const today = now.getDay();

    let nextDate = new Date();
    nextDate.setHours(hours, minutes, 0, 0);

    // If time has passed today and it's the right day, schedule for next week
    if (today === reminder.dayOfWeek && nextDate <= now) {
      nextDate.setDate(nextDate.getDate() + 7);
    } else if (today > reminder.dayOfWeek) {
      // Schedule for next week if day has passed
      nextDate.setDate(nextDate.getDate() + (7 - today + reminder.dayOfWeek));
    } else {
      // Schedule for this week
      nextDate.setDate(nextDate.getDate() + (reminder.dayOfWeek - today));
    }

    return Math.max(0, nextDate.getTime() - now.getTime());
  }

  /**
   * Start the scheduler (check reminders periodically)
   */
  private startScheduler(): void {
    // Reschedule reminders every hour to handle day/time changes
    setInterval(() => {
      this.reminders.forEach(reminder => {
        if (reminder.enabled) {
          this.cancelReminder(reminder.id);
          this.scheduleReminder(reminder);
        }
      });
    }, 60 * 60 * 1000); // Every hour
  }

  /**
   * Save reminders to localStorage
   */
  private saveReminders(): void {
    const remindersArray = Array.from(this.reminders.values());
    localStorage.setItem(this.storageKey, JSON.stringify(remindersArray));
  }

  /**
   * Load reminders from localStorage
   */
  private loadReminders(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const remindersArray = JSON.parse(stored) as WorkoutReminder[];
        remindersArray.forEach(reminder => {
          this.reminders.set(reminder.id, reminder);
          this.scheduleReminder(reminder);
        });
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  }

  /**
   * Notify achievement
   */
  notifyAchievement(name: string, description: string): void {
    if (notificationService.isEnabled()) {
      notificationService.notifyAchievement(name, description);
    }
  }

  /**
   * Notify personal record
   */
  notifyPersonalRecord(exerciseName: string, reps: number): void {
    if (notificationService.isEnabled()) {
      notificationService.notifyPersonalRecord(exerciseName, reps);
    }
  }

  /**
   * Notify streak milestone
   */
  notifyStreak(days: number): void {
    if (notificationService.isEnabled()) {
      notificationService.notifyStreak(days);
    }
  }

  /**
   * Notify rest day
   */
  notifyRestDay(): void {
    if (notificationService.isEnabled()) {
      notificationService.notifyRestDay();
    }
  }

  /**
   * Cleanup (call on app unmount)
   */
  destroy(): void {
    this.timers.forEach(timeoutId => clearTimeout(timeoutId));
    this.timers.clear();
  }
}

export const reminderScheduler = new ReminderScheduler();
