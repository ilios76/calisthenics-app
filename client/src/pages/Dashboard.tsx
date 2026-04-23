// ============================================================
// CallistheniX – Dashboard Page
// Scoreboard-style overview: stats, recommended program, quick actions
// ============================================================
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { getRecommendedPrograms, getDietPlan, calculateBMI, getBMICategory, getGoalLabel } from '@/lib/data';
import { Flame, Zap, Target, ChevronRight, Play, Utensils, TrendingUp } from 'lucide-react';
import { MusicPlayer } from '@/components/MusicPlayer';

const WORKOUT_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/workout-bg-4n6t43em9tdbWJH7YCcGcZ.webp';
const HERO_MALE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/hero-bg-C5GENbhHcAmSh8V2dzFSZc.webp';
const HERO_FEMALE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/hero-female-ZWPp8YEB9EFQPcEGvYzBjN.webp';

export default function DashboardPage() {
  const { profile, setCurrentView, setSelectedProgram, completedSessions } = useUser();
  const [activeTab, setActiveTab] = useState<'program' | 'nutrition'>('program');
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
    setSelectedProgram(program);
    setCurrentView('trainer');
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.10 0.005 285)' }}>
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
                {dietPlan ? (
                  <div
                    className="relative overflow-hidden rounded p-6"
                    style={{ background: 'oklch(0.15 0.006 285)', border: '1px solid oklch(1 0 0 / 8%)' }}
                  >
                    <div className="mb-6">
                      <span className="cx-label mb-2 block" style={{ fontSize: '0.65rem' }}>Daily Caloric Target</span>
                      <p className="font-number text-5xl mb-1" style={{ fontFamily: 'Bebas Neue, cursive', color: 'oklch(0.68 0.18 142)' }}>
                        {dailyCals} <span style={{ fontSize: '1.5rem', color: 'oklch(0.60 0.008 80)' }}>kcal</span>
                      </p>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', color: 'oklch(0.65 0.008 80)', marginTop: '8px' }}>
                        Based on your goal: <strong>{getGoalLabel(profile.goal)}</strong>
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid oklch(1 0 0 / 8%)', paddingTop: '20px' }}>
                      <h3 className="cx-section-title text-lg mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
                        Macronutrient Breakdown
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'Protein', pct: dietPlan.macros.protein, color: 'oklch(0.68 0.18 142)' },
                          { label: 'Carbs', pct: dietPlan.macros.carbs, color: 'oklch(0.68 0.18 142)' },
                          { label: 'Fat', pct: dietPlan.macros.fat, color: 'oklch(0.68 0.18 142)' },
                        ].map(m => (
                          <div key={m.label}>
                            <div className="cx-progress-bar mb-2">
                              <div className="cx-progress-fill" style={{ width: `${m.pct}%`, background: m.color }} />
                            </div>
                            <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'oklch(0.90 0.008 80)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {m.label}
                            </p>
                            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.55 0.008 80)' }}>
                              {m.pct}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>


                  </div>
                ) : (
                  <div className="cx-card p-8 text-center">
                    <p style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}>
                      No nutrition plan available. Please update your profile.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Music Player + Quick Actions */}
          <div className="space-y-4">
            <MusicPlayer compact={false} />
            <h2 className="cx-section-title text-2xl mt-6" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
              QUICK ACTIONS
            </h2>

            {[
              { label: 'Browse Programs', desc: 'Find your perfect program', icon: <Zap size={18} />, view: 'programs' as const },
              { label: 'View Diet Plans', desc: 'Detailed nutrition guide', icon: <Utensils size={18} />, view: 'diet' as const },
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

        {/* Today's workout preview */}
        {topProgram && (
          <div className="mt-10">
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
      </div>
    </div>
  );
}
