// ============================================================
// Meal Notification Service
// Handles meal reminders for breakfast, lunch, dinner
// ============================================================

export const mealNotificationService = {
  // Schedule meal notifications
  scheduleMealNotifications: () => {
    const meals = [
      { name: 'Breakfast', time: '07:00', message: '🌅 Time for breakfast! Fuel your body for the day ahead.' },
      { name: 'Lunch', time: '12:30', message: '🍽️ Lunch time! Recharge your energy with a nutritious meal.' },
      { name: 'Dinner', time: '19:00', message: '🌙 Dinner time! Complete your nutrition plan for the day.' },
    ];

    meals.forEach(meal => {
      const [hours, minutes] = meal.time.split(':').map(Number);
      const now = new Date();
      const mealTime = new Date();
      mealTime.setHours(hours, minutes, 0, 0);

      // If meal time has passed today, schedule for tomorrow
      if (mealTime < now) {
        mealTime.setDate(mealTime.getDate() + 1);
      }

      const timeUntilMeal = mealTime.getTime() - now.getTime();
      
      // Schedule the notification
      setTimeout(() => {
        mealNotificationService.sendMealNotification(meal.name, meal.message);
        // Reschedule for next day
        setInterval(() => {
          mealNotificationService.sendMealNotification(meal.name, meal.message);
        }, 24 * 60 * 60 * 1000); // Every 24 hours
      }, timeUntilMeal);
    });
  },

  // Send meal notification
  sendMealNotification: async (mealName: string, message: string) => {
    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return;
      }

      // Request permission if not granted
      if (Notification.permission === 'granted') {
        new Notification(`${mealName} Reminder`, {
          body: message,
          icon: '🥗',
          tag: `meal-${mealName.toLowerCase()}`,
          requireInteraction: false,
        });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification(`${mealName} Reminder`, {
            body: message,
            icon: '🥗',
            tag: `meal-${mealName.toLowerCase()}`,
            requireInteraction: false,
          });
        }
      }
    } catch (error) {
      console.error('Error sending meal notification:', error);
    }
  },

  // Request notification permission
  requestNotificationPermission: async () => {
    try {
      if ('Notification' in window && Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }
      return Notification.permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  },

  // Check if notifications are enabled
  areNotificationsEnabled: () => {
    return 'Notification' in window && Notification.permission === 'granted';
  },
};
