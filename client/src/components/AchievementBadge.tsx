import React from 'react';
import { AchievementBadge as Achievement } from '@/contexts/CoachContext';
import { Lock } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
  showProgress?: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  isUnlocked,
  showProgress = true,
}) => {
  const progress = achievement.currentProgress / achievement.requirement;
  const progressPercent = Math.min(100, (progress * 100).toFixed(0));

  return (
    <div
      className="relative p-4 rounded-lg text-center transition-all"
      style={{
        background: isUnlocked
          ? 'oklch(0.68 0.18 142 / 15%)'
          : 'oklch(0.15 0.006 285)',
        border: isUnlocked
          ? '2px solid oklch(0.68 0.18 142)'
          : '1px solid oklch(0.20 0.005 285)',
        opacity: isUnlocked ? 1 : 0.6,
      }}
    >
      {/* Icon */}
      <div className="text-4xl mb-2">
        {isUnlocked ? achievement.icon : <Lock size={32} style={{ color: 'oklch(0.50 0.008 80)' }} />}
      </div>

      {/* Name */}
      <h3
        style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700,
          fontSize: '0.85rem',
          color: isUnlocked ? 'oklch(0.96 0.008 80)' : 'oklch(0.65 0.01 285)',
          textTransform: 'uppercase',
          marginBottom: '4px',
        }}
      >
        {achievement.name}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.75rem',
          color: 'oklch(0.55 0.008 80)',
          marginBottom: '8px',
        }}
      >
        {achievement.description}
      </p>

      {/* Progress bar */}
      {showProgress && !isUnlocked && (
        <div>
          <div
            className="w-full h-2 rounded-full overflow-hidden mb-2"
            style={{ background: 'oklch(0.20 0.005 285)' }}
          >
            <div
              className="h-full transition-all"
              style={{
                width: `${progressPercent}%`,
                background: 'oklch(0.68 0.18 142)',
              }}
            />
          </div>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.7rem',
              color: 'oklch(0.55 0.008 80)',
            }}
          >
            {achievement.currentProgress} / {achievement.requirement}
          </p>
        </div>
      )}

      {/* Unlocked badge */}
      {isUnlocked && achievement.unlockedAt && (
        <p
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.7rem',
            color: 'oklch(0.68 0.18 142)',
            marginTop: '8px',
          }}
        >
          ✓ Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};
