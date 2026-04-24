import React from 'react';

interface CoachFigureProps {
  message?: string;
  type?: 'greeting' | 'guidance' | 'celebration' | 'rest';
  showMessage?: boolean;
}

export const CoachFigure: React.FC<CoachFigureProps> = ({ 
  message, 
  type = 'guidance',
  showMessage = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      {/* Coach Figure SVG - Upper body silhouette */}
      <div className="relative w-32 h-48">
        <svg
          viewBox="0 0 100 150"
          className="w-full h-full"
          style={{
            filter: type === 'celebration' ? 'drop-shadow(0 0 20px rgba(132, 204, 22, 0.5))' : 'drop-shadow(0 0 10px rgba(132, 204, 22, 0.3))'
          }}
        >
          {/* Head */}
          <circle cx="50" cy="25" r="15" fill="oklch(0.68 0.18 142)" />
          
          {/* Shoulders & Chest */}
          <ellipse cx="50" cy="55" rx="20" ry="18" fill="oklch(0.68 0.18 142)" />
          
          {/* Arms */}
          <line x1="30" y1="50" x2="15" y2="70" stroke="oklch(0.68 0.18 142)" strokeWidth="6" strokeLinecap="round" />
          <line x1="70" y1="50" x2="85" y2="70" stroke="oklch(0.68 0.18 142)" strokeWidth="6" strokeLinecap="round" />
          
          {/* Torso */}
          <rect x="40" y="70" width="20" height="30" fill="oklch(0.68 0.18 142)" rx="4" />
          
          {/* Motivation indicator */}
          {type === 'celebration' && (
            <>
              <circle cx="35" cy="20" r="3" fill="oklch(0.96 0.008 80)" opacity="0.8" />
              <circle cx="65" cy="18" r="3" fill="oklch(0.96 0.008 80)" opacity="0.8" />
            </>
          )}
        </svg>
      </div>

      {/* Coach Message */}
      {showMessage && message && (
        <div className="max-w-sm text-center">
          <div className="inline-block px-6 py-4 rounded-lg" 
            style={{
              background: type === 'celebration' 
                ? 'oklch(0.68 0.18 142 / 15%)' 
                : type === 'rest'
                ? 'oklch(0.55 0.008 80 / 10%)'
                : 'oklch(0.68 0.18 142 / 10%)',
              border: `1px solid oklch(0.68 0.18 142 / ${type === 'celebration' ? '40%' : '20%'})`
            }}>
            <p style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '1rem',
              color: 'oklch(0.96 0.008 80)',
              lineHeight: 1.6
            }}>
              {message}
            </p>
          </div>
        </div>
      )}

      {/* Animated indicator for active coaching */}
      {type !== 'rest' && (
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: 'oklch(0.68 0.18 142)',
                animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
