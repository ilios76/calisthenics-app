// ============================================================
// CallistheniX – Stripe Payment Integration
// Handles premium tier subscriptions and payments
// ============================================================

export interface StripeConfig {
  publishableKey: string;
  priceIdMonthly: string;
  priceIdYearly: string;
}

export interface SubscriptionPlan {
  id: 'monthly' | 'yearly';
  name: string;
  price: number;
  currency: string;
  billingPeriod: 'month' | 'year';
  description: string;
  features: string[];
  savings?: number; // For yearly plan
}

export interface UserSubscription {
  userId: string;
  subscriptionId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  plan: 'monthly' | 'yearly' | 'free';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  paymentMethod?: {
    last4: string;
    brand: string;
    expMonth: number;
    expYear: number;
  };
}

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'processing' | 'requires_payment_method';
}

// ============================================================
// Subscription Plans
// ============================================================

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  monthly: {
    id: 'monthly',
    name: 'Pro Monthly',
    price: 5.99,
    currency: 'EUR',
    billingPeriod: 'month',
    description: 'Perfect for trying out premium features',
    features: [
      '30-day meal plans',
      'Unlimited skill paths',
      'Advanced coach AI',
      'Priority support',
      'No ads',
    ],
  },
  yearly: {
    id: 'yearly',
    name: 'Pro Yearly',
    price: 29.99,
    currency: 'EUR',
    billingPeriod: 'year',
    description: 'Best value - save 75% vs monthly',
    features: [
      '30-day meal plans',
      'Unlimited skill paths',
      'Advanced coach AI',
      'Priority support',
      'No ads',
      'Exclusive yearly badge',
    ],
    savings: 42, // ~€12 saved per year (€5.99*12 = €71.88 vs €59.99)
  },
};

// ============================================================
// Stripe Service
// ============================================================

export class StripeService {
  private static config: StripeConfig | null = null;

  /**
   * Initialize Stripe service with config
   */
  static initialize(config: StripeConfig): void {
    this.config = config;
  }

  /**
   * Get Stripe config
   */
  static getConfig(): StripeConfig {
    if (!this.config) {
      throw new Error('Stripe service not initialized');
    }
    return this.config;
  }

  /**
   * Create checkout session
   */
  static async createCheckoutSession(
    userId: string,
    plan: 'monthly' | 'yearly',
    successUrl: string,
    cancelUrl: string
  ): Promise<{ sessionId: string; url: string }> {
    try {
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          plan,
          successUrl,
          cancelUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Checkout session error:', error);
      throw error;
    }
  }

  /**
   * Get user subscription
   */
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const response = await fetch(`/api/stripe/subscription/${userId}`);

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch subscription');
      }

      const data = await response.json();
      return {
        ...data,
        currentPeriodStart: new Date(data.currentPeriodStart),
        currentPeriodEnd: new Date(data.currentPeriodEnd),
        trialEnd: data.trialEnd ? new Date(data.trialEnd) : undefined,
      };
    } catch (error) {
      console.error('Subscription fetch error:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(userId: string): Promise<void> {
    try {
      const response = await fetch(`/api/stripe/subscription/${userId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  }

  /**
   * Resume subscription
   */
  static async resumeSubscription(userId: string): Promise<void> {
    try {
      const response = await fetch(`/api/stripe/subscription/${userId}/resume`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to resume subscription');
      }
    } catch (error) {
      console.error('Resume subscription error:', error);
      throw error;
    }
  }

  /**
   * Update payment method
   */
  static async updatePaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    try {
      const response = await fetch(`/api/stripe/payment-method/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethodId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment method');
      }
    } catch (error) {
      console.error('Update payment method error:', error);
      throw error;
    }
  }

  /**
   * Get billing portal URL
   */
  static async getBillingPortalUrl(userId: string, returnUrl: string): Promise<string> {
    try {
      const response = await fetch('/api/stripe/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, returnUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to get billing portal URL');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Billing portal error:', error);
      throw error;
    }
  }

  /**
   * Check if user is premium
   */
  static async isPremium(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      return subscription ? subscription.status === 'active' : false;
    } catch {
      return false;
    }
  }

  /**
   * Get subscription status
   */
  static async getSubscriptionStatus(userId: string): Promise<{
    isPremium: boolean;
    plan?: 'monthly' | 'yearly';
    status?: string;
    renewalDate?: Date;
  }> {
    try {
      const subscription = await this.getUserSubscription(userId);

      if (!subscription) {
        return { isPremium: false };
      }

      return {
        isPremium: subscription.status === 'active',
        plan: subscription.plan as 'monthly' | 'yearly',
        status: subscription.status,
        renewalDate: subscription.currentPeriodEnd,
      };
    } catch {
      return { isPremium: false };
    }
  }
}

// ============================================================
// Premium Feature Gating
// ============================================================

export interface FeatureAccess {
  feature: string;
  isPremium: boolean;
  requiredPlan?: 'monthly' | 'yearly';
  message: string;
}

export class FeatureGating {
  private static premiumFeatures = [
    'meal_plan_30_day',
    'unlimited_skill_paths',
    'advanced_coach_ai',
    'priority_support',
    'no_ads',
    'custom_workouts',
    'advanced_analytics',
  ];

  /**
   * Check if feature is premium
   */
  static isPremiumFeature(feature: string): boolean {
    return this.premiumFeatures.includes(feature);
  }

  /**
   * Get feature access info
   */
  static getFeatureAccess(feature: string, isPremium: boolean): FeatureAccess {
    const isFeatPremium = this.isPremiumFeature(feature);

    return {
      feature,
      isPremium: isFeatPremium && isPremium,
      requiredPlan: isFeatPremium ? 'monthly' : undefined,
      message: isFeatPremium
        ? isPremium
          ? `You have access to ${feature}`
          : `Upgrade to Pro to access ${feature}`
        : `${feature} is available in free tier`,
    };
  }

  /**
   * Get all premium features
   */
  static getPremiumFeatures(): string[] {
    return [...this.premiumFeatures];
  }

  /**
   * Get free features
   */
  static getFreeFeatures(): string[] {
    return [
      '7_day_meal_plan',
      'basic_workouts',
      'basic_progression_tracking',
      'community_features',
      'offline_mode',
    ];
  }
}

// ============================================================
// Subscription Utilities
// ============================================================

export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency,
  }).format(price);
}

export function getDaysUntilRenewal(renewalDate: Date): number {
  const now = new Date();
  const diffMs = renewalDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getSubscriptionStatus(subscription: UserSubscription): string {
  switch (subscription.status) {
    case 'active':
      return 'Active';
    case 'canceled':
      return 'Canceled';
    case 'past_due':
      return 'Payment Due';
    case 'unpaid':
      return 'Unpaid';
    case 'trialing':
      return 'Trial';
    default:
      return 'Unknown';
  }
}

export function getTrialDaysRemaining(trialEnd?: Date): number | null {
  if (!trialEnd) return null;
  const now = new Date();
  const diffMs = trialEnd.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
