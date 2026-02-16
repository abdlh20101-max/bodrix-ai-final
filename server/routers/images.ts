import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  addImage,
  getUserImages,
  checkDailyLimit,
  incrementDailyUsage,
} from "../db";

export const imagesRouter = router({
  // Upload an image
  upload: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
        fileName: z.string().min(1).max(255),
        fileSize: z.number().positive(),
        mimeType: z.string().min(1).max(50),
        messageId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check daily limit
      const limit = await checkDailyLimit(ctx.user.id, "images");
      if (limit.remaining <= 0) {
        throw new Error("Daily image limit reached");
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (input.fileSize > maxSize) {
        throw new Error("File size exceeds 10MB limit");
      }

      // Add image to database
      const result = await addImage({
        userId: ctx.user.id,
        url: input.url,
        fileName: input.fileName,
        fileSize: input.fileSize,
        mimeType: input.mimeType,
        messageId: input.messageId,
      });

      // Increment daily usage
      await incrementDailyUsage(ctx.user.id, "images", 1);

      return {
        success: true,
        imageId: result[0]?.insertId,
        remainingImages: limit.remaining - 1,
      };
    }),

  // Get user images
  getImages: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      const images = await getUserImages(ctx.user.id, input.limit);
      return images;
    }),

  // Get remaining images for today
  getRemainingToday: protectedProcedure.query(async ({ ctx }) => {
    const limit = await checkDailyLimit(ctx.user.id, "images");
    return {
      limit: limit.limit,
      used: limit.used,
      remaining: limit.remaining,
    };
  }),
});
