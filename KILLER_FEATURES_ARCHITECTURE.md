# CallistheniX – Killer Features Architecture

## Overview

This document outlines the complete architecture for implementing 6 market-leading features that will differentiate CallistheniX from competitors:

1. **Auto Progression System** - Intelligent workout progression
2. **Skill-Based Training Paths** - Structured calisthenics progressions
3. **Coach AI** - Rule-based intelligent recommendations
4. **Gamification** - Streaks, levels, challenges, unlockables
5. **Social Features** - Leaderboards, progress sharing, friends
6. **Offline Mode** - Local caching and sync

---

## 1. Auto Progression System

### Purpose

Transform the app from a simple tracker into an intelligent coach that automatically adjusts workout difficulty based on performance.

### Architecture

```typescript
interface ProgressionMetrics {
  exerciseId: string;
  userId: string;
  
  // Performance tracking
  completedReps: number;
  targetReps: number;
  completedSets: number;
  targetSets: number;
  
  // Progression state
  currentLevel: 1 | 2 | 3 | 4 | 5 | 6; // Beginner to Elite
  progressionStreak: number; // Days of consistent progression
  plateauDays: number; // Days without improvement
  
  // Adaptive difficulty
  difficultyMultiplier: number; // 0.8 - 1.2
  lastProgressionDate: Date;
  lastDeloadDate: Date;
}

interface ProgressionRule {
  condition: (metrics: ProgressionMetrics) => boolean;
  action: (metrics: ProgressionMetrics) => ProgressionMetrics;
  description: string;
}
```

### Progression Rules

**Rule 1: Auto Progression (Success)**
- **Condition**: User completes 120% of target reps for 3 consecutive sessions
- **Action**: Increase difficulty by 1 level, reset streak
- **Example**: 10 pushups → 12 pushups target

**Rule 2: Deload (Fatigue)**
- **Condition**: User fails to complete 80% of target reps for 3 consecutive sessions
- **Action**: Decrease difficulty by 1 level, suggest 2-day rest
- **Example**: 12 pushups → 10 pushups target

**Rule 3: Adaptive Difficulty (Performance)**
- **Condition**: User completes exactly target reps (±5%)
- **Action**: Keep difficulty, increase volume (sets/reps)
- **Example**: 10 pushups × 3 sets → 10 pushups × 4 sets

**Rule 4: Plateau Break**
- **Condition**: No progression for 14 days
- **Action**: Suggest variation (different grip, tempo, ROM)
- **Example**: Standard pushup → Diamond pushup

**Rule 5: Recovery Suggestion**
- **Condition**: Streak > 20 days AND performance declining
- **Action**: Suggest deload week (60% volume)
- **Example**: "You've been training hard. Take it easy this week."

**Rule 6: Challenge Unlock**
- **Condition**: User reaches level 5+ on exercise
- **Action**: Unlock advanced variation
- **Example**: Unlock "Archer Pushup" after mastering standard pushup

### Data Model

```typescript
// Firestore: /users/{uid}/exerciseProgress/{exerciseId}
{
  exerciseId: "pushup",
  currentLevel: 3,
  targetReps: 12,
  targetSets: 3,
  completedReps: 12,
  completedSets: 3,
  progressionStreak: 5,
  plateauDays: 0,
  difficultyMultiplier: 1.0,
  lastProgressionDate: "2026-04-21",
  lastDeloadDate: "2026-04-07",
  history: [
    { date: "2026-04-21", reps: 12, sets: 3, completed: true },
    { date: "2026-04-20", reps: 12, sets: 3, completed: true },
    // ... more history
  ]
}
```

---

## 2. Skill-Based Training Paths

### Purpose

Provide structured, goal-oriented progressions for advanced calisthenics skills. Users don't just do exercises—they follow a "roadmap to mastery."

### Supported Skills

#### Skill 1: Muscle-Up (10 Steps)

| Step | Name | Exercise | Reps | Difficulty |
|------|------|----------|------|------------|
| 1 | Dead Hang | Hang from bar | 30s | Beginner |
| 2 | Scapular Pull | Pull shoulder blades up | 10 | Beginner |
| 3 | Negative Muscle-Up | Jump to top, lower slowly | 5 | Beginner |
| 4 | Assisted Muscle-Up | Band-assisted | 5 | Intermediate |
| 5 | Jumping Muscle-Up | Jump-assisted | 5 | Intermediate |
| 6 | Half Muscle-Up | Partial ROM | 5 | Intermediate |
| 7 | Muscle-Up (Strict) | Full ROM, no momentum | 3 | Advanced |
| 8 | Muscle-Up (Explosive) | Fast, controlled | 5 | Advanced |
| 9 | Muscle-Up (Multiple) | 5 consecutive | 5 | Elite |
| 10 | Muscle-Up (Weighted) | With weight | 3 | Elite |

#### Skill 2: Handstand (12 Steps)

| Step | Name | Exercise | Duration | Difficulty |
|------|------|----------|----------|------------|
| 1 | Wall Hold | Back to wall | 30s | Beginner |
| 2 | Chest to Wall | Face to wall | 30s | Beginner |
| 3 | Kick-up Practice | Practice balance | 10 reps | Beginner |
| 4 | Wall Hold (Chest Out) | Hollow body position | 30s | Intermediate |
| 5 | Free Standing (Assisted) | Hold wall with fingers | 10s | Intermediate |
| 6 | Free Standing (Balance) | Hold without wall | 5s | Intermediate |
| 7 | Free Standing (Stable) | Hold steady | 15s | Advanced |
| 8 | Free Standing (Extended) | Hold extended | 30s | Advanced |
| 9 | Handstand Walk | 5 meters | 1 rep | Advanced |
| 10 | Handstand Push-Up | Strict form | 3 reps | Elite |
| 11 | Handstand Push-Up (Deficit) | Elevated surface | 3 reps | Elite |
| 12 | Freestanding Handstand | 60+ seconds | 1 rep | Elite |

#### Skill 3: Front Lever (8 Steps)

| Step | Name | Exercise | Duration | Difficulty |
|------|------|----------|----------|------------|
| 1 | Dead Hang | Hang from bar | 30s | Beginner |
| 2 | Tuck Front Lever | Knees to chest | 10s | Beginner |
| 3 | Single Leg Front Lever | One leg extended | 10s | Intermediate |
| 4 | Straddle Front Lever | Legs wide | 10s | Intermediate |
| 5 | Advanced Tuck | Hips higher | 15s | Advanced |
| 6 | One Leg Straddle | One leg extended | 15s | Advanced |
| 7 | Straddle Front Lever (Full) | Full ROM | 20s | Elite |
| 8 | Full Front Lever | Legs together | 10s | Elite |

#### Skill 4: Planche (10 Steps)

| Step | Name | Exercise | Duration | Difficulty |
|------|------|----------|----------|------------|
| 1 | Plank Hold | Ground plank | 60s | Beginner |
| 2 | Parallettes Plank | Elevated | 60s | Beginner |
| 3 | Tuck Planche | Knees to chest | 10s | Intermediate |
| 4 | Tuck Planche (Elevated) | On parallettes | 15s | Intermediate |
| 5 | Advanced Tuck | Hips higher | 15s | Intermediate |
| 6 | Single Leg Tuck | One leg extended | 15s | Advanced |
| 7 | Straddle Planche | Legs wide | 10s | Advanced |
| 8 | Planche (Full) | Legs together | 5s | Elite |
| 9 | Planche Lean | Lean forward | 10s | Elite |
| 10 | Planche Hold (Extended) | 20+ seconds | 1 rep | Elite |

### Data Model

```typescript
interface SkillPath {
  skillId: string; // "muscle-up", "handstand", etc.
  skillName: string;
  description: string;
  totalSteps: number;
  estimatedDuration: string; // "3-6 months"
  steps: SkillStep[];
}

interface SkillStep {
  stepNumber: number;
  name: string;
  description: string;
  exercise: string;
  targetReps?: number;
  targetDuration?: number; // seconds
  difficulty: "beginner" | "intermediate" | "advanced" | "elite";
  prerequisites: number[]; // step numbers that must be completed first
  tips: string[];
}

interface UserSkillProgress {
  userId: string;
  skillId: string;
  currentStep: number;
  completedSteps: number[];
  startDate: Date;
  lastProgressDate: Date;
  estimatedCompletionDate: Date;
}
```

### Firestore Structure

```
/users/{uid}/skillPaths/{skillId}
{
  skillId: "muscle-up",
  skillName: "Muscle-Up",
  currentStep: 3,
  completedSteps: [1, 2],
  startDate: "2026-04-01",
  lastProgressDate: "2026-04-21",
  estimatedCompletionDate: "2026-07-01",
  progress: [
    { step: 1, completedDate: "2026-04-01", attempts: 5 },
    { step: 2, completedDate: "2026-04-08", attempts: 12 },
    { step: 3, completedDate: "2026-04-21", attempts: 8 }
  ]
}
```

---

## 3. Coach AI (Rule-Based)

### Purpose

Provide personalized, intelligent recommendations that make users feel like they have a personal trainer.

### Coach Rules Engine

```typescript
interface CoachRecommendation {
  type: "motivation" | "warning" | "suggestion" | "celebration";
  priority: "low" | "medium" | "high";
  message: string;
  action?: string; // "start_light_workout", "take_rest_day", etc.
  timestamp: Date;
}

interface CoachContext {
  userId: string;
  currentStreak: number;
  totalWorkouts: number;
  recentPerformance: number[]; // last 7 days performance %
  plateauDays: number;
  lastRestDay: Date;
  averageRecoveryTime: number; // hours
  currentLevel: number;
  goalType: "lose_weight" | "gain_muscle" | "stay_slim";
}
```

### Coach Rules

**Rule 1: Performance Decline Warning**
```
IF: Last 3 workouts < 80% of target
THEN: "You seem tired. How about a lighter session today?"
TYPE: warning
PRIORITY: high
```

**Rule 2: Plateau Breakthrough**
```
IF: No progression for 14 days
THEN: "Let's try a different variation to break through!"
ACTION: suggest_variation
PRIORITY: medium
```

**Rule 3: Streak Celebration**
```
IF: Streak >= 7 days
THEN: "🔥 Amazing! 7-day streak! Keep it up!"
TYPE: celebration
PRIORITY: low
```

**Rule 4: Recovery Suggestion**
```
IF: Streak >= 20 days AND performance declining
THEN: "You've been grinding hard. Take a deload week (60% volume)"
ACTION: suggest_deload_week
PRIORITY: high
```

**Rule 5: Motivation Boost**
```
IF: Streak == 0 AND last_workout > 3 days ago
THEN: "Let's get back on track! Start with a light session"
ACTION: suggest_comeback_workout
PRIORITY: medium
```

**Rule 6: Goal Alignment**
```
IF: Goal == "lose_weight" AND completed_workout == true
THEN: "Great! Keep this up for consistent results"
TYPE: motivation
PRIORITY: low
```

**Rule 7: Skill Path Encouragement**
```
IF: User on skill path AND completed_step == true
THEN: "Step {X} complete! {Y} steps remaining to mastery"
TYPE: celebration
PRIORITY: medium
```

**Rule 8: Recovery Time Warning**
```
IF: Average recovery time < 24 hours AND streak > 10
THEN: "Your body needs more rest. Consider 48-hour recovery"
ACTION: suggest_extended_rest
PRIORITY: high
```

---

## 4. Gamification System

### Purpose

Increase retention and engagement through psychological motivation mechanisms.

### Components

#### 4.1 Streak System

```typescript
interface StreakData {
  userId: string;
  currentStreak: number; // consecutive days
  longestStreak: number;
  lastWorkoutDate: Date;
  streakBroken: number; // total times broken
}
```

**Mechanics:**
- +1 day for completing any workout
- Streak resets if user misses a day
- Notifications at 7, 14, 30, 60, 100 days
- Milestone rewards at key streaks

#### 4.2 Level System

```typescript
interface UserLevel {
  userId: string;
  currentLevel: 1 | 2 | 3 | 4 | 5; // Beginner → Elite
  experiencePoints: number;
  nextLevelXP: number;
  totalXP: number;
}
```

**Progression:**
- Level 1 (Beginner): 0-500 XP
- Level 2 (Intermediate): 500-1500 XP
- Level 3 (Advanced): 1500-3500 XP
- Level 4 (Elite): 3500-7000 XP
- Level 5 (Master): 7000+ XP

**XP Rewards:**
- Complete workout: +50 XP
- Complete skill step: +100 XP
- Break streak: +10 XP
- Reach new PR: +50 XP

#### 4.3 Challenges

```typescript
interface Challenge {
  challengeId: string;
  name: string;
  description: string;
  type: "personal" | "global" | "friend";
  duration: number; // days
  target: number; // reps, days, etc.
  reward: number; // XP
  startDate: Date;
  endDate: Date;
}
```

**Pre-built Challenges:**
- 30-Day Push-Up Challenge (1000 total reps)
- 100 Pull-Ups Challenge
- 7-Day Streak Challenge
- Skill Master Challenge (complete 3 skill steps)
- Consistency Challenge (20 workouts in 30 days)

#### 4.4 Unlockables

```typescript
interface Unlockable {
  unlockableId: string;
  name: string;
  description: string;
  type: "workout" | "badge" | "feature";
  unlockedAt: number; // level or XP threshold
  reward: string;
}
```

**Examples:**
- Level 2: Unlock "Advanced Push-Up Variations"
- Level 3: Unlock "Skill Paths"
- 500 XP: Unlock "Handstand Training"
- Streak 30: Unlock "Coach AI Recommendations"

---

## 5. Social Features

### Purpose

Leverage social motivation to increase engagement and viral growth.

### Components

#### 5.1 Progress Sharing

```typescript
interface ProgressShare {
  shareId: string;
  userId: string;
  type: "workout_complete" | "milestone" | "skill_step";
  content: {
    title: string;
    description: string;
    stats: {
      reps?: number;
      sets?: number;
      duration?: number;
      exerciseName: string;
    };
    imageUrl?: string;
    timestamp: Date;
  };
  visibility: "public" | "friends" | "private";
  likes: number;
  comments: Comment[];
}
```

**Share Types:**
- "Just completed 50 pushups! 💪"
- "Reached Level 3! 🎉"
- "Completed Muscle-Up Step 5! 🚀"
- "30-day streak! 🔥"

#### 5.2 Leaderboards

```typescript
interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  rank: number;
  score: number; // XP or workouts completed
  streak: number;
  level: number;
}

interface Leaderboard {
  leaderboardId: string;
  type: "global" | "friends" | "weekly" | "skill";
  period: "all_time" | "weekly" | "monthly";
  entries: LeaderboardEntry[];
  userRank: number;
}
```

**Leaderboard Types:**
- Global XP Leaderboard (all-time)
- Weekly Streak Leaderboard
- Monthly Challenges Leaderboard
- Skill-Specific Leaderboards (Muscle-Up, Handstand, etc.)

#### 5.3 Friends & Challenges

```typescript
interface FriendChallenge {
  challengeId: string;
  challenger: string;
  opponent: string;
  type: "reps" | "streak" | "skill";
  target: number;
  duration: number; // days
  status: "pending" | "active" | "completed";
  results: {
    challengerScore: number;
    opponentScore: number;
    winner?: string;
  };
}
```

**Challenge Types:**
- "Who can do more push-ups this week?"
- "30-day streak challenge"
- "Complete Muscle-Up skill path first"

---

## 6. Offline Mode

### Purpose

Allow users to train without internet connection and sync when online.

### Architecture

```typescript
interface OfflineWorkout {
  workoutId: string;
  userId: string;
  timestamp: Date;
  exercises: {
    exerciseId: string;
    reps: number;
    sets: number;
    duration: number;
    completed: boolean;
  }[];
  synced: boolean;
  syncedAt?: Date;
}

interface SyncQueue {
  userId: string;
  pendingWorkouts: OfflineWorkout[];
  pendingProgress: any[];
  lastSyncTime: Date;
}
```

### Implementation

**Local Storage:**
- Cache all workouts locally
- Store user profile
- Store exercise library
- Store skill paths

**Sync Strategy:**
- Queue all offline changes
- Sync when online
- Resolve conflicts (server wins)
- Notify user of sync status

**Data Persistence:**
- IndexedDB for large datasets
- LocalStorage for small data
- Service Worker for offline support

---

## Integration Points

### Data Flow

```
User Action
    ↓
Local Update (Offline)
    ↓
Firestore Sync (Online)
    ↓
Coach AI Analysis
    ↓
Recommendation Generation
    ↓
Gamification Update
    ↓
Social Share (Optional)
    ↓
Leaderboard Update
```

### Key Integrations

1. **Auto Progression** → Coach AI (recommendations based on progression)
2. **Skill Paths** → Gamification (XP rewards for steps)
3. **Coach AI** → Notifications (send recommendations)
4. **Gamification** → Social (share achievements)
5. **Social** → Leaderboards (rank users)
6. **Offline Mode** → All features (cache and sync)

---

## Implementation Timeline

| Phase | Features | Duration | Dependencies |
|-------|----------|----------|---------------|
| Phase 1 | Auto Progression + Skill Paths | 3-4 days | Firestore setup |
| Phase 2 | Coach AI + Gamification | 2-3 days | Phase 1 complete |
| Phase 3 | Social Features | 2-3 days | Phase 1 + 2 |
| Phase 4 | Offline Mode | 1-2 days | All features |
| Phase 5 | Integration & Testing | 2 days | All phases |

**Total Estimated Time: 10-15 days**

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Retention (Day 7) | 60%+ | Firebase Analytics |
| Retention (Day 30) | 40%+ | Firebase Analytics |
| Average Session Duration | 15+ min | Firebase Analytics |
| Streak Completion Rate | 70%+ | App Analytics |
| Challenge Participation | 50%+ | Firestore queries |
| Social Sharing Rate | 30%+ | Firestore queries |
| Conversion to Premium | 15%+ | Stripe data |

---

## Next Steps

1. **Implement Auto Progression System** (Phase 1)
2. **Build Skill-Based Training Paths** (Phase 1)
3. **Deploy Coach AI** (Phase 2)
4. **Add Gamification** (Phase 2)
5. **Implement Social Features** (Phase 3)
6. **Add Offline Mode** (Phase 4)
7. **Test and optimize** (Phase 5)

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-21  
**Status:** Ready for Implementation
