// ============================================================
// WorkoutCalendar Component
// Interactive calendar showing current month with workout plan
// Users can select/change workout days
// ============================================================

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Dumbbell } from 'lucide-react';

interface WorkoutDay {
  date: number;
  hasWorkout: boolean;
}

interface WorkoutCalendarProps {
  sessionsPerWeek: number;
  onDaysChange?: (workoutDays: number[]) => void;
}

export function WorkoutCalendar({ sessionsPerWeek, onDaysChange }: WorkoutCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [workoutDays, setWorkoutDays] = useState<Set<number>>(new Set());

  // Load saved workout days from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('workoutDays');
    if (saved) {
      setWorkoutDays(new Set(JSON.parse(saved)));
    } else {
      // Default: Mon, Wed, Fri, Sat for 4 sessions/week
      const defaultDays = new Set<number>();
      if (sessionsPerWeek >= 1) defaultDays.add(1); // Monday
      if (sessionsPerWeek >= 2) defaultDays.add(3); // Wednesday
      if (sessionsPerWeek >= 3) defaultDays.add(5); // Friday
      if (sessionsPerWeek >= 4) defaultDays.add(6); // Saturday
      if (sessionsPerWeek >= 5) defaultDays.add(2); // Tuesday
      setWorkoutDays(defaultDays);
    }
  }, [sessionsPerWeek]);

  // Save workout days to localStorage
  useEffect(() => {
    localStorage.setItem('workoutDays', JSON.stringify(Array.from(workoutDays)));
    if (onDaysChange) {
      onDaysChange(Array.from(workoutDays));
    }
  }, [workoutDays, onDaysChange]);

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

  const toggleWorkoutDay = (dayOfWeek: number) => {
    const newDays = new Set(workoutDays);
    if (newDays.has(dayOfWeek)) {
      newDays.delete(dayOfWeek);
    } else {
      if (newDays.size < sessionsPerWeek) {
        newDays.add(dayOfWeek);
      }
    }
    setWorkoutDays(newDays);
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

          const dayOfWeek = (firstDay + day - 1) % 7;
          const hasWorkout = workoutDays.has(dayOfWeek);
          const isToday = isCurrentMonth && day === today.getDate();

          return (
            <button
              key={day}
              onClick={() => toggleWorkoutDay(dayOfWeek)}
              className="aspect-square rounded flex items-center justify-center text-sm font-bold transition-all relative"
              style={{
                background: hasWorkout ? 'oklch(0.68 0.18 142)' : isToday ? 'oklch(0.68 0.18 142 / 20%)' : 'oklch(0.12 0.005 285)',
                color: hasWorkout ? 'oklch(0.10 0.005 285)' : 'oklch(0.90 0.008 80)',
                border: isToday ? '2px solid oklch(0.68 0.18 142)' : '1px solid oklch(1 0 0 / 8%)',
                cursor: 'pointer',
                fontFamily: 'Bebas Neue, cursive',
                fontSize: '1rem',
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
            </button>
          );
        })}
      </div>

      {/* Info text */}
      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid oklch(1 0 0 / 8%)' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'oklch(0.60 0.008 80)', margin: 0 }}>
          ✓ Click dates to select workout days • {workoutDays.size}/{sessionsPerWeek} selected
        </p>
      </div>
    </div>
  );
}
