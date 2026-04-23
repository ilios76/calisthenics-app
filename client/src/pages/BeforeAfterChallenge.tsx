import React, { useState } from 'react';
import { Camera, Calendar, Share2, RotateCcw } from 'lucide-react';
import { useChallenge } from '@/contexts/ChallengeContext';
import { SelfieCapture } from '@/components/SelfieCapture';
import { BeforeAfterFrame } from '@/components/BeforeAfterFrame';
import { ShareBeforeAfter } from '@/components/ShareBeforeAfter';

export const BeforeAfterChallenge: React.FC = () => {
  const { challenge, initChallenge, getChallengeDaysRemaining, resetChallenge } = useChallenge();
  const [showBeforeCapture, setShowBeforeCapture] = useState(false);
  const [showAfterCapture, setShowAfterCapture] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const daysRemaining = getChallengeDaysRemaining();

  const handleStartChallenge = () => {
    initChallenge();
    setShowBeforeCapture(true);
  };

  if (!challenge) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1
              className="text-5xl font-bold mb-4"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                color: 'oklch(0.68 0.18 142)',
              }}
            >
              BEFORE & AFTER CHALLENGE
            </h1>
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: 'oklch(0.65 0.01 285)',
                fontSize: '1.1rem',
                lineHeight: 1.6,
              }}
            >
              Take a selfie today and compare it with your photo after 2 months of training.
              Watch your transformation unfold!
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: '📸', title: 'CAPTURE', desc: 'Take your before photo now' },
              { icon: '⏰', title: '60 DAYS', desc: 'Complete your 2-month journey' },
              { icon: '🎉', title: 'TRANSFORM', desc: 'See your amazing results' },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-lg text-center"
                style={{
                  background: 'oklch(0.15 0.006 285)',
                  border: '1px solid oklch(0.68 0.18 142)',
                }}
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    color: 'oklch(0.68 0.18 142)',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: 'oklch(0.65 0.01 285)',
                    fontSize: '0.9rem',
                    marginTop: '8px',
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={handleStartChallenge}
              className="px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-3 mx-auto"
              style={{
                background: 'oklch(0.68 0.18 142)',
                color: 'oklch(0.10 0.005 285)',
                fontFamily: 'Barlow Condensed, sans-serif',
              }}
            >
              <Camera size={24} /> START CHALLENGE NOW
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-4"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              color: 'oklch(0.68 0.18 142)',
            }}
          >
            YOUR TRANSFORMATION JOURNEY
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div
              className="px-4 py-2 rounded-lg"
              style={{
                background: 'oklch(0.15 0.006 285)',
                border: '1px solid oklch(0.68 0.18 142)',
              }}
            >
              <p
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  color: 'oklch(0.68 0.18 142)',
                }}
              >
                {daysRemaining} DAYS REMAINING
              </p>
            </div>
            {challenge.beforeDate && (
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  color: 'oklch(0.65 0.01 285)',
                }}
              >
                Started: {challenge.beforeDate.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                color: 'oklch(0.68 0.18 142)',
              }}
            >
              PROGRESS
            </span>
            <span
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: 'oklch(0.65 0.01 285)',
              }}
            >
              {challenge.beforePhoto && challenge.afterPhoto ? '100%' : challenge.beforePhoto ? '50%' : '0%'}
            </span>
          </div>
          <div
            className="h-3 rounded-full overflow-hidden"
            style={{ background: 'oklch(0.15 0.006 285)' }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: challenge.beforePhoto && challenge.afterPhoto ? '100%' : challenge.beforePhoto ? '50%' : '0%',
                background: 'oklch(0.68 0.18 142)',
              }}
            />
          </div>
        </div>

        {/* Before/After Frame */}
        {challenge.beforePhoto && (
          <div className="mb-12">
            <BeforeAfterFrame
              beforePhoto={challenge.beforePhoto}
              afterPhoto={challenge.afterPhoto}
              beforeDate={challenge.beforeDate || undefined}
              afterDate={challenge.afterDate || undefined}
              onShare={() => setShowShare(true)}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {!challenge.beforePhoto ? (
            <button
              onClick={() => setShowBeforeCapture(true)}
              className="py-4 rounded-lg font-bold transition-all hover:scale-105 flex items-center justify-center gap-2 col-span-full"
              style={{
                background: 'oklch(0.68 0.18 142)',
                color: 'oklch(0.10 0.005 285)',
                fontFamily: 'Barlow Condensed, sans-serif',
              }}
            >
              <Camera size={20} /> TAKE BEFORE PHOTO
            </button>
          ) : !challenge.afterPhoto ? (
            <>
              <button
                onClick={() => setShowBeforeCapture(true)}
                className="py-4 rounded-lg font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
                style={{
                  background: 'oklch(0.35 0.05 285)',
                  color: 'oklch(0.90 0.008 80)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  border: '1px solid oklch(0.68 0.18 142)',
                }}
              >
                <RotateCcw size={18} /> RETAKE BEFORE
              </button>
              <button
                onClick={() => setShowAfterCapture(true)}
                className="py-4 rounded-lg font-bold transition-all hover:scale-105 flex items-center justify-center gap-2 col-span-2"
                style={{
                  background: 'oklch(0.68 0.18 142)',
                  color: 'oklch(0.10 0.005 285)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                }}
              >
                <Camera size={20} /> TAKE AFTER PHOTO
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowBeforeCapture(true)}
                className="py-4 rounded-lg font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
                style={{
                  background: 'oklch(0.35 0.05 285)',
                  color: 'oklch(0.90 0.008 80)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  border: '1px solid oklch(0.68 0.18 142)',
                }}
              >
                <RotateCcw size={18} /> RETAKE BEFORE
              </button>
              <button
                onClick={() => setShowAfterCapture(true)}
                className="py-4 rounded-lg font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
                style={{
                  background: 'oklch(0.35 0.05 285)',
                  color: 'oklch(0.90 0.008 80)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  border: '1px solid oklch(0.68 0.18 142)',
                }}
              >
                <RotateCcw size={18} /> RETAKE AFTER
              </button>
              <button
                onClick={() => setShowShare(true)}
                className="py-4 rounded-lg font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
                style={{
                  background: 'oklch(0.68 0.18 142)',
                  color: 'oklch(0.10 0.005 285)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                }}
              >
                <Share2 size={20} /> SHARE TRANSFORMATION
              </button>
            </>
          )}
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetChallenge}
            className="px-6 py-2 rounded-lg font-bold transition-all hover:opacity-70"
            style={{
              background: 'transparent',
              color: 'oklch(0.65 0.01 285)',
              fontFamily: 'Barlow Condensed, sans-serif',
              border: '1px solid oklch(0.65 0.01 285)',
            }}
          >
            START NEW CHALLENGE
          </button>
        </div>
      </div>

      {/* Modals */}
      {showBeforeCapture && (
        <SelfieCapture
          mode="before"
          onClose={() => setShowBeforeCapture(false)}
        />
      )}
      {showAfterCapture && (
        <SelfieCapture
          mode="after"
          onClose={() => setShowAfterCapture(false)}
        />
      )}
      {showShare && (
        <ShareBeforeAfter
          beforePhoto={challenge.beforePhoto}
          afterPhoto={challenge.afterPhoto}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
};
