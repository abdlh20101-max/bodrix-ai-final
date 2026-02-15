import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(isAuthenticated = true): { ctx: TrpcContext; clearedCookies: Array<{ name: string; options: Record<string, unknown> }> } {
  const clearedCookies: Array<{ name: string; options: Record<string, unknown> }> = [];

  const user: AuthenticatedUser | null = isAuthenticated
    ? {
        id: 1,
        openId: "test-user-123",
        email: "test@example.com",
        name: "Test User",
        loginMethod: "google",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : null;

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

describe("Authentication Integration Tests", () => {
  describe("auth.me", () => {
    it("should return authenticated user info", async () => {
      const { ctx } = createAuthContext(true);
      const caller = appRouter.createCaller(ctx);

      const user = await caller.auth.me();

      expect(user).toBeDefined();
      expect(user?.id).toBe(1);
      expect(user?.email).toBe("test@example.com");
      expect(user?.name).toBe("Test User");
      expect(user?.role).toBe("user");
    });

    it("should return null for unauthenticated user", async () => {
      const { ctx } = createAuthContext(false);
      const caller = appRouter.createCaller(ctx);

      const user = await caller.auth.me();

      expect(user).toBeNull();
    });
  });

  describe("auth.logout", () => {
    it("should clear session cookie on logout", async () => {
      const { ctx, clearedCookies } = createAuthContext(true);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.logout();

      expect(result).toEqual({ success: true });
      expect(clearedCookies).toHaveLength(1);
      expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
      expect(clearedCookies[0]?.options.maxAge).toBe(-1);
    });

    it("should work even for unauthenticated users", async () => {
      const { ctx, clearedCookies } = createAuthContext(false);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.auth.logout();

      expect(result).toEqual({ success: true });
      expect(clearedCookies).toHaveLength(1);
    });
  });

  describe("OAuth Configuration", () => {
    it("should have valid Google OAuth credentials", () => {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      expect(clientId).toBeDefined();
      expect(clientSecret).toBeDefined();
      expect(clientId).toMatch(/\.apps\.googleusercontent\.com$/);
      expect(clientSecret?.length).toBeGreaterThan(0);
    });

    it("should have Manus OAuth configured", () => {
      const oauthUrl = process.env.OAUTH_SERVER_URL;
      const appId = process.env.VITE_APP_ID;

      expect(oauthUrl).toBeDefined();
      expect(appId).toBeDefined();
    });
  });
});
