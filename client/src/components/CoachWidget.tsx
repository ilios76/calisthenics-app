// ============================================================
// CallistheniX – Coach Widget (FIXED v4 - Touch Support)
//
// The floating AI Coach button now:
// - Opens a UNIFIED modal with BOTH voice AND text modes
// - Is DRAGGABLE around the screen (mouse + touch)
// - Saves position to localStorage
// - Supports smooth touch drag on mobile devices
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import { CoachChatBot } from './CoachChatBot';
import { AICoacButton } from './AICoacButton';
import { VoiceCoachButton } from './VoiceCoachButton';
import { X, Mic, MessageSquare } from 'lucide-react';

interface CoachWidgetProps {
  isVisible?: boolean;
}

const STORAGE_KEY = 'coachWidgetPosition';

interface Position {
  x: number;
  y: number;
}

export const CoachWidget: React.FC<CoachWidgetProps> = ({
  isVisible = true,
}) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  // Load position from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPosition(JSON.parse(saved));
      } catch {
        // Default position if parsing fails
        setPosition({ x: window.innerWidth - 104, y: window.innerHeight - 104 });
      }
    } else {
      // Default: bottom-right corner (80px button + 24px margin)
      setPosition({ x: window.innerWidth - 104, y: window.innerHeight - 104 });
    }
  }, []);

  // Handle mouse down on button
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent context menu
    e.preventDefault();
    
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  // Handle touch start on button
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Prevent default touch behavior (context menu, etc)
    e.preventDefault();
    
    if (buttonRef.current && e.touches.length > 0) {
      const rect = buttonRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  // Handle mouse/touch move
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Constrain to viewport
      const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - 80));
      const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - 80));

      setPosition({ x: constrainedX, y: constrainedY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const newX = touch.clientX - dragOffset.x;
        const newY = touch.clientY - dragOffset.y;

        // Constrain to viewport
        const constrainedX = Math.max(0, Math.min(newX, window.innerWidth - 80));
        const constrainedY = Math.max(0, Math.min(newY, window.innerHeight - 80));

        setPosition({ x: constrainedX, y: constrainedY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Save position to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      // Save position to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset, position]);

  if (!isVisible) return null;

  return (
    <>
      {/* ── Draggable Floating Button (Mouse + Touch) ───────────────────────────────── */}
      <div
        ref={buttonRef}
        className="fixed z-40 flex items-center justify-center"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          touchAction: 'none',
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onContextMenu={(e) => e.preventDefault()}
      >
        <AICoacButton onClick={() => setOpen(o => !o)} isActive={open} />
      </div>

      {/* ── Unified Modal ─────────────────────────────────── */}
      {open && (
        <div
          className="fixed z-50 flex flex-col"
          style={{
            left: `${Math.max(12, Math.min(position.x - 140, window.innerWidth - 372))}px`,
            top: `${Math.max(12, position.y - 400)}px`,
            width: '360px',
            maxHeight: '70vh',
            background: 'oklch(0.14 0.006 285)',
            border: '1px solid oklch(1 0 0 / 12%)',
            borderRadius: '12px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid oklch(1 0 0 / 10%)' }}
          >
            <div className="flex items-center gap-2">
              <span style={{ color: 'oklch(0.68 0.18 142)', fontWeight: 700, fontFamily: 'Barlow Condensed, sans-serif', fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                CALIX COACH
              </span>
            </div>

            {/* Mode Toggle */}
            <div className="flex items-center gap-1 rounded-md p-1" style={{ background: 'oklch(0.10 0.005 285)' }}>
              <button
                onClick={() => setMode('voice')}
                className="flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold transition-all"
                style={{
                  background: mode === 'voice' ? 'oklch(0.68 0.18 142)' : 'transparent',
                  color: mode === 'voice' ? 'oklch(0.10 0.005 285)' : 'oklch(0.60 0.008 80)',
                }}
              >
                <Mic size={12} /> Voice
              </button>
              <button
                onClick={() => setMode('text')}
                className="flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold transition-all"
                style={{
                  background: mode === 'text' ? 'oklch(0.68 0.18 142)' : 'transparent',
                  color: mode === 'text' ? 'oklch(0.10 0.005 285)' : 'oklch(0.60 0.008 80)',
                }}
              >
                <MessageSquare size={12} /> Text
              </button>
            </div>

            <button onClick={() => setOpen(false)} style={{ color: 'oklch(0.50 0.008 80)' }} className="hover:text-white transition">
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            {mode === 'voice' ? (
              /* ── VOICE MODE ── */
              <div className="flex flex-col items-center justify-center gap-6 py-10 px-6">
                <p style={{ color: 'oklch(0.60 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.88rem', textAlign: 'center' }}>
                  Press the mic and ask CALIX anything about training, form, or recovery.
                </p>
                {/* VoiceCoachButton renders its own floating button — we render it inline here */}
                <VoiceCoachInline />
                <p style={{ color: 'oklch(0.45 0.008 80)', fontSize: '0.75rem', textAlign: 'center' }}>
                  Supports Greek 🇬🇷 and English 🇬🇧 — detected automatically
                </p>
              </div>
            ) : (
              /* ── TEXT MODE ── */
              <CoachChatBot open={true} onOpenChange={() => {}} embedded={true} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

// ── Inline Voice Component (extracted from VoiceCoachButton) ──
// Renders the mic button inline inside our modal instead of floating
import { useState as useVState, useEffect as useVEffect } from 'react';
import { voiceService } from '@/services/voiceService';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { MicOff, Volume2, Loader2 } from 'lucide-react';

function VoiceCoachInline() {
  const [isListening, setIsListening] = useVState(false);
  const [isSpeaking, setIsSpeaking] = useVState(false);
  const [transcript, setTranscript] = useVState('');
  const [response, setResponse] = useVState('');
  const chatMutation = trpc.coach.chat.useMutation();

  useVEffect(() => {
    voiceService.updateConfig({
      onTranscript: (text) => {
        setTranscript(text);
        handleVoiceQuery(text);
      },
      onError: (error) => {
        toast.error(`Voice error: ${error}`);
        setIsListening(false);
      },
      onListening: (listening) => setIsListening(listening),
    });
  }, []);

  const handleVoiceQuery = async (query: string) => {
    if (!query.trim()) return;
    setIsListening(false);
    setIsSpeaking(true);
    try {
      const res = await chatMutation.mutateAsync({ messages: [{ role: 'user', content: query }] });
      if (res.success) {
        setResponse(res.message);
        voiceService.speak(res.message);
      }
    } catch (e) {
      toast.error('Voice query failed. Try again.');
    } finally {
      setIsSpeaking(false);
    }
  };

  const toggle = () => {
    if (!voiceService.isRecognitionSupported()) {
      toast.error('Voice not supported in this browser. Use Chrome.');
      return;
    }
    if (isListening) {
      voiceService.stopListening();
    } else {
      setTranscript('');
      setResponse('');
      voiceService.startListening('el');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Big mic button */}
      <button
        onClick={toggle}
        disabled={isSpeaking || chatMutation.isPending}
        className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
        style={{
          background: isListening ? '#dc2626' : 'oklch(0.68 0.18 142)',
          border: 'none',
          cursor: isSpeaking ? 'not-allowed' : 'pointer',
          opacity: isSpeaking ? 0.5 : 1,
        }}
      >
        {isListening ? (
          <Loader2 size={32} color="white" className="animate-spin" />
        ) : isSpeaking ? (
          <Volume2 size={32} color="white" className="animate-pulse" />
        ) : (
          <Mic size={32} color="#0a0a0a" />
        )}
      </button>

      <p style={{ color: 'oklch(0.60 0.008 80)', fontSize: '0.8rem' }}>
        {isListening ? '🔴 Listening...' : isSpeaking ? '🔊 Speaking...' : 'Tap to speak'}
      </p>

      {/* Transcript */}
      {transcript && (
        <div className="w-full rounded-lg px-4 py-2" style={{ background: 'oklch(0.10 0.005 285)', border: '1px solid oklch(1 0 0 / 10%)' }}>
          <p style={{ color: 'oklch(0.50 0.008 80)', fontSize: '0.7rem', marginBottom: 4 }}>You said:</p>
          <p style={{ color: 'oklch(0.85 0.008 80)', fontSize: '0.85rem' }}>"{transcript}"</p>
        </div>
      )}

      {/* Response preview */}
      {response && !isSpeaking && (
        <div className="w-full rounded-lg px-4 py-2" style={{ background: 'oklch(0.68 0.18 142 / 10%)', border: '1px solid oklch(0.68 0.18 142 / 30%)' }}>
          <p style={{ color: 'oklch(0.68 0.18 142)', fontSize: '0.7rem', marginBottom: 4 }}>CALIX:</p>
          <p style={{ color: 'oklch(0.85 0.008 80)', fontSize: '0.82rem', lineHeight: 1.5 }}>
            {response.substring(0, 200)}{response.length > 200 ? '…' : ''}
          </p>
        </div>
      )}

      {/* Stop speaking */}
      {isSpeaking && (
        <button
          onClick={() => { voiceService.stopSpeaking(); setIsSpeaking(false); }}
          className="text-xs px-4 py-2 rounded"
          style={{ background: 'oklch(0.20 0.008 285)', color: 'oklch(0.70 0.008 80)', border: '1px solid oklch(1 0 0 / 15%)' }}
        >
          ⏹ Stop Speaking
        </button>
      )}
    </div>
  );
}
