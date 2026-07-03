// ============================================================
// CallistheniX – Settings Page
// Dark mode toggle, notification settings, reminders
// ============================================================

import { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/contexts/I18nContext';
import { notificationService } from '@/lib/notificationService';
import { reminderScheduler, WorkoutReminder } from '@/lib/reminderScheduler';
import { toast } from 'sonner';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const [notificationsEnabled, setNotificationsEnabled] = useState(notificationService.isEnabled());
  const [reminders, setReminders] = useState<WorkoutReminder[]>(reminderScheduler.getReminders());
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    programName: '',
    dayOfWeek: 1,
    time: '09:00',
  });

  useEffect(() => {
    setReminders(reminderScheduler.getReminders());
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      setNotificationsEnabled(true);
      toast.success('Notifications enabled!');
    } else {
      toast.error('Notification permission denied');
    }
  };

  const handleAddReminder = () => {
    if (!newReminder.programName.trim()) {
      toast.error('Please enter a program name');
      return;
    }

    const reminder: WorkoutReminder = {
      id: `reminder-${Date.now()}`,
      programName: newReminder.programName,
      dayOfWeek: newReminder.dayOfWeek,
      time: newReminder.time,
      enabled: true,
    };

    reminderScheduler.addReminder(reminder);
    setReminders(reminderScheduler.getReminders());
    setNewReminder({ programName: '', dayOfWeek: 1, time: '09:00' });
    setShowReminderForm(false);
    toast.success('Reminder added!');
  };

  const handleRemoveReminder = (id: string) => {
    reminderScheduler.removeReminder(id);
    setReminders(reminderScheduler.getReminders());
    toast.success('Reminder removed');
  };

  const handleToggleReminder = (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      reminderScheduler.updateReminder({
        ...reminder,
        enabled: !reminder.enabled,
      });
      setReminders(reminderScheduler.getReminders());
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">⚙️ {t('settings')}</h1>
          <p className="text-muted-foreground">{t('manage_your_preferences')}</p>
        </div>

        {/* Dark Mode Section */}
        <Card className="p-6 border border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-6 h-6 text-primary" />
              ) : (
                <Sun className="w-6 h-6 text-primary" />
              )}
              <div>
                <h3 className="font-semibold text-lg">Dark Mode</h3>
                <p className="text-sm text-muted-foreground">
                  {theme === 'dark' ? 'Currently enabled' : 'Currently disabled'}
                </p>
              </div>
            </div>
            <Button
              onClick={toggleTheme}
              variant="outline"
              className="gap-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="p-6 border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  {notificationsEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            {!notificationsEnabled && (
              <Button
                onClick={handleEnableNotifications}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Enable
              </Button>
            )}
          </div>

          {notificationsEnabled && (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>✓ Workout reminders</p>
              <p>✓ Achievement notifications</p>
              <p>✓ Personal record alerts</p>
              <p>✓ Streak milestones</p>
            </div>
          )}
        </Card>

        {/* Reminders Section */}
        {notificationsEnabled && (
          <Card className="p-6 border border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-lg">Workout Reminders</h3>
              </div>
              <Button
                onClick={() => setShowReminderForm(!showReminderForm)}
                variant="outline"
                size="sm"
              >
                {showReminderForm ? 'Cancel' : '+ Add Reminder'}
              </Button>
            </div>

            {/* Add Reminder Form */}
            {showReminderForm && (
              <div className="mb-4 p-4 bg-muted rounded-lg space-y-3">
                <input
                  type="text"
                  placeholder="Program name (e.g., Fat Loss)"
                  value={newReminder.programName}
                  onChange={(e) => setNewReminder({ ...newReminder, programName: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-foreground placeholder-muted-foreground"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={newReminder.dayOfWeek}
                    onChange={(e) => setNewReminder({ ...newReminder, dayOfWeek: parseInt(e.target.value) })}
                    className="px-3 py-2 bg-background border border-border rounded text-foreground"
                  >
                    {DAYS_OF_WEEK.map((day, idx) => (
                      <option key={idx} value={idx}>{day}</option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                    className="px-3 py-2 bg-background border border-border rounded text-foreground"
                  />
                </div>
                <Button
                  onClick={handleAddReminder}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Add Reminder
                </Button>
              </div>
            )}

            {/* Reminders List */}
            {reminders.length > 0 ? (
              <div className="space-y-2">
                {reminders.map(reminder => (
                  <div key={reminder.id} className="flex items-center justify-between p-3 bg-muted rounded">
                    <div className="flex items-center gap-3 flex-1">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={() => handleToggleReminder(reminder.id)}
                      />
                      <div className="text-sm">
                        <p className="font-medium">{reminder.programName}</p>
                        <p className="text-muted-foreground">
                          {DAYS_OF_WEEK[reminder.dayOfWeek]} at {reminder.time}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleRemoveReminder(reminder.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reminders set yet</p>
            )}
          </Card>
        )}

        {/* Info Section */}
        <Card className="p-4 bg-muted border border-border">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tip:</strong> Enable notifications to get workout reminders and achievement alerts. Your preferences are saved automatically.
          </p>
        </Card>
      </div>
    </div>
  );
}
