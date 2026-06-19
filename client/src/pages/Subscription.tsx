// ============================================================
// CallistheniX – Subscription/Paywall Screen
// Premium tier with Stripe integration
// ============================================================
import { useState } from 'react';
import { Check, X, Zap, Crown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  icon: React.ReactNode;
  features: Array<{
    name: string;
    included: boolean;
  }>;
  cta: string;
  popular?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'Forever',
    description: 'Get started with the basics',
    icon: <Zap className="w-6 h-6" />,
    features: [
      { name: '5 Workout Programs', included: true },
      { name: 'Basic Progress Tracking', included: true },
      { name: 'AI Coach (Limited)', included: true },
      { name: 'Unlimited Programs', included: false },
      { name: 'Advanced Analytics', included: false },
      { name: 'Custom Meal Plans', included: false },
      { name: 'Priority Support', included: false },
      { name: 'Offline Mode', included: false },
    ],
    cta: 'Current Plan',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    period: 'month',
    description: 'Unlock your full potential',
    icon: <Crown className="w-6 h-6" />,
    features: [
      { name: '5 Workout Programs', included: true },
      { name: 'Basic Progress Tracking', included: true },
      { name: 'AI Coach (Limited)', included: true },
      { name: 'Unlimited Programs', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Custom Meal Plans', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Offline Mode', included: true },
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 19.99,
    period: 'month',
    description: 'For serious athletes',
    icon: <Shield className="w-6 h-6" />,
    features: [
      { name: '5 Workout Programs', included: true },
      { name: 'Basic Progress Tracking', included: true },
      { name: 'AI Coach (Limited)', included: true },
      { name: 'Unlimited Programs', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Custom Meal Plans', included: true },
      { name: 'Priority Support', included: true },
      { name: 'Offline Mode', included: true },
    ],
    cta: 'Upgrade to Elite',
  },
];

export default function Subscription() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async (tierId: string) => {
    if (tierId === 'free') {
      toast.info('You are already on the Free plan');
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Integrate with Stripe
      // This would call your backend to create a Stripe checkout session
      toast.success('Redirecting to payment...');
      // window.location.href = `/api/checkout?tier=${tierId}`;
    } catch (error) {
      toast.error('Failed to process upgrade');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(0.10 0.005 285)' }}>
      {/* Header */}
      <div className="px-4 py-12 md:px-8 text-center border-b" style={{ borderColor: 'oklch(0.68 0.18 142 / 20%)' }}>
        <h1 
          className="text-4xl font-black uppercase mb-4"
          style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}
        >
          Choose Your Path
        </h1>
        <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
          Unlock unlimited access to all programs, advanced analytics, and personalized coaching. Start your transformation today.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="px-4 py-12 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className="relative transition-all duration-300 cursor-pointer"
              style={{
                transform: selectedTier === tier.id ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {tier.popular && (
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase"
                  style={{
                    background: 'oklch(0.68 0.18 142)',
                    color: 'oklch(0.10 0.005 285)',
                    letterSpacing: '0.05em',
                  }}
                >
                  Most Popular
                </div>
              )}

              <Card
                className="p-8 h-full border transition-all duration-300"
                style={{
                  background: 'oklch(0.12 0.005 285)',
                  borderColor: selectedTier === tier.id 
                    ? 'oklch(0.68 0.18 142)' 
                    : 'oklch(0.68 0.18 142 / 30%)',
                  boxShadow: selectedTier === tier.id
                    ? '0 0 30px oklch(0.68 0.18 142 / 40%)'
                    : 'none',
                }}
              >
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div style={{ color: 'oklch(0.68 0.18 142)' }}>
                    {tier.icon}
                  </div>
                  <h3
                    className="text-2xl font-black"
                    style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}
                  >
                    {tier.name}
                  </h3>
                </div>

                {/* Description */}
                <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {tier.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-4xl font-black"
                      style={{ fontFamily: 'Bebas Neue, sans-serif', color: 'oklch(0.68 0.18 142)' }}
                    >
                      ${tier.price}
                    </span>
                    {tier.period !== 'Forever' && (
                      <span style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}>
                        /{tier.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleUpgrade(tier.id)}
                  disabled={isProcessing || tier.id === 'free'}
                  className="w-full mb-8 font-bold uppercase tracking-wide"
                  style={{
                    background: tier.popular ? 'oklch(0.68 0.18 142)' : 'oklch(0.68 0.18 142 / 60%)',
                    color: 'oklch(0.10 0.005 285)',
                  }}
                >
                  {tier.cta}
                </Button>

                {/* Features List */}
                <div className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 flex-shrink-0" style={{ color: 'oklch(0.68 0.18 142)' }} />
                      ) : (
                        <X className="w-5 h-5 flex-shrink-0" style={{ color: 'oklch(0.60 0.008 80)' }} />
                      )}
                      <span
                        style={{
                          color: feature.included ? 'oklch(0.96 0.008 80)' : 'oklch(0.60 0.008 80)',
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: '0.9rem',
                        }}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl font-black uppercase mb-8 text-center"
            style={{ fontFamily: 'Barlow Condensed, sans-serif', color: 'oklch(0.96 0.008 80)' }}
          >
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, you can cancel your subscription at any time. No hidden fees or long-term contracts.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, Apple Pay, and Google Pay through our secure Stripe payment processor.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Start with our Free plan to explore all features. Upgrade anytime to unlock premium content.',
              },
              {
                q: 'Can I switch plans?',
                a: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
              },
            ].map((faq, idx) => (
              <Card
                key={idx}
                className="p-6 border"
                style={{
                  background: 'oklch(0.12 0.005 285)',
                  borderColor: 'oklch(0.68 0.18 142 / 30%)',
                }}
              >
                <h3
                  className="font-bold mb-2"
                  style={{ color: 'oklch(0.96 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {faq.q}
                </h3>
                <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem' }}>
                  {faq.a}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div
          className="max-w-3xl mx-auto mt-12 p-8 rounded-lg text-center border"
          style={{
            background: 'linear-gradient(135deg, oklch(0.12 0.005 285), oklch(0.15 0.008 285))',
            borderColor: 'oklch(0.68 0.18 142 / 30%)',
          }}
        >
          <Shield className="w-8 h-8 mx-auto mb-4" style={{ color: 'oklch(0.68 0.18 142)' }} />
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: 'oklch(0.96 0.008 80)', fontFamily: 'Barlow Condensed, sans-serif' }}
          >
            30-Day Money Back Guarantee
          </h3>
          <p style={{ color: 'oklch(0.70 0.008 80)', fontFamily: 'DM Sans, sans-serif' }}>
            Not satisfied? Get a full refund within 30 days. No questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
