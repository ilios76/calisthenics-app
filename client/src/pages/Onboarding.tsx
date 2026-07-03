// ============================================================
// CallistheniX – Onboarding  (UNIFIED v2)
//
// Works for BOTH cases:
//   1. Authenticated user (Google sign-in) → saves to Firebase
//   2. Guest user (no login yet) → saves to localStorage
//
// Replaces:
//   - components/OnboardingProfile.tsx  (deleted)
//   - pages/ProfileSetupPage.tsx        (deleted)
//   - pages/Onboarding.tsx              (this file)
// ============================================================

import { useState, useEffect } from 'react';
import { useUser, type UserProfile as LocalUserProfile } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/services/firebaseAuth';
import type { Goal, Sex } from '@/lib/data';
import { getGoalDescription } from '@/lib/data';
import { ChevronRight, ChevronLeft, Dumbbell, Zap, Target, Flame, Hourglass } from 'lucide-react';
import { toast } from 'sonner';

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = 'welcome' | 'name' | 'body' | 'goal' | 'level' | 'loading';

interface FormState {
  name: string;
  sex: Sex | '';
  age: string;
  weight: string;
  height: string;
  goal: Goal | '';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | '';
}

// ── Assets ────────────────────────────────────────────────────────────────────

const CDN = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL';
const HERO_MALE     = `${CDN}/hero-bg-C5GENbhHcAmSh8V2dzFSZc.webp`;
const HERO_FEMALE   = `${CDN}/hero-female-ZWPp8YEB9EFQPcEGvYzBjN.webp`;
const ONBOARDING_BG = `${CDN}/onboarding-bg-CjdbkXHsPUECspmpqtKu2B.webp`;

// ── Component ─────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const { setProfile } = useUser();
  const { user } = useAuth();

  const [step, setStep]   = useState<Step>('welcome');
  const [saving, setSaving] = useState(false);
  const [form, setForm]   = useState<FormState>({
    name: user?.displayName ?? '',
    sex: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    fitnessLevel: '',
  });

  // Pre-fill name from Google account if available
  useEffect(() => {
    if (user?.displayName && !form.name) {
      setForm(f => ({ ...f, name: user.displayName! }));
    }
  }, [user]);

  // Trigger save when we reach the loading step
  useEffect(() => {
    if (step === 'loading') {
      const timer = setTimeout(() => handleSave(), 2200);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // ── Steps ──────────────────────────────────────────────────────────────────

  const STEPS: Step[] = ['welcome', 'name', 'body', 'goal', 'level'];
  const stepIndex = STEPS.indexOf(step);
  const progress  = (stepIndex / (STEPS.length - 1)) * 100;

  const next = () => {
    const i = STEPS.indexOf(step);
    if (i < STEPS.length - 1) setStep(STEPS[i + 1]);
  };
  const back = () => {
    const i = STEPS.indexOf(step);
    if (i > 0) setStep(STEPS[i - 1]);
  };

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (
      !form.name || !form.sex || !form.age ||
      !form.weight || !form.height || !form.goal || !form.fitnessLevel
    ) {
      toast.error('Please complete all fields.');
      setStep('level');
      return;
    }

    setSaving(true);

    // Build local profile (used by UserContext / localStorage)
    const localProfile: LocalUserProfile = {
      name:         form.name,
      sex:          form.sex as Sex,
      age:          parseInt(form.age),
      weight:       parseFloat(form.weight),
      height:       parseFloat(form.height),
      goal:         form.goal as Goal,
      fitnessLevel: form.fitnessLevel as 'beginner' | 'intermediate' | 'advanced',
    };

    try {
      // ① Always save locally (used by program/diet recommendation engine)
      setProfile(localProfile);  // also calls setCurrentView('dashboard')

      // ② If the user is authenticated, also persist to Firebase
      if (user) {
        await updateUserProfile(user.uid, {
          displayName: form.name,
          sex:         form.sex as Sex,
          age:         parseInt(form.age),
          weight:      parseFloat(form.weight),
          height:      parseFloat(form.height),
          goal:        form.goal as Goal,
        });
      }

      toast.success(`Welcome, ${form.name}! Your plan is ready. 💪`);
    } catch (err) {
      console.error('Profile save error:', err);
      // Local profile is already set — user can continue even if Firebase fails
      toast.error('Could not sync to cloud, but your local profile is saved.');
    } finally {
      setSaving(false);
    }
  };

  // ── UI helpers ─────────────────────────────────────────────────────────────

  const heroImg   = form.sex === 'female' ? HERO_FEMALE : HERO_MALE;
  const isLoading = step === 'loading';

  // Shared button styles
  const primaryBtn = (disabled: boolean) => ({
    opacity: disabled ? 0.4 : 1,
    cursor:  disabled ? 'not-allowed' : 'pointer',
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex" style={{ background: 'oklch(0.10 0.005 285)' }}>

      {/* ── Left image panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={step === 'welcome' ? ONBOARDING_BG : heroImg}
          alt="Calisthenics athlete"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transition: 'opacity 0.5s ease' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, oklch(0.10 0.005 285 / 20%), oklch(0.10 0.005 285 / 60%))' }}
        />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <span className="cx-label mb-4 block">The System That Works</span>
          <h2
            className="cx-section-title text-5xl text-white mb-4"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            RESULTS<br />
            <span style={{ color: 'oklch(0.68 0.18 142)' }}>NOT EXCUSES</span>
          </h2>
          <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', maxWidth: 360 }}>
            Without a proven system, you'll stay stuck. CallistheniX gives you the exact
            roadmap to transform your body — step by step.
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 md:px-16">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-12">
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{ background: 'oklch(0.68 0.18 142)', borderRadius: 2 }}
          >
            <Dumbbell size={16} style={{ color: 'oklch(0.10 0.005 285)' }} />
          </div>
          <span
            className="text-xl font-black tracking-wider uppercase"
            style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}
          >
            Callistheni<span style={{ color: 'oklch(0.68 0.18 142)' }}>X</span>
          </span>
        </div>

        {/* Progress bar (hidden on welcome & loading) */}
        {step !== 'welcome' && !isLoading && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="cx-label" style={{ fontSize: '0.7rem' }}>Setup Progress</span>
              <span className="cx-label" style={{ fontSize: '0.7rem' }}>{stepIndex}/{STEPS.length - 1}</span>
            </div>
            <div className="cx-progress-bar">
              <div className="cx-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* ── WELCOME ─────────────────────────────────────────────── */}
        {step === 'welcome' && (
          <div className="animate-cx-slide-up">
            <span className="cx-label mb-4 block">Welcome to CallistheniX</span>
            <h1
              className="cx-section-title text-6xl mb-6"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}
            >
              THE ROUTE THAT<br />
              <span style={{ color: 'oklch(0.68 0.18 142)' }}>GETS RESULTS</span>
            </h1>
            <p className="mb-8" style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.7, maxWidth: 420 }}>
              Follow a clear roadmap from beginner to advanced — proven to deliver results in 90 days.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { icon: <Zap size={20} />,    label: 'Personalized Programs' },
                { icon: <Target size={20} />, label: 'Goal-Based Training' },
                { icon: <Flame size={20} />,  label: 'AI Coach Mode' },
              ].map(f => (
                <div key={f.label} className="cx-card p-4 text-center" style={{ borderRadius: 4 }}>
                  <div className="flex justify-center mb-2" style={{ color: 'oklch(0.68 0.18 142)' }}>{f.icon}</div>
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'oklch(0.80 0.008 80)' }}>
                    {f.label}
                  </p>
                </div>
              ))}
            </div>

            <button className="cx-btn-primary w-full flex items-center justify-center gap-2" onClick={next}>
              Get Started <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ── NAME & SEX ──────────────────────────────────────────── */}
        {step === 'name' && (
          <div className="animate-cx-slide-up">
            <span className="cx-label mb-3 block">Step 1 of 4</span>
            <h2 className="cx-section-title text-4xl mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
              WHO ARE YOU?
            </h2>
            <p className="mb-8" style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}>
              {user ? `Signed in as ${user.email}` : "Let's start with the basics."}
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
                        color:      form.sex === s ? 'oklch(0.10 0.005 285)' : 'oklch(0.70 0.008 80)',
                        border:     form.sex === s ? '1px solid oklch(0.68 0.18 142)' : '1px solid oklch(1 0 0 / 12%)',
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
                style={primaryBtn(!form.name || !form.sex)}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── BODY STATS ──────────────────────────────────────────── */}
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
              {[
                { label: 'Age', key: 'age', placeholder: 'e.g. 28', min: 14, max: 80 },
                { label: 'Weight (kg)', key: 'weight', placeholder: 'e.g. 75', min: 30, max: 200 },
                { label: 'Height (cm)', key: 'height', placeholder: 'e.g. 178', min: 140, max: 220 },
              ].map(field => (
                <div key={field.key}>
                  <label className="cx-label mb-2 block">{field.label}</label>
                  <input
                    className="cx-input"
                    type="number"
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    value={form[field.key as keyof FormState]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-10">
              <button className="cx-btn-ghost flex-1" onClick={back}><ChevronLeft size={16} /> Back</button>
              <button
                className="cx-btn-primary flex-1 flex items-center justify-center gap-2"
                onClick={next}
                disabled={!form.age || !form.weight || !form.height}
                style={primaryBtn(!form.age || !form.weight || !form.height)}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── GOAL ────────────────────────────────────────────────── */}
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
                { value: 'lose_weight' as Goal, label: 'Lose Weight',      icon: '🔥' },
                { value: 'gain_muscle' as Goal, label: 'Gain Muscle',      icon: '💪' },
                { value: 'stay_slim'   as Goal, label: 'Stay Slim & Tight', icon: '⚡' },
              ]).map(g => (
                <button
                  key={g.value}
                  onClick={() => setForm(f => ({ ...f, goal: g.value }))}
                  className="w-full p-4 rounded text-left transition-all duration-150"
                  style={{
                    background: form.goal === g.value ? 'oklch(0.68 0.18 142 / 12%)' : 'oklch(0.17 0.006 285)',
                    border:     form.goal === g.value ? '1px solid oklch(0.68 0.18 142)' : '1px solid oklch(1 0 0 / 10%)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{g.icon}</span>
                    <div>
                      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: form.goal === g.value ? 'oklch(0.68 0.18 142)' : 'oklch(0.90 0.008 80)' }}>
                        {g.label}
                      </p>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'oklch(0.60 0.008 80)', marginTop: 2 }}>
                        {getGoalDescription(g.value)}
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
                style={primaryBtn(!form.goal)}
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── FITNESS LEVEL ────────────────────────────────────────── */}
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
                { value: 'beginner',     label: 'Beginner',     desc: 'New to training or returning after a long break', badge: '0–6 months' },
                { value: 'intermediate', label: 'Intermediate', desc: 'Training consistently for 6+ months',             badge: '6m–2 years' },
                { value: 'advanced',     label: 'Advanced',     desc: 'Experienced athlete with solid technique',         badge: '2+ years'   },
              ] as const).map(l => (
                <button
                  key={l.value}
                  onClick={() => setForm(f => ({ ...f, fitnessLevel: l.value }))}
                  className="w-full p-4 rounded text-left transition-all duration-150"
                  style={{
                    background: form.fitnessLevel === l.value ? 'oklch(0.68 0.18 142 / 12%)' : 'oklch(0.17 0.006 285)',
                    border:     form.fitnessLevel === l.value ? '1px solid oklch(0.68 0.18 142)' : '1px solid oklch(1 0 0 / 10%)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: form.fitnessLevel === l.value ? 'oklch(0.68 0.18 142)' : 'oklch(0.90 0.008 80)' }}>
                        {l.label}
                      </p>
                      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'oklch(0.60 0.008 80)', marginTop: 2 }}>
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
                disabled={!form.fitnessLevel || saving}
                style={primaryBtn(!form.fitnessLevel || saving)}
              >
                Build My Program <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── LOADING / SAVING ─────────────────────────────────────── */}
        {isLoading && (
          <div className="animate-cx-slide-up flex flex-col items-center justify-center py-20">
            <div className="mb-8 flex justify-center">
              <Hourglass size={64} style={{ color: 'oklch(0.68 0.18 142)', animation: 'spin 2s linear infinite' }} />
            </div>
            <h2
              className="cx-section-title text-4xl mb-4 text-center"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}
            >
              BUILDING YOUR<br />
              <span style={{ color: 'oklch(0.68 0.18 142)' }}>PERSONAL PLAN</span>
            </h2>
            <p className="text-center" style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', maxWidth: 320 }}>
              Matching your program, diet plan, and AI coach to your profile…
            </p>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

      </div>
    </div>
  );
}
