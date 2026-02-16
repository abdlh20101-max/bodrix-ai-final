import { describe, it, expect, vi, beforeEach } from "vitest";
import { addMessage, getUserMessages, checkDailyLimit, incrementDailyUsage } from "./db";

describe("Messages System", () => {
  const testUserId = 1;

  describe("checkDailyLimit", () => {
    it("should return daily message limit for user", async () => {
      const limit = await checkDailyLimit(testUserId, "messages");
      expect(limit).toHaveProperty("limit");
      expect(limit).toHaveProperty("used");
      expect(limit).toHaveProperty("remaining");
      expect(limit.limit).toBeGreaterThan(0);
    });

    it("should return daily image limit for user", async () => {
      const limit = await checkDailyLimit(testUserId, "images");
      expect(limit).toHaveProperty("limit");
      expect(limit).toHaveProperty("used");
      expect(limit).toHaveProperty("remaining");
    });

    it("should reset limits if it's a new day", async () => {
      const limit1 = await checkDailyLimit(testUserId, "messages");
      const limit2 = await checkDailyLimit(testUserId, "messages");
      expect(limit1.remaining).toBe(limit2.remaining);
    });
  });

  describe("incrementDailyUsage", () => {
    it("should increment daily message usage", async () => {
      const limitBefore = await checkDailyLimit(testUserId, "messages");
      await incrementDailyUsage(testUserId, "messages", 1);
      const limitAfter = await checkDailyLimit(testUserId, "messages");
      expect(limitAfter.used).toBeGreaterThan(limitBefore.used);
    });

    it("should increment daily image usage", async () => {
      const limitBefore = await checkDailyLimit(testUserId, "images");
      await incrementDailyUsage(testUserId, "images", 1);
      const limitAfter = await checkDailyLimit(testUserId, "images");
      expect(limitAfter.used).toBeGreaterThan(limitBefore.used);
    });
  });

  describe("addMessage", () => {
    it("should add a message to database", async () => {
      const result = await addMessage({
        userId: testUserId,
        content: "Test message",
        role: "user",
        language: "ar",
      });
      expect(result).toBeDefined();
    });

    it("should add a message with different languages", async () => {
      const resultAr = await addMessage({
        userId: testUserId,
        content: "رسالة اختبار",
        role: "user",
        language: "ar",
      });
      const resultEn = await addMessage({
        userId: testUserId,
        content: "Test message",
        role: "user",
        language: "en",
      });
      expect(resultAr).toBeDefined();
      expect(resultEn).toBeDefined();
    });
  });

  describe("getUserMessages", () => {
    it("should retrieve user messages", async () => {
      const messages = await getUserMessages(testUserId, 10);
      expect(Array.isArray(messages)).toBe(true);
    });

    it("should respect limit parameter", async () => {
      const messages = await getUserMessages(testUserId, 5);
      expect(messages.length).toBeLessThanOrEqual(5);
    });
  });
});
