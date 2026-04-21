// ============================================================
// CallistheniX – Social Features System
// Progress Sharing, Leaderboards, Friend Challenges
// ============================================================

export type ShareType = 'workout_complete' | 'milestone' | 'skill_step' | 'challenge_complete' | 'level_up' | 'streak_milestone';
export type Visibility = 'public' | 'friends' | 'private';
export type LeaderboardType = 'global' | 'friends' | 'weekly' | 'skill' | 'challenge';
export type LeaderboardPeriod = 'all_time' | 'weekly' | 'monthly';

// ============================================================
// Progress Sharing System
// ============================================================

export interface Comment {
  commentId: string;
  userId: string;
  username: string;
  avatar?: string;
  text: string;
  timestamp: Date;
  likes: number;
}

export interface ProgressShare {
  shareId: string;
  userId: string;
  username: string;
  avatar?: string;
  type: ShareType;
  content: {
    title: string;
    description: string;
    stats: {
      reps?: number;
      sets?: number;
      duration?: number;
      exerciseName?: string;
      skillName?: string;
      level?: number;
      streak?: number;
    };
    imageUrl?: string;
    timestamp: Date;
  };
  visibility: Visibility;
  likes: number;
  comments: Comment[];
  likedBy: string[]; // user IDs
  shares: number;
}

export class ProgressShareManager {
  /**
   * Create a progress share
   */
  static createShare(
    userId: string,
    username: string,
    type: ShareType,
    content: ProgressShare['content'],
    visibility: Visibility = 'public'
  ): ProgressShare {
    return {
      shareId: `share-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      username,
      type,
      content,
      visibility,
      likes: 0,
      comments: [],
      likedBy: [],
      shares: 0,
    };
  }

  /**
   * Generate share message based on type
   */
  static generateShareMessage(type: ShareType, stats: any): string {
    const messages: Record<ShareType, (stats: any) => string> = {
      'workout_complete': (s) => `Just crushed ${s.reps} ${s.exerciseName}s! 💪 #calisthenics #fitness`,
      'milestone': (s) => `Reached Level ${s.level}! 🎉 #CallistheniX #LevelUp`,
      'skill_step': (s) => `Completed ${s.skillName} Step ${s.stats.stepNumber}! 🚀 #SkillPath #Calisthenics`,
      'challenge_complete': (s) => `Completed the ${s.challengeName} challenge! 🏆 #Challenge #Fitness`,
      'level_up': (s) => `Just leveled up to ${s.level}! 🎊 #CallistheniX #Progress`,
      'streak_milestone': (s) => `${s.streak}-day streak! 🔥 #Consistency #Motivation`,
    };

    return messages[type]?.(stats) || 'Check out my progress on CallistheniX!';
  }

  /**
   * Add like to share
   */
  static addLike(share: ProgressShare, userId: string): ProgressShare {
    if (!share.likedBy.includes(userId)) {
      return {
        ...share,
        likes: share.likes + 1,
        likedBy: [...share.likedBy, userId],
      };
    }
    return share;
  }

  /**
   * Remove like from share
   */
  static removeLike(share: ProgressShare, userId: string): ProgressShare {
    if (share.likedBy.includes(userId)) {
      return {
        ...share,
        likes: share.likes - 1,
        likedBy: share.likedBy.filter(id => id !== userId),
      };
    }
    return share;
  }

  /**
   * Add comment to share
   */
  static addComment(
    share: ProgressShare,
    userId: string,
    username: string,
    text: string
  ): ProgressShare {
    const comment: Comment = {
      commentId: `comment-${Date.now()}`,
      userId,
      username,
      text,
      timestamp: new Date(),
      likes: 0,
    };

    return {
      ...share,
      comments: [...share.comments, comment],
    };
  }

  /**
   * Get shares for feed
   */
  static getFeedShares(shares: ProgressShare[], userId: string, friends: string[]): ProgressShare[] {
    return shares.filter(share => {
      if (share.visibility === 'public') return true;
      if (share.visibility === 'friends' && (friends.includes(share.userId) || share.userId === userId)) return true;
      if (share.visibility === 'private' && share.userId === userId) return true;
      return false;
    });
  }
}

// ============================================================
// Leaderboard System
// ============================================================

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  score: number;
  metadata: {
    level?: number;
    streak?: number;
    totalXP?: number;
    totalWorkouts?: number;
    skillName?: string;
  };
}

export interface Leaderboard {
  leaderboardId: string;
  type: LeaderboardType;
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
  userRank?: number;
  userScore?: number;
  lastUpdated: Date;
}

export class LeaderboardManager {
  /**
   * Create leaderboard
   */
  static createLeaderboard(
    type: LeaderboardType,
    period: LeaderboardPeriod,
    entries: LeaderboardEntry[]
  ): Leaderboard {
    return {
      leaderboardId: `leaderboard-${type}-${period}-${Date.now()}`,
      type,
      period,
      entries: entries.sort((a, b) => b.score - a.score).map((entry, index) => ({
        ...entry,
        rank: index + 1,
      })),
      lastUpdated: new Date(),
    };
  }

  /**
   * Get user rank in leaderboard
   */
  static getUserRank(leaderboard: Leaderboard, userId: string): LeaderboardEntry | null {
    return leaderboard.entries.find(entry => entry.userId === userId) || null;
  }

  /**
   * Get top entries
   */
  static getTopEntries(leaderboard: Leaderboard, limit: number = 10): LeaderboardEntry[] {
    return leaderboard.entries.slice(0, limit);
  }

  /**
   * Get entries around user
   */
  static getEntriesAroundUser(
    leaderboard: Leaderboard,
    userId: string,
    range: number = 5
  ): LeaderboardEntry[] {
    const userEntry = this.getUserRank(leaderboard, userId);
    if (!userEntry) return [];

    const startIndex = Math.max(0, userEntry.rank - range - 1);
    const endIndex = Math.min(leaderboard.entries.length, userEntry.rank + range);

    return leaderboard.entries.slice(startIndex, endIndex);
  }

  /**
   * Get leaderboard type description
   */
  static getLeaderboardDescription(type: LeaderboardType): string {
    const descriptions: Record<LeaderboardType, string> = {
      'global': 'Global XP Leaderboard - All-time rankings',
      'friends': 'Friends Leaderboard - Compete with your friends',
      'weekly': 'Weekly Streak Leaderboard - This week\'s top streaks',
      'skill': 'Skill-Specific Leaderboard - Master a specific skill',
      'challenge': 'Challenge Leaderboard - Current challenge rankings',
    };

    return descriptions[type];
  }
}

// ============================================================
// Friend System
// ============================================================

export interface Friend {
  userId: string;
  username: string;
  avatar?: string;
  addedDate: Date;
  status: 'active' | 'inactive';
  lastSeen: Date;
}

export interface FriendRequest {
  requestId: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdDate: Date;
}

export class FriendManager {
  /**
   * Create friend request
   */
  static createFriendRequest(fromUserId: string, toUserId: string): FriendRequest {
    return {
      requestId: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fromUserId,
      toUserId,
      status: 'pending',
      createdDate: new Date(),
    };
  }

  /**
   * Accept friend request
   */
  static acceptFriendRequest(request: FriendRequest): FriendRequest {
    return {
      ...request,
      status: 'accepted',
    };
  }

  /**
   * Reject friend request
   */
  static rejectFriendRequest(request: FriendRequest): FriendRequest {
    return {
      ...request,
      status: 'rejected',
    };
  }

  /**
   * Add friend
   */
  static addFriend(userId: string, username: string, avatar?: string): Friend {
    return {
      userId,
      username,
      avatar,
      addedDate: new Date(),
      status: 'active',
      lastSeen: new Date(),
    };
  }

  /**
   * Remove friend
   */
  static removeFriend(friends: Friend[], userId: string): Friend[] {
    return friends.filter(f => f.userId !== userId);
  }

  /**
   * Get friend status
   */
  static getFriendStatus(friends: Friend[], userId: string): Friend | null {
    return friends.find(f => f.userId === userId) || null;
  }
}

// ============================================================
// Friend Challenge System
// ============================================================

export interface FriendChallenge {
  challengeId: string;
  challenger: {
    userId: string;
    username: string;
    avatar?: string;
  };
  opponent: {
    userId: string;
    username: string;
    avatar?: string;
  };
  type: 'reps' | 'streak' | 'skill' | 'xp';
  target: number;
  duration: number; // days
  status: 'pending' | 'active' | 'completed';
  startDate: Date;
  endDate: Date;
  results?: {
    challengerScore: number;
    opponentScore: number;
    winner?: string; // user ID
    winnerUsername?: string;
  };
}

export class FriendChallengeManager {
  /**
   * Create friend challenge
   */
  static createChallenge(
    challenger: FriendChallenge['challenger'],
    opponent: FriendChallenge['opponent'],
    type: FriendChallenge['type'],
    target: number,
    duration: number = 7
  ): FriendChallenge {
    return {
      challengeId: `challenge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      challenger,
      opponent,
      type,
      target,
      duration,
      status: 'pending',
      startDate: new Date(),
      endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
    };
  }

  /**
   * Accept challenge
   */
  static acceptChallenge(challenge: FriendChallenge): FriendChallenge {
    return {
      ...challenge,
      status: 'active',
      startDate: new Date(),
    };
  }

  /**
   * Reject challenge
   */
  static rejectChallenge(challenge: FriendChallenge): FriendChallenge {
    return {
      ...challenge,
      status: 'completed',
    };
  }

  /**
   * Complete challenge
   */
  static completeChallenge(
    challenge: FriendChallenge,
    challengerScore: number,
    opponentScore: number
  ): FriendChallenge {
    const winner = challengerScore > opponentScore ? challenge.challenger.userId : challenge.opponent.userId;
    const winnerUsername = challengerScore > opponentScore ? challenge.challenger.username : challenge.opponent.username;

    return {
      ...challenge,
      status: 'completed',
      results: {
        challengerScore,
        opponentScore,
        winner,
        winnerUsername,
      },
    };
  }

  /**
   * Get challenge description
   */
  static getChallengeDescription(challenge: FriendChallenge): string {
    const descriptions: Record<FriendChallenge['type'], (target: number) => string> = {
      'reps': (target) => `Who can do more ${target} reps?`,
      'streak': (target) => `Who can maintain a ${target}-day streak?`,
      'skill': (target) => `Who can complete ${target} skill steps?`,
      'xp': (target) => `Who can earn ${target} XP?`,
    };

    return descriptions[challenge.type]?.(challenge.target) || 'Challenge';
  }
}

// ============================================================
// Social Manager (Unified)
// ============================================================

export interface SocialState {
  friends: Friend[];
  friendRequests: FriendRequest[];
  shares: ProgressShare[];
  leaderboards: Leaderboard[];
  friendChallenges: FriendChallenge[];
}

export class SocialManager {
  /**
   * Create initial social state
   */
  static createInitialState(): SocialState {
    return {
      friends: [],
      friendRequests: [],
      shares: [],
      leaderboards: [],
      friendChallenges: [],
    };
  }

  /**
   * Get user feed
   */
  static getUserFeed(state: SocialState, userId: string): ProgressShare[] {
    const friendIds = state.friends.map(f => f.userId);
    return ProgressShareManager.getFeedShares(state.shares, userId, friendIds)
      .sort((a, b) => b.content.timestamp.getTime() - a.content.timestamp.getTime())
      .slice(0, 50); // Last 50 shares
  }

  /**
   * Get friend leaderboard
   */
  static getFriendsLeaderboard(state: SocialState, userId: string): Leaderboard | null {
    return state.leaderboards.find(lb => lb.type === 'friends') || null;
  }

  /**
   * Get global leaderboard
   */
  static getGlobalLeaderboard(state: SocialState): Leaderboard | null {
    return state.leaderboards.find(lb => lb.type === 'global') || null;
  }

  /**
   * Get active friend challenges
   */
  static getActiveChallenges(state: SocialState, userId: string): FriendChallenge[] {
    return state.friendChallenges.filter(
      challenge =>
        challenge.status === 'active' &&
        (challenge.challenger.userId === userId || challenge.opponent.userId === userId)
    );
  }

  /**
   * Get pending friend requests
   */
  static getPendingRequests(state: SocialState, userId: string): FriendRequest[] {
    return state.friendRequests.filter(
      req => req.toUserId === userId && req.status === 'pending'
    );
  }
}
