import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import * as db from "../db";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Pricing configuration
const PRICING = {
  free: { name: "Free", price: 0, features: ["Basic workouts", "AI Coach (limited)"] },
  pro: { name: "Pro", price: 999, features: ["All workouts", "Unlimited AI Coach", "Progress tracking", "Custom programs"] },
  elite: { name: "Elite", price: 1999, features: ["Everything in Pro", "1-on-1 coaching", "Nutrition plans", "Priority support"] },
};

export const paymentRouter = router({
  // Get current subscription status
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await db.getUserSubscription(ctx.user.id);
    return subscription || { plan: "free", status: "active" };
  }),

  // Create checkout session
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["pro", "elite"]),
        returnUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get or create Stripe customer
        let stripeCustomerId = await db.getStripeCustomerId(ctx.user.id);

        if (!stripeCustomerId) {
          const customer = await stripe.customers.create({
            email: ctx.user.email || undefined,
            metadata: {
              userId: ctx.user.id.toString(),
            },
          });
          stripeCustomerId = customer.id;
          await db.saveStripeCustomerId(ctx.user.id, stripeCustomerId);
        }

        // Price IDs from Stripe (you need to set these in your Stripe dashboard)
        const priceIds: Record<string, string> = {
          pro: process.env.STRIPE_PRICE_ID_PRO || "price_1TqWJC",
          elite: process.env.STRIPE_PRICE_ID_ELITE || "price_1TqWJC",
        };

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          customer: stripeCustomerId,
          mode: "subscription",
          payment_method_types: ["card"],
          line_items: [
            {
              price: priceIds[input.plan],
              quantity: 1,
            },
          ],
          success_url: `${input.returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: input.returnUrl,
          metadata: {
            userId: ctx.user.id.toString(),
            plan: input.plan,
          },
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error) {
        console.error("Checkout session error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
    }),

  // Get pricing information
  getPricing: publicProcedure.query(() => {
    return Object.entries(PRICING).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  }),

  // Verify checkout session (called after successful payment)
  verifyCheckoutSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId, {
          expand: ["subscription"],
        });

        if (session.payment_status !== "paid") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Payment not completed",
          });
        }

        const subscription = session.subscription as Stripe.Subscription;
        const plan = session.metadata?.plan || "pro";

        // Save subscription to database
        await db.saveSubscription({
          userId: ctx.user.id,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          plan: plan as "pro" | "elite",
          status: subscription.status as "active" | "cancelled" | "past_due" | "incomplete",
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        });

        return { success: true, plan };
      } catch (error) {
        console.error("Session verification error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to verify session",
        });
      }
    }),

  // Cancel subscription
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const subscription = await db.getUserSubscription(ctx.user.id);

      if (!subscription || !subscription.stripeSubscriptionId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No active subscription",
        });
      }

      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

      // Update database
      await db.cancelSubscription(ctx.user.id);

      return { success: true };
    } catch (error) {
      console.error("Cancellation error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to cancel subscription",
      });
    }
  }),
});
