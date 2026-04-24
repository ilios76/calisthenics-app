import React, { useState, useEffect } from 'react';
import { useCoach } from '@/contexts/CoachContext';
import { X, MessageCircle, Zap } from 'lucide-react';

interface CoachWidgetProps {
  isVisible?: boolean;
  position?: 'bottom-right' | 'bottom-left';
}

const MOTIVATIONAL_MESSAGES = [
  "Rest up—you've earned it!",
  "Your effort today builds tomorrow's strength.",
  "Every rep counts. You're crushing it.",
  "Recovery is part of the journey.",
  "You're stronger than yesterday.",
  "Keep pushing. You've got this.",
];

export const CoachWidget: React.FC<CoachWidgetProps> = ({
  isVisible = true,
  position = 'bottom-right',
}) => {
  const { dailyMessage, getDailyChallenge } = useCoach();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(dailyMessage);
  const [showChallenge, setShowChallenge] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  
  useEffect(() => {
    const randomMsg = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    setMotivationalMessage(randomMsg);
  }, [isOpen]);

  useEffect(() => {
    if (dailyMessage) {
      setCurrentMessage(dailyMessage);
    }
  }, [dailyMessage]);

  if (!isVisible) return null;

  const handleGetChallenge = () => {
    const challenge = getDailyChallenge();
    setCurrentMessage(challenge);
    setShowChallenge(true);
  };

  return (
    <>
      {/* Round floating button - AI Coach */}
      <div
        className="fixed z-40 flex items-center justify-center shadow-lg"
        style={{
          [position === 'bottom-right' ? 'right' : 'left']: '24px',
          bottom: '24px',
          width: '64px',
          height: '64px',
        }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-full rounded-full flex items-center justify-center font-bold transition-all hover:scale-110 shadow-lg"
          style={{
            background: 'oklch(0.68 0.18 142)',
            color: 'oklch(0.10 0.005 285)',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '24px',
            cursor: 'pointer',
            border: '3px solid oklch(0.68 0.18 142)',
            boxShadow: '0 0 20px rgba(132, 204, 22, 0.4)',
          }}
          title="AI Coach"
        >
          💬
        </button>
      </div>

      {/* Chat bubble - slides in from bottom */}
      {isOpen && (
        <div
          className="fixed z-40 flex flex-col gap-3"
          style={{
            [position === 'bottom-right' ? 'right' : 'left']: '24px',
            bottom: '100px',
            animation: 'slideUp 0.3s ease-out forwards',
            pointerEvents: 'auto',
          }}
        >
          {/* Chat bubble */}
          <div
            className="p-4 rounded-lg shadow-lg max-w-xs"
            style={{
              background: 'oklch(0.15 0.006 285)',
              border: '1px solid oklch(0.68 0.18 142)',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <span style={{ fontSize: '1.5rem' }}>💪</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:opacity-70 transition-opacity"
              >
                <X size={16} style={{ color: 'oklch(0.65 0.01 285)' }} />
              </button>
            </div>
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9rem',
                color: 'oklch(0.90 0.008 80)',
                lineHeight: 1.5,
                marginBottom: '12px',
              }}
            >
              {motivationalMessage}
            </p>
            <button
              onClick={() => setMotivationalMessage(MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)])}
              className="w-full py-2 rounded text-sm transition-all flex items-center justify-center gap-2"
              style={{
                background: 'oklch(0.68 0.18 142)',
                color: 'oklch(0.10 0.005 285)',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
              }}
            >
              <Zap size={14} /> New Message
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};
