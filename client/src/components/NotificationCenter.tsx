import React, { useState, useEffect } from 'react';
import { Bell, Trash2, Archive } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PushNotification, PushNotificationService } from '@/services/pushNotificationService';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    const history = await PushNotificationService.getNotificationHistory(50);
    setNotifications(history);
    setLoading(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await PushNotificationService.markAsRead(notificationId);
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleDelete = (notificationId: string) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'workout_reminder':
        return '💪';
      case 'streak_milestone':
        return '🔥';
      case 'coach_recommendation':
        return '🤖';
      case 'daily_engagement':
        return '✨';
      case 'achievement_unlocked':
        return '🏆';
      case 'friend_challenge':
        return '⚡';
      case 'leaderboard_update':
        return '📊';
      default:
        return '🔔';
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === 'unread' ? !n.read : true
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return <div className="text-center py-8">Loading notifications...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          onClick={() => setFilter('all')}
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
        >
          All ({notifications.length})
        </Button>
        <Button
          onClick={() => setFilter('unread')}
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card className="p-8 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">
            {filter === 'unread'
              ? 'No unread notifications'
              : 'No notifications yet'}
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 flex items-start gap-4 transition-colors ${
                notification.read
                  ? 'bg-white hover:bg-gray-50'
                  : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
              }`}
            >
              {/* Icon */}
              <div className="text-2xl flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${
                  notification.read ? 'text-gray-900' : 'text-blue-900'
                }`}>
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.body}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {formatTime(notification.timestamp)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                {!notification.read && (
                  <Button
                    onClick={() => handleMarkAsRead(notification.id)}
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                  >
                    <Archive className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(notification.id)}
                  size="sm"
                  variant="ghost"
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(date).toLocaleDateString();
}
