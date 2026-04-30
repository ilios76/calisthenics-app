import React, { useEffect, useState } from 'react';
import { Trophy, Zap, Flame, Star, ArrowRight } from 'lucide-react';
import { useWorkoutCompletion } from '@/contexts/WorkoutCompletionContext';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithGoogle } from '@/services/firebaseAuth';
import { notificationService } from '@/services/notificationService';
import { CoachFigure } from './CoachFigure';
import { PricingModal } from './PricingModal';

interface WorkoutEndScreenProps {
  onContinue: () => void;
}

const MOTIVATION_MESSAGES = [
  "You started strong! 🔥",
  "Keep the momentum going! 💪",
  "You're building a habit! 🎯",
  "This is just the beginning! 🚀",
  "Every rep counts! 💯",
  "You're unstoppable! ⚡",
  "Consistency is key! 🔑",
  "You're crushing it! 🏆",
];

export const WorkoutEndScreen: React.FC<WorkoutEndScreenProps> = ({ onContinue }) => {
  const { completion, completeWorkout } = useWorkoutCompletion();
  const { setCurrentView } = useUser();
  const { user } = useAuth();
  const [xpGained] = useState(50);
  const [leveledUp, setLeveledUp] = useState(false);
  const [motivation, setMotivation] = useState('');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  useEffect(() => {
    // Complete the workout and trigger animations
    const oldLevel = completion.level;
    completeWorkout(xpGained);
    
    // Check if leveled up
    const newLevel = Math.floor((completion.xp + xpGained) / 100) + 1;
    if (newLevel > oldLevel) {
      setLeveledUp(true);
    }

    // Set random motivation message
    setMotivation(MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)]);

    // Send daily notification
    const dayNumber = completion.totalWorkouts + 1;
    notificationService.sendDailyNotification(dayNumber).catch(err => console.error('Notification error:', err));

    // Show sign-in prompt after first workout if not authenticated
    if (completion.totalWorkouts === 1 && !user) {
      setTimeout(() => setShowSignInPrompt(true), 3000);
    }

    // Show paywall if trial ended (after 15 seconds to let user see congratulations)
    if (completion.trialDaysRemaining <= 0 && !completion.isPremium) {
      setTimeout(() => setShowPricingModal(true), 15000);
    }
  }, []);

  const nextLevelXp = (completion.level + 1) * 100;
  const currentLevelXp = completion.level * 100;
  const xpProgress = ((completion.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  const handleContinue = () => {
    setShowSignInPrompt(false);
    // Show paywall if trial ended
    if (completion.trialDaysRemaining <= 0 && !completion.isPremium) {
      setShowPricingModal(true);
    } else {
      onContinue();
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      setShowSignInPrompt(false);
      onContinue();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleUpgrade = (plan: 'monthly' | 'yearly') => {
    // TODO: Integrate with Stripe payment
    console.log(`Upgrading to ${plan} plan`);
    setShowPricingModal(false);
    onContinue();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-8"
      style={{ background: 'oklch(0.10 0.005 285)' }}
    >
      {/* Sign-In Prompt Modal */}
      {showSignInPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-8 max-w-sm w-full" style={{ background: 'oklch(0.12 0.005 285)', border: '1px solid oklch(0.68 0.18 142 / 30%)' }}>
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: 'oklch(0.96 0.008 80)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Save Your Progress
            </h2>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', color: 'oklch(0.85 0.008 80)', lineHeight: 1.6, marginBottom: '24px' }}>
              Sign in to track your workouts, unlock achievements, and save your progress across devices.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSignIn}
                className="w-full px-4 py-3 rounded flex items-center justify-center gap-2"
                style={{ background: 'oklch(0.68 0.18 142)', color: 'oklch(0.10 0.005 285)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
              >
                <span>🔐</span> Sign In with Google
              </button>
              <button
                onClick={() => setShowSignInPrompt(false)}
                className="w-full px-4 py-3 rounded"
                style={{ background: 'oklch(0.68 0.18 142 / 10%)', border: '1px solid oklch(0.68 0.18 142)', color: 'oklch(0.68 0.18 142)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}
              >
                Continue Without Signing In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confetti-like animation background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-2 h-2 rounded-full animate-pulse"
          style={{
            background: 'oklch(0.68 0.18 142)',
            left: '20%',
            top: '20%',
            animation: 'float 3s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-2 h-2 rounded-full animate-pulse"
          style={{
            background: 'oklch(0.68 0.18 142)',
            left: '80%',
            top: '30%',
            animation: 'float 4s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-2 h-2 rounded-full animate-pulse"
          style={{
            background: 'oklch(0.68 0.18 142)',
            left: '50%',
            top: '10%',
            animation: 'float 3.5s ease-in-out infinite',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-md w-full text-center">
        {/* Coach Figure - Post-workout celebration */}
        <div className="mb-8">
          <CoachFigure
            type="finished"
            message="Rest up—I've counted that you've already put in enough effort today. Your body needs time to rebuild stronger. See you on the next session!"
            showMessage={true}
          />
        </div>

        {/* Trophy icon */}
        <div className="mb-6 flex justify-center">
          <div
            className="animate-bounce"
            style={{
              animationDuration: '1s',
            }}
          >
            <Trophy
              size={80}
              style={{
                color: 'oklch(0.68 0.18 142)',
              }}
            />
          </div>
        </div>

        {/* Main heading */}
        <h1
          style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
            fontSize: '2.5rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'oklch(0.96 0.008 80)',
            marginBottom: '8px',
          }}
        >
          Congratulations!
        </h1>

        {/* Motivation message */}
        <p
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '1.1rem',
            color: 'oklch(0.68 0.18 142)',
            marginBottom: '32px',
            fontWeight: 500,
          }}
        >
          {motivation}
        </p>

        {/* XP and Level card */}
        <div
          style={{
            background: 'oklch(0.12 0.005 285)',
            border: '1px solid oklch(0.68 0.18 142 / 30%)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          {/* XP Gained */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Zap size={24} style={{ color: 'oklch(0.68 0.18 142)' }} />
            <div>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.8rem',
                  color: 'oklch(0.65 0.01 285)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                XP Gained
              </p>
              <p
                style={{
                  fontFamily: 'Bebas Neue, cursive',
                  fontSize: '1.8rem',
                  color: 'oklch(0.96 0.008 80)',
                }}
              >
                +{xpGained}
              </p>
            </div>
          </div>

          {/* Level Up animation */}
          {leveledUp && (
            <div
              className="mb-6 p-4 rounded-lg"
              style={{
                background: 'oklch(0.68 0.18 142 / 15%)',
                border: '2px solid oklch(0.68 0.18 142)',
                animation: 'pulse 0.5s ease-in-out',
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star size={20} style={{ color: 'oklch(0.68 0.18 142)' }} />
                <p
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'oklch(0.68 0.18 142)',
                    textTransform: 'uppercase',
                  }}
                >
                  Level Up!
                </p>
              </div>
              <p
                style={{
                  fontFamily: 'Bebas Neue, cursive',
                  fontSize: '2rem',
                  color: 'oklch(0.96 0.008 80)',
                }}
              >
                Level {completion.level}
              </p>
            </div>
          )}

          {/* Current stats */}
          <div className="grid grid-cols-3 gap-4">
            {/* Level */}
            <div>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.75rem',
                  color: 'oklch(0.65 0.01 285)',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Level
              </p>
              <p
                style={{
                  fontFamily: 'Bebas Neue, cursive',
                  fontSize: '1.5rem',
                  color: 'oklch(0.68 0.18 142)',
                }}
              >
                {completion.level}
              </p>
            </div>

            {/* Streak */}
            <div>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.75rem',
                  color: 'oklch(0.65 0.01 285)',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Streak
              </p>
              <div className="flex items-center justify-center gap-1">
                <Flame size={16} style={{ color: 'oklch(0.68 0.18 142)' }} />
                <p
                  style={{
                    fontFamily: 'Bebas Neue, cursive',
                    fontSize: '1.5rem',
                    color: 'oklch(0.68 0.18 142)',
                  }}
                >
                  {completion.streak}
                </p>
              </div>
            </div>

            {/* Total Workouts */}
            <div>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.75rem',
                  color: 'oklch(0.65 0.01 285)',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Workouts
              </p>
              <p
                style={{
                  fontFamily: 'Bebas Neue, cursive',
                  fontSize: '1.5rem',
                  color: 'oklch(0.68 0.18 142)',
                }}
              >
                {completion.totalWorkouts}
              </p>
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.75rem',
                  color: 'oklch(0.65 0.01 285)',
                  textTransform: 'uppercase',
              }}
              >
                Next Level
              </p>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.75rem',
                  color: 'oklch(0.68 0.18 142)',
                }}
              >
                {Math.floor(xpProgress)}%
              </p>
            </div>
            <div
              style={{
                background: 'oklch(0.15 0.006 285)',
                borderRadius: '4px',
                height: '8px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: 'oklch(0.68 0.18 142)',
                  height: '100%',
                  width: `${xpProgress}%`,
                  transition: 'width 0.5s ease-out',
                }}
              />
            </div>
          </div>
        </div>

        {/* Trial status */}
        {completion.trialDaysRemaining > 0 && (
          <div
            style={{
              background: 'oklch(0.12 0.005 285)',
              border: '1px solid oklch(0.68 0.18 142 / 20%)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '24px',
            }}
          >
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.85rem',
                color: 'oklch(0.65 0.01 285)',
              }}
            >
              Trial: <span style={{ color: 'oklch(0.68 0.18 142)', fontWeight: 600 }}>{completion.trialDaysRemaining} days remaining</span>
            </p>
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{
            background: 'oklch(0.68 0.18 142)',
            color: 'oklch(0.10 0.005 285)',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {completion.trialDaysRemaining <= 0 && !completion.isPremium ? 'Upgrade Now' : 'Keep Training'}
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};
