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
      {/* Coach Figure Image */}
      <div className="relative w-48 h-64">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663480765519/caJNdno7UCGz8MCuABbtpL/1_404bf839.png"
          alt="Coach"
          className="w-full h-full object-contain"
          style={{
            filter: type === 'celebration' ? 'drop-shadow(0 0 20px rgba(132, 204, 22, 0.5))' : 'drop-shadow(0 0 10px rgba(132, 204, 22, 0.3))'
          }}
        />
      </div>

      {/* Coach Message with Quotes */}
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
              "{message}"
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
