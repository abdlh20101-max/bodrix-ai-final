import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  addMessage,
  getUserMessages,
  checkDailyLimit,
  incrementDailyUsage,
} from "../db";

export const messagesRouter = router({
  // Send a message
  send: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1).max(5000),
        language: z.enum(["ar", "en"]).default("ar"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check daily limit
      const limit = await checkDailyLimit(ctx.user.id, "messages");
      if (limit.remaining <= 0) {
        throw new Error("Daily message limit reached");
      }

      // Add message to database
      const result = await addMessage({
        userId: ctx.user.id,
        content: input.content,
        role: "user",
        language: input.language,
      });

      // Increment daily usage
      await incrementDailyUsage(ctx.user.id, "messages", 1);

      return {
        success: true,
        messageId: result[0]?.insertId,
        remainingMessages: limit.remaining - 1,
      };
    }),

  // Get user messages
  getMessages: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      const messages = await getUserMessages(ctx.user.id, input.limit);
      return messages;
    }),

  // Get remaining messages for today
  getRemainingToday: protectedProcedure.query(async ({ ctx }) => {
    const limit = await checkDailyLimit(ctx.user.id, "messages");
    return {
      limit: limit.limit,
      used: limit.used,
      remaining: limit.remaining,
    };
  }),
});
