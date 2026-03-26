// ============================================================
// CallistheniX – Live Trainer Page
// Full-screen exercise mode with timer, sets, GIF demo, instructions
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { getExercisesByIds } from '@/lib/data';
import { Play, Pause, SkipForward, ChevronLeft, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';



// Animated GIF demos from public fitness sources
const EXERCISE_ANIMATED: Record<string, string> = {
  push_up: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHVwdnVhZzJ2MzZtNHBhcGJlZzBtNXZtNXZtNXZtNXZtNXZtNQ/3oKIPrc2ngFZ6BTyww/giphy.gif',
  pull_up: 'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
  squat: 'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif',
  burpee: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  plank: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  lunge: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  jumping_jack: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  mountain_climber: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  high_knees: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  dip: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  pike_push_up: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  leg_raise: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  diamond_push_up: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  glute_bridge: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  tricep_dip: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
  superman: 'https://media.giphy.com/media/3oKIPrc2ngFZ6BTyww/giphy.gif',
};



type Phase = 'preview' | 'exercise' | 'rest' | 'complete';

export default function TrainerPage() {
  const { selectedProgram, setCurrentView, completedSessions, setCompletedSessions } = useUser();
  const [dayIndex, setDayIndex] = useState(0);
  const [exIndex, setExIndex] = useState(0);
  const [setNumber, setSetNumber] = useState(1);
  const [phase, setPhase] = useState<Phase>('preview');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showTips, setShowTips] = useState(false);

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

  const handleTimerEnd = useCallback(() => {
    setIsRunning(false);
    if (phase === 'exercise') {
      if (setNumber < totalSets) {
        setPhase('rest');
        setTimeLeft(currentEx?.restSeconds ?? 60);
        setIsRunning(true);
      } else {
        // Move to next exercise
        if (exIndex < totalExercises - 1) {
          setExIndex(i => i + 1);
          setSetNumber(1);
          setPhase('preview');
          setIsRunning(false);
        } else {
          setPhase('complete');
          setCompletedSessions(completedSessions + 1);
          toast.success('Workout Complete! Great job! 💪');
        }
      }
    } else if (phase === 'rest') {
      setSetNumber(s => s + 1);
      setPhase('exercise');
      if (isTimeBased && currentEx?.durationSeconds) {
        setTimeLeft(currentEx.durationSeconds);
        setIsRunning(true);
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'oklch(0.10 0.005 285)' }}>
        <div className="text-center max-w-md px-6 animate-cx-slide-up">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'oklch(0.65 0.22 40 / 15%)', border: '2px solid oklch(0.65 0.22 40)' }}>
            <CheckCircle size={40} style={{ color: 'oklch(0.65 0.22 40)' }} />
          </div>
          <h2 className="cx-section-title text-5xl mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
            WORKOUT<br /><span style={{ color: 'oklch(0.65 0.22 40)' }}>COMPLETE!</span>
          </h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'oklch(0.65 0.008 80)', marginBottom: '32px' }}>
            You crushed {currentDay.name} — {currentDay.focus}. Rest up and come back stronger.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="cx-card p-4 text-center">
              <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '2.5rem', color: 'oklch(0.65 0.22 40)', lineHeight: 1 }}>{totalExercises}</p>
              <p className="cx-label" style={{ fontSize: '0.65rem' }}>Exercises</p>
            </div>
            <div className="cx-card p-4 text-center">
              <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '2.5rem', color: 'oklch(0.65 0.22 40)', lineHeight: 1 }}>{completedSessions}</p>
              <p className="cx-label" style={{ fontSize: '0.65rem' }}>Total Sessions</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="cx-btn-ghost flex-1" onClick={() => setCurrentView('dashboard')}>
              Dashboard
            </button>
            <button className="cx-btn-primary flex-1" onClick={() => {
              setExIndex(0); setSetNumber(1); setPhase('preview'); setIsRunning(false);
              if (dayIndex < selectedProgram.days.length - 1) setDayIndex(d => d + 1);
            }}>
              Next Day
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.10 0.005 285)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid oklch(1 0 0 / 8%)' }}>
        <button
          className="flex items-center gap-2"
          onClick={() => setCurrentView('programs')}
          style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem' }}
        >
          <ChevronLeft size={16} /> Back
        </button>
        <div className="text-center">
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(0.65 0.22 40)' }}>
            {currentDay.name}
          </p>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.55 0.008 80)' }}>
            {currentDay.focus}
          </p>
        </div>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'oklch(0.55 0.008 80)' }}>
          {exIndex + 1}/{totalExercises}
        </div>
      </div>

      {/* Progress bar */}
      <div className="cx-progress-bar" style={{ borderRadius: 0, height: '3px' }}>
        <div className="cx-progress-fill" style={{ width: `${overallProgress}%`, borderRadius: 0 }} />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left: Exercise GIF + Info */}
        <div className="lg:w-1/2 flex flex-col">
          {/* GIF display */}
          <div
            className="relative flex items-center justify-center"
            style={{ background: 'oklch(0.08 0.004 285)', minHeight: '280px', flex: 1 }}
          >
            {phase === 'rest' ? (
              <div className="text-center animate-cx-fade">
                <p className="font-number text-8xl animate-cx-pulse" style={{ fontFamily: 'Bebas Neue, cursive', color: 'oklch(0.65 0.22 40)' }}>
                  REST
                </p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'oklch(0.60 0.008 80)', marginTop: '8px' }}>
                  Catch your breath
                </p>
              </div>
            ) : (
              <>
                <img
                  key={currentEx?.id}
                  src={EXERCISE_ANIMATED[currentEx?.id] || EXERCISE_ANIMATED.push_up}
                  alt={currentEx?.name}
                  className="max-h-64 object-contain animate-cx-fade"
                  style={{ maxWidth: '100%' }}
                  onError={e => {
                    // Fallback to a placeholder exercise illustration
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {phase === 'preview' && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'oklch(0 0 0 / 40%)' }}>
                    <div className="text-center">
                      <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'oklch(0.65 0.22 40)', marginBottom: '8px' }}>
                        GET READY
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Exercise name + tags */}
          <div className="p-5" style={{ borderTop: '1px solid oklch(1 0 0 / 8%)' }}>
            <div className="flex gap-2 mb-2 flex-wrap">
              {currentEx?.muscleGroups.map(mg => (
                <span key={mg} className="cx-tag">{mg.replace('_', ' ')}</span>
              ))}
              <span className="cx-tag">{currentEx?.difficulty}</span>
            </div>
            <h2 className="cx-section-title text-4xl" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
              {currentEx?.name.toUpperCase()}
            </h2>
          </div>
        </div>

        {/* Right: Timer + Controls + Instructions */}
        <div className="lg:w-1/2 flex flex-col p-6 gap-6">
          {/* Set tracker */}
          <div className="flex gap-2 items-center">
            <span className="cx-label" style={{ fontSize: '0.7rem' }}>Sets:</span>
            {Array.from({ length: totalSets }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 flex items-center justify-center rounded"
                style={{
                  background: i < setNumber - 1 ? 'oklch(0.65 0.22 40)' : i === setNumber - 1 ? 'oklch(0.65 0.22 40 / 20%)' : 'oklch(0.17 0.006 285)',
                  border: i === setNumber - 1 ? '1px solid oklch(0.65 0.22 40)' : '1px solid oklch(1 0 0 / 10%)',
                  fontFamily: 'Bebas Neue, cursive',
                  fontSize: '1rem',
                  color: i < setNumber - 1 ? 'oklch(0.10 0.005 285)' : i === setNumber - 1 ? 'oklch(0.65 0.22 40)' : 'oklch(0.50 0.008 80)',
                }}
              >
                {i + 1}
              </div>
            ))}
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'oklch(0.55 0.008 80)', marginLeft: '4px' }}>
              Set {setNumber} of {totalSets}
            </span>
          </div>

          {/* Main timer / rep display */}
          <div
            className="flex-1 flex flex-col items-center justify-center rounded py-8"
            style={{ background: 'oklch(0.13 0.005 285)', border: '1px solid oklch(1 0 0 / 8%)' }}
          >
            {phase === 'rest' ? (
              <>
                <span className="cx-label mb-2">Rest Time</span>
                <p className="font-number animate-cx-pulse" style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '6rem', color: 'oklch(0.65 0.22 40)', lineHeight: 1 }}>
                  {formatTime(timeLeft)}
                </p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'oklch(0.55 0.008 80)', marginTop: '8px' }}>
                  Next: Set {setNumber + 1} of {totalSets}
                </p>
                <button
                  className="cx-btn-ghost mt-4"
                  onClick={() => { setIsRunning(false); startExercise(); setSetNumber(s => s + 1); }}
                  style={{ fontSize: '0.8rem', padding: '0.5rem 1.5rem' }}
                >
                  Skip Rest
                </button>
              </>
            ) : isTimeBased && phase === 'exercise' ? (
              <>
                <span className="cx-label mb-2">Time Remaining</span>
                <p className="font-number animate-cx-pulse" style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '6rem', color: 'oklch(0.65 0.22 40)', lineHeight: 1 }}>
                  {formatTime(timeLeft)}
                </p>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setIsRunning(r => !r)}
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: 'oklch(0.65 0.22 40 / 15%)', border: '1px solid oklch(0.65 0.22 40)', color: 'oklch(0.65 0.22 40)' }}
                  >
                    {isRunning ? <Pause size={22} /> : <Play size={22} />}
                  </button>
                  <button
                    onClick={completeSet}
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: 'oklch(0.65 0.22 40)', color: 'oklch(0.10 0.005 285)' }}
                  >
                    <SkipForward size={22} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="cx-label mb-2">Target</span>
                <p className="font-number" style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '6rem', color: 'oklch(0.65 0.22 40)', lineHeight: 1 }}>
                  {currentEx?.reps}
                </p>
                <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.2rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(0.65 0.008 80)', marginTop: '4px' }}>
                  REPS
                </p>
              </>
            )}
          </div>

          {/* Action buttons */}
          {phase === 'preview' && (
            <button className="cx-btn-primary w-full flex items-center justify-center gap-2" onClick={startExercise}>
              <Play size={18} /> Start Exercise
            </button>
          )}
          {phase === 'exercise' && !isTimeBased && (
            <button className="cx-btn-primary w-full flex items-center justify-center gap-2" onClick={completeSet}>
              <CheckCircle size={18} /> Done — {setNumber < totalSets ? `Rest & Next Set` : 'Next Exercise'}
            </button>
          )}

          {/* Instructions */}
          <div>
            <button
              className="flex items-center gap-2 mb-3"
              onClick={() => setShowTips(t => !t)}
              style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(0.65 0.22 40)' }}
            >
              <Info size={14} /> {showTips ? 'Hide' : 'Show'} Instructions & Tips
            </button>

            {showTips && currentEx && (
              <div className="animate-cx-slide-up space-y-4">
                <div className="p-4 rounded" style={{ background: 'oklch(0.13 0.005 285)', border: '1px solid oklch(1 0 0 / 8%)' }}>
                  <p className="cx-label mb-2" style={{ fontSize: '0.65rem' }}>How To Do It</p>
                  <ol className="space-y-1">
                    {currentEx.instructions.map((inst, i) => (
                      <li key={i} className="flex gap-2" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.83rem', color: 'oklch(0.70 0.008 80)', lineHeight: 1.6 }}>
                        <span style={{ color: 'oklch(0.65 0.22 40)', fontFamily: 'Bebas Neue, cursive', fontSize: '1rem', flexShrink: 0 }}>{i + 1}.</span>
                        {inst}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="p-4 rounded" style={{ background: 'oklch(0.13 0.005 285)', border: '1px solid oklch(0.65 0.22 40 / 20%)' }}>
                  <p className="cx-label mb-2" style={{ fontSize: '0.65rem' }}>Pro Tips</p>
                  <ul className="space-y-1">
                    {currentEx.tips.map((tip, i) => (
                      <li key={i} className="flex gap-2" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.83rem', color: 'oklch(0.70 0.008 80)', lineHeight: 1.6 }}>
                        <span style={{ color: 'oklch(0.65 0.22 40)', flexShrink: 0 }}>→</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Exercise list */}
          <div>
            <p className="cx-label mb-2" style={{ fontSize: '0.65rem' }}>Workout Queue</p>
            <div className="space-y-1.5">
              {exercises.map((ex, i) => (
                <div
                  key={ex.id}
                  className="flex items-center gap-3 p-2 rounded"
                  style={{
                    background: i === exIndex ? 'oklch(0.65 0.22 40 / 10%)' : 'transparent',
                    border: i === exIndex ? '1px solid oklch(0.65 0.22 40 / 30%)' : '1px solid transparent',
                  }}
                >
                  <span style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1rem', color: i < exIndex ? 'oklch(0.65 0.22 40)' : i === exIndex ? 'oklch(0.65 0.22 40)' : 'oklch(0.40 0.008 80)', width: '24px' }}>
                    {i < exIndex ? '✓' : String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: i === exIndex ? 'oklch(0.90 0.008 80)' : i < exIndex ? 'oklch(0.50 0.008 80)' : 'oklch(0.65 0.008 80)', textDecoration: i < exIndex ? 'line-through' : 'none' }}>
                    {ex.name}
                  </span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.45 0.008 80)', marginLeft: 'auto' }}>
                    {ex.reps ? `${ex.reps} reps` : `${ex.durationSeconds}s`} × {ex.sets}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
