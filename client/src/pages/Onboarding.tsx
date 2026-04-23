// ============================================================
// CallistheniX – Onboarding Page
// Multi-step profile setup: name, sex, age, weight, goal
// Industrial Athletic dark design
// ============================================================
import { useState, useEffect } from 'react';
import { useUser, type UserProfile } from '@/contexts/UserContext';
import type { Goal, Sex } from '@/lib/data';
import { getGoalDescription } from '@/lib/data';
import { ChevronRight, ChevronLeft, Dumbbell, Zap, Target, Flame, Hourglass } from 'lucide-react';

type Step = 'welcome' | 'name' | 'body' | 'goal' | 'level' | 'loading';

const HERO_MALE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/hero-bg-C5GENbhHcAmSh8V2dzFSZc.webp';
const HERO_FEMALE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/hero-female-ZWPp8YEB9EFQPcEGvYzBjN.webp';
const ONBOARDING_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/onboarding-bg-CjdbkXHsPUECspmpqtKu2B.webp';

export default function OnboardingPage() {
  const { setProfile } = useUser();
  const [step, setStep] = useState<Step>('welcome');
  const [form, setForm] = useState({
    name: '',
    sex: '' as Sex | '',
    age: '',
    weight: '',
    height: '',
    goal: '' as Goal | '',
    fitnessLevel: '' as 'beginner' | 'intermediate' | 'advanced' | '',
  });

  useEffect(() => {
    if (step === 'loading') {
      const timer = setTimeout(() => {
        handleSubmit();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const steps: Step[] = ['welcome', 'name', 'body', 'goal', 'level'];
  const stepIndex = steps.indexOf(step);
  const progress = (stepIndex / (steps.length - 1)) * 100;

  const next = () => {
    const i = steps.indexOf(step);
    if (i < steps.length - 1) setStep(steps[i + 1]);
  };
  const back = () => {
    const i = steps.indexOf(step);
    if (i > 0) setStep(steps[i - 1]);
  };

  const handleSubmit = () => {
    if (!form.name || !form.sex || !form.age || !form.weight || !form.height || !form.goal || !form.fitnessLevel) return;
    const profile: UserProfile = {
      name: form.name,
      sex: form.sex as Sex,
      age: parseInt(form.age),
      weight: parseFloat(form.weight),
      height: parseFloat(form.height),
      goal: form.goal as Goal,
      fitnessLevel: form.fitnessLevel as 'beginner' | 'intermediate' | 'advanced',
    };
    setProfile(profile);
  };

  const heroImg = form.sex === 'female' ? HERO_FEMALE : HERO_MALE;

  return (
    <div className="min-h-screen flex" style={{ background: 'oklch(0.10 0.005 285)' }}>
      {/* Left: Image panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={step === 'welcome' ? ONBOARDING_BG : heroImg}
          alt="Calisthenics athlete"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transition: 'opacity 0.5s ease' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, oklch(0.10 0.005 285 / 20%), oklch(0.10 0.005 285 / 60%))' }} />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <div className="mb-4">
            <span className="cx-label">The System That Works</span>
          </div>
          <h2 className="cx-section-title text-5xl text-white mb-4" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
            RESULTS<br />
            <span style={{ color: 'oklch(0.68 0.18 142)' }}>NOT EXCUSES</span>
          </h2>
          <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', maxWidth: '360px' }}>
            Without a proven system, you'll stay stuck. CallistheniX gives you the exact roadmap to transform your body in 90 days.
          </p>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 md:px-16">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 flex items-center justify-center" style={{ background: 'oklch(0.68 0.18 142)', borderRadius: '2px' }}>
            <Dumbbell size={16} style={{ color: 'oklch(0.10 0.005 285)' }} />
          </div>
          <span className="text-xl font-black tracking-wider uppercase" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
            Callistheni<span style={{ color: 'oklch(0.68 0.18 142)' }}>X</span>
          </span>
        </div>

        {/* Progress bar */}
        {step !== 'welcome' && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="cx-label" style={{ fontSize: '0.7rem' }}>Setup Progress</span>
              <span className="cx-label" style={{ fontSize: '0.7rem' }}>{stepIndex}/{steps.length - 1}</span>
            </div>
            <div className="cx-progress-bar">
              <div className="cx-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Step: Welcome */}
        {step === 'welcome' && (
          <div className="animate-cx-slide-up">
            <span className="cx-label mb-4 block">Welcome to CallistheniX App</span>
            <h1 className="cx-section-title text-6xl mb-6" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
              THE ROUTE THAT<br />
              <span style={{ color: 'oklch(0.68 0.18 142)' }}>GETS RESULTS</span>
            </h1>
            <p className="mb-8" style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7, maxWidth: '420px' }}>
              Follow a clear roadmap from beginner to advanced, step by step — proven to deliver results in 90 days.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { icon: <Zap size={20} />, label: 'Personalized Programs' },
                { icon: <Target size={20} />, label: 'Goal-Based Training' },
                { icon: <Flame size={20} />, label: 'Live Trainer Mode' },
              ].map(f => (
                <div key={f.label} className="cx-card p-4 text-center" style={{ borderRadius: '4px' }}>
                  <div className="flex justify-center mb-2" style={{ color: 'oklch(0.68 0.18 142)' }}>{f.icon}</div>
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'oklch(0.80 0.008 80)' }}>{f.label}</p>
                </div>
              ))}
            </div>
            <button className="cx-btn-primary w-full flex items-center justify-center gap-2" onClick={next}>
              Get Started <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Step: Name */}
        {step === 'name' && (
          <div className="animate-cx-slide-up">
            <span className="cx-label mb-3 block">Step 1 of 4</span>
            <h2 className="cx-section-title text-4xl mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
              WHO ARE YOU?
            </h2>
            <p className="mb-8" style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}>
              Let's start with the basics.
            </p>

            <div className="space-y-6">
              <div>
                <label className="cx-label mb-2 block">Your Name</label>
                <input
                  className="cx-input"
                  placeholder="e.g. Alex"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="cx-label mb-3 block">Sex</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['male', 'female'] as Sex[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setForm(f => ({ ...f, sex: s }))}
                      className="py-4 rounded transition-all duration-150"
                      style={{
                        fontFamily: 'Barlow Condensed, sans-serif',
                        fontWeight: 700,
                        fontSize: '1rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        background: form.sex === s ? 'oklch(0.68 0.18 142)' : 'oklch(0.17 0.006 285)',
                        color: form.sex === s ? 'oklch(0.10 0.005 285)' : 'oklch(0.70 0.008 80)',
                        border: form.sex === s ? '1px solid oklch(0.68 0.18 142)' : '1px solid oklch(1 0 0 / 12%)',
                      }}
                    >
                      {s === 'male' ? '♂ Male' : '♀ Female'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-10">
              <button className="cx-btn-ghost flex-1" onClick={back}><ChevronLeft size={16} /> Back</button>
              <button
                className="cx-btn-primary flex-1 flex items-center justify-center gap-2"
                onClick={next}
                disabled={!form.name || !form.sex}
                style={{ opacity: (!form.name || !form.sex) ? 0.4 : 1 }}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step: Body */}
        {step === 'body' && (
          <div className="animate-cx-slide-up">
            <span className="cx-label mb-3 block">Step 2 of 4</span>
            <h2 className="cx-section-title text-4xl mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
              YOUR BODY STATS
            </h2>
            <p className="mb-8" style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}>
              Used to calculate your personalized program and nutrition plan.
            </p>

            <div className="space-y-5">
              <div>
                <label className="cx-label mb-2 block">Age</label>
                <input
                  className="cx-input"
                  type="number"
                  placeholder="e.g. 28"
                  min="14" max="80"
                  value={form.age}
                  onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
                />
              </div>
              <div>
                <label className="cx-label mb-2 block">Weight (kg)</label>
                <input
                  className="cx-input"
                  type="number"
                  placeholder="e.g. 75"
                  min="30" max="200"
                  value={form.weight}
                  onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                />
              </div>
              <div>
                <label className="cx-label mb-2 block">Height (cm)</label>
                <input
                  className="cx-input"
                  type="number"
                  placeholder="e.g. 178"
                  min="140" max="220"
                  value={form.height}
                  onChange={e => setForm(f => ({ ...f, height: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-10">
              <button className="cx-btn-ghost flex-1" onClick={back}><ChevronLeft size={16} /> Back</button>
              <button
                className="cx-btn-primary flex-1 flex items-center justify-center gap-2"
                onClick={next}
                disabled={!form.age || !form.weight || !form.height}
                style={{ opacity: (!form.age || !form.weight || !form.height) ? 0.4 : 1 }}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step: Goal */}
        {step === 'goal' && (
          <div className="animate-cx-slide-up">
            <span className="cx-label mb-3 block">Step 3 of 4</span>
            <h2 className="cx-section-title text-4xl mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
              YOUR GOAL
            </h2>
            <p className="mb-8" style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}>
              What do you want to achieve?
            </p>

            <div className="space-y-3">
              {([
                { value: 'lose_weight' as Goal, label: 'Lose Weight', icon: '🔥', desc: getGoalDescription('lose_weight') },
                { value: 'gain_muscle' as Goal, label: 'Gain Muscle', icon: '💪', desc: getGoalDescription('gain_muscle') },
                { value: 'stay_slim' as Goal, label: 'Stay Slim & Tight', icon: '⚡', desc: getGoalDescription('stay_slim') },
              ]).map(g => (
                <button
                  key={g.value}
                  onClick={() => setForm(f => ({ ...f, goal: g.value }))}
                  className="w-full p-4 rounded text-left transition-all duration-150"
                  style={{
                    background: form.goal === g.value ? 'oklch(0.65 0.22 40 / 12%)' : 'oklch(0.17 0.006 285)',
                    border: form.goal === g.value ? '1px solid oklch(0.68 0.18 142)' : '1px solid oklch(1 0 0 / 10%)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{g.icon}</span>
                    <div>
                      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: form.goal === g.value ? 'oklch(0.68 0.18 142)' : 'oklch(0.90 0.008 80)' }}>
                        {g.label}
                      </p>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'oklch(0.60 0.008 80)', marginTop: '2px' }}>
                        {g.desc}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button className="cx-btn-ghost flex-1" onClick={back}><ChevronLeft size={16} /> Back</button>
              <button
                className="cx-btn-primary flex-1 flex items-center justify-center gap-2"
                onClick={next}
                disabled={!form.goal}
                style={{ opacity: !form.goal ? 0.4 : 1 }}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step: Loading */}
        {step === 'loading' && (
          <div className="animate-cx-slide-up flex flex-col items-center justify-center py-20">
            <div className="mb-8 flex justify-center">
              <Hourglass size={64} style={{ color: 'oklch(0.68 0.18 142)', animation: 'spin 2s linear infinite' }} />
            </div>
            <h2 className="cx-section-title text-4xl mb-4 text-center" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
              WE ARE PREPARING<br />
              <span style={{ color: 'oklch(0.68 0.18 142)' }}>YOUR OWN PLAN</span>
            </h2>
            <p className="text-center" style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', maxWidth: '320px' }}>
              Building your personalized workout program based on your profile...
            </p>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Step: Level */}
        {step === 'level' && (
          <div className="animate-cx-slide-up">
            <span className="cx-label mb-3 block">Step 4 of 4</span>
            <h2 className="cx-section-title text-4xl mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
              FITNESS LEVEL
            </h2>
            <p className="mb-8" style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}>
              Be honest — we'll match your program accordingly.
            </p>

            <div className="space-y-3">
              {([
                { value: 'beginner', label: 'Beginner', desc: 'New to training or returning after a long break', badge: '0–6 months' },
                { value: 'intermediate', label: 'Intermediate', desc: 'Training consistently for 6+ months', badge: '6m–2 years' },
                { value: 'advanced', label: 'Advanced', desc: 'Experienced athlete with solid technique', badge: '2+ years' },
              ] as const).map(l => (
                <button
                  key={l.value}
                  onClick={() => setForm(f => ({ ...f, fitnessLevel: l.value }))}
                  className="w-full p-4 rounded text-left transition-all duration-150"
                  style={{
                    background: form.fitnessLevel === l.value ? 'oklch(0.65 0.22 40 / 12%)' : 'oklch(0.17 0.006 285)',
                    border: form.fitnessLevel === l.value ? '1px solid oklch(0.68 0.18 142)' : '1px solid oklch(1 0 0 / 10%)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: form.fitnessLevel === l.value ? 'oklch(0.68 0.18 142)' : 'oklch(0.90 0.008 80)' }}>
                        {l.label}
                      </p>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'oklch(0.60 0.008 80)', marginTop: '2px' }}>
                        {l.desc}
                      </p>
                    </div>
                    <span className="cx-tag">{l.badge}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <button className="cx-btn-ghost flex-1" onClick={back}><ChevronLeft size={16} /> Back</button>
              <button
                className="cx-btn-primary flex-1 flex items-center justify-center gap-2"
                onClick={() => setStep('loading')}
                disabled={!form.fitnessLevel}
                style={{ opacity: !form.fitnessLevel ? 0.4 : 1 }}
              >
                Build My Program <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
