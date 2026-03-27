// ============================================================
// CallistheniX – Progress & Analytics Page
// Track workouts, PRs, streaks, and achievements
// ============================================================
import { useProgress } from '@/contexts/ProgressContext';
import { TrendingUp, Flame, Trophy, Target, Calendar } from 'lucide-react';

export default function ProgressPage() {
  const { stats, sessions } = useProgress();

  const getAchievementDetails = (id: string) => {
    const details: Record<string, { name: string; icon: string; color: string }> = {
      first_workout: { name: 'First Step', icon: '🎯', color: 'oklch(0.68 0.18 142)' },
      week_warrior: { name: 'Week Warrior', icon: '🔥', color: 'oklch(0.65 0.22 40)' },
      month_master: { name: 'Month Master', icon: '⭐', color: 'oklch(0.75 0.18 80)' },
      ten_workouts: { name: 'Double Digits', icon: '💪', color: 'oklch(0.68 0.18 142)' },
      fifty_workouts: { name: 'Fitness Fanatic', icon: '🚀', color: 'oklch(0.68 0.18 142)' },
    };
    return details[id] || { name: 'Unknown', icon: '🏆', color: 'oklch(0.68 0.18 142)' };
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.10 0.005 285)' }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: '200px', background: 'linear-gradient(135deg, oklch(0.15 0.006 285) 0%, oklch(0.12 0.005 285) 100%)' }}>
        <div className="container py-10">
          <h1 className="cx-section-title text-5xl mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
            YOUR PROGRESS
          </h1>
          <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}>
            Track your journey, celebrate your wins, and stay motivated
          </p>
        </div>
      </div>

      <div className="container pb-16 -mt-2">
        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Workouts', value: stats.totalWorkouts.toString(), icon: Calendar, color: 'oklch(0.68 0.18 142)' },
            { label: 'Total Minutes', value: stats.totalMinutes.toString(), icon: TrendingUp, color: 'oklch(0.68 0.18 142)' },
            { label: 'Current Streak', value: stats.currentStreak.toString(), icon: Flame, color: 'oklch(0.65 0.22 40)' },
            { label: 'Best Streak', value: stats.longestStreak.toString(), icon: Trophy, color: 'oklch(0.75 0.18 80)' },
          ].map(stat => (
            <div key={stat.label} className="cx-card p-5">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={18} style={{ color: stat.color }} />
                <p className="cx-label" style={{ fontSize: '0.65rem' }}>{stat.label}</p>
              </div>
              <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '2.8rem', color: stat.color, lineHeight: 1 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Personal Records */}
          <div>
            <h2 className="cx-section-title text-2xl mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
              PERSONAL RECORDS
            </h2>
            {stats.personalRecords.length === 0 ? (
              <div className="cx-card p-6 text-center">
                <Target size={32} style={{ color: 'oklch(0.68 0.18 142)', margin: '0 auto 12px' }} />
                <p style={{ color: 'oklch(0.65 0.01 285)', fontFamily: 'DM Sans, sans-serif' }}>
                  No personal records yet. Complete workouts to set your first PR!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.personalRecords.map((pr, i) => (
                  <div key={pr.exerciseId} className="cx-card p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'oklch(0.90 0.008 80)' }}>
                          {pr.exerciseName}
                        </p>
                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.55 0.008 80)' }}>
                          {new Date(pr.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '2rem', color: 'oklch(0.68 0.18 142)', lineHeight: 1 }}>
                          {pr.reps || pr.duration}
                        </p>
                        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: 'oklch(0.55 0.008 80)' }}>
                          {pr.reps ? 'reps' : 'sec'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Achievements */}
          <div>
            <h2 className="cx-section-title text-2xl mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
              ACHIEVEMENTS
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'first_workout', unlocked: stats.achievements.some(a => a.id === 'first_workout') },
                { id: 'week_warrior', unlocked: stats.achievements.some(a => a.id === 'week_warrior') },
                { id: 'month_master', unlocked: stats.achievements.some(a => a.id === 'month_master') },
                { id: 'ten_workouts', unlocked: stats.achievements.some(a => a.id === 'ten_workouts') },
                { id: 'fifty_workouts', unlocked: stats.achievements.some(a => a.id === 'fifty_workouts') },
              ].map(ach => {
                const details = getAchievementDetails(ach.id);
                return (
                  <div
                    key={ach.id}
                    className="cx-card p-4 text-center"
                    style={{ opacity: ach.unlocked ? 1 : 0.4 }}
                  >
                    <p style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{details.icon}</p>
                    <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: ach.unlocked ? 'oklch(0.90 0.008 80)' : 'oklch(0.55 0.008 80)' }}>
                      {details.name}
                    </p>
                    {ach.unlocked && (
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.65rem', color: details.color, marginTop: '4px' }}>
                        ✓ Unlocked
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Workouts */}
        <div>
          <h2 className="cx-section-title text-2xl mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
            RECENT WORKOUTS
          </h2>
          {sessions.length === 0 ? (
            <div className="cx-card p-6 text-center">
              <Calendar size={32} style={{ color: 'oklch(0.68 0.18 142)', margin: '0 auto 12px' }} />
              <p style={{ color: 'oklch(0.65 0.01 285)', fontFamily: 'DM Sans, sans-serif' }}>
                No workouts logged yet. Start training to see your history!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...sessions].reverse().slice(0, 10).map((session, i) => (
                <div key={session.id} className="cx-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'oklch(0.90 0.008 80)' }}>
                        {session.dayName}
                      </p>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.55 0.008 80)' }}>
                        {new Date(session.date).toLocaleDateString()} • {session.totalDuration} min
                      </p>
                    </div>
                    <div className="text-right">
                      <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.5rem', color: 'oklch(0.68 0.18 142)', lineHeight: 1 }}>
                        {session.exercises.filter(e => e.completed).length}/{session.exercises.length}
                      </p>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: 'oklch(0.55 0.008 80)' }}>
                        exercises
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {session.exercises.map((ex, j) => (
                      <span
                        key={j}
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: '0.7rem',
                          color: ex.completed ? 'oklch(0.68 0.18 142)' : 'oklch(0.55 0.008 80)',
                          background: ex.completed ? 'oklch(0.68 0.18 142 / 15%)' : 'oklch(0.20 0.006 285)',
                          padding: '2px 6px',
                          borderRadius: '2px',
                          textDecoration: ex.completed ? 'none' : 'line-through',
                        }}
                      >
                        {ex.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
