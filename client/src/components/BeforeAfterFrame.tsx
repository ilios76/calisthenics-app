import React, { useRef } from 'react';
import { Download, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';

interface BeforeAfterFrameProps {
  beforePhoto: string | null;
  afterPhoto: string | null;
  beforeDate?: Date;
  afterDate?: Date;
  onShare?: () => void;
  onDownload?: () => void;
}

export const BeforeAfterFrame: React.FC<BeforeAfterFrameProps> = ({
  beforePhoto,
  afterPhoto,
  beforeDate,
  afterDate,
  onShare,
  onDownload,
}) => {
  const frameRef = useRef<HTMLDivElement>(null);

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDownload = async () => {
    if (frameRef.current) {
      try {
        const canvas = await html2canvas(frameRef.current, {
          backgroundColor: '#000000',
          scale: 2,
        });
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `CallistheniX-BeforeAfter-${Date.now()}.png`;
        link.click();
        onDownload?.();
      } catch (error) {
        console.error('Failed to download frame:', error);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Frame Container */}
      <div
        ref={frameRef}
        className="relative rounded-lg overflow-hidden shadow-2xl"
        style={{
          background: 'oklch(0.10 0.005 285)',
          padding: '20px',
        }}
      >
        {/* Header with Logo */}
        <div className="text-center mb-6">
          <div
            className="text-3xl font-bold mb-2"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              color: 'oklch(0.68 0.18 142)',
            }}
          >
            💪 CALLISTHENIX
          </div>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: 'oklch(0.65 0.01 285)',
              fontSize: '0.9rem',
            }}
          >
            BEFORE & AFTER TRANSFORMATION
          </p>
        </div>

        {/* Photos Container */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Before Photo */}
          <div className="relative rounded-lg overflow-hidden border-2" style={{ borderColor: 'oklch(0.68 0.18 142)' }}>
            {beforePhoto ? (
              <img src={beforePhoto} alt="Before" className="w-full h-64 object-cover" />
            ) : (
              <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                <span style={{ color: 'oklch(0.65 0.01 285)' }}>No photo</span>
              </div>
            )}
            <div
              className="absolute top-2 left-2 px-3 py-1 rounded text-sm font-bold"
              style={{
                background: 'oklch(0.68 0.18 142)',
                color: 'oklch(0.10 0.005 285)',
                fontFamily: 'Barlow Condensed, sans-serif',
              }}
            >
              BEFORE
            </div>
            {beforeDate && (
              <div
                className="absolute bottom-2 left-2 px-2 py-1 rounded text-xs"
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'oklch(0.90 0.008 80)',
                }}
              >
                {formatDate(beforeDate)}
              </div>
            )}
          </div>

          {/* After Photo */}
          <div className="relative rounded-lg overflow-hidden border-2" style={{ borderColor: 'oklch(0.68 0.18 142)' }}>
            {afterPhoto ? (
              <img src={afterPhoto} alt="After" className="w-full h-64 object-cover" />
            ) : (
              <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                <span style={{ color: 'oklch(0.65 0.01 285)' }}>No photo</span>
              </div>
            )}
            <div
              className="absolute top-2 right-2 px-3 py-1 rounded text-sm font-bold"
              style={{
                background: 'oklch(0.68 0.18 142)',
                color: 'oklch(0.10 0.005 285)',
                fontFamily: 'Barlow Condensed, sans-serif',
              }}
            >
              AFTER
            </div>
            {afterDate && (
              <div
                className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs"
                style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'oklch(0.90 0.008 80)',
                }}
              >
                {formatDate(afterDate)}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center py-4 rounded"
          style={{
            background: 'oklch(0.15 0.006 285)',
            border: '1px solid oklch(0.68 0.18 142)',
          }}
        >
          <p
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              color: 'oklch(0.68 0.18 142)',
              fontSize: '0.9rem',
              fontWeight: 700,
            }}
          >
            ✨ TRANSFORMATION IN PROGRESS ✨
          </p>
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: 'oklch(0.65 0.01 285)',
              fontSize: '0.8rem',
              marginTop: '4px',
            }}
          >
            Powered by CallistheniX - Your Personal Calisthenics Trainer
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleDownload}
          className="flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all hover:scale-105"
          style={{
            background: 'oklch(0.68 0.18 142)',
            color: 'oklch(0.10 0.005 285)',
            fontFamily: 'Barlow Condensed, sans-serif',
          }}
        >
          <Download size={18} /> DOWNLOAD
        </button>
        <button
          onClick={onShare}
          className="flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all hover:scale-105"
          style={{
            background: 'oklch(0.35 0.05 285)',
            color: 'oklch(0.90 0.008 80)',
            fontFamily: 'Barlow Condensed, sans-serif',
            border: '1px solid oklch(0.68 0.18 142)',
          }}
        >
          <Share2 size={18} /> SHARE
        </button>
      </div>
    </div>
  );
};
