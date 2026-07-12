// ============================================================
// WorkoutCalendar Component
// Interactive calendar showing current month with workout plan
// Users can select/change individual workout dates with notes
// ============================================================

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Dumbbell, MessageSquare } from 'lucide-react';
import { WorkoutNoteModal } from './WorkoutNoteModal';
import { SimpleNotificationService } from '../services/simpleNotifications';

interface WorkoutCalendarProps {
  sessionsPerWeek: number;
  onDaysChange?: (workoutDates: string[]) => void;
}

interface WorkoutNote {
  date: string;
  note: string;
}

export function WorkoutCalendar({ sessionsPerWeek, onDaysChange }: WorkoutCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutDates, setWorkoutDates] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Map<string, string>>(new Map());
  const [selectedDateForNote, setSelectedDateForNote] = useState<string | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  // Load saved workout dates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('workoutDates');
    if (saved) {
      setWorkoutDates(new Set(JSON.parse(saved)));
    }
    
    const savedNotes = localStorage.getItem('workoutNotes');
    if (savedNotes) {
      const notesArray = JSON.parse(savedNotes) as WorkoutNote[];
      const notesMap = new Map(notesArray.map(n => [n.date, n.note]));
      setNotes(notesMap);
    }
  }, []);

  // Save workout dates to localStorage
  useEffect(() => {
    localStorage.setItem('workoutDates', JSON.stringify(Array.from(workoutDates)));
    if (onDaysChange) {
      onDaysChange(Array.from(workoutDates));
    }
  }, [workoutDates, onDaysChange]);

  // Save notes to localStorage
  useEffect(() => {
    const notesArray = Array.from(notes.entries()).map(([date, note]) => ({ date, note }));
    localStorage.setItem('workoutNotes', JSON.stringify(notesArray));
  }, [notes]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

  // Create unique date key (YYYY-MM-DD format)
  const getDateKey = (day: number) => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const toggleWorkoutDate = (day: number) => {
    const dateKey = getDateKey(day);
    const newDates = new Set(workoutDates);
    
    if (newDates.has(dateKey)) {
      newDates.delete(dateKey);
      const stored = localStorage.getItem('scheduledNotifications');
      if (stored) {
        const scheduled = JSON.parse(stored);
        delete scheduled[dateKey];
        localStorage.setItem('scheduledNotifications', JSON.stringify(scheduled));
      }
    } else {
      if (newDates.size < sessionsPerWeek) {
        newDates.add(dateKey);
        const [year, month, dayStr] = dateKey.split('-');
        const notificationTime = new Date(`${year}-${month}-${dayStr}T08:00:00`);
        const stored = localStorage.getItem('scheduledNotifications') || '{}';
        const scheduled = JSON.parse(stored);
        scheduled[dateKey] = notificationTime.toISOString();
        localStorage.setItem('scheduledNotifications', JSON.stringify(scheduled));
        SimpleNotificationService.scheduleNotification(
          {
            title: '💪 Workout Time!',
            body: 'Time for your workout today!',
            tag: `workout-${dateKey}`,
            data: { date: dateKey },
          },
          notificationTime
        );
      } else {
        return;
      }
    }
    setWorkoutDates(newDates);
  };

  const handleDateClick = (day: number, e: React.MouseEvent) => {
    const dateKey = getDateKey(day);
    
    // Double-click to add note
    if ((e as any).detail === 2) {
      e.preventDefault();
      setSelectedDateForNote(dateKey);
      setIsNoteModalOpen(true);
    } else {
      // Regular click to toggle workout
      toggleWorkoutDate(day);
    }
  };

  const handleSaveNote = (note: string) => {
    if (selectedDateForNote) {
      const newNotes = new Map(notes);
      newNotes.set(selectedDateForNote, note);
      setNotes(newNotes);
    }
  };

  const handleDeleteNote = () => {
    if (selectedDateForNote) {
      const newNotes = new Map(notes);
      newNotes.delete(selectedDateForNote);
      setNotes(newNotes);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Create calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <>
      <div className="cx-card p-6" style={{ background: 'oklch(0.15 0.006 285)', border: '1px solid oklch(1 0 0 / 8%)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.75rem', color: 'oklch(0.68 0.18 142)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, margin: 0 }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </p>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem', color: 'oklch(0.60 0.008 80)', margin: '4px 0 0 0' }}>
              Select {sessionsPerWeek} workout days per week
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-white/10 rounded transition-colors"
              style={{ color: 'oklch(0.68 0.18 142)' }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-white/10 rounded transition-colors"
              style={{ color: 'oklch(0.68 0.18 142)' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {dayNames.map(day => (
            <div
              key={day}
              className="text-center"
              style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '0.7rem', color: 'oklch(0.55 0.008 80)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} />;
            }

            const dateKey = getDateKey(day);
            const hasWorkout = workoutDates.has(dateKey);
            const hasNote = notes.has(dateKey);
            const isToday = isCurrentMonth && day === today.getDate();
            const canSelect = workoutDates.size < sessionsPerWeek || hasWorkout;

            return (
              <button
                key={day}
                onClick={(e) => handleDateClick(day, e)}
                disabled={!canSelect && !hasWorkout}
                className="aspect-square rounded flex items-center justify-center text-sm font-bold transition-all relative"
                style={{
                  background: hasWorkout ? 'oklch(0.68 0.18 142)' : isToday ? 'oklch(0.68 0.18 142 / 20%)' : 'oklch(0.12 0.005 285)',
                  color: hasWorkout ? 'oklch(0.10 0.005 285)' : 'oklch(0.90 0.008 80)',
                  border: isToday ? '2px solid oklch(0.68 0.18 142)' : '1px solid oklch(1 0 0 / 8%)',
                  cursor: (canSelect || hasWorkout) ? 'pointer' : 'not-allowed',
                  fontFamily: 'Bebas Neue, cursive',
                  fontSize: '1rem',
                  opacity: (canSelect || hasWorkout) ? 1 : 0.5,
                }}
              >
                <span>{day}</span>
                {hasWorkout && (
                  <div
                    className="absolute top-0.5 right-0.5"
                    style={{ color: 'oklch(0.10 0.005 285)' }}
                  >
                    <Dumbbell size={12} />
                  </div>
                )}
                {hasNote && (
                  <div
                    className="absolute bottom-0.5 right-0.5"
                    style={{ color: 'oklch(0.68 0.18 142)' }}
                  >
                    <MessageSquare size={10} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Info text */}
        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid oklch(1 0 0 / 8%)' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'oklch(0.60 0.008 80)', margin: 0 }}>
            ✓ Click dates to select workouts • Double-click to add notes • {workoutDates.size}/{sessionsPerWeek} selected
          </p>
        </div>
      </div>

      <WorkoutNoteModal
        isOpen={isNoteModalOpen}
        date={selectedDateForNote || ''}
        initialNote={selectedDateForNote ? notes.get(selectedDateForNote) || '' : ''}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
        onClose={() => {
          setIsNoteModalOpen(false);
          setSelectedDateForNote(null);
        }}
      />
    </>
  );
}
