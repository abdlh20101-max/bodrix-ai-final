import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { tapPaymentsManager } from "../tapPayments";

/**
 * Tap Payments Billing Router
 * موجه الفواتير والدفع عبر Tap Payments
 */

export const tapBillingRouter = router({
  /**
   * Create a payment charge
   */
  createCharge: protectedProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        currency: z.string().default("SAR"),
        description: z.string(),
        planId: z.string(),
        redirectUrl: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const charge = await tapPaymentsManager.createCharge({
          amount: input.amount,
          currency: input.currency,
          description: input.description,
          customer: {
            first_name: ctx.user?.name?.split(" ")[0] ?? "Customer",
            last_name: ctx.user?.name?.split(" ")[1] ?? undefined,
            email: ctx.user?.email ?? undefined,
          },
          metadata: {
            userId: ctx.user?.id?.toString(),
            planId: input.planId,
          },
          redirect: {
            url: input.redirectUrl,
          },
        });

        return {
          success: true,
          chargeId: charge.id,
          status: charge.status,
          amount: charge.amount,
          currency: charge.currency,
        };
      } catch (error) {
        console.error("[Tap Billing] Error creating charge:", error);
        throw new Error("Failed to create payment charge");
      }
    }),

  /**
   * Get charge status
   */
  getChargeStatus: protectedProcedure
    .input(z.object({ chargeId: z.string() }))
    .query(async ({ input }) => {
      try {
        const charge = await tapPaymentsManager.getCharge(input.chargeId);

        return {
          chargeId: charge.id,
          status: charge.status,
          amount: charge.amount,
          currency: charge.currency,
          description: charge.description,
          createdAt: charge.created_at,
        };
      } catch (error) {
        console.error("[Tap Billing] Error getting charge:", error);
        throw new Error("Failed to get charge status");
      }
    }),

  /**
   * Refund a charge
   */
  refundCharge: protectedProcedure
    .input(
      z.object({
        chargeId: z.string(),
        amount: z.number().positive().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const charge = await tapPaymentsManager.refundCharge(
          input.chargeId,
          input.amount
        );

        return {
          success: true,
          chargeId: charge.id,
          status: charge.status,
          refundedAmount: input.amount || charge.amount,
        };
      } catch (error) {
        console.error("[Tap Billing] Error refunding charge:", error);
        throw new Error("Failed to refund charge");
      }
    }),

  /**
   * Get public key for frontend
   */
  getPublicKey: protectedProcedure.query(() => {
    return {
      publicKey: tapPaymentsManager.getPublicKey(),
    };
  }),

  /**
   * Get subscription plans
   */
  getPlans: protectedProcedure.query(() => {
    return {
      plans: [
        {
          id: "free",
          name: "Free Plan",
          price: 0,
          currency: "SAR",
          features: [
            "5 AI requests per day",
            "Basic features",
            "Community support",
          ],
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
      ],
    };
  }),
});
