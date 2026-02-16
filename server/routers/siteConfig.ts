import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getAllSiteConfig, updateSiteConfig } from "../db";
import { ForbiddenError } from "@shared/_core/errors";

export const siteConfigRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    // Only admin can see all config? Or maybe public config is okay?
    // For now, let's allow fetching, but sensitive data should be handled carefully.
    // Assuming site config is for public settings like colors, titles, etc.
    const configs = await getAllSiteConfig();
    return configs.reduce((acc, curr) => {
      acc[curr.key] = {
        value: curr.value,
        type: curr.type,
      };
      return acc;
    }, {} as Record<string, { value: string; type: string }>);
  }),

  update: publicProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.string(),
        type: z.enum(["string", "number", "boolean", "json"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user || ctx.user.role !== "admin") {
        throw ForbiddenError("Only admins can update site configuration");
      }

      await updateSiteConfig(input.key, input.value, input.type);
      return { success: true };
    }),
});
