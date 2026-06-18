// ============================================================
// CallistheniX – Dashboard Page
// Scoreboard-style overview: stats, recommended program, quick actions
// ============================================================
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { getRecommendedPrograms, getDietPlan, calculateBMI, getBMICategory, getGoalLabel } from '@/lib/data';
import { Flame, Zap, Target, ChevronRight, Play, Utensils, TrendingUp, AlertCircle, ChevronLeft } from 'lucide-react';
import { RewardedAdWidget } from '@/components/RewardedAdWidget';
import { WorkoutCalendar } from '@/components/WorkoutCalendar';
import { loseWeightWeekly, gainMuscleWeekly, staySlimWeekly } from '@/lib/weeklyMeals';

const WORKOUT_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/workout-bg-4n6t43em9tdbWJH7YCcGcZ.webp';
const HERO_MALE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/hero-bg-C5GENbhHcAmSh8V2dzFSZc.webp';
const HERO_FEMALE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/hero-female-ZWPp8YEB9EFQPcEGvYzBjN.webp';

export default function DashboardPage() {
  const { profile, setCurrentView, setSelectedProgram, completedSessions } = useUser();
  const [activeTab, setActiveTab] = useState<'program' | 'nutrition'>('program');
  const [showRestWarning, setShowRestWarning] = useState(false);
  const [lastWorkoutTime, setLastWorkoutTime] = useState<number | null>(null);
  const [dayIndex, setDayIndex] = useState(0);
  
  useEffect(() => {
    const stored = localStorage.getItem('lastWorkoutTime');
    if (stored) {
      setLastWorkoutTime(parseInt(stored));
    }
  }, []);
  
  if (!profile) return null;

  const programs = getRecommendedPrograms(profile.sex, profile.age, profile.weight, profile.goal);
  const topProgram = programs[0];
  const dietPlan = getDietPlan(profile.goal);
  const bmi = calculateBMI(profile.weight, profile.height);
  const bmiCat = getBMICategory(bmi);
  const dailyCals = dietPlan ? dietPlan.dailyCalories(profile.weight, profile.goal) : 0;
  const heroImg = profile.sex === 'female' ? HERO_FEMALE : HERO_MALE;

  const startProgram = (program: typeof topProgram) => {
    if (!program) return;
    
    if (lastWorkoutTime) {
      const now = Date.now();
      const hoursSinceLastWorkout = (now - lastWorkoutTime) / (1000 * 60 * 60);
      
      if (hoursSinceLastWorkout < 12) {
        setShowRestWarning(true);
        return;
      }
    }
    
    setSelectedProgram(program);
    setCurrentView('trainer');
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.10 0.005 285)' }}>
      {/* 12-Hour Rest Warning Modal */}
      {showRestWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-8 max-w-sm w-full" style={{ background: 'oklch(0.12 0.005 285)', border: '1px solid oklch(0.68 0.18 142 / 30%)' }}>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={24} style={{ color: 'oklch(0.68 0.18 142)' }} />
              <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'oklch(0.96 0.008 80)', textTransform: 'uppercase' }}>Rest Recommended</h2>
            </div>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', color: 'oklch(0.85 0.008 80)', lineHeight: 1.6, marginBottom: '24px' }}>
              Rest is recommended for at least 12 hours between sessions. Otherwise, you risk injury.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRestWarning(false)}
                className="flex-1 px-4 py-2 rounded"
                style={{ background: 'oklch(0.68 0.18 142)', color: 'oklch(0.10 0.005 285)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
              >
                Understand
              </button>
              <button
                onClick={() => {
                  setShowRestWarning(false);
                  setSelectedProgram(topProgram);
                  setCurrentView('trainer');
                }}
                className="flex-1 px-4 py-2 rounded"
                style={{ background: 'oklch(0.68 0.18 142 / 20%)', border: '1px solid oklch(0.68 0.18 142)', color: 'oklch(0.68 0.18 142)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Hero banner */}
      <div className="relative overflow-hidden" style={{ minHeight: '340px' }}>
        <img
          src={heroImg}
          alt="Training"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, oklch(0.10 0.005 285 / 30%) 0%, oklch(0.10 0.005 285) 100%)' }} />
        <div className="relative z-10 container py-12">
          <span className="cx-label mb-2 block">Welcome back,</span>
          <h1 className="cx-section-title text-6xl md:text-7xl mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
            {profile.name.toUpperCase()}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="cx-tag">{getGoalLabel(profile.goal)}</span>
            <span className="cx-tag">{profile.fitnessLevel}</span>
            <span className="cx-tag">{profile.sex}</span>
          </div>
        </div>
      </div>

      <div className="container pb-16 -mt-4">
        {/* Mental Trigger Banner */}
        <div className="mb-8 p-6 rounded-lg" style={{ background: 'oklch(0.68 0.18 142 / 10%)', border: '1px solid oklch(0.68 0.18 142 / 30%)' }}>
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'oklch(0.68 0.18 142)', marginBottom: '4px' }}>🔥 You are getting close</p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', color: 'oklch(0.96 0.008 80)', lineHeight: 1.6 }}>
            Your training adapts to you after every workout. Stay consistent with streaks, levels and push further with real progress.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Weight', value: `${profile.weight}`, unit: 'kg', icon: <TrendingUp size={16} /> },
            { label: 'BMI', value: bmi.toFixed(1), unit: bmiCat, icon: <Target size={16} /> },
            { label: 'Daily Calories', value: dailyCals.toString(), unit: 'kcal', icon: <Flame size={16} /> },
            { label: 'Sessions Done', value: completedSessions.toString(), unit: 'workouts', icon: <Zap size={16} /> },
          ].map(stat => (
            <div key={stat.label} className="cx-card p-5">
              <div className="flex items-center gap-2 mb-3" style={{ color: 'oklch(0.68 0.18 142)' }}>
                {stat.icon}
                <span className="cx-label" style={{ fontSize: '0.65rem' }}>{stat.label}</span>
              </div>
              <p className="font-number text-4xl" style={{ fontFamily: 'Bebas Neue, cursive', color: 'oklch(0.96 0.008 80)', lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.55 0.008 80)', marginTop: '4px' }}>
                {stat.unit}
              </p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Program / Nutrition Tabs */}
          <div className="md:col-span-2">
            {/* Tab Navigation */}
            <div className="flex gap-4 mb-4" style={{ borderBottom: '1px solid oklch(1 0 0 / 8%)' }}>
              <button
                onClick={() => setActiveTab('program')}
                className="cx-label pb-3 px-2 transition-colors"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: activeTab === 'program' ? 700 : 500,
                  color: activeTab === 'program' ? 'oklch(0.68 0.18 142)' : 'oklch(0.55 0.008 80)',
                  borderBottom: activeTab === 'program' ? '2px solid oklch(0.68 0.18 142)' : 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Your Program
              </button>
              <button
                onClick={() => setActiveTab('nutrition')}
                className="cx-label pb-3 px-2 transition-colors"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: activeTab === 'nutrition' ? 700 : 500,
                  color: activeTab === 'nutrition' ? 'oklch(0.68 0.18 142)' : 'oklch(0.55 0.008 80)',
                  borderBottom: activeTab === 'nutrition' ? '2px solid oklch(0.68 0.18 142)' : 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Your Nutrition Plan
              </button>
            </div>

            {/* Program Tab */}
            {activeTab === 'program' && (
              <div>
                {topProgram ? (
                  <div
                    className="relative overflow-hidden rounded"
                    style={{ background: 'oklch(0.15 0.006 285)', border: '1px solid oklch(1 0 0 / 8%)' }}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ background: 'oklch(0.68 0.18 142)' }} />
                    <div className="p-6 pl-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex gap-2 mb-2 flex-wrap">
                            {topProgram.tags.slice(0, 3).map(t => <span key={t} className="cx-tag">{t}</span>)}
                          </div>
                          <h3 className="cx-section-title text-3xl mb-1" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
                            {topProgram.name.toUpperCase()}
                          </h3>
                          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', color: 'oklch(0.65 0.008 80)', lineHeight: 1.6 }}>
                            {topProgram.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6 pt-4" style={{ borderTop: '1px solid oklch(1 0 0 / 8%)' }}>
                        {[
                          { label: 'Duration', value: `${topProgram.durationWeeks}`, unit: 'weeks' },
                          { label: 'Sessions', value: `${topProgram.sessionsPerWeek}x`, unit: 'per week' },
                          { label: 'Per Session', value: `${topProgram.sessionDurationMin}`, unit: 'minutes' },
                        ].map(s => (
                          <div key={s.label}>
                            <p className="font-number text-3xl" style={{ fontFamily: 'Bebas Neue, cursive', color: 'oklch(0.68 0.18 142)' }}>{s.value}</p>
                            <p className="cx-label" style={{ fontSize: '0.65rem' }}>{s.label}</p>
                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.55 0.008 80)' }}>{s.unit}</p>
                          </div>
                        ))}
                      </div>

                  {/* Workout Calendar */}
                  <div className="mb-6 pt-4" style={{ borderTop: '1px solid oklch(1 0 0 / 8%)' }}>
                    <WorkoutCalendar sessionsPerWeek={topProgram.sessionsPerWeek} />
                  </div>

                  <button
                    className="cx-btn-primary flex items-center gap-2"
                    onClick={() => startProgram(topProgram)}
                  >
                    <Play size={16} /> Start Training
                  </button>
                    </div>
                  </div>
                ) : (
                  <div className="cx-card p-8 text-center">
                    <p style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}>
                      No programs found for your profile. Try adjusting your settings.
                    </p>
                    <button className="cx-btn-ghost mt-4" onClick={() => setCurrentView('programs')}>
                      Browse All Programs
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Nutrition Tab */}
            {activeTab === 'nutrition' && (
              <div>
                {dietPlan ? (() => {
                  // Get the 7-day meal plan based on goal
                  let weeklyPlan: typeof loseWeightWeekly = [];
                  if (profile.goal === 'lose_weight') {
                    weeklyPlan = loseWeightWeekly;
                  } else if (profile.goal === 'gain_muscle') {
                    weeklyPlan = gainMuscleWeekly;
                  } else if (profile.goal === 'stay_slim') {
                    weeklyPlan = staySlimWeekly;
                  }
                  
                  const currentDay = weeklyPlan[dayIndex];
                  const proteinG = Math.round((dailyCals * dietPlan.macros.protein / 100) / 4);
                  const carbsG = Math.round((dailyCals * dietPlan.macros.carbs / 100) / 4);
                  const fatG = Math.round((dailyCals * dietPlan.macros.fat / 100) / 9);
                  
                  const goToPreviousDay = () => {
                    setDayIndex(prev => (prev === 0 ? 6 : prev - 1));
                  };
                  
                  const goToNextDay = () => {
                    setDayIndex(prev => (prev === 6 ? 0 : prev + 1));
                  };
                  
                  return (
                    <div>
                      {/* Macro targets */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        {[
                          { label: 'Daily Calories', value: dailyCals.toString(), unit: 'kcal', color: 'oklch(0.68 0.18 142)' },
                          { label: 'Protein', value: proteinG.toString(), unit: 'g / day', color: 'oklch(0.68 0.18 142)' },
                          { label: 'Carbs', value: carbsG.toString(), unit: 'g / day', color: 'oklch(0.68 0.18 142)' },
                          { label: 'Fats', value: fatG.toString(), unit: 'g / day', color: 'oklch(0.68 0.18 142)' },
                        ].map(s => (
                          <div key={s.label} className="cx-card p-3">
                            <p className="cx-label mb-1" style={{ fontSize: '0.6rem' }}>{s.label}</p>
                            <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.8rem', color: s.color, lineHeight: 1 }}>{s.value}</p>
                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.65rem', color: 'oklch(0.55 0.008 80)', marginTop: '2px' }}>{s.unit}</p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Weekly Meal Plan */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="cx-section-title text-lg" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
                            WEEKLY MEAL PLAN
                          </h3>
                        </div>
                        
                        {/* Day Navigation */}
                        <div className="cx-card p-3 mb-3">
                          <div className="flex items-center justify-between mb-3">
                            <button
                              onClick={goToPreviousDay}
                              className="w-8 h-8 rounded flex items-center justify-center"
                              style={{ background: 'oklch(0.68 0.18 142 / 15%)', border: '1px solid oklch(0.68 0.18 142)', color: 'oklch(0.68 0.18 142)' }}
                            >
                              <ChevronLeft size={16} />
                            </button>
                            <div className="text-center flex-1">
                              <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'oklch(0.68 0.18 142)' }}>
                                {currentDay.day}
                              </p>
                              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: 'oklch(0.55 0.008 80)' }}>
                                Day {dayIndex + 1} of 7
                              </p>
                            </div>
                            <button
                              onClick={goToNextDay}
                              className="w-8 h-8 rounded flex items-center justify-center"
                              style={{ background: 'oklch(0.68 0.18 142 / 15%)', border: '1px solid oklch(0.68 0.18 142)', color: 'oklch(0.68 0.18 142)' }}
                            >
                              <ChevronRight size={16} />
                            </button>
                          </div>
                          {/* Day dots navigation */}
                          <div className="flex justify-center gap-1.5">
                            {weeklyPlan.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setDayIndex(i)}
                                className="rounded-full transition-all"
                                style={{
                                  background: i === dayIndex ? 'oklch(0.68 0.18 142)' : 'oklch(0.68 0.18 142 / 30%)',
                                  width: i === dayIndex ? '20px' : '6px',
                                  height: '6px',
                                }}
                                title={weeklyPlan[i].day}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {/* Meals for the day */}
                        <div className="space-y-2">
                          {currentDay.meals.map((meal: any, i: number) => (
                            <div key={meal.name} className="cx-card p-3">
                              <div className="flex items-start gap-2 mb-2">
                                <span style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.2rem', color: 'oklch(0.68 0.18 142)', lineHeight: 1, minWidth: '20px', flexShrink: 0 }}>
                                  {String(i + 1).padStart(2, '0')}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'oklch(0.90 0.008 80)' }}>
                                    {meal.name}
                                  </p>
                                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.7rem', color: 'oklch(0.55 0.008 80)' }}>
                                    {meal.time} — {meal.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 ml-7">
                                {meal.examples.map((ex: string) => (
                                  <span key={ex} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.65rem', color: 'oklch(0.65 0.008 80)', background: 'oklch(0.20 0.006 285)', padding: '2px 8px', borderRadius: '2px' }}>
                                    {ex}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })() : (
                  <div className="cx-card p-8 text-center">
                    <p style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}>
                      No nutrition plan available. Please update your profile.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="cx-section-title text-2xl mt-6" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
              QUICK ACTIONS
            </h2>

            {[
              { label: 'Browse Programs', desc: 'Find your perfect program', icon: <Zap size={18} />, view: 'programs' as const },
              { label: 'View Diet Plans', desc: 'Detailed nutrition guide', icon: <Utensils size={18} />, view: 'diet' as const },
              { label: 'Workout Statistics', desc: 'Track your progress', icon: <TrendingUp size={18} />, view: 'stats' as const },
            ].map(action => (
              <button
                key={action.label}
                onClick={() => setCurrentView(action.view)}
                className="cx-card w-full p-4 flex items-center gap-4 text-left"
              >
                <div
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ background: 'oklch(0.65 0.22 40 / 15%)', borderRadius: '4px', color: 'oklch(0.68 0.18 142)' }}
                >
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'oklch(0.90 0.008 80)' }}>
                    {action.label}
                  </p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.78rem', color: 'oklch(0.55 0.008 80)' }}>
                    {action.desc}
                  </p>
                </div>
                <ChevronRight size={16} style={{ color: 'oklch(0.50 0.008 80)', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>

        {/* Today's workout preview - before START TRAINING */}
        {topProgram && (
          <div className="mb-10">
            <h2 className="cx-section-title text-2xl mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
              TODAY'S WORKOUT
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {topProgram.days[0].exercises.slice(0, 4).map((exId, i) => {
                const exName = exId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                return (
                  <div key={exId} className="cx-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-number text-2xl" style={{ fontFamily: 'Bebas Neue, cursive', color: 'oklch(0.68 0.18 142)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'oklch(0.85 0.008 80)' }}>
                      {exName}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* START TRAINING Button */}
        {topProgram && (
          <div className="mt-10 mb-10">
            <button
              className="cx-btn-primary w-full flex items-center justify-center gap-2"
              onClick={() => startProgram(topProgram)}
            >
              <Play size={18} /> START TRAINING
            </button>
          </div>
        )}

        {/* Program Completion Date Card */}
        {topProgram && (() => {
          const today = new Date();
          const completionDate = new Date(today.getTime() + topProgram.durationWeeks * 7 * 24 * 60 * 60 * 1000);
          const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
          const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
          
          return (
            <div className="mt-10 mb-10">
              <div className="cx-card p-8 text-center" style={{ background: 'linear-gradient(135deg, oklch(0.15 0.006 285), oklch(0.12 0.005 285))', border: '2px solid oklch(0.68 0.18 142 / 30%)' }}>
                {/* Calendar-style header */}
                <div style={{ background: 'oklch(0.68 0.18 142)', padding: '12px', borderRadius: '8px 8px 0 0', marginBottom: '24px', marginLeft: '-32px', marginRight: '-32px', marginTop: '-32px' }}>
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.75rem', color: 'oklch(0.10 0.005 285)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, margin: 0 }}>
                    Completion Date
                  </p>
                </div>
                
                {/* Month and Date */}
                <div className="mb-6">
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.9rem', color: 'oklch(0.65 0.008 80)', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px 0' }}>
                    {monthNames[completionDate.getMonth()]}
                  </p>
                  <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '4rem', fontWeight: 700, color: 'oklch(0.68 0.18 142)', margin: '0 0 8px 0', lineHeight: 1 }}>
                    {String(completionDate.getDate()).padStart(2, '0')}
                  </p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: 'oklch(0.70 0.008 80)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                    {dayNames[completionDate.getDay()]}
                  </p>
                </div>
                
                {/* Motivational message */}
                <div style={{ borderTop: '1px solid oklch(1 0 0 / 10%)', paddingTop: '16px' }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', color: 'oklch(0.90 0.008 80)', lineHeight: 1.6, margin: 0 }}>
                    The day of the new version of yourself!
                  </p>
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.85rem', color: 'oklch(0.68 0.18 142)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginTop: '8px', margin: '8px 0 0 0' }}>
                    Start today
                  </p>
                </div>
              </div>
            </div>
          );
        })()}




      </div>
    </div>
  );
}
