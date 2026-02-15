import { z } from "zod";
import { protectedProcedure, router, adminProcedure } from "../_core/trpc";
import {
  addPoints,
  getUserPoints,
  addWatchedAd,
  addShare,
  createReferral,
  completeReferral,
  hasUserWatchedAd,
  getReferralByCode,
} from "../db";
import { nanoid } from "nanoid";

export const pointsRouter = router({
  // Get current points
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const points = await getUserPoints(ctx.user.id);
    return { points };
  }),

  // Watch an advertisement
  watchAd: protectedProcedure
    .input(z.object({ adId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // Check if user already watched this ad today
      const hasWatched = await hasUserWatchedAd(ctx.user.id, input.adId);
      if (hasWatched) {
        throw new Error("You already watched this ad today");
      }

      // Add watched ad record
      await addWatchedAd({
        userId: ctx.user.id,
        adId: input.adId,
        pointsEarned: 8,
      });

      const newBalance = await getUserPoints(ctx.user.id);
      return {
        success: true,
        pointsEarned: 8,
        newBalance,
      };
    }),

  // Share with friends
  share: protectedProcedure
    .input(z.object({ sharedWith: z.number().default(1) }))
    .mutation(async ({ ctx, input }) => {
      const pointsEarned = 5 * input.sharedWith;

      await addShare({
        userId: ctx.user.id,
        sharedWith: input.sharedWith,
        pointsEarned,
      });

      const newBalance = await getUserPoints(ctx.user.id);
      return {
        success: true,
        pointsEarned,
        newBalance,
      };
    }),

  // Generate referral code
  generateReferralCode: protectedProcedure.mutation(async ({ ctx }) => {
    const referralCode = nanoid(10);

    await createReferral({
      referrerId: ctx.user.id,
      referralCode,
      status: "pending",
    });

    return {
      referralCode,
      referralUrl: `${process.env.VITE_APP_ID}?ref=${referralCode}`,
    };
  }),

  // Use referral code
  useReferralCode: protectedProcedure
    .input(z.object({ referralCode: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const referral = await getReferralByCode(input.referralCode);
      if (!referral) {
        throw new Error("Invalid referral code");
      }

      if (referral.referrerId === ctx.user.id) {
        throw new Error("Cannot use your own referral code");
      }

      // Complete the referral
      const pointsEarned = 20;
      await completeReferral(referral.id, pointsEarned);

      const newBalance = await getUserPoints(ctx.user.id);
      return {
        success: true,
        pointsEarned,
        newBalance,
      };
    }),

  // Admin: Add points to user (for testing or rewards)
  adminAddPoints: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        amount: z.number().positive(),
        reason: z.string().min(1).max(100),
      })
    )
    .mutation(async ({ input }) => {
      await addPoints({
        userId: input.userId,
        amount: input.amount,
        reason: input.reason,
      });

      const newBalance = await getUserPoints(input.userId);
      return {
        success: true,
        newBalance,
      };
    }),
});
