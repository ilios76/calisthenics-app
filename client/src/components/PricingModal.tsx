import React, { useState } from 'react';
import { X, Check, Zap } from 'lucide-react';
import { useWorkoutCompletion } from '@/contexts/WorkoutCompletionContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: 'monthly' | 'yearly') => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const { completion } = useWorkoutCompletion();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  if (!isOpen) return null;

  const features = [
    'Unlimited workouts',
    'All exercise programs',
    'Advanced analytics',
    'Personalized coaching',
    'Priority support',
    'Offline mode',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'oklch(0 0 0 / 50%)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-lg"
        style={{ background: 'oklch(0.12 0.005 285)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:opacity-70 transition-opacity"
        >
          <X size={24} style={{ color: 'oklch(0.65 0.01 285)' }} />
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: '2rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'oklch(0.96 0.008 80)',
                marginBottom: '8px',
              }}
            >
              Unlock Premium
            </h2>
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '1rem',
                color: 'oklch(0.65 0.01 285)',
              }}
            >
              Your trial ends in {completion.trialDaysRemaining} days. Upgrade now to keep training.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Monthly */}
            <div
              className="relative p-6 rounded-lg border-2 cursor-pointer transition-all"
              style={{
                borderColor:
                  selectedPlan === 'monthly'
                    ? 'oklch(0.68 0.18 142)'
                    : 'oklch(0.20 0.005 285)',
                background:
                  selectedPlan === 'monthly'
                    ? 'oklch(0.68 0.18 142 / 10%)'
                    : 'oklch(0.15 0.006 285)',
              }}
              onClick={() => setSelectedPlan('monthly')}
            >
              <h3
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  color: 'oklch(0.96 0.008 80)',
                  marginBottom: '8px',
                }}
              >
                Monthly
              </h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span
                  style={{
                    fontFamily: 'Bebas Neue, cursive',
                    fontSize: '2.5rem',
                    color: 'oklch(0.68 0.18 142)',
                  }}
                >
                  €7.99
                </span>
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.9rem',
                    color: 'oklch(0.65 0.01 285)',
                  }}
                >
                  /month
                </span>
              </div>
              <button
                onClick={() => onUpgrade('monthly')}
                className="w-full py-2 rounded-lg transition-all"
                style={{
                  background:
                    selectedPlan === 'monthly'
                      ? 'oklch(0.68 0.18 142)'
                      : 'oklch(0.20 0.005 285)',
                  color:
                    selectedPlan === 'monthly'
                      ? 'oklch(0.10 0.005 285)'
                      : 'oklch(0.68 0.18 142)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  marginBottom: '16px',
                }}
              >
                Choose Plan
              </button>
              <div className="space-y-2">
                {features.slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check size={16} style={{ color: 'oklch(0.68 0.18 142)' }} />
                    <span
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '0.85rem',
                        color: 'oklch(0.65 0.01 285)',
                      }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Yearly */}
            <div
              className="relative p-6 rounded-lg border-2 cursor-pointer transition-all"
              style={{
                borderColor:
                  selectedPlan === 'yearly'
                    ? 'oklch(0.68 0.18 142)'
                    : 'oklch(0.20 0.005 285)',
                background:
                  selectedPlan === 'yearly'
                    ? 'oklch(0.68 0.18 142 / 10%)'
                    : 'oklch(0.15 0.006 285)',
              }}
              onClick={() => setSelectedPlan('yearly')}
            >
              {/* Best value badge */}
              <div
                className="absolute -top-3 left-6 px-3 py-1 rounded-full flex items-center gap-1"
                style={{
                  background: 'oklch(0.68 0.18 142)',
                  color: 'oklch(0.10 0.005 285)',
                }}
              >
                <Zap size={14} />
                <span
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                  }}
                >
                  Best Value
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  color: 'oklch(0.96 0.008 80)',
                  marginBottom: '8px',
                }}
              >
                Yearly
              </h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span
                  style={{
                    fontFamily: 'Bebas Neue, cursive',
                    fontSize: '2.5rem',
                    color: 'oklch(0.68 0.18 142)',
                  }}
                >
                  €39.99
                </span>
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.9rem',
                    color: 'oklch(0.65 0.01 285)',
                  }}
                >
                  /year
                </span>
              </div>
              <div
                className="mb-6 px-2 py-1 rounded text-center"
                style={{
                  background: 'oklch(0.68 0.18 142 / 15%)',
                  border: '1px solid oklch(0.68 0.18 142 / 30%)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: 'oklch(0.68 0.18 142)',
                    textTransform: 'uppercase',
                  }}
                >
                  Save 60%
                </p>
              </div>
              <button
                onClick={() => onUpgrade('yearly')}
                className="w-full py-2 rounded-lg transition-all"
                style={{
                  background:
                    selectedPlan === 'yearly'
                      ? 'oklch(0.68 0.18 142)'
                      : 'oklch(0.20 0.005 285)',
                  color:
                    selectedPlan === 'yearly'
                      ? 'oklch(0.10 0.005 285)'
                      : 'oklch(0.68 0.18 142)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  marginBottom: '16px',
                }}
              >
                Choose Plan
              </button>
              <div className="space-y-2">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check size={16} style={{ color: 'oklch(0.68 0.18 142)' }} />
                    <span
                      style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '0.85rem',
                        color: 'oklch(0.65 0.01 285)',
                      }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="text-center pt-6 border-t"
            style={{ borderColor: 'oklch(0.20 0.005 285)' }}
          >
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.8rem',
                color: 'oklch(0.65 0.01 285)',
              }}
            >
              Secure payment powered by Stripe. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
