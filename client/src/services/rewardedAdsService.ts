// ============================================================
// CallistheniX – Rewarded Ads Service
// Handles rewarded video ads for premium features
// ============================================================

export interface RewardedAd {
  id: string;
  type: 'video' | 'banner';
  reward: 'extra_xp' | 'free_trial_day' | 'premium_feature_unlock';
  rewardAmount: number;
  title: string;
  description: string;
  cooldownMinutes: number;
}

export interface AdWatchRecord {
  adId: string;
  watchedAt: Date;
  completed: boolean;
  reward: string;
}

const REWARDED_ADS: Record<string, RewardedAd> = {
  xp_boost: {
    id: 'xp_boost',
    type: 'video',
    reward: 'extra_xp',
    rewardAmount: 50,
    title: 'Boost Your XP',
    description: 'Watch a short video to earn 50 bonus XP',
    cooldownMinutes: 60,
  },
  trial_extension: {
    id: 'trial_extension',
    type: 'video',
    reward: 'free_trial_day',
    rewardAmount: 1,
    title: 'Extend Your Trial',
    description: 'Watch a video to add 1 day to your free trial',
    cooldownMinutes: 1440, // 24 hours
  },
  feature_unlock: {
    id: 'feature_unlock',
    type: 'video',
    reward: 'premium_feature_unlock',
    rewardAmount: 1,
    title: 'Unlock Premium Features',
    description: 'Watch a video to unlock premium features for 24 hours',
    cooldownMinutes: 1440,
  },
};

const STORAGE_KEY = 'callisthenix_ad_watches';

export class RewardedAdsService {
  /**
   * Get all available rewarded ads
   */
  static getAvailableAds(): RewardedAd[] {
    return Object.values(REWARDED_ADS);
  }

  /**
   * Get specific ad by ID
   */
  static getAd(adId: string): RewardedAd | null {
    return REWARDED_ADS[adId] || null;
  }

  /**
   * Check if ad is available (not on cooldown)
   */
  static isAdAvailable(adId: string): boolean {
    try {
      const watches = this.getAdWatches();
      const lastWatch = watches.find(w => w.adId === adId && w.completed);

      if (!lastWatch) return true;

      const ad = this.getAd(adId);
      if (!ad) return false;

      const cooldownMs = ad.cooldownMinutes * 60 * 1000;
      const timeSinceWatch = Date.now() - lastWatch.watchedAt.getTime();

      return timeSinceWatch >= cooldownMs;
    } catch {
      return true;
    }
  }

  /**
   * Get time until ad is available again (in minutes)
   */
  static getTimeUntilAvailable(adId: string): number {
    try {
      const watches = this.getAdWatches();
      const lastWatch = watches.find(w => w.adId === adId && w.completed);

      if (!lastWatch) return 0;

      const ad = this.getAd(adId);
      if (!ad) return 0;

      const cooldownMs = ad.cooldownMinutes * 60 * 1000;
      const timeSinceWatch = Date.now() - lastWatch.watchedAt.getTime();
      const timeRemaining = cooldownMs - timeSinceWatch;

      return Math.max(0, Math.ceil(timeRemaining / 60000)); // Return in minutes
    } catch {
      return 0;
    }
  }

  /**
   * Record ad watch
   */
  static recordAdWatch(adId: string, completed: boolean = true): void {
    try {
      const watches = this.getAdWatches();
      const ad = this.getAd(adId);

      if (!ad) return;

      watches.push({
        adId,
        watchedAt: new Date(),
        completed,
        reward: ad.reward,
      });

      // Keep only last 100 records
      if (watches.length > 100) {
        watches.shift();
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(watches));
    } catch (error) {
      console.error('Error recording ad watch:', error);
    }
  }

  /**
   * Get all ad watch records
   */
  static getAdWatches(): AdWatchRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const watches = JSON.parse(data) as Array<{
        adId: string;
        watchedAt: string;
        completed: boolean;
        reward: string;
      }>;

      return watches.map(w => ({
        ...w,
        watchedAt: new Date(w.watchedAt),
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get total XP earned from ads
   */
  static getTotalXpFromAds(): number {
    try {
      const watches = this.getAdWatches();
      return watches
        .filter(w => w.completed && w.reward === 'extra_xp')
        .reduce((sum, w) => sum + 50, 0); // Each XP ad gives 50 XP
    } catch {
      return 0;
    }
  }

  /**
   * Get total trial days earned from ads
   */
  static getTotalTrialDaysFromAds(): number {
    try {
      const watches = this.getAdWatches();
      return watches.filter(
        w => w.completed && w.reward === 'free_trial_day'
      ).length;
    } catch {
      return 0;
    }
  }

  /**
   * Clear all ad watch history
   */
  static clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing ad history:', error);
    }
  }
}
