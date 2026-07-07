// ============================================================
// CallistheniX – Streak Counter Component
// Visual streak display with gamification
// ============================================================
import { trpc } from '@/lib/trpc';
import { Flame, Award } from 'lucide-react';
import { useEffect, useState } from 'react';

export const StreakCounter = () => {
  const { data: streak, refetch } = trpc.streak.getStreak.useQuery();
  const recordActivityMutation = trpc.streak.recordActivity.useMutation();
  const [showMilestoneAnimation, setShowMilestoneAnimation] = useState(false);
  const [milestoneText, setMilestoneText] = useState('');

  const handleRecordActivity = async () => {
    const result = await recordActivityMutation.mutateAsync({});
    if (result.milestonReached) {
      setMilestoneText(`🔥 ${result.milestonReached} Day Streak!`);
      setShowMilestoneAnimation(true);
      setTimeout(() => setShowMilestoneAnimation(false), 3000);
    }
    refetch();
  };

  if (!streak) return null;

  const milestones = streak.milestonesReached
    ? streak.milestonesReached.split(',').map(Number)
    : [];

  return (
    <div className="relative">
      {/* Main Streak Card */}
      <div
        className="rounded-2xl p-6 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, oklch(0.68 0.18 142 / 20%), oklch(0.68 0.18 142 / 10%))',
          border: '1px solid oklch(0.68 0.18 142 / 30%)',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Flame
              size={48}
              style={{ color: 'oklch(0.68 0.18 142)' }}
              className="animate-pulse"
            />
            <span
              className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
              style={{ color: 'oklch(0.68 0.18 142)' }}
            >
              {streak.currentStreak}
            </span>
          </div>

          <div>
            <h3
              className="text-lg font-bold"
              style={{ color: 'oklch(0.96 0.008 80)' }}
            >
              Current Streak
            </h3>
            <p style={{ color: 'oklch(0.70 0.008 80)', fontSize: '0.9rem' }}>
              Keep it going! 💪
            </p>
          </div>
        </div>

        <button
          onClick={handleRecordActivity}
          disabled={recordActivityMutation.isPending}
          className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
          style={{
            background: 'oklch(0.68 0.18 142)',
            color: 'oklch(0.10 0.005 285)',
          }}
        >
          {recordActivityMutation.isPending ? 'Recording...' : 'Log Today'}
        </button>
      </div>

      {/* Milestone Animation */}
      {showMilestoneAnimation && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold animate-bounce"
          style={{ color: 'oklch(0.68 0.18 142)', zIndex: 50 }}
        >
          {milestoneText}
        </div>
      )}

      {/* Longest Streak & Milestones */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Longest Streak */}
        <div
          className="rounded-lg p-4"
          style={{
            background: 'oklch(0.14 0.006 285)',
            border: '1px solid oklch(1 0 0 / 10%)',
          }}
        >
          <p style={{ color: 'oklch(0.60 0.008 80)', fontSize: '0.85rem' }}>
            Longest Streak
          </p>
          <p
            className="text-2xl font-bold mt-1"
            style={{ color: 'oklch(0.68 0.18 142)' }}
          >
            {streak.longestStreak} days
          </p>
        </div>

        {/* Milestones Reached */}
        <div
          className="rounded-lg p-4"
          style={{
            background: 'oklch(0.14 0.006 285)',
            border: '1px solid oklch(1 0 0 / 10%)',
          }}
        >
          <p style={{ color: 'oklch(0.60 0.008 80)', fontSize: '0.85rem' }}>
            Milestones
          </p>
          <div className="flex items-center gap-1 mt-1">
            {[7, 14, 30, 60, 90, 180, 365].map((m) => (
              <Award
                key={m}
                size={20}
                style={{
                  color: milestones.includes(m)
                    ? 'oklch(0.68 0.18 142)'
                    : 'oklch(0.60 0.008 80)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Milestone Labels */}
      <div
        className="mt-4 p-3 rounded-lg text-xs"
        style={{
          background: 'oklch(0.14 0.006 285)',
          border: '1px solid oklch(1 0 0 / 10%)',
          color: 'oklch(0.70 0.008 80)',
        }}
      >
        <p className="font-semibold mb-2">Unlock badges at: 7, 14, 30, 60, 90, 180, 365 days</p>
        {milestones.length > 0 && (
          <p>
            Unlocked: <span style={{ color: 'oklch(0.68 0.18 142)' }}>{milestones.join(', ')}</span>
          </p>
        )}
      </div>
    </div>
  );
};
