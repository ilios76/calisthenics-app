import React from 'react';
import { Flame, Star, Trophy, Unlock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { GamificationState, LevelManager } from '@/lib/gamificationSystem';

interface GamificationDashboardProps {
  state: GamificationState;
  onChallengeClick: (challengeId: string) => void;
  onUnlockableClick: (unlockableId: string) => void;
}

export function GamificationDashboard({
  state,
  onChallengeClick,
  onUnlockableClick,
}: GamificationDashboardProps) {
  const levelInfo = state.level;
  const xpToNextLevel = 500 * levelInfo.currentLevel; // Approximate XP needed
  const currentXP = 0; // Placeholder
  const xpProgress = 45; // Placeholder

  const getStreakMilestoneColor = (milestone: number) => {
    if (state.streak.currentStreak >= milestone) return 'text-yellow-500';
    return 'text-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Level & XP Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
             <h3 className="text-lg font-bold">Level {state.level.currentLevel}</h3>
            <p className="text-sm text-gray-600">
              {['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'][levelInfo.currentLevel - 1]}
            </p>
          </div>
          <Star className="w-12 h-12 text-yellow-500 fill-yellow-500" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">XP Progress</span>
            <span className="text-sm font-bold">
              {currentXP} / {xpToNextLevel} XP
            </span>
          </div>
          <Progress value={xpProgress} className="h-3" />
          <p className="text-xs text-gray-600">
            {Math.round(xpProgress)}% to next level
          </p>
        </div>
      </Card>

      {/* Streak Section */}
      <Card className="p-6 border-orange-200 bg-orange-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Current Streak</h3>
          <Flame className="w-8 h-8 text-orange-500" />
        </div>

        <div className="mb-4">
          <p className="text-4xl font-bold text-orange-600">{state.streak.currentStreak}</p>
          <p className="text-sm text-gray-600">days in a row</p>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-4">
          {[7, 14, 30, 60, 100].map((milestone) => (
            <div key={milestone} className="text-center">
              <Trophy className={`w-5 h-5 mx-auto mb-1 ${getStreakMilestoneColor(milestone)}`} />
              <p className="text-xs font-medium">{milestone}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded p-3 border border-orange-200">
          <p className="text-xs text-gray-600 mb-1">Longest Streak</p>
          <p className="text-lg font-bold text-orange-600">{state.streak.longestStreak} days</p>
        </div>
      </Card>

      {/* Challenges Section */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Active Challenges
        </h3>

        <div className="space-y-3">
          {state.challenges.slice(0, 3).map((challenge) => {
            const progress = (challenge.progress / 100) * 100;
            return (
              <div key={challenge.challengeId} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">{challenge.challengeId}</p>
                    <p className="text-xs text-gray-600">{challenge.progress} / 100</p>
                  </div>
                  <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    +200 XP
                  </span>
                </div>
                <Progress value={progress} className="h-2 mb-2" />
                <Button
                  onClick={() => onChallengeClick(challenge.challengeId)}
                  size="sm"
                  variant="outline"
                  className="w-full text-xs"
                >
                  View Challenge
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Unlockables Section */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Unlock className="w-5 h-5 text-purple-500" />
          Unlocked Features
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {state.unlockedItems.slice(0, 6).map((itemId) => (
            <button
              key={itemId}
              onClick={() => onUnlockableClick(itemId)}
              className="bg-purple-50 border border-purple-200 rounded-lg p-3 hover:bg-purple-100 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <Unlock className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-semibold text-purple-900 capitalize">
                  {itemId.replace(/_/g, ' ')}
                </p>
              </div>
              <p className="text-xs text-purple-700">Unlocked!</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Stats Summary */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <h3 className="text-lg font-bold mb-4">Your Stats</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{currentXP}</p>
            <p className="text-xs text-gray-600">Current XP</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{state.challenges.length}</p>
            <p className="text-xs text-gray-600">Challenges</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{state.unlockedItems.length}</p>
            <p className="text-xs text-gray-600">Unlocked</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
