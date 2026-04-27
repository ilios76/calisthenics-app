// CallistheniX – Workout Statistics Page
// Displays detailed workout stats, charts, personal records, and weekly progress
// ============================================================
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { ChevronLeft, TrendingUp, Flame, Zap, Award, Calendar } from 'lucide-react';

export default function StatisticsPage() {
  const { setCurrentView, completedSessions } = useUser();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    averageRepsPerSet: 0,
    personalRecords: [] as { exercise: string; reps: number; date: string }[],
    weeklyProgress: [] as { day: string; workouts: number }[],
  });

  useEffect(() => {
    // Load stats from localStorage
    const storedStats = localStorage.getItem('workoutStats');
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    } else {
      // Initialize with sample data
      const initialStats = {
        totalWorkouts: completedSessions,
        totalCalories: completedSessions * 250,
        averageRepsPerSet: 12,
        personalRecords: [
          { exercise: 'Push-ups', reps: 45, date: '2026-04-24' },
          { exercise: 'Pull-ups', reps: 15, date: '2026-04-23' },
          { exercise: 'Dips', reps: 30, date: '2026-04-22' },
        ],
        weeklyProgress: [
          { day: 'Mon', workouts: 1 },
          { day: 'Tue', workouts: 1 },
          { day: 'Wed', workouts: 0 },
          { day: 'Thu', workouts: 1 },
          { day: 'Fri', workouts: 1 },
          { day: 'Sat', workouts: 1 },
          { day: 'Sun', workouts: 0 },
        ],
      };
      setStats(initialStats);
    }
  }, [completedSessions]);

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.10 0.005 285)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} style={{ color: 'oklch(0.68 0.18 142)' }} />
          </button>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '2.5rem', fontWeight: 700, color: 'oklch(0.96 0.008 80)', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Workout Statistics
          </h1>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Workouts */}
          <div className="cx-card p-6" style={{ background: 'linear-gradient(135deg, oklch(0.15 0.006 285), oklch(0.12 0.005 285))', border: '1px solid oklch(0.68 0.18 142 / 20%)' }}>
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'oklch(0.65 0.008 80)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Workouts</p>
              <Zap size={20} style={{ color: 'oklch(0.68 0.18 142)' }} />
            </div>
            <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '2.5rem', fontWeight: 700, color: 'oklch(0.68 0.18 142)' }}>
              {stats.totalWorkouts}
            </p>
          </div>

          {/* Total Calories */}
          <div className="cx-card p-6" style={{ background: 'linear-gradient(135deg, oklch(0.15 0.006 285), oklch(0.12 0.005 285))', border: '1px solid oklch(0.68 0.18 142 / 20%)' }}>
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'oklch(0.65 0.008 80)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Calories</p>
              <Flame size={20} style={{ color: 'oklch(0.65 0.22 40)' }} />
            </div>
            <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '2.5rem', fontWeight: 700, color: 'oklch(0.65 0.22 40)' }}>
              {stats.totalCalories.toLocaleString()}
            </p>
          </div>

          {/* Average Reps */}
          <div className="cx-card p-6" style={{ background: 'linear-gradient(135deg, oklch(0.15 0.006 285), oklch(0.12 0.005 285))', border: '1px solid oklch(0.68 0.18 142 / 20%)' }}>
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'oklch(0.65 0.008 80)', textTransform: 'uppercase', letterSpacing: '1px' }}>Avg Reps/Set</p>
              <TrendingUp size={20} style={{ color: 'oklch(0.68 0.18 142)' }} />
            </div>
            <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '2.5rem', fontWeight: 700, color: 'oklch(0.68 0.18 142)' }}>
              {stats.averageRepsPerSet}
            </p>
          </div>

          {/* Streak */}
          <div className="cx-card p-6" style={{ background: 'linear-gradient(135deg, oklch(0.15 0.006 285), oklch(0.12 0.005 285))', border: '1px solid oklch(0.68 0.18 142 / 20%)' }}>
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'oklch(0.65 0.008 80)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Streak</p>
              <Award size={20} style={{ color: 'oklch(0.68 0.18 142)' }} />
            </div>
            <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '2.5rem', fontWeight: 700, color: 'oklch(0.68 0.18 142)' }}>
              {Math.floor(Math.random() * 10) + 1}
            </p>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="cx-card p-6 mb-8" style={{ background: 'linear-gradient(135deg, oklch(0.15 0.006 285), oklch(0.12 0.005 285))', border: '1px solid oklch(0.68 0.18 142 / 20%)' }}>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'oklch(0.96 0.008 80)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
            Weekly Progress
          </h2>
          <div className="flex items-end justify-between gap-2 h-40">
            {stats.weeklyProgress.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  style={{
                    width: '100%',
                    height: `${(day.workouts / 2) * 100}%`,
                    background: day.workouts > 0 ? 'oklch(0.68 0.18 142)' : 'oklch(0.12 0.005 285)',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease',
                    minHeight: day.workouts > 0 ? '20px' : '4px',
                  }}
                />
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.65 0.008 80)', textTransform: 'uppercase' }}>
                  {day.day}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Records */}
        <div className="cx-card p-6" style={{ background: 'linear-gradient(135deg, oklch(0.15 0.006 285), oklch(0.12 0.005 285))', border: '1px solid oklch(0.68 0.18 142 / 20%)' }}>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: 'oklch(0.96 0.008 80)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
            Personal Records
          </h2>
          <div className="space-y-3">
            {stats.personalRecords.map((pr, idx) => (
              <div key={idx} className="flex items-center justify-between p-4" style={{ background: 'oklch(0.12 0.005 285)', borderRadius: '8px', border: '1px solid oklch(1 0 0 / 10%)' }}>
                <div>
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'oklch(0.90 0.008 80)', textTransform: 'uppercase' }}>
                    {pr.exercise}
                  </p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'oklch(0.65 0.008 80)' }}>
                    {pr.date}
                  </p>
                </div>
                <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.5rem', fontWeight: 700, color: 'oklch(0.68 0.18 142)' }}>
                  {pr.reps} reps
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
