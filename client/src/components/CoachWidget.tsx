import React, { useState, useEffect } from 'react';
import { useCoach } from '@/contexts/CoachContext';
import { X, MessageCircle, Zap } from 'lucide-react';

interface CoachWidgetProps {
  isVisible?: boolean;
  position?: 'bottom-left' | 'bottom-right';
}

export const CoachWidget: React.FC<CoachWidgetProps> = ({
  isVisible = true,
  position = 'bottom-left',
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

  const positionClasses = position === 'bottom-left' 
    ? 'bottom-6 left-6' 
    : 'bottom-6 right-6';

  const handleGetChallenge = () => {
    const challenge = getDailyChallenge();
    setCurrentMessage(challenge);
    setShowChallenge(true);
  };

  return (
    <div className="fixed bottom-6 right-8 z-40">
      {/* Chat bubble */}
      {isOpen && currentMessage && (
        <div
          className="mb-4 p-4 rounded-lg shadow-lg max-w-xs animate-cx-slide-up"
          style={{
            background: 'oklch(0.15 0.006 285)',
            border: '1px solid oklch(0.68 0.18 142)',
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
      )}

      {/* Coach button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-105 font-bold text-sm"
        style={{
          background: isOpen ? 'oklch(0.68 0.18 142)' : 'oklch(0.68 0.18 142)',
          color: 'oklch(0.10 0.005 285)',
          fontFamily: 'Barlow Condensed, sans-serif',
        }}
        title="AI Coach"
      >
        <MessageCircle size={18} />
        AI COACH
      </button>
    </div>
  );
};
