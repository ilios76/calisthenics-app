// ============================================================
// CallistheniX – Coach Widget (FIXED v3)
// Unified modal with Voice + Text tabs
// Fixed: duplicate react imports that caused circular dep error
// ============================================================
import React, { useState, useEffect, useCallback } from 'react';
import { CoachChatBot } from './CoachChatBot';
import { AICoacButton } from './AICoacButton';
import { X, Mic, MessageSquare, Volume2, Loader2 } from 'lucide-react';
import { voiceService } from '@/services/voiceService';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

// ── Types ─────────────────────────────────────────────────────

interface CoachWidgetProps {
  isVisible?: boolean;
  position?: 'bottom-right' | 'bottom-left';
}

// ── Main Widget ───────────────────────────────────────────────

export const CoachWidget: React.FC<CoachWidgetProps> = ({
  isVisible = true,
  position = 'bottom-right',
}) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'voice' | 'text'>('voice');

  if (!isVisible) return null;

  const side = position === 'bottom-right' ? { right: '24px' } : { left: '24px' };

  return (
    <>
      {/* ── Floating Button ── */}
      <div className="fixed z-40 flex items-center justify-center" style={{ ...side, bottom: '24px' }}>
        <AICoacButton onClick={() => setOpen(o => !o)} isActive={open} />
      </div>

      {/* ── Unified Modal ── */}
      {open && (
        <div
          className="fixed z-50 flex flex-col"
          style={{
            ...side,
            bottom: '160px',
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
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ borderBottom: '1px solid oklch(1 0 0 / 10%)' }}
          >
            <span style={{
              color: 'oklch(0.68 0.18 142)',
              fontWeight: 700,
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: '1.1rem',
              letterSpacing: '0.05em',
            }}>
              CALIX COACH
            </span>

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

            <button
              onClick={() => setOpen(false)}
              style={{ color: 'oklch(0.50 0.008 80)' }}
              className="hover:text-white transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            {mode === 'voice' ? (
              <VoiceCoachInline />
            ) : (
              <CoachChatBot open={true} onOpenChange={() => {}} embedded={true} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

// ── Inline Voice Component ────────────────────────────────────
// All hooks use the single react import at the top of the file

function VoiceCoachInline() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const chatMutation = trpc.coach.chat.useMutation();

  useEffect(() => {
    voiceService.updateConfig({
      onTranscript: (text: string) => {
        setTranscript(text);
        handleVoiceQuery(text);
      },
      onError: (error: string) => {
        toast.error(`Voice error: ${error}`);
        setIsListening(false);
      },
      onListening: (listening: boolean) => setIsListening(listening),
    });
  }, []);

  const handleVoiceQuery = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsListening(false);
    setIsSpeaking(true);
    try {
      const res = await chatMutation.mutateAsync({
        messages: [{ role: 'user', content: query }],
      });
      if (res.success) {
        setResponse(res.message);
        voiceService.speak(res.message);
      }
    } catch {
      toast.error('Voice query failed. Try again.');
    } finally {
      setIsSpeaking(false);
    }
  }, [chatMutation]);

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

  const stopSpeaking = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 py-10 px-6 w-full">
      <p style={{
        color: 'oklch(0.60 0.008 80)',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '0.88rem',
        textAlign: 'center',
      }}>
        Press the mic and ask CALIX anything about training, form, or recovery.
      </p>

      {/* Mic Button */}
      <button
        onClick={toggle}
        disabled={isSpeaking || chatMutation.isPending}
        className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
        style={{
          background: isListening ? '#dc2626' : 'oklch(0.68 0.18 142)',
          border: 'none',
          cursor: (isSpeaking || chatMutation.isPending) ? 'not-allowed' : 'pointer',
          opacity: (isSpeaking || chatMutation.isPending) ? 0.5 : 1,
        }}
      >
        {(isListening || chatMutation.isPending) ? (
          <Loader2 size={32} color="white" className="animate-spin" />
        ) : isSpeaking ? (
          <Volume2 size={32} color="white" className="animate-pulse" />
        ) : (
          <Mic size={32} color="#0a0a0a" />
        )}
      </button>

      <p style={{ color: 'oklch(0.60 0.008 80)', fontSize: '0.8rem' }}>
        {isListening
          ? '🔴 Listening…'
          : isSpeaking
          ? '🔊 Speaking…'
          : 'Tap to speak'}
      </p>

      {/* Transcript */}
      {transcript ? (
        <div className="w-full rounded-lg px-4 py-2" style={{
          background: 'oklch(0.10 0.005 285)',
          border: '1px solid oklch(1 0 0 / 10%)',
        }}>
          <p style={{ color: 'oklch(0.50 0.008 80)', fontSize: '0.7rem', marginBottom: 4 }}>You said:</p>
          <p style={{ color: 'oklch(0.85 0.008 80)', fontSize: '0.85rem' }}>"{transcript}"</p>
        </div>
      ) : null}

      {/* Response */}
      {response && !isSpeaking ? (
        <div className="w-full rounded-lg px-4 py-2" style={{
          background: 'oklch(0.68 0.18 142 / 10%)',
          border: '1px solid oklch(0.68 0.18 142 / 30%)',
        }}>
          <p style={{ color: 'oklch(0.68 0.18 142)', fontSize: '0.7rem', marginBottom: 4 }}>CALIX:</p>
          <p style={{ color: 'oklch(0.85 0.008 80)', fontSize: '0.82rem', lineHeight: 1.5 }}>
            {response.length > 200 ? response.substring(0, 200) + '…' : response}
          </p>
        </div>
      ) : null}

      {/* Stop speaking */}
      {isSpeaking ? (
        <button
          onClick={stopSpeaking}
          className="text-xs px-4 py-2 rounded"
          style={{
            background: 'oklch(0.20 0.008 285)',
            color: 'oklch(0.70 0.008 80)',
            border: '1px solid oklch(1 0 0 / 15%)',
          }}
        >
          ⏹ Stop Speaking
        </button>
      ) : null}

      <p style={{ color: 'oklch(0.45 0.008 80)', fontSize: '0.75rem', textAlign: 'center' }}>
        Supports Greek 🇬🇷 and English 🇬🇧
      </p>
    </div>
  );
}
