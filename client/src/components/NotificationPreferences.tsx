import React, { useState, useEffect } from 'react';
import { Bell, Clock, Zap, Users, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { NotificationPreferences, PushNotificationService } from '@/services/pushNotificationService';

interface NotificationPreferencesProps {
  onSave?: () => void;
}

export function NotificationPreferencesComponent({
  onSave,
}: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    // In a real app, fetch from backend
    const defaultPreferences: NotificationPreferences = {
      userId: 'current-user',
      workoutReminders: {
        enabled: true,
        time: '07:00',
        frequency: 'daily',
      },
      streakMilestones: {
        enabled: true,
        notify: [true, true, true, true, true], // 7, 14, 30, 60, 100
      },
      coachRecommendations: {
        enabled: true,
        frequency: 'daily',
      },
      dailyEngagement: {
        enabled: true,
        time: '18:00',
      },
      achievements: {
        enabled: true,
      },
      social: {
        enabled: true,
        friendChallenges: true,
        leaderboardUpdates: true,
      },
      quiet_hours: {
        enabled: true,
        start: '22:00',
        end: '08:00',
      },
    };
    setPreferences(defaultPreferences);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!preferences) return;

    await PushNotificationService.updatePreferences(preferences);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    onSave?.();
  };

  if (loading || !preferences) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Notification Settings</h2>
      </div>

      {/* Workout Reminders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold">Workout Reminders</h3>
          </div>
          <Switch
            checked={preferences.workoutReminders.enabled}
            onCheckedChange={(checked) =>
              setPreferences({
                ...preferences,
                workoutReminders: {
                  ...preferences.workoutReminders,
                  enabled: checked,
                },
              })
            }
          />
        </div>

        {preferences.workoutReminders.enabled && (
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Reminder Time
              </Label>
              <input
                type="time"
                value={preferences.workoutReminders.time}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    workoutReminders: {
                      ...preferences.workoutReminders,
                      time: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Frequency
              </Label>
              <select
                value={preferences.workoutReminders.frequency}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    workoutReminders: {
                      ...preferences.workoutReminders,
                      frequency: e.target.value as any,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="daily">Daily</option>
                <option value="every_other_day">Every Other Day</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
        )}
      </Card>

      {/* Streak Milestones */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <h3 className="text-lg font-bold">Streak Milestones</h3>
          </div>
          <Switch
            checked={preferences.streakMilestones.enabled}
            onCheckedChange={(checked) =>
              setPreferences({
                ...preferences,
                streakMilestones: {
                  ...preferences.streakMilestones,
                  enabled: checked,
                },
              })
            }
          />
        </div>

        {preferences.streakMilestones.enabled && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-3">
              Notify me when I reach these milestones:
            </p>
            <div className="grid grid-cols-5 gap-2">
              {[7, 14, 30, 60, 100].map((milestone, idx) => (
                <label key={milestone} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferences.streakMilestones.notify[idx]}
                    onChange={(e) => {
                      const newNotify = [...preferences.streakMilestones.notify];
                      newNotify[idx] = e.target.checked;
                      setPreferences({
                        ...preferences,
                        streakMilestones: {
                          ...preferences.streakMilestones,
                          notify: newNotify,
                        },
                      });
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{milestone}d</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Coach Recommendations */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <h3 className="text-lg font-bold">Coach Recommendations</h3>
          </div>
          <Switch
            checked={preferences.coachRecommendations.enabled}
            onCheckedChange={(checked) =>
              setPreferences({
                ...preferences,
                coachRecommendations: {
                  ...preferences.coachRecommendations,
                  enabled: checked,
                },
              })
            }
          />
        </div>

        {preferences.coachRecommendations.enabled && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="text-sm font-medium mb-2 block">
              Frequency
            </Label>
            <select
              value={preferences.coachRecommendations.frequency}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  coachRecommendations: {
                    ...preferences.coachRecommendations,
                    frequency: e.target.value as any,
                  },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="daily">Daily</option>
              <option value="every_other_day">Every Other Day</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        )}
      </Card>

      {/* Daily Engagement */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <h3 className="text-lg font-bold">Daily Engagement</h3>
          </div>
          <Switch
            checked={preferences.dailyEngagement.enabled}
            onCheckedChange={(checked) =>
              setPreferences({
                ...preferences,
                dailyEngagement: {
                  ...preferences.dailyEngagement,
                  enabled: checked,
                },
              })
            }
          />
        </div>

        {preferences.dailyEngagement.enabled && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="text-sm font-medium mb-2 block">
              Notification Time
            </Label>
            <input
              type="time"
              value={preferences.dailyEngagement.time}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  dailyEngagement: {
                    ...preferences.dailyEngagement,
                    time: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        )}
      </Card>

      {/* Social Notifications */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-bold">Social Notifications</h3>
          </div>
          <Switch
            checked={preferences.social.enabled}
            onCheckedChange={(checked) =>
              setPreferences({
                ...preferences,
                social: {
                  ...preferences.social,
                  enabled: checked,
                },
              })
            }
          />
        </div>

        {preferences.social.enabled && (
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={preferences.social.friendChallenges}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    social: {
                      ...preferences.social,
                      friendChallenges: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4"
              />
              <span className="text-sm">Friend Challenges</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={preferences.social.leaderboardUpdates}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    social: {
                      ...preferences.social,
                      leaderboardUpdates: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4"
              />
              <span className="text-sm">Leaderboard Updates</span>
            </label>
          </div>
        )}
      </Card>

      {/* Quiet Hours */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-bold">Quiet Hours</h3>
          </div>
          <Switch
            checked={preferences.quiet_hours.enabled}
            onCheckedChange={(checked) =>
              setPreferences({
                ...preferences,
                quiet_hours: {
                  ...preferences.quiet_hours,
                  enabled: checked,
                },
              })
            }
          />
        </div>

        {preferences.quiet_hours.enabled && (
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Start Time
              </Label>
              <input
                type="time"
                value={preferences.quiet_hours.start}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    quiet_hours: {
                      ...preferences.quiet_hours,
                      start: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">
                End Time
              </Label>
              <input
                type="time"
                value={preferences.quiet_hours.end}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    quiet_hours: {
                      ...preferences.quiet_hours,
                      end: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <p className="text-xs text-gray-600">
              No notifications will be sent during quiet hours
            </p>
          </div>
        )}
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button
          onClick={handleSave}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {saved ? '✓ Saved' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}
