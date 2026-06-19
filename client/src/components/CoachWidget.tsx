import React, { useState } from 'react';
import { CoachChatBot } from './CoachChatBot';
import { AICoacButton } from './AICoacButton';

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
      {/* AI Coach Button with Label */}
      <div
        className="fixed z-40 flex items-center justify-center"
        style={{
          [position === 'bottom-right' ? 'right' : 'left']: '24px',
          bottom: '24px',
        }}
      >
        <AICoacButton 
          onClick={() => setChatOpen(true)} 
          isActive={chatOpen}
        />
      </div>

      {/* Chat Bot Modal */}
      <CoachChatBot open={chatOpen} onOpenChange={setChatOpen} />
    </>
  );
};
