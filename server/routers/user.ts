import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getUserById,
  checkDailyLimit,
  getUserPoints,
  getUserPointsHistory,
  getUserSubscription,
  getUserReferrals,
} from "../db";

export const userRouter = router({
  // Get current user profile
  profile: protectedProcedure.query(async ({ ctx }) => {
    const user = await getUserById(ctx.user.id);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      accountType: user.accountType,
      role: user.role,
      totalPoints: user.totalPoints,
      dailyMessagesLimit: user.dailyMessagesLimit,
      dailyImagesLimit: user.dailyImagesLimit,
      messagesUsedToday: user.messagesUsedToday,
      imagesUsedToday: user.imagesUsedToday,
      createdAt: user.createdAt,
    };
  }),

  // Check daily message limit
  checkMessageLimit: protectedProcedure.query(async ({ ctx }) => {
    const limit = await checkDailyLimit(ctx.user.id, "messages");
    return limit;
  }),

  // Check daily image limit
  checkImageLimit: protectedProcedure.query(async ({ ctx }) => {
    const limit = await checkDailyLimit(ctx.user.id, "images");
    return limit;
  }),

  // Get user points
  getPoints: protectedProcedure.query(async ({ ctx }) => {
    const points = await getUserPoints(ctx.user.id);
    return { points };
  }),

  // Get points history
  getPointsHistory: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      const history = await getUserPointsHistory(ctx.user.id, input.limit);
      return history;
    }),

  // Get current subscription
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await getUserSubscription(ctx.user.id);
    return subscription;
  }),

  // Get referrals
  getReferrals: protectedProcedure.query(async ({ ctx }) => {
    const referrals = await getUserReferrals(ctx.user.id);
    return referrals;
  }),

  // Update user language preference
  updateLanguage: protectedProcedure
    .input(z.object({ language: z.enum(["ar", "en"]) }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Add language preference to user table and update here
      return { success: true, language: input.language };
    }),
});
