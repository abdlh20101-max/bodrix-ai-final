import { z } from "zod";
import { protectedProcedure, router, adminProcedure } from "../_core/trpc";
import {
  addSubscription,
  getUserSubscription,
  getUserSubscriptionHistory,
  getUserById,
  getDb,
} from "../db";
import { subscriptions, users, walletTransactions } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  premium_week: { name: "Premium Week", price: 999, currency: "USD", days: 7 },
  premium_month: { name: "Premium Month", price: 2999, currency: "USD", days: 30 },
  premium_3months: { name: "Premium 3 Months", price: 7999, currency: "USD", days: 90 },
  premium_year: { name: "Premium Year", price: 19999, currency: "USD", days: 365 },
  pro_week: { name: "Pro Week", price: 1999, currency: "USD", days: 7 },
  pro_month: { name: "Pro Month", price: 5999, currency: "USD", days: 30 },
  pro_3months: { name: "Pro 3 Months", price: 15999, currency: "USD", days: 90 },
  pro_year: { name: "Pro Year", price: 39999, currency: "USD", days: 365 },
} as const;

export const subscriptionsRouter = router({
  // Get available plans
  getPlans: protectedProcedure.query(async () => {
    return Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => ({
      id: key,
      ...plan,
    }));
  }),

  // Get current subscription
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await getUserSubscription(ctx.user.id);
    return subscription;
  }),

  // Get subscription history
  getHistory: protectedProcedure.query(async ({ ctx }) => {
    const history = await getUserSubscriptionHistory(ctx.user.id);
    return history;
  }),

  // Create subscription (after payment)
  create: protectedProcedure
    .input(
      z.object({
        planType: z.enum([
          "premium_week",
          "premium_month",
          "premium_3months",
          "premium_year",
          "pro_week",
          "pro_month",
          "pro_3months",
          "pro_year",
        ]),
        paymentMethod: z.enum([
          "apple_pay",
          "google_pay",
          "stripe",
          "paypal",
          "bank_transfer",
        ]),
        transactionId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const plan = SUBSCRIPTION_PLANS[input.planType];
      if (!plan) {
        throw new Error("Invalid plan");
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.days);

      const result = await addSubscription({
        userId: ctx.user.id,
        planType: input.planType,
        price: plan.price,
        currency: plan.currency,
        startDate,
        endDate,
        paymentMethod: input.paymentMethod,
        transactionId: input.transactionId,
        status: "active",
      });

      return {
        success: true,
        subscriptionId: result[0]?.insertId,
        plan: {
          name: plan.name,
          startDate,
          endDate,
          daysRemaining: plan.days,
        },
      };
    }),

  // Admin: Create subscription for user
  adminCreate: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        planType: z.enum([
          "premium_week",
          "premium_month",
          "premium_3months",
          "premium_year",
          "pro_week",
          "pro_month",
          "pro_3months",
          "pro_year",
        ]),
        transactionId: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const plan = SUBSCRIPTION_PLANS[input.planType];
      if (!plan) {
        throw new Error("Invalid plan");
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.days);

      const result = await addSubscription({
        userId: input.userId,
        planType: input.planType,
        price: plan.price,
        currency: plan.currency,
        startDate,
        endDate,
        paymentMethod: "admin",
        transactionId: input.transactionId || "admin-created",
        status: "active",
      });

      return {
        success: true,
        subscriptionId: result[0]?.insertId,
      };
    }),
});

// Auto-upgrade to Premium after $100 spent
export async function checkAndUpgradeToPremium(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await getUserById(userId);
  if (!user || user.accountType !== "free") return null;

  // Calculate total spent
  const transactions = await db
    .select()
    .from(walletTransactions)
    .where(
      and(
        eq(walletTransactions.userId, userId),
        eq(walletTransactions.type, "purchase")
      )
    );

  const totalSpent = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

  // Auto-upgrade if spent >= $100
  if (totalSpent >= 100) {
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    await db.insert(subscriptions).values({
      userId,
      planType: "premium_year",
      price: 0,
      currency: "USD",
      startDate: new Date(),
      endDate,
      status: "active",
      paymentMethod: "auto_upgrade",
    });

    await db
      .update(users)
      .set({
        accountType: "premium",
        dailyMessagesLimit: 999999,
        dailyImagesLimit: 999999,
      })
      .where(eq(users.id, userId));

    return {
      success: true,
      message: "تم ترقيتك للـ Premium تلقائياً!",
    };
  }

  return null;
}
