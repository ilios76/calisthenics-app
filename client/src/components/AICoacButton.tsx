// ============================================================
// CallistheniX – AI Coach Button
// Floating button with AI Coach circular badge design
// ============================================================
import { useState } from 'react';

interface AICoacButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export const AICoacButton: React.FC<AICoacButtonProps> = ({ onClick, isActive = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      {/* Main button with AI Coach badge image */}
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 relative overflow-hidden"
        style={{
          width: '120px',
          height: '120px',
          background: 'transparent',
          border: 'none',
          boxShadow: isActive 
            ? '0 0 30px oklch(0.68 0.18 142 / 60%)' 
            : '0 4px 16px rgba(0, 0, 0, 0.4)',
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        }}
        title="AI Coach - Ask me anything about calisthenics!"
      >
        {/* AI Coach Badge Image */}
        <img
          src="/manus-storage/ai-coach-button_baccde05.png"
          alt="AI Coach"
          className="w-full h-full object-contain"
          style={{
            filter: isActive ? 'brightness(1.1)' : 'brightness(1)',
            transition: 'filter 0.3s ease',
          }}
        />
      </button>

      {/* Pulse animation when active */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '3px solid oklch(0.68 0.18 142)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};
