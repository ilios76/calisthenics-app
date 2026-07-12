import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';

interface WorkoutNoteModalProps {
  isOpen: boolean;
  date: string;
  initialNote?: string;
  onSave: (note: string) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function WorkoutNoteModal({
  isOpen,
  date,
  initialNote = '',
  onSave,
  onDelete,
  onClose,
}: WorkoutNoteModalProps) {
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (note.trim()) {
      onSave(note);
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  // Format date for display
  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('el-GR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-lg p-6 w-full max-w-md"
        style={{ background: 'oklch(0.15 0.006 285)', border: '1px solid oklch(1 0 0 / 8%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '1.25rem',
              color: 'oklch(0.68 0.18 142)',
              fontWeight: 700,
              margin: 0,
            }}
          >
            Σημείωση Ημερομηνίας
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            style={{ color: 'oklch(0.60 0.008 80)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Date */}
        <p
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.9rem',
            color: 'oklch(0.60 0.008 80)',
            margin: '0 0 16px 0',
          }}
        >
          {formattedDate}
        </p>

        {/* Text area */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Προσθέστε μια σημείωση ή υπενθύμιση..."
          className="w-full p-3 rounded mb-4 resize-none focus:outline-none"
          rows={4}
          style={{
            background: 'oklch(0.12 0.005 285)',
            color: 'oklch(0.90 0.008 80)',
            border: '1px solid oklch(1 0 0 / 8%)',
            fontFamily: 'DM Sans, sans-serif',
          }}
        />

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded font-semibold transition-all"
            style={{
              background: 'oklch(0.68 0.18 142)',
              color: 'oklch(0.10 0.005 285)',
            }}
          >
            <Save size={16} />
            Αποθήκευση
          </button>
          {initialNote && (
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded font-semibold transition-all hover:bg-red-500/20"
              style={{
                background: 'transparent',
                color: 'oklch(0.90 0.008 80)',
                border: '1px solid oklch(1 0 0 / 20%)',
              }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
