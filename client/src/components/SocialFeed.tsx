import React from 'react';
import { Heart, MessageCircle, Share2, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressShare } from '@/lib/socialSystem';

interface SocialFeedProps {
  shares: ProgressShare[];
  onLike: (shareId: string) => void;
  onComment: (shareId: string) => void;
  onShare: (shareId: string) => void;
  currentUserId: string;
}

export function SocialFeed({
  shares,
  onLike,
  onComment,
  onShare,
  currentUserId,
}: SocialFeedProps) {
  const getShareIcon = (type: string) => {
    switch (type) {
      case 'workout_complete':
        return '💪';
      case 'milestone_reached':
        return '🏆';
      case 'skill_completed':
        return '⭐';
      case 'challenge_won':
        return '🥇';
      case 'level_up':
        return '📈';
      case 'streak_milestone':
        return '🔥';
      default:
        return '✨';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {shares.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-2">No posts yet</p>
          <p className="text-sm text-gray-500">Complete a workout to share your progress!</p>
        </Card>
      ) : (
        shares.map((share) => (
          <Card key={share.shareId} className="p-4 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                  {share.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{share.username}</p>
                  <p className="text-xs text-gray-500">{getTimeAgo(share.timestamp)}</p>
                </div>
              </div>
              <span className="text-2xl">{getShareIcon(share.type)}</span>
            </div>

            {/* Content */}
            <div className="mb-3">
              <p className="font-semibold text-sm mb-1">{share.title}</p>
              <p className="text-sm text-gray-700">{share.description}</p>
            </div>

            {/* Stats */}
            {share.stats && Object.keys(share.stats).length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 mb-3 grid grid-cols-2 gap-2">
                {Object.entries(share.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-xs text-gray-600 capitalize">{key}</p>
                    <p className="font-bold text-sm">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Engagement */}
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
              {share.likes > 0 && (
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  {share.likes}
                </span>
              )}
              {share.comments > 0 && (
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {share.comments}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => onLike(share.shareId)}
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
              >
                <Heart className="w-4 h-4 mr-1" />
                Like
              </Button>
              <Button
                onClick={() => onComment(share.shareId)}
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Comment
              </Button>
              <Button
                onClick={() => onShare(share.shareId)}
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
