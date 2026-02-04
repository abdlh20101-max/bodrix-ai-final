import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDailyChallenges, getUserChallengeProgress, updateChallengeProgress } from "../db";

export const challengesRouter = router({
  // Get today's challenges
  getDaily: protectedProcedure
    .query(async ({ ctx }) => {
      const challenges = await getDailyChallenges();
      const userProgress = await getUserChallengeProgress(ctx.user.id);

      return challenges.map(challenge => {
        const progress = userProgress.find(p => p.challengeId === challenge.id);
        return {
          ...challenge,
          userProgress: progress || {
            currentCount: 0,
            isCompleted: 0,
            completedAt: null,
          },
        };
      });
    }),

  // Update challenge progress
  updateProgress: protectedProcedure
    .input(
      z.object({
        challengeId: z.number(),
        increment: z.number().default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const progress = await updateChallengeProgress(
        ctx.user.id,
        input.challengeId,
        input.increment
      );

      return {
        success: true,
        progress,
      };
    }),

  // Get user challenge progress
  getProgress: protectedProcedure
    .query(async ({ ctx }) => {
      return await getUserChallengeProgress(ctx.user.id);
    }),
});
