# CallistheniX – Push Notifications Implementation Guide

## Overview

This guide covers the complete implementation of push notifications for CallistheniX, including workout reminders, streak milestones, coach recommendations, and daily engagement notifications.

---

## 🎯 Notification Types

### 1. Workout Reminders 💪
- **Purpose**: Encourage users to start their daily workout
- **Frequency**: Customizable (daily, every other day, weekly)
- **Timing**: User-selected time (default: 7:00 AM)
- **Content**: "Time to Train! Your {exercise} workout is ready. Let's crush it!"
- **Action**: Opens workout screen

### 2. Streak Milestones 🔥
- **Purpose**: Celebrate achievement milestones
- **Triggers**: 7, 14, 30, 60, 100 day streaks
- **Content**: "Amazing! You've hit {streak} day streak! Keep going!"
- **Action**: Opens achievements screen
- **Impact**: High engagement and retention boost

### 3. Coach Recommendations 🤖
- **Purpose**: Provide personalized training tips
- **Frequency**: Daily, every other day, or weekly
- **Content**: AI-generated recommendations based on performance
- **Examples**:
  - "You're doing great with push-ups! Try the diamond variation next."
  - "Time for a deload week. Rest and recover!"
  - "You've hit a plateau. Let's change your routine."
- **Action**: Opens coach AI section

### 4. Daily Engagement ✨
- **Purpose**: Drive daily active users (DAU)
- **Timing**: User-selected time (default: 6:00 PM)
- **Content**: "Complete today's workout to earn {xp} XP"
- **Reward**: XP incentive for completion
- **Action**: Opens home screen with daily challenge

### 5. Achievement Unlocked 🏆
- **Purpose**: Celebrate milestones and unlocks
- **Triggers**: Level up, skill completion, badge earned
- **Content**: "You've unlocked: {achievement}"
- **Action**: Opens achievements screen

### 6. Friend Challenges ⚡
- **Purpose**: Drive social engagement
- **Triggers**: Friend sends challenge
- **Content**: "{friend} challenged you to {challenge}"
- **Action**: Opens friend challenge screen

### 7. Leaderboard Updates 📊
- **Purpose**: Drive competitive engagement
- **Triggers**: User rank changes significantly
- **Content**: "You're now #{rank} on the leaderboard!"
- **Action**: Opens leaderboard screen

---

## 🔧 Technical Implementation

### Step 1: Generate VAPID Keys

```bash
# Install web-push globally
npm install -g web-push

# Generate VAPID keys
web-push generate-vapid-keys

# Output:
# Public Key: ...
# Private Key: ...
```

### Step 2: Add Environment Variables

```env
# .env.local
VITE_VAPID_PUBLIC_KEY=your_public_key_here
VITE_PUSH_NOTIFICATIONS_ENABLED=true
VITE_SERVICE_WORKER_PATH=/sw.js
```

### Step 3: Create Service Worker

```javascript
// public/sw.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: data.tag,
    data: data.data,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
```

### Step 4: Initialize in App

```typescript
// In App.tsx or main.tsx
import { PushNotificationService } from '@/services/pushNotificationService';

useEffect(() => {
  if (currentUser) {
    PushNotificationService.initialize(currentUser.id);
  }
}, [currentUser]);
```

### Step 5: Add Components to Settings

```typescript
// In Settings.tsx
import { NotificationPreferencesComponent } from '@/components/NotificationPreferences';
import { NotificationCenter } from '@/components/NotificationCenter';

export function SettingsPage() {
  return (
    <div>
      <NotificationCenter />
      <NotificationPreferencesComponent />
    </div>
  );
}
```

---

## 📱 Notification Scheduling

### Workout Reminders

```typescript
import { NotificationScheduler } from '@/services/pushNotificationService';

// Schedule daily at 7:00 AM
NotificationScheduler.scheduleDailyNotification(
  'workout-reminder',
  '07:00',
  async () => {
    await PushNotificationService.scheduleWorkoutReminder('Push-ups', '07:00');
  }
);
```

### Streak Milestones

```typescript
// When user completes workout and streak increases
if ([7, 14, 30, 60, 100].includes(newStreak)) {
  await PushNotificationService.notifyStreakMilestone(newStreak);
  AnalyticsService.trackEvent('engagement', 'streak_milestone', { streak: newStreak });
}
```

### Coach Recommendations

```typescript
// After analyzing user performance
const recommendation = CoachAISystem.generateRecommendation(userMetrics);
if (recommendation) {
  await PushNotificationService.sendCoachRecommendation(recommendation.message);
}
```

### Daily Engagement

```typescript
// Schedule daily at 6:00 PM
NotificationScheduler.scheduleDailyNotification(
  'daily-engagement',
  '18:00',
  async () => {
    await PushNotificationService.sendDailyEngagement();
  }
);
```

---

## 🎯 Notification Strategy

### Frequency Guidelines

| Notification Type | Recommended Frequency | Max Per Week |
|------------------|----------------------|--------------|
| Workout Reminders | Daily | 7 |
| Streak Milestones | On milestone | ~1-2 |
| Coach Recommendations | Daily/Weekly | 7 |
| Daily Engagement | Daily | 7 |
| Achievements | On trigger | ~2-3 |
| Friend Challenges | On trigger | ~3-5 |
| Leaderboard Updates | Weekly | 1 |

### Quiet Hours

- **Default**: 10 PM - 8 AM
- **Customizable**: Users can set their own quiet hours
- **Respect**: Never send notifications during quiet hours
- **Impact**: Prevents notification fatigue and improves retention

### Personalization

1. **Time-Based**: Send at user's preferred time
2. **Performance-Based**: Adjust frequency based on engagement
3. **Preference-Based**: Respect user settings
4. **Context-Based**: Consider user's current activity

---

## 📊 Notification Analytics

### Key Metrics to Track

```typescript
// Track notification sent
AnalyticsService.trackEvent('engagement', 'notification_sent', {
  type: 'workout_reminder',
  time: '07:00',
});

// Track notification clicked
AnalyticsService.trackEvent('engagement', 'notification_clicked', {
  type: 'workout_reminder',
  actionUrl: '/workouts',
});

// Track notification dismissed
AnalyticsService.trackEvent('engagement', 'notification_dismissed', {
  type: 'workout_reminder',
});
```

### Measuring Success

| Metric | Target | Impact |
|--------|--------|--------|
| Click-through Rate | 15-25% | Engagement |
| Conversion (Notification → Workout) | 10-15% | Retention |
| Opt-in Rate | 40-50% | Reach |
| Unsubscribe Rate | <5% | Satisfaction |

---

## 🔐 Privacy & Compliance

### GDPR Compliance

- Explicit opt-in required (not opt-out)
- Clear privacy policy
- Easy unsubscribe option
- Data retention policy (max 90 days)
- User data deletion on request

### Best Practices

- Never send sensitive information in notifications
- Use generic language (no personal data)
- Provide clear unsubscribe option
- Respect user preferences
- Monitor unsubscribe rates

---

## 🧪 Testing

### Local Testing

```typescript
// Send test notification
await PushNotificationService.sendLocalNotification('workout_reminder', {
  exerciseName: 'Push-ups',
});

// Test quiet hours
const preferences = {
  quiet_hours: {
    enabled: true,
    start: '22:00',
    end: '08:00',
  },
};
await PushNotificationService.updatePreferences(preferences);
```

### Production Testing

1. **Canary Testing**: Send to 1% of users first
2. **A/B Testing**: Test different messages
3. **Timing Tests**: Optimize send times
4. **Frequency Tests**: Find optimal frequency

---

## 📈 Optimization Tips

### Increase Click-Through Rate

1. **Personalization**: Use user's name and preferences
2. **Urgency**: "Limited time offer" or "Don't miss out"
3. **Specificity**: "Complete 10 push-ups" vs "Complete workout"
4. **Timing**: Send at optimal time for user
5. **Action**: Clear call-to-action

### Reduce Unsubscribe Rate

1. **Frequency**: Don't overwhelm users
2. **Relevance**: Only send relevant notifications
3. **Timing**: Respect quiet hours
4. **Value**: Ensure notifications provide value
5. **Preferences**: Let users customize

### Improve Retention

1. **Consistency**: Regular reminders build habit
2. **Variety**: Mix different notification types
3. **Rewards**: Tie notifications to rewards (XP, badges)
4. **Social**: Leverage friend challenges
5. **Progress**: Show progress toward goals

---

## 🚀 Deployment Checklist

- [ ] VAPID keys generated and stored securely
- [ ] Service Worker created and tested
- [ ] Push notification service initialized
- [ ] Notification preferences UI built
- [ ] Notification center component added
- [ ] Scheduling system implemented
- [ ] Analytics tracking added
- [ ] Quiet hours implemented
- [ ] Privacy policy updated
- [ ] GDPR compliance verified
- [ ] Testing completed
- [ ] Monitoring alerts set up
- [ ] Documentation complete

---

## 📞 Troubleshooting

### Notifications Not Showing

1. Check browser notification permissions
2. Verify Service Worker is registered
3. Check browser console for errors
4. Verify VAPID keys are correct
5. Check quiet hours settings

### High Unsubscribe Rate

1. Reduce notification frequency
2. Improve message relevance
3. Respect user preferences
4. Check timing (avoid off-hours)
5. Add value to notifications

### Poor Click-Through Rate

1. Improve message copy
2. Add personalization
3. Optimize send time
4. Test different messages
5. Add clear call-to-action

---

## 📚 Resources

- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Notification Best Practices](https://web.dev/push-notifications-overview/)

---

## Next Steps

1. **Deploy**: Push to production
2. **Monitor**: Track metrics closely
3. **Optimize**: A/B test messages and timing
4. **Expand**: Add more notification types
5. **Integrate**: Connect with email campaigns

---

**Status**: Production-Ready  
**Version**: 1.0.0  
**Last Updated**: April 2026
