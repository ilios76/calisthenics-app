// ============================================================
// CallistheniX – Programs Page
// Browse and select workout programs
// ============================================================
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { programs, getRecommendedPrograms, getExercisesByIds, type WorkoutProgram } from '@/lib/data';
import { Play, Clock, Calendar, ChevronRight, Dumbbell, X } from 'lucide-react';

export default function ProgramsPage() {
  const { profile, setSelectedProgram, setCurrentView } = useUser();
  const [selected, setSelected] = useState<WorkoutProgram | null>(null);
  const [filter, setFilter] = useState<'all' | 'recommended'>('recommended');

  const recommended = profile
    ? getRecommendedPrograms(profile.sex, profile.age, profile.weight, profile.goal)
    : [];
  const displayPrograms = filter === 'recommended' ? recommended : programs;

  const startProgram = (p: WorkoutProgram) => {
    setSelectedProgram(p);
    setCurrentView('trainer');
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.10 0.005 285)' }}>
      <div className="container py-10">
        {/* Header */}
        <div className="mb-8">
          <span className="cx-label mb-2 block">Training Library</span>
          <h1 className="cx-section-title text-5xl mb-3" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
            PROGRAMS
          </h1>
          <p style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}>
            Choose a program that matches your goal and fitness level.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8">
          {(['recommended', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-5 py-2 rounded transition-all"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: filter === f ? 'oklch(0.68 0.18 142)' : 'oklch(0.17 0.006 285)',
                color: filter === f ? 'oklch(0.10 0.005 285)' : 'oklch(0.65 0.008 80)',
                border: '1px solid ' + (filter === f ? 'oklch(0.68 0.18 142)' : 'oklch(1 0 0 / 10%)'),
              }}
            >
              {f === 'recommended' ? `For You (${recommended.length})` : `All Programs (${programs.length})`}
            </button>
          ))}
        </div>

        {/* Programs grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayPrograms.map(p => (
            <div
              key={p.id}
              className="cx-card cursor-pointer"
              onClick={() => setSelected(p)}
              style={{ borderRadius: '4px', overflow: 'hidden' }}
            >
              {/* Color accent top bar */}
              <div style={{ height: '3px', background: 'oklch(0.68 0.18 142)' }} />
              <div className="p-5">
                <div className="flex gap-2 mb-3 flex-wrap">
                  {p.tags.slice(0, 2).map(t => <span key={t} className="cx-tag">{t}</span>)}
                </div>
                <h3 className="cx-section-title text-2xl mb-2" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
                  {p.name.toUpperCase()}
                </h3>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.82rem', color: 'oklch(0.60 0.008 80)', lineHeight: 1.6, marginBottom: '16px' }}>
                  {p.description}
                </p>

                <div className="grid grid-cols-3 gap-3 pt-4" style={{ borderTop: '1px solid oklch(1 0 0 / 8%)' }}>
                  {[
                    { icon: <Calendar size={12} />, val: `${p.durationWeeks}w` },
                    { icon: <Clock size={12} />, val: `${p.sessionsPerWeek}x/wk` },
                    { icon: <Dumbbell size={12} />, val: p.difficulty },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span style={{ color: 'oklch(0.68 0.18 142)' }}>{s.icon}</span>
                      <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'oklch(0.65 0.008 80)' }}>
                        {s.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayPrograms.length === 0 && (
          <div className="text-center py-16">
            <p style={{ color: 'oklch(0.55 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}>
              No programs match your current profile. Try "All Programs".
            </p>
          </div>
        )}
      </div>

      {/* Program Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: 'oklch(0 0 0 / 80%)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded"
            style={{ background: 'oklch(0.13 0.005 285)', border: '1px solid oklch(1 0 0 / 10%)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ height: '3px', background: 'oklch(0.68 0.18 142)' }} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {selected.tags.map(t => <span key={t} className="cx-tag">{t}</span>)}
                  </div>
                  <h2 className="cx-section-title text-4xl" style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}>
                    {selected.name.toUpperCase()}
                  </h2>
                </div>
                <button onClick={() => setSelected(null)} style={{ color: 'oklch(0.55 0.008 80)' }}>
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', color: 'oklch(0.65 0.008 80)', lineHeight: 1.7, marginBottom: '20px' }}>
                {selected.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 rounded" style={{ background: 'oklch(0.17 0.006 285)' }}>
                {[
                  { label: 'Duration', value: `${selected.durationWeeks} weeks` },
                  { label: 'Frequency', value: `${selected.sessionsPerWeek}x / week` },
                  { label: 'Per Session', value: `${selected.sessionDurationMin} min` },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.8rem', color: 'oklch(0.68 0.18 142)', lineHeight: 1 }}>{s.value}</p>
                    <p className="cx-label" style={{ fontSize: '0.65rem', marginTop: '4px' }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Workout days */}
              <h3 className="cx-label mb-3">Workout Schedule</h3>
              <div className="space-y-2 mb-6">
                {selected.days.map(day => {
                  const exs = getExercisesByIds(day.exercises);
                  return (
                    <div key={day.dayNumber} className="p-3 rounded" style={{ background: 'oklch(0.17 0.006 285)' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'oklch(0.90 0.008 80)' }}>
                          {day.name} — {day.focus}
                        </span>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.55 0.008 80)' }}>
                          {exs.length} exercises
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {exs.map(ex => (
                          <span key={ex.id} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'oklch(0.60 0.008 80)', background: 'oklch(0.20 0.006 285)', padding: '2px 8px', borderRadius: '2px' }}>
                            {ex.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                className="cx-btn-primary w-full flex items-center justify-center gap-2"
                onClick={() => startProgram(selected)}
              >
                <Play size={16} /> Start This Program
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
