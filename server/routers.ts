import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "../shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { userRouter } from "./routers/user";
import { messagesRouter } from "./routers/messages";
import { imagesRouter } from "./routers/images";
import { pointsRouter } from "./routers/points";
import { subscriptionsRouter } from "./routers/subscriptions";
import { aiRouter } from "./routers/ai";
import { challengesRouter } from "./routers/challenges";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Feature routers
  user: userRouter,
  messages: messagesRouter,
  images: imagesRouter,
  points: pointsRouter,
  subscriptions: subscriptionsRouter,
  ai: aiRouter,
  challenges: challengesRouter,
});

export type AppRouter = typeof appRouter;
