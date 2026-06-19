// ============================================================
// CallistheniX – Progress Tracking Dashboard
// Retention-focused: Streaks, Total Exercises, Program Progress
// ============================================================
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Flame, Dumbbell, TrendingUp, Calendar, Award, ChevronRight } from 'lucide-react';

interface ProgressStats {
  currentStreak: number;
  longestStreak: number;
  totalExercises: number;
  totalWorkouts: number;
  programProgress: number; // 0-100
  lastWorkoutDate: string | null;
  thisWeekWorkouts: number;
}

export default function ProgressDashboard() {
  const { profile, selectedProgram, completedSessions } = useUser();
  const [stats, setStats] = useState<ProgressStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalExercises: 0,
    totalWorkouts: 0,
    programProgress: 0,
    lastWorkoutDate: null,
    thisWeekWorkouts: 0,
  });

  // Calculate progress stats from localStorage
  useEffect(() => {
    const calculateStats = () => {
      const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
      const lastWorkoutTime = localStorage.getItem('lastWorkoutTime');
      
      // Total workouts and exercises
      const totalWorkouts = workoutHistory.length;
      const totalExercises = workoutHistory.reduce((sum: number, w: any) => sum + (w.exercisesCompleted || 0), 0);
      
      // Calculate streaks
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      // Sort workout dates
      const workoutDates = workoutHistory
        .map((w: any) => {
          const date = new Date(w.date || w.completedAt);
          date.setHours(0, 0, 0, 0);
          return date.getTime();
        })
        .sort((a: number, b: number) => b - a);
      
      // Remove duplicates
      const uniqueDates = [...new Set(workoutDates)];
      
      // Calculate current streak
      for (let i = 0; i < uniqueDates.length; i++) {
        const workoutDate = new Date(uniqueDates[i]);
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        
        if (workoutDate.getTime() === expectedDate.getTime()) {
          tempStreak++;
        } else {
          break;
        }
      }
      currentStreak = tempStreak;
      
      // Calculate longest streak
      tempStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1]);
        const currDate = new Date(uniqueDates[i]);
        const daysDiff = (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
      
      // This week workouts
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const thisWeekWorkouts = uniqueDates.filter(d => d >= weekAgo.getTime()).length;
      
      // Program progress
      const programProgress = selectedProgram 
        ? Math.round((completedSessions / (selectedProgram.days.length || 1)) * 100)
        : 0;
      
      const lastWorkoutDate = uniqueDates.length > 0 
        ? new Date(uniqueDates[0]).toLocaleDateString()
        : null;
      
      setStats({
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
        totalExercises,
        totalWorkouts,
        programProgress: Math.min(programProgress, 100),
        lastWorkoutDate,
        thisWeekWorkouts,
      });
    };
    
    calculateStats();
  }, [completedSessions, selectedProgram]);

  if (!profile) return null;

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.10 0.005 285)' }}>
      {/* Header */}
      <div className="px-4 py-8 md:px-8 border-b" style={{ borderColor: 'oklch(0.68 0.18 142 / 20%)' }}>
        <h1 
          className="text-3xl font-black uppercase mb-2"
          style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}
        >
          Your Progress
        </h1>
        <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}>
          Track your journey to becoming unstoppable
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="px-4 py-8 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Current Streak Card */}
        <div 
          className="rounded-lg p-6 border"
          style={{ 
            background: 'oklch(0.12 0.005 285)',
            borderColor: 'oklch(0.68 0.18 142 / 30%)'
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Current Streak
              </p>
              <h2 
                className="text-5xl font-black mt-2"
                style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'oklch(0.68 0.18 142)' }}
              >
                {stats.currentStreak}
              </h2>
              <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', marginTop: '8px' }}>
                days in a row
              </p>
            </div>
            <Flame size={32} style={{ color: 'oklch(0.68 0.18 142)', opacity: 0.6 }} />
          </div>
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: `${Math.min((stats.currentStreak / 30) * 100, 100)}%`,
                background: 'oklch(0.68 0.18 142)'
              }}
            />
          </div>
          <p style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', marginTop: '8px' }}>
            Longest: {stats.longestStreak} days
          </p>
        </div>

        {/* Total Exercises Card */}
        <div 
          className="rounded-lg p-6 border"
          style={{ 
            background: 'oklch(0.12 0.005 285)',
            borderColor: 'oklch(0.68 0.18 142 / 30%)'
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Exercises
              </p>
              <h2 
                className="text-5xl font-black mt-2"
                style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'oklch(0.68 0.18 142)' }}
              >
                {stats.totalExercises}
              </h2>
              <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', marginTop: '8px' }}>
                reps completed
              </p>
            </div>
            <Dumbbell size={32} style={{ color: 'oklch(0.68 0.18 142)', opacity: 0.6 }} />
          </div>
          <p style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem' }}>
            {stats.totalWorkouts} total workouts
          </p>
        </div>

        {/* Program Progress Card */}
        <div 
          className="rounded-lg p-6 border md:col-span-2"
          style={{ 
            background: 'oklch(0.12 0.005 285)',
            borderColor: 'oklch(0.68 0.18 142 / 30%)'
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Program Progress
              </p>
              <h2 
                className="text-4xl font-black mt-2"
                style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'oklch(0.68 0.18 142)' }}
              >
                {stats.programProgress}%
              </h2>
            </div>
            <TrendingUp size={32} style={{ color: 'oklch(0.68 0.18 142)', opacity: 0.6 }} />
          </div>
          <div className="h-3 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: `${stats.programProgress}%`,
                background: 'linear-gradient(to right, oklch(0.68 0.18 142), oklch(0.75 0.15 150))'
              }}
            />
          </div>
          <p style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', marginTop: '8px' }}>
            {completedSessions} of {selectedProgram?.days.length || 0} sessions completed
          </p>
        </div>

      </div>

      {/* Weekly Breakdown */}
      <div className="px-4 py-8 md:px-8">
        <h3 
          className="text-xl font-black uppercase mb-4"
          style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}
        >
          This Week
        </h3>
        <div 
          className="rounded-lg p-6 border"
          style={{ 
            background: 'oklch(0.12 0.005 285)',
            borderColor: 'oklch(0.68 0.18 142 / 30%)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar size={24} style={{ color: 'oklch(0.68 0.18 142)' }} />
              <div>
                <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' }}>
                  Workouts this week
                </p>
                <h4 
                  className="text-3xl font-black"
                  style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'oklch(0.96 0.008 80)' }}
                >
                  {stats.thisWeekWorkouts}/7
                </h4>
              </div>
            </div>
            <div className="text-right">
              <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem' }}>
                {7 - stats.thisWeekWorkouts} days left
              </p>
              <p style={{ color: 'oklch(0.68 0.18 142)', fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.9rem', fontWeight: 700, marginTop: '4px' }}>
                {Math.round((stats.thisWeekWorkouts / 7) * 100)}% Complete
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Last Workout */}
      {stats.lastWorkoutDate && (
        <div className="px-4 py-8 md:px-8">
          <div 
            className="rounded-lg p-6 border flex items-center justify-between"
            style={{ 
              background: 'oklch(0.12 0.005 285)',
              borderColor: 'oklch(0.68 0.18 142 / 30%)'
            }}
          >
            <div className="flex items-center gap-3">
              <Award size={24} style={{ color: 'oklch(0.68 0.18 142)' }} />
              <div>
                <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem' }}>
                  Last Workout
                </p>
                <p style={{ color: 'oklch(0.96 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', marginTop: '4px' }}>
                  {stats.lastWorkoutDate}
                </p>
              </div>
            </div>
            <ChevronRight size={20} style={{ color: 'oklch(0.68 0.18 142)' }} />
          </div>
        </div>
      )}

      {/* Motivation Banner */}
      <div className="px-4 py-8 md:px-8 pb-16">
        <div 
          className="rounded-lg p-8 text-center border"
          style={{ 
            background: 'linear-gradient(135deg, oklch(0.12 0.005 285), oklch(0.15 0.008 285))',
            borderColor: 'oklch(0.68 0.18 142 / 30%)'
          }}
        >
          <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', marginBottom: '12px' }}>
            Keep the momentum going!
          </p>
          <h3 
            className="text-2xl font-black uppercase"
            style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.68 0.18 142)' }}
          >
            {stats.currentStreak > 0 
              ? `${30 - stats.currentStreak} workouts until 30-day streak!`
              : 'Start your first workout today!'}
          </h3>
        </div>
      </div>
    </div>
  );
}
