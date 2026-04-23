import React, { useEffect } from 'react';
import { useCoach } from '@/contexts/CoachContext';
import { useWorkoutCompletion } from '@/contexts/WorkoutCompletionContext';
import { AchievementBadge } from '@/components/AchievementBadge';
import { Trophy, Zap, Flame, Target } from 'lucide-react';

export default function AchievementsPage() {
  const { achievements, unlockedAchievements, checkAchievements } = useCoach();
  const { completion } = useWorkoutCompletion();

  useEffect(() => {
    // Check achievements based on current stats
    checkAchievements({
      streak: completion.streak,
      totalXp: completion.xp,
      totalWorkouts: completion.totalWorkouts,
      level: completion.level,
    });
  }, [completion, checkAchievements]);

  const categories = [
    { name: 'Streak', icon: <Flame size={20} />, type: 'streak' },
    { name: 'XP Earned', icon: <Zap size={20} />, type: 'xp' },
    { name: 'Workouts', icon: <Target size={20} />, type: 'workout' },
    { name: 'Skills', icon: <Trophy size={20} />, type: 'skill' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.10 0.005 285)' }}>
      {/* Header */}
      <div className="relative overflow-hidden py-12" style={{ background: 'linear-gradient(135deg, oklch(0.15 0.006 285) 0%, oklch(0.12 0.005 285) 100%)' }}>
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Trophy size={32} style={{ color: 'oklch(0.68 0.18 142)' }} />
            <span className="cx-label">Your Achievements</span>
          </div>
          <h1 className="cx-section-title text-5xl md:text-6xl" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
            ACHIEVEMENTS
          </h1>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', color: 'oklch(0.65 0.01 285)', marginTop: '12px' }}>
            {unlockedAchievements.length} of {achievements.length} achievements unlocked
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Streak', value: completion.streak, icon: <Flame size={16} /> },
            { label: 'Level', value: completion.level, icon: <Zap size={16} /> },
            { label: 'Total XP', value: completion.xp, icon: <Trophy size={16} /> },
            { label: 'Workouts', value: completion.totalWorkouts, icon: <Target size={16} /> },
          ].map(stat => (
            <div key={stat.label} className="cx-card p-5">
              <div className="flex items-center gap-2 mb-3" style={{ color: 'oklch(0.68 0.18 142)' }}>
                {stat.icon}
                <span className="cx-label" style={{ fontSize: '0.65rem' }}>{stat.label}</span>
              </div>
              <p className="font-number text-4xl" style={{ fontFamily: 'Bebas Neue, cursive', color: 'oklch(0.96 0.008 80)', lineHeight: 1 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Achievements by category */}
        {categories.map(category => {
          const categoryAchievements = achievements.filter(a => a.category === category.type);
          const unlockedCount = unlockedAchievements.filter(a => a.category === category.type).length;

          return (
            <div key={category.type} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div style={{ color: 'oklch(0.68 0.18 142)' }}>{category.icon}</div>
                <h2 className="cx-section-title text-2xl" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
                  {category.name}
                </h2>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: 'oklch(0.65 0.01 285)' }}>
                  {unlockedCount}/{categoryAchievements.length}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categoryAchievements.map(achievement => {
                  const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
                  return (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      isUnlocked={isUnlocked}
                      showProgress={!isUnlocked}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
