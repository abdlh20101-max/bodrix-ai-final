import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

/**
 * Billing Router (Legacy - Use tapBilling instead)
 * نظام الفواتير والاشتراكات (قديم - استخدم tapBilling بدلاً منه)
 * 
 * This router is kept for backward compatibility only.
 * All new payment functionality should use tapBilling router.
 */

const SUBSCRIPTION_PLANS = [
  {
    id: "free",
    name: "Free Plan",
    price: 0,
    currency: "SAR",
    features: ["5 AI requests per day", "Basic features", "Community support"],
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: 99,
    currency: "SAR",
    features: [
      "Unlimited AI requests",
      "Advanced features",
      "Priority support",
      "Custom integrations",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: 299,
    currency: "SAR",
    features: [
      "Unlimited everything",
      "Dedicated support",
      "Custom solutions",
      "SLA guarantee",
    ],
  },
];

export const billingRouter = router({
  /**
   * Get available subscription plans
   */
  getPlans: publicProcedure.query(async () => {
    return SUBSCRIPTION_PLANS;
  }),

  /**
   * Get plan details
   */
  getPlan: publicProcedure
    .input(z.object({ planId: z.string() }))
    .query(async ({ input }) => {
      const plan = SUBSCRIPTION_PLANS.find((p) => p.id === input.planId);
      if (!plan) {
        throw new Error("Plan not found");
      }
      return plan;
    }),

  /**
   * Create checkout session
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        planId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.user;
      if (!user) {
        throw new Error("User not authenticated");
      }

      try {
        // Redirect to /billing page for Tap Payments checkout
        return {
          success: true,
          url: `/billing?plan=${input.planId}`,
        };
      } catch (error) {
        console.error("[Billing] Error creating checkout session:", error);
        throw new Error("Failed to create checkout session");
      }
    }),

  /**
   * Get user subscription
   */
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Return default free plan
    return {
      planId: "free",
      status: "active",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
  }),

  /**
   * Cancel subscription
   */
  cancelSubscription: protectedProcedure
    .input(
      z.object({
        immediate: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.user;
      if (!user) {
        throw new Error("User not authenticated");
      }

      return { success: true };
    }),

  /**
   * Get billing history
   */
  getBillingHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = ctx.user;
      if (!user) {
        throw new Error("User not authenticated");
      }

      return [];
    }),

  /**
   * Get usage metrics
   */
  getUsageMetrics: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    if (!user) {
      throw new Error("User not authenticated");
    }

    return {
      currentUsage: 0,
      limit: 10,
      percentageUsed: 0,
    };
  }),

  /**
   * Update payment method
   */
  updatePaymentMethod: protectedProcedure
    .input(
      z.object({
        paymentMethodId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.user;
      if (!user) {
        throw new Error("User not authenticated");
      }

      return { success: true };
    }),

  /**
   * Get invoice
   */
  getInvoice: protectedProcedure
    .input(
      z.object({
        invoiceId: z.string(),
      })
    )
    .query(async ({ input }) => {
      // Return mock invoice
      return {
        id: input.invoiceId,
        amount: 99,
        currency: "SAR",
        date: new Date(),
        status: "paid",
        pdfUrl: null,
      };
    }),
});
