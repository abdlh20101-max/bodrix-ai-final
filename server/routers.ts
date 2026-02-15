import { z } from "zod";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import {
  createSessionToken,
  hashPassword,
  validatePassword,
  validatePhone,
  validateUsername,
  verifyPassword,
} from "./_core/authLocal";
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
import { aiChatRouter } from "./routers/aiChat";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    loginUsername: publicProcedure
      .input(z.object({ username: z.string().min(1), password: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const v = validateUsername(input.username);
        if (!v.ok) throw new Error(v.error);
        const vp = validatePassword(input.password);
        if (!vp.ok) throw new Error(vp.error);
        const user = await db.getUserByUsername(input.username);
        if (!user || !user.passwordHash) throw new Error("اسم المستخدم أو كلمة السر غير صحيحة");
        const ok = await verifyPassword(input.password, user.passwordHash);
        if (!ok) throw new Error("اسم المستخدم أو كلمة السر غير صحيحة");
        const token = await createSessionToken({ userId: user.id, username: user.username ?? undefined });
        const opts = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, { ...opts, maxAge: 365 * 24 * 60 * 60 * 1000 });
        return { success: true, user: { id: user.id, name: user.name, role: user.role } };
      }),
    loginPhone: publicProcedure
      .input(z.object({ phone: z.string().min(1), password: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const v = validatePhone(input.phone);
        if (!v.ok) throw new Error(v.error);
        const vp = validatePassword(input.password);
        if (!vp.ok) throw new Error(vp.error);
        const user = await db.getUserByPhone(input.phone);
        if (!user || !user.passwordHash) throw new Error("رقم الجوال أو كلمة السر غير صحيحة");
        const ok = await verifyPassword(input.password, user.passwordHash);
        if (!ok) throw new Error("رقم الجوال أو كلمة السر غير صحيحة");
        const token = await createSessionToken({ userId: user.id, username: user.username ?? undefined });
        const opts = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, { ...opts, maxAge: 365 * 24 * 60 * 60 * 1000 });
        return { success: true, user: { id: user.id, name: user.name, role: user.role } };
      }),
    loginGuest: publicProcedure.mutation(async ({ ctx }) => {
      const guestId = `guest_${nanoid(12)}`;
      const openId = `local:${guestId}`;
      let user = await db.getUserByOpenId(openId);
      if (!user) {
        user = await db.createUser({
          openId,
          username: guestId,
          name: "ضيف",
          loginMethod: "guest",
          role: "user",
        });
      }
      if (!user) throw new Error("فشل إنشاء حساب الضيف");
      const token = await createSessionToken({ userId: user.id, username: user.username ?? undefined });
      const opts = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, { ...opts, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days for guest
      return { success: true, user: { id: user.id, name: user.name, role: user.role } };
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
  aiChat: aiChatRouter,
});

export type AppRouter = typeof appRouter;
