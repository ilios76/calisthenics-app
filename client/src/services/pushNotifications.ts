// ============================================================
// CallistheniX – Push Notifications Service
// Handles workout reminders and retention notifications
// ============================================================

export interface NotificationOptions {
  title?: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string; // Prevents duplicate notifications
  requireInteraction?: boolean;
  data?: Record<string, any>;
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Send a local notification
 */
export function sendNotification(options: NotificationOptions): Notification | null {
  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return null;
  }

  const notificationOptions: any = {
    body: options.body,
    icon: options.icon || '/favicon.ico',
    badge: options.badge,
    tag: options.tag || 'callisthenix-notification',
    requireInteraction: options.requireInteraction || false,
    data: options.data,
  };

  const notification = new Notification(options.title || 'CallistheniX', notificationOptions);

  return notification;
}

/**
 * Schedule a workout reminder for tomorrow at a specific time
 */
export function scheduleWorkoutReminder(
  hour: number = 8,
  minute: number = 0
): void {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Workers not supported');
    return;
  }

  // Calculate time until tomorrow at specified hour
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(hour, minute, 0, 0);

  const timeUntilNotification = tomorrow.getTime() - now.getTime();

  // Store the scheduled notification time
  localStorage.setItem('nextWorkoutReminder', tomorrow.toISOString());

  // Schedule the notification
  setTimeout(() => {
    sendNotification({
      title: '💪 Time to Train!',
      body: 'Your workout is waiting. Let\'s crush it today!',
      tag: 'workout-reminder',
      requireInteraction: true,
      data: {
        action: 'open-dashboard',
        timestamp: new Date().toISOString(),
      },
    });

    // Reschedule for the next day
    scheduleWorkoutReminder(hour, minute);
  }, timeUntilNotification);
}

/**
 * Send a streak milestone notification
 */
export function sendStreakNotification(streak: number): void {
  const milestones = [7, 14, 21, 30, 60, 90, 100];

  if (!milestones.includes(streak)) {
    return;
  }

  const messages: Record<number, string> = {
    7: '🔥 7-Day Streak! You\'re on fire!',
    14: '🔥 2-Week Streak! Unstoppable!',
    21: '🔥 3-Week Streak! You\'re a machine!',
    30: '🏆 30-Day Streak! Legendary status!',
    60: '👑 60-Day Streak! You\'re a champion!',
    90: '⭐ 90-Day Streak! Transformation complete!',
    100: '🌟 100-Day Streak! You\'re unstoppable!',
  };

  sendNotification({
    title: 'Streak Milestone! 🎉',
    body: messages[streak] || `${streak}-Day Streak! Keep going!`,
    tag: `streak-${streak}`,
    requireInteraction: true,
    data: {
      action: 'view-progress',
      streak,
    },
  });
}

/**
 * Send a motivation notification
 */
export function sendMotivationNotification(): void {
  const motivations = [
    {
      title: '💪 Time to Build',
      body: 'Your body is waiting for you. Let\'s get stronger!',
    },
    {
      title: '🔥 Consistency Wins',
      body: 'One more workout brings you closer to your goal.',
    },
    {
      title: '⚡ No Excuses',
      body: 'Results don\'t come from wishes. Start your workout now!',
    },
    {
      title: '🎯 Goal Closer',
      body: 'Every rep counts. Your transformation starts today.',
    },
    {
      title: '💯 You Got This',
      body: 'Just 30 minutes. That\'s all it takes to change your day.',
    },
  ];

  const random = motivations[Math.floor(Math.random() * motivations.length)];

  sendNotification({
    title: random.title,
    body: random.body,
    tag: 'motivation',
    data: {
      action: 'open-dashboard',
    },
  });
}

/**
 * Cancel all scheduled notifications
 */
export function cancelNotifications(): void {
  localStorage.removeItem('nextWorkoutReminder');
}

/**
 * Get next scheduled workout reminder time
 */
export function getNextReminderTime(): Date | null {
  const stored = localStorage.getItem('nextWorkoutReminder');
  return stored ? new Date(stored) : null;
}

/**
 * Enable push notifications with default settings
 */
export async function enablePushNotifications(): Promise<boolean> {
  const granted = await requestNotificationPermission();

  if (granted) {
    // Schedule daily reminder at 8 AM
    scheduleWorkoutReminder(8, 0);

    // Store preference
    localStorage.setItem('pushNotificationsEnabled', 'true');

    return true;
  }

  return false;
}

/**
 * Disable push notifications
 */
export function disablePushNotifications(): void {
  cancelNotifications();
  localStorage.setItem('pushNotificationsEnabled', 'false');
}

/**
 * Check if push notifications are enabled
 */
export function arePushNotificationsEnabled(): boolean {
  return localStorage.getItem('pushNotificationsEnabled') === 'true';
}
