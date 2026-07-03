import React, { useState } from 'react';
import { CoachChatBot } from './CoachChatBot';

interface CoachWidgetProps {
  isVisible?: boolean;
  position?: 'bottom-right' | 'bottom-left';
}

export const CoachWidget: React.FC<CoachWidgetProps> = ({
  isVisible = true,
  position = 'bottom-right',
}) => {
  const [chatOpen, setChatOpen] = useState(false);

  if (!isVisible) return null;

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
          onClick={() => setChatOpen(true)}
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
          title="AI Coach - Ask me anything!"
        >
          💬
        </button>
      </div>

      {/* Chat Bot Modal */}
      <CoachChatBot open={chatOpen} onOpenChange={setChatOpen} />
    </>
  );
};
