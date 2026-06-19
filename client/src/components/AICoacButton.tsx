// ============================================================
// CallistheniX – AI Coach Button
// Floating button with "AI COACH" label and microphone icon
// ============================================================
import { Mic } from 'lucide-react';
import { useState } from 'react';

interface AICoacButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export const AICoacButton: React.FC<AICoacButtonProps> = ({ onClick, isActive = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      {/* Label background */}
      <div
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full whitespace-nowrap transition-all duration-300"
        style={{
          background: 'oklch(0.68 0.18 142)',
          color: 'oklch(0.10 0.005 285)',
          fontSize: '0.7rem',
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          opacity: isHovered ? 1 : 0.8,
          pointerEvents: 'none',
        }}
      >
        AI COACH
      </div>

      {/* Main button */}
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 relative"
        style={{
          width: '64px',
          height: '64px',
          background: isActive 
            ? 'oklch(0.68 0.18 142)' 
            : 'oklch(0.68 0.18 142 / 80%)',
          border: '2px solid oklch(0.68 0.18 142)',
          color: 'oklch(0.10 0.005 285)',
          boxShadow: isActive 
            ? '0 0 20px oklch(0.68 0.18 142 / 60%)' 
            : '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}
        title="AI Coach - Ask me anything about calisthenics!"
      >
        <Mic className="w-7 h-7" />
      </button>

      {/* Pulse animation when active */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            border: '2px solid oklch(0.68 0.18 142)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
      )}
    </div>
  );
};
