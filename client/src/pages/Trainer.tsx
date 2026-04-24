// ============================================================
// CallistheniX – Live Trainer Page
// Full-screen exercise mode with timer, sets, GIF demonstrations
// ============================================================
import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useProgress } from '@/contexts/ProgressContext';
import { getExercisesByIds } from '@/lib/data';
import { getExerciseGifUrl } from '@/lib/gifUrls';
import { getRandomQuote, getRandomQuoteWithVariety } from '@/lib/quotes';
import { playDoubleBeepSound } from '@/lib/soundUtils';
import { Play, Pause, SkipForward, ChevronLeft, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { WorkoutEndScreen } from '@/components/WorkoutEndScreen';
import { CoachFigure } from '@/components/CoachFigure';
import { useCoach } from '@/contexts/CoachContext';
import { useWorkoutCompletion } from '@/contexts/WorkoutCompletionContext';

type Phase = 'preview' | 'exercise' | 'rest' | 'complete';

export default function TrainerPage() {
  const { selectedProgram, setCurrentView, completedSessions, setCompletedSessions } = useUser();
  const { generatePreWorkoutMessage, generatePostWorkoutMessage } = useCoach();
  const { completion } = useWorkoutCompletion();
  const [dayIndex, setDayIndex] = useState(0);
  const [exIndex, setExIndex] = useState(0);
  const [setNumber, setSetNumber] = useState(1);
  const [phase, setPhase] = useState<Phase>('preview');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(getRandomQuoteWithVariety());

  if (!selectedProgram) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'oklch(0.10 0.005 285)' }}>
        <div className="text-center">
          <p style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif', marginBottom: '16px' }}>
            No program selected.
          </p>
          <button className="cx-btn-primary" onClick={() => setCurrentView('programs')}>
            Choose a Program
          </button>
        </div>
      </div>
    );
  }

  const currentDay = selectedProgram.days[dayIndex];
  const exercises = getExercisesByIds(currentDay.exercises);
  const currentEx = exercises[exIndex];
  const totalExercises = exercises.length;
  const isTimeBased = !!currentEx?.durationSeconds;
  const totalSets = currentEx?.sets ?? 3;

  // Timer logic
  useEffect(() => {
    if (!isRunning || phase === 'preview' || phase === 'complete') return;
    if (timeLeft <= 0) {
      handleTimerEnd();
      return;
    }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [isRunning, timeLeft, phase]);

  // Play sound when timer ends
  const playTimerSound = () => {
    playDoubleBeepSound();
  };

  const handleTimerEnd = useCallback(() => {
    playTimerSound();
    setIsRunning(false);
    if (phase === 'exercise') {
      if (setNumber < totalSets) {
        setPhase('rest');
        setTimeLeft(currentEx?.restSeconds ?? 60);
        setIsRunning(true);
        setCurrentQuote(getRandomQuoteWithVariety());
      } else {
        // Move to next exercise
        if (exIndex < totalExercises - 1) {
          setExIndex(i => i + 1);
          setSetNumber(1);
          setPhase('preview');
          setIsRunning(false);
          setCurrentQuote(getRandomQuoteWithVariety());
        } else {
          setPhase('complete');
          setCompletedSessions(completedSessions + 1);
          localStorage.setItem('lastWorkoutTime', Date.now().toString());
          const coachMsg = generatePostWorkoutMessage(30, 50, completion.streak);
          toast.custom((t) => (
            <div
              style={{
                background: 'oklch(0.68 0.18 142)',
                color: 'oklch(0.10 0.005 285)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9rem',
              }}
            >
              {coachMsg.emoji} {coachMsg.content}
            </div>
          ));
        }
      }
    } else if (phase === 'rest') {
      if (setNumber < totalSets) {
        // Continue with next set of same exercise
        setSetNumber(s => s + 1);
        setPhase('preview');
        setIsRunning(false);
        setCurrentQuote(getRandomQuoteWithVariety());
      } else {
        // All sets done, move to next exercise
        if (exIndex < totalExercises - 1) {
          setExIndex(i => i + 1);
          setSetNumber(1);
          setPhase('preview');
          setIsRunning(false);
          setCurrentQuote(getRandomQuoteWithVariety());
        } else {
          // Workout complete
          setPhase('complete');
          setCompletedSessions(completedSessions + 1);
          localStorage.setItem('lastWorkoutTime', Date.now().toString());
          const coachMsg = generatePostWorkoutMessage(30, 50, completion.streak);
          toast.custom((t) => (
            <div
              style={{
                background: 'oklch(0.68 0.18 142)',
                color: 'oklch(0.10 0.005 285)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9rem',
              }}
            >
              {coachMsg.emoji} {coachMsg.content}
            </div>
          ));
        }
      }
    }
  }, [phase, setNumber, totalSets, currentEx, exIndex, totalExercises, completedSessions, isTimeBased]);

  const startExercise = () => {
    if (!currentEx) return;
    setPhase('exercise');
    if (isTimeBased) {
      setTimeLeft(currentEx.durationSeconds!);
      setIsRunning(true);
    } else {
      setTimeLeft(0);
      setIsRunning(false);
    }
  };

  const startRest = () => {
    setPhase('rest');
    setTimeLeft(currentEx?.restSeconds ?? 60);
    setIsRunning(true);
  };

  const advanceExercise = () => {
    if (exIndex < totalExercises - 1) {
      setExIndex(i => i + 1);
      setSetNumber(1);
      setPhase('preview');
      setIsRunning(false);
      setCurrentQuote(getRandomQuote());
    } else {
      setPhase('complete');
      setCompletedSessions(completedSessions + 1);
      toast.success('Workout Complete! Great job! 💪');
    }
  };

  const completeSet = () => {
    if (setNumber < totalSets) {
      setSetNumber(s => s + 1);
      startRest();
    } else {
      advanceExercise();
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const overallProgress = ((exIndex + (setNumber - 1) / totalSets) / totalExercises) * 100;

  if (phase === 'complete') {
    return (
      <WorkoutEndScreen
        onContinue={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.10 0.005 285)' }}>
      {/* Header */}
      <div style={{ background: 'oklch(0.12 0.005 285)', borderBottom: '1px solid oklch(1 0 0 / 8%)', padding: '16px 24px' }}>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentView('programs')}
            className="flex items-center gap-2"
            style={{ color: 'oklch(0.68 0.18 142)', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.85rem' }}
          >
            <ChevronLeft size={18} /> Back
          </button>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'oklch(0.65 0.01 285)', marginBottom: '4px' }}>
              {currentDay.name}
            </p>
            <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.2rem', color: 'oklch(0.96 0.008 80)' }}>
              {currentEx?.name}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'oklch(0.65 0.01 285)' }}>
              {exIndex + 1} / {totalExercises}
            </p>
            <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.2rem', color: 'oklch(0.68 0.18 142)' }}>
              Set {setNumber} / {totalSets}
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="cx-progress-bar">
          <div className="cx-progress-fill" style={{ width: `${overallProgress}%` }} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Coach Figure - Pre-workout guidance */}
        {phase === 'preview' && (
          <div className="mb-8 w-full max-w-md">
            <CoachFigure
              type="guidance"
              message={`Ready to crush ${currentEx?.name}? Focus on form, breathe steadily, and give it your best effort!`}
              showMessage={true}
            />
          </div>
        )}

        {/* Exercise video/GIF */}
        <div className="relative w-full max-w-2xl mb-8" style={{ aspectRatio: '16/9', background: 'oklch(0.12 0.005 285)', borderRadius: '8px', overflow: 'hidden', border: '1px solid oklch(1 0 0 / 8%)' }}>
          {phase === 'preview' ? (
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'oklch(0.15 0.006 285)' }}>
              <div className="text-center">
                <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'oklch(0.68 0.18 142)', marginBottom: '16px' }}>
                  GET READY
                </p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', color: 'oklch(0.65 0.01 285)', marginBottom: '24px' }}>
                  {currentEx?.name}
                </p>
                <button
                  onClick={startExercise}
                  className="cx-btn-primary"
                >
                  Start Exercise
                </button>
              </div>
            </div>
          ) : phase === 'rest' ? (
            <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, oklch(0.15 0.006 285) 0%, oklch(0.12 0.005 285) 100%)' }}>
              <div className="text-center">
                <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(0.68 0.18 142)', marginBottom: '24px' }}>
                  Rest Time
                </p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.3rem', color: 'oklch(0.85 0.008 80)', marginBottom: '16px', fontWeight: 500 }}>
                  Stay healthy — drink water, only!
                </p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: 'oklch(0.65 0.01 285)' }}>
                  Prepare for the next set
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* GIF demonstration */}
              {currentEx && getExerciseGifUrl(currentEx.name) ? (
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'oklch(0 0 0)' }}>
                  <img
                    src={getExerciseGifUrl(currentEx.name) || ''}
                    alt={currentEx.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'oklch(0.15 0.006 285)' }}>
                  <p style={{ color: 'oklch(0.65 0.01 285)', fontFamily: 'DM Sans, sans-serif' }}>GIF demonstration not available</p>
                </div>
              )}
            </>
          )
        }
      </div>

        {/* Timer and controls */}
        <div className="w-full max-w-md text-center">
          {phase === 'preview' ? (
            <div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: 'oklch(0.65 0.01 285)', marginBottom: '24px' }}>
                {currentEx?.instructions[0]}
              </p>
            </div>
          ) : isTimeBased && phase === 'exercise' ? (
            <>
              <span className="cx-label mb-2">Time Remaining</span>
              <p className="animate-cx-pulse" style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '6rem', color: 'oklch(0.68 0.18 142)', lineHeight: 1 }}>
                {formatTime(timeLeft)}
              </p>
              <div className="flex gap-4 mt-6 justify-center">
                <button
                  onClick={() => setIsRunning(r => !r)}
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'oklch(0.68 0.18 142 / 15%)', border: '1px solid oklch(0.68 0.18 142)', color: 'oklch(0.68 0.18 142)' }}
                >
                  {isRunning ? <Pause size={22} /> : <Play size={22} />}
                </button>
                <button
                  onClick={completeSet}
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'oklch(0.68 0.18 142)', color: 'oklch(0.10 0.005 285)' }}
                >
                  <SkipForward size={22} />
                </button>
              </div>
            </>
          ) : !isTimeBased && phase === 'exercise' ? (
            <>
              <span className="cx-label mb-2">Reps</span>
              <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '5rem', color: 'oklch(0.68 0.18 142)', lineHeight: 1, marginBottom: '24px' }}>
                {currentEx?.reps}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={completeSet}
                  className="cx-btn-primary"
                >
                  Set Complete
                </button>
              </div>
            </>
          ) : phase === 'rest' ? (
            <>
              <span className="cx-label mb-2">Rest Time</span>
              <p className="animate-cx-pulse" style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '5rem', color: 'oklch(0.68 0.18 142)', lineHeight: 1, marginBottom: '24px' }}>
                {formatTime(timeLeft)}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setIsRunning(r => !r)}
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'oklch(0.68 0.18 142 / 15%)', border: '1px solid oklch(0.68 0.18 142)', color: 'oklch(0.68 0.18 142)' }}
                >
                  {isRunning ? <Pause size={22} /> : <Play size={22} />}
                </button>
                <button
                  onClick={() => handleTimerEnd()}
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'oklch(0.68 0.18 142)', color: 'oklch(0.10 0.005 285)' }}
                >
                  <SkipForward size={22} />
                </button>
              </div>
            </>
          ) : null}

          {/* Motivational Quote - shown during rest */}
          {phase === 'rest' && (
            <div className="animate-cx-slide-up p-4 rounded mt-6" style={{ background: 'oklch(0.68 0.18 142 / 8%)', border: '1px solid oklch(0.68 0.18 142 / 30%)' }}>
              <div className="flex items-start gap-2">
                <span style={{ color: 'oklch(0.68 0.18 142)', fontSize: '1.5rem', flexShrink: 0 }}>💪</span>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: 'oklch(0.85 0.008 80)', lineHeight: 1.8, fontStyle: 'italic' }}>
                  "{currentQuote}"
                </p>
              </div>
              <div className="mt-4 flex justify-center">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/break_2cd1ad76.png"
                  alt="Coach motivation"
                  style={{ width: '120px', height: 'auto', borderRadius: '8px' }}
                />
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8">
            <button
              className="flex items-center gap-2 mb-3"
              onClick={() => setShowTips(t => !t)}
              style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(0.68 0.18 142)' }}
            >
              <Info size={14} /> {showTips ? 'Hide' : 'Show'} Instructions & Tips
            </button>
            {showTips && (
              <div className="animate-cx-slide-up" style={{ background: 'oklch(0.17 0.006 285)', border: '1px solid oklch(1 0 0 / 10%)', borderRadius: '4px', padding: '12px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(0.68 0.18 142)', marginBottom: '8px' }}>
                    How to Perform
                  </p>
                  {currentEx?.instructions.map((inst, i) => (
                    <p key={i} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'oklch(0.80 0.008 80)', lineHeight: 1.6, marginBottom: '4px' }}>
                      {i + 1}. {inst}
                    </p>
                  ))}
                </div>
                <div>
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(0.68 0.18 142)', marginBottom: '8px' }}>
                    Pro Tips
                  </p>
                  {currentEx?.tips.map((tip, i) => (
                    <p key={i} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'oklch(0.80 0.008 80)', lineHeight: 1.6, marginBottom: '4px' }}>
                      • {tip}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}
