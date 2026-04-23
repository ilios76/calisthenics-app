import React, { useState, useEffect } from 'react';
import { useCoach } from '@/contexts/CoachContext';
import { X, MessageCircle, Zap } from 'lucide-react';

interface CoachWidgetProps {
  isVisible?: boolean;
}

export const CoachWidget: React.FC<CoachWidgetProps> = ({
  isVisible = true,
}) => {
  const { dailyMessage, getDailyChallenge } = useCoach();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(dailyMessage);
  const [showChallenge, setShowChallenge] = useState(false);

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
      {/* Vertical tab - permanently fixed on right side */}
      <div
        className="fixed top-1/2 right-0 z-40 flex flex-col"
        style={{
          transform: 'translateY(-50%)',
        }}
      >
        {/* Vertical tab button - compact size */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-1 py-3 rounded-l-lg flex items-center justify-center gap-1 shadow-lg transition-all hover:scale-105 font-bold text-xs self-end"
          style={{
            background: 'oklch(0.68 0.18 142)',
            color: 'oklch(0.10 0.005 285)',
            fontFamily: 'Barlow Condensed, sans-serif',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            pointerEvents: 'auto',
            cursor: 'pointer',
            letterSpacing: '1px',
            fontSize: '10px',
            minHeight: '60px',
            minWidth: '24px',
          }}
          title="AI Coach"
        >
          AI COACH
        </button>
      </div>

      {/* Chat bubble - slides in from right */}
      {isOpen && currentMessage && (
        <div
          className="fixed top-1/3 right-0 z-40 flex flex-col gap-3"
          style={{
            animation: 'slideInRight 0.3s ease-out forwards',
            pointerEvents: 'auto',
          }}
        >
          {/* Chat bubble */}
          <div
            className="p-4 rounded-lg shadow-lg max-w-xs"
            style={{
              background: 'oklch(0.15 0.006 285)',
              border: '1px solid oklch(0.68 0.18 142)',
              marginRight: '1rem',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <span style={{ fontSize: '1.5rem' }}>{currentMessage.emoji}</span>
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
              {currentMessage.content}
            </p>
            {!showChallenge && (
              <button
                onClick={handleGetChallenge}
                className="w-full py-2 rounded text-sm transition-all flex items-center justify-center gap-2"
                style={{
                  background: 'oklch(0.68 0.18 142)',
                  color: 'oklch(0.10 0.005 285)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                }}
              >
                <Zap size={14} /> Today's Challenge
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};
