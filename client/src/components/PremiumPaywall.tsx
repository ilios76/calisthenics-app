import React, { useState } from 'react';
import { Check, X, Zap, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SUBSCRIPTION_PLANS, formatPrice } from '@/services/stripeService';

interface PremiumPaywallProps {
  onSelectPlan: (plan: 'monthly' | 'yearly') => void;
  isLoading?: boolean;
  featureName?: string;
}

export function PremiumPaywall({
  onSelectPlan,
  isLoading = false,
  featureName,
}: PremiumPaywallProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const monthlyPlan = SUBSCRIPTION_PLANS.monthly;
  const yearlyPlan = SUBSCRIPTION_PLANS.yearly;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Lock className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Unlock Premium</h2>
        </div>
        {featureName && (
          <p className="text-gray-600">
            <span className="font-semibold">{featureName}</span> is a premium feature
          </p>
        )}
      </div>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Monthly Plan */}
        <Card
          className={`p-6 cursor-pointer transition-all border-2 ${
            selectedPlan === 'monthly'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSelectedPlan('monthly')}
        >
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-1">{monthlyPlan.name}</h3>
            <p className="text-sm text-gray-600">{monthlyPlan.description}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">€{monthlyPlan.price}</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Billed monthly</p>
          </div>

          <Button
            onClick={() => onSelectPlan('monthly')}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-4"
          >
            {isLoading ? 'Processing...' : 'Choose Monthly'}
          </Button>

          <div className="space-y-2">
            {monthlyPlan.features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Yearly Plan */}
        <Card
          className={`p-6 cursor-pointer transition-all border-2 relative ${
            selectedPlan === 'yearly'
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSelectedPlan('yearly')}
        >
          {/* Best Value Badge */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Best Value
            </span>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold mb-1">{yearlyPlan.name}</h3>
            <p className="text-sm text-gray-600">{yearlyPlan.description}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">€{yearlyPlan.price}</span>
              <span className="text-gray-600">/year</span>
            </div>
            <p className="text-xs text-green-600 font-semibold mt-1">
              Save ~€{yearlyPlan.savings} per year
            </p>
          </div>

          <Button
            onClick={() => onSelectPlan('yearly')}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white mb-4"
          >
            {isLoading ? 'Processing...' : 'Choose Yearly'}
          </Button>

          <div className="space-y-2">
            {yearlyPlan.features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Free vs Premium Comparison */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-bold mb-4">What You Get</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">30-day meal plans</span>
            <X className="w-4 h-4 text-gray-400" />
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Unlimited skill paths</span>
            <X className="w-4 h-4 text-gray-400" />
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Advanced coach AI</span>
            <X className="w-4 h-4 text-gray-400" />
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Priority support</span>
            <X className="w-4 h-4 text-gray-400" />
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">No ads</span>
            <X className="w-4 h-4 text-gray-400" />
            <Check className="w-4 h-4 text-green-600" />
          </div>
        </div>
      </Card>

      {/* Trust Badges */}
      <div className="text-center text-xs text-gray-600">
        <p className="mb-2">🔒 Secure payment powered by Stripe</p>
        <p>💳 Cancel anytime, no questions asked</p>
      </div>
    </div>
  );
}
