// ============================================================
// CallistheniX – Diet / Nutrition Page
// Personalized diet plan with 7-day weekly meal plan
// ============================================================
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { getDietPlan } from '@/lib/data';
import { loseWeightWeekly, gainMuscleWeekly, staySlimWeekly } from '@/lib/weeklyMeals';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DIET_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/diet-bg-csMuuswhyiiQGbA9zW4vjd.webp';

export default function DietPage() {
  const { profile } = useUser();
  const [dayIndex, setDayIndex] = useState(0);

  if (!profile) return null;

  const plan = getDietPlan(profile.goal);
  if (!plan) return null;

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
  const dailyCals = plan.dailyCalories(profile.weight, profile.goal);
  const proteinG = Math.round((dailyCals * plan.macros.protein / 100) / 4);
  const carbsG = Math.round((dailyCals * plan.macros.carbs / 100) / 4);
  const fatG = Math.round((dailyCals * plan.macros.fat / 100) / 9);

  const goToPreviousDay = () => {
    setDayIndex(prev => (prev === 0 ? 6 : prev - 1));
  };

  const goToNextDay = () => {
    setDayIndex(prev => (prev === 6 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.10 0.005 285)' }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: '260px' }}>
        <img src={DIET_BG} alt="Nutrition" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, oklch(0.10 0.005 285 / 40%) 0%, oklch(0.10 0.005 285) 100%)' }} />
        <div className="relative z-10 container py-10">
          <span className="cx-label mb-2 block">Personalized for {profile.name}</span>
          <h1 className="cx-section-title text-5xl mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
            {plan.name.toUpperCase()}
          </h1>
          <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', maxWidth: '500px' }}>
            {plan.description}
          </p>
        </div>
      </div>

      <div className="container pb-16 -mt-2">
        {/* Macro targets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Daily Calories', value: dailyCals.toString(), unit: 'kcal', color: 'oklch(0.68 0.18 142)' },
            { label: 'Protein', value: proteinG.toString(), unit: 'g / day', color: 'oklch(0.68 0.18 142)' },
            { label: 'Carbohydrates', value: carbsG.toString(), unit: 'g / day', color: 'oklch(0.68 0.18 142)' },
            { label: 'Fats', value: fatG.toString(), unit: 'g / day', color: 'oklch(0.68 0.18 142)' },
          ].map(s => (
            <div key={s.label} className="cx-card p-5">
              <p className="cx-label mb-2" style={{ fontSize: '0.65rem' }}>{s.label}</p>
              <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '2.8rem', color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.55 0.008 80)', marginTop: '4px' }}>{s.unit}</p>
            </div>
          ))}
        </div>

        {/* Macro breakdown bar */}
        <div className="cx-card p-5 mb-8">
          <p className="cx-label mb-4" style={{ fontSize: '0.7rem' }}>Macro Split</p>
          <div className="flex rounded overflow-hidden mb-3" style={{ height: '12px' }}>
            <div style={{ width: `${plan.macros.protein}%`, background: 'oklch(0.68 0.18 142)' }} />
            <div style={{ width: `${plan.macros.carbs}%`, background: 'oklch(0.58 0.14 142 / 70%)' }} />
            <div style={{ width: `${plan.macros.fat}%`, background: 'oklch(0.48 0.12 142 / 50%)' }} />
          </div>
          <div className="flex gap-6">
            {[
              { label: 'Protein', pct: plan.macros.protein, g: proteinG },
              { label: 'Carbs', pct: plan.macros.carbs, g: carbsG },
              { label: 'Fat', pct: plan.macros.fat, g: fatG },
            ].map(m => (
              <div key={m.label} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: 'oklch(0.68 0.18 142)' }} />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'oklch(0.70 0.008 80)' }}>
                  {m.label} <strong style={{ color: 'oklch(0.90 0.008 80)' }}>{m.pct}%</strong> ({m.g}g)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* 7-Day Weekly Meal Plan */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="cx-section-title text-2xl" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
                WEEKLY MEAL PLAN
              </h2>
            </div>

            {/* Day Navigation */}
            <div className="cx-card p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={goToPreviousDay}
                  className="w-10 h-10 rounded flex items-center justify-center"
                  style={{ background: 'oklch(0.68 0.18 142 / 15%)', border: '1px solid oklch(0.68 0.18 142)', color: 'oklch(0.68 0.18 142)' }}
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="text-center flex-1">
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'oklch(0.68 0.18 142)' }}>
                    {currentDay.day}
                  </p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.55 0.008 80)' }}>
                    Day {dayIndex + 1} of 7
                  </p>
                </div>
                <button
                  onClick={goToNextDay}
                  className="w-10 h-10 rounded flex items-center justify-center"
                  style={{ background: 'oklch(0.68 0.18 142 / 15%)', border: '1px solid oklch(0.68 0.18 142)', color: 'oklch(0.68 0.18 142)' }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Day dots navigation */}
              <div className="flex justify-center gap-2">
                {weeklyPlan.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setDayIndex(i)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      background: i === dayIndex ? 'oklch(0.68 0.18 142)' : 'oklch(0.68 0.18 142 / 30%)',
                      width: i === dayIndex ? '24px' : '8px',
                    }}
                    title={weeklyPlan[i].day}
                  />
                ))}
              </div>
            </div>

            {/* Meals for the day */}
            <div className="space-y-3">
              {currentDay.meals.map((meal: any, i: number) => (
                <div key={meal.name} className="cx-card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.5rem', color: 'oklch(0.68 0.18 142)', lineHeight: 1, minWidth: '28px' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'oklch(0.90 0.008 80)' }}>
                        {meal.name}
                      </p>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.55 0.008 80)' }}>
                        {meal.time} — {meal.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-10">
                    {meal.examples.map((ex: string) => (
                      <span key={ex} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.65 0.008 80)', background: 'oklch(0.20 0.006 285)', padding: '3px 10px', borderRadius: '2px' }}>
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips + Foods */}
          <div className="space-y-6">
            {/* Nutrition tips */}
            <div>
              <h2 className="cx-section-title text-2xl mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
                NUTRITION TIPS
              </h2>
              <div className="space-y-2">
                {plan.tips.map((tip, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded" style={{ background: 'oklch(0.15 0.006 285)', border: '1px solid oklch(1 0 0 / 8%)' }}>
                    <span style={{ color: 'oklch(0.68 0.18 142)', fontFamily: 'Bebas Neue, cursive', fontSize: '1.1rem', flexShrink: 0, lineHeight: 1.4 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.83rem', color: 'oklch(0.70 0.008 80)', lineHeight: 1.6 }}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Food categories */}
            <div>
              <h2 className="cx-section-title text-2xl mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
                FOOD GUIDE
              </h2>
              <div className="space-y-3">
                {plan.foods.map(cat => (
                  <div key={cat.category} className="cx-card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{cat.icon}</span>
                      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'oklch(0.90 0.008 80)' }}>
                        {cat.category}
                      </p>
                    </div>
                    <div className="mb-2">
                      <p className="cx-label mb-1.5" style={{ fontSize: '0.6rem', color: 'oklch(0.68 0.18 142)' }}>EAT</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items.map(item => (
                          <span key={item} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'oklch(0.70 0.008 80)', background: 'oklch(0.68 0.18 142 / 10%)', border: '1px solid oklch(0.68 0.18 142 / 20%)', padding: '2px 8px', borderRadius: '2px' }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    {cat.avoid.length > 0 && (
                      <div>
                        <p className="cx-label mb-1.5" style={{ fontSize: '0.6rem', color: 'oklch(0.577 0.245 27.325)' }}>AVOID</p>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.avoid.map(item => (
                            <span key={item} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.72rem', color: 'oklch(0.70 0.008 80)', background: 'oklch(0.577 0.245 27.325 / 10%)', border: '1px solid oklch(0.577 0.245 27.325 / 20%)', padding: '2px 8px', borderRadius: '2px', textDecoration: 'line-through' }}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
