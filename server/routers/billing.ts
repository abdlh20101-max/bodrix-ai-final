import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { stripeManager, SUBSCRIPTION_PLANS } from "../stripe";

/**
 * Billing Router
 * نظام الفواتير والاشتراكات
 */

export const billingRouter = router({
  /**
   * Get available subscription plans
   */
  getPlans: publicProcedure.query(async () => {
    return stripeManager.getAllPlans();
  }),

  /**
   * Get plan details
   */
  getPlan: publicProcedure
    .input(z.object({ planId: z.string() }))
    .query(async ({ input }) => {
      return stripeManager.getPlanDetails(input.planId);
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
        const checkoutUrl = await stripeManager.createCheckoutSession(
          user.id.toString(),
          input.planId,
          user.email || ""
        );

        return {
          success: true,
          url: checkoutUrl,
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

    // TODO: Get from database
    // const subscription = await db.query.subscriptions.findFirst({
    //   where: eq(subscriptions.userId, user.id)
    // });

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

      // TODO: Get subscription from database and cancel
      // const subscription = await db.query.subscriptions.findFirst({
      //   where: eq(subscriptions.userId, user.id)
      // });
      //
      // if (!subscription) {
      //   throw new Error("No active subscription");
      // }
      //
      // await stripeManager.cancelSubscription(
      //   subscription.stripeSubscriptionId,
      //   input.immediate
      // );

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

      // TODO: Get invoices from Stripe
      // const customerId = await getStripeCustomerId(user.id);
      // if (!customerId) return [];
      //
      // const invoices = await stripeManager.listInvoices(customerId, input.limit);
      // return invoices.map(invoice => ({
      //   id: invoice.id,
      //   amount: invoice.amount_paid,
      //   currency: invoice.currency,
      //   date: new Date(invoice.created * 1000),
      //   status: invoice.status,
      //   pdfUrl: invoice.invoice_pdf
      // }));

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

    // TODO: Get from database
    // const subscription = await db.query.subscriptions.findFirst({
    //   where: eq(subscriptions.userId, user.id)
    // });
    //
    // if (!subscription) {
    //   return {
    //     currentUsage: 0,
    //     limit: 10,
    //     percentageUsed: 0
    //   };
    // }
    //
    // const plan = stripeManager.getPlanDetails(subscription.planId);
    // const usage = await stripeManager.getUsageMetrics(subscription.stripeCustomerId);

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

      // TODO: Update payment method in Stripe
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
      try {
        const invoice = await stripeManager.getInvoice(input.invoiceId);
        return {
          id: invoice.id,
          amount: invoice.amount_paid,
          currency: invoice.currency,
          date: new Date(invoice.created * 1000),
          status: invoice.status,
          pdfUrl: invoice.invoice_pdf,
        };
      } catch (error) {
        console.error("[Billing] Error getting invoice:", error);
        throw new Error("Failed to get invoice");
      }
    }),
});
