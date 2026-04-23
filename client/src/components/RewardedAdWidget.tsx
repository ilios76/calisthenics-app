import React, { useState, useEffect } from 'react';
import { Play, Clock, Gift } from 'lucide-react';
import { RewardedAdsService } from '@/services/rewardedAdsService';
import { useWorkoutCompletion } from '@/contexts/WorkoutCompletionContext';

interface RewardedAdWidgetProps {
  adId: string;
  onRewardClaimed?: (reward: string, amount: number) => void;
}

export const RewardedAdWidget: React.FC<RewardedAdWidgetProps> = ({
  adId,
  onRewardClaimed,
}) => {
  const { completeWorkout } = useWorkoutCompletion();
  const [isAvailable, setIsAvailable] = useState(false);
  const [timeUntilAvailable, setTimeUntilAvailable] = useState(0);
  const [isWatching, setIsWatching] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const ad = RewardedAdsService.getAd(adId);

  useEffect(() => {
    const checkAvailability = () => {
      setIsAvailable(RewardedAdsService.isAdAvailable(adId));
      setTimeUntilAvailable(RewardedAdsService.getTimeUntilAvailable(adId));
    };

    checkAvailability();
    const interval = setInterval(checkAvailability, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [adId]);

  if (!ad) return null;

  const handleWatchAd = () => {
    setIsWatching(true);

    // Simulate ad watching (3 seconds)
    setTimeout(() => {
      setIsWatching(false);
      setIsCompleted(true);

      // Record the watch
      RewardedAdsService.recordAdWatch(adId, true);

      // Apply reward
      if (ad.reward === 'extra_xp') {
        completeWorkout(ad.rewardAmount);
      }

      // Notify parent
      if (onRewardClaimed) {
        onRewardClaimed(ad.reward, ad.rewardAmount);
      }

      // Reset after 2 seconds
      setTimeout(() => {
        setIsCompleted(false);
        setIsAvailable(false);
      }, 2000);
    }, 3000);
  };

  return (
    <div
      className="p-4 rounded-lg border-2 transition-all"
      style={{
        borderColor: isAvailable
          ? 'oklch(0.68 0.18 142)'
          : 'oklch(0.20 0.005 285)',
        background: isAvailable
          ? 'oklch(0.68 0.18 142 / 10%)'
          : 'oklch(0.15 0.006 285)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gift size={18} style={{ color: 'oklch(0.68 0.18 142)' }} />
          <h3
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: 'oklch(0.96 0.008 80)',
              textTransform: 'uppercase',
            }}
          >
            {ad.title}
          </h3>
        </div>
      </div>

      <p
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.85rem',
          color: 'oklch(0.65 0.01 285)',
          marginBottom: '12px',
        }}
      >
        {ad.description}
      </p>

      {isWatching ? (
        <div className="flex items-center justify-center gap-2 py-3">
          <div
            className="animate-spin rounded-full h-4 w-4"
            style={{ borderTop: '2px solid oklch(0.68 0.18 142)' }}
          />
          <span
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.85rem',
              color: 'oklch(0.68 0.18 142)',
            }}
          >
            Watching ad...
          </span>
        </div>
      ) : isCompleted ? (
        <div
          className="py-3 text-center rounded"
          style={{
            background: 'oklch(0.68 0.18 142 / 15%)',
            border: '1px solid oklch(0.68 0.18 142)',
          }}
        >
          <p
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: 'oklch(0.68 0.18 142)',
              textTransform: 'uppercase',
            }}
          >
            ✓ Reward Claimed!
          </p>
        </div>
      ) : isAvailable ? (
        <button
          onClick={handleWatchAd}
          className="w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
          style={{
            background: 'oklch(0.68 0.18 142)',
            color: 'oklch(0.10 0.005 285)',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
            fontSize: '0.85rem',
          }}
        >
          <Play size={14} /> Watch Ad
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 py-2">
          <Clock size={14} style={{ color: 'oklch(0.65 0.01 285)' }} />
          <span
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.85rem',
              color: 'oklch(0.65 0.01 285)',
            }}
          >
            Available in {timeUntilAvailable}m
          </span>
        </div>
      )}
    </div>
  );
};
