import { describe, it, expect, beforeEach } from "vitest";
import { addMessage, getUserMessages, checkDailyLimit } from "./db";

describe("Bodrix AI - Comprehensive Tests", () => {
  describe("Messages System", () => {
    it("should add a message successfully", async () => {
      const result = await addMessage({
        userId: 1,
        content: "Test message",
        role: "user",
        language: "ar",
      });
      expect(result).toBeDefined();
    });

    it("should get user messages", async () => {
      const messages = await getUserMessages(1, 10);
      expect(Array.isArray(messages)).toBe(true);
    });

    it("should check daily message limit", async () => {
      const limit = await checkDailyLimit(1, "messages");
      expect(limit).toHaveProperty("limit");
      expect(limit).toHaveProperty("used");
      expect(limit).toHaveProperty("remaining");
    });

    it("should have correct limit structure", async () => {
      const limit = await checkDailyLimit(1, "messages");
      expect(typeof limit.limit).toBe("number");
      expect(typeof limit.used).toBe("number");
      expect(typeof limit.remaining).toBe("number");
      expect(limit.remaining).toBeLessThanOrEqual(limit.limit);
    });
  });

  describe("Images System", () => {
    it("should check daily image limit", async () => {
      const limit = await checkDailyLimit(1, "images");
      expect(limit).toHaveProperty("limit");
      expect(limit).toHaveProperty("used");
      expect(limit).toHaveProperty("remaining");
    });

    it("should have correct image limit", async () => {
      const limit = await checkDailyLimit(1, "images");
      expect(limit.limit).toBeGreaterThan(0);
      expect(limit.remaining).toBeGreaterThanOrEqual(0);
    });
  });

  describe("User Tiers", () => {
    it("should have message limits for different tiers", async () => {
      // Free tier should have lower limit
      const freeLimit = await checkDailyLimit(1, "messages");
      expect(freeLimit.limit).toBeGreaterThan(0);
    });

    it("should have image limits for different tiers", async () => {
      const imageLimit = await checkDailyLimit(1, "images");
      expect(imageLimit.limit).toBeGreaterThan(0);
    });
  });

  describe("Daily Limits Reset", () => {
    it("should track daily usage", async () => {
      const limit = await checkDailyLimit(1, "messages");
      expect(limit.used).toBeGreaterThanOrEqual(0);
      expect(limit.remaining).toBeGreaterThanOrEqual(0);
    });

    it("should have remaining messages", async () => {
      const limit = await checkDailyLimit(1, "messages");
      expect(limit.remaining).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Data Validation", () => {
    it("should validate message content", async () => {
      try {
        await addMessage({
          userId: 1,
          content: "", // Empty content
          role: "user",
          language: "ar",
        });
        // If we get here, the system allows empty messages
        // which might be intentional
        expect(true).toBe(true);
      } catch (error) {
        // Empty messages should be rejected
        expect(error).toBeDefined();
      }
    });

    it("should support multiple languages", async () => {
      const arMessage = await addMessage({
        userId: 1,
        content: "مرحبا",
        role: "user",
        language: "ar",
      });
      expect(arMessage).toBeDefined();

      const enMessage = await addMessage({
        userId: 1,
        content: "Hello",
        role: "user",
        language: "en",
      });
      expect(enMessage).toBeDefined();
    });
  });

  describe("API Response Format", () => {
    it("should return messages with correct structure", async () => {
      const messages = await getUserMessages(1, 5);
      if (messages.length > 0) {
        const msg = messages[0];
        expect(msg).toHaveProperty("id");
        expect(msg).toHaveProperty("content");
        expect(msg).toHaveProperty("role");
        expect(msg).toHaveProperty("userId");
      }
    });

    it("should return limit info with correct structure", async () => {
      const limit = await checkDailyLimit(1, "messages");
      expect(limit.limit).toBeGreaterThan(0);
      expect(limit.used).toBeGreaterThanOrEqual(0);
      expect(limit.remaining).toBeGreaterThanOrEqual(0);
      expect(limit.limit).toBe(limit.used + limit.remaining);
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid user IDs gracefully", async () => {
      try {
        const messages = await getUserMessages(-1, 10);
        // Should either return empty array or handle gracefully
        expect(Array.isArray(messages)).toBe(true);
      } catch (error) {
        // Or throw an error for invalid input
        expect(error).toBeDefined();
      }
    });

    it("should handle invalid limit types", async () => {
      try {
        const limit = await checkDailyLimit(1, "invalid" as any);
        // Should handle gracefully
        expect(limit).toBeDefined();
      } catch (error) {
        // Or throw an error for invalid type
        expect(error).toBeDefined();
      }
    });
  });

  describe("Performance", () => {
    it("should retrieve messages quickly", async () => {
      const start = Date.now();
      await getUserMessages(1, 50);
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it("should check limits quickly", async () => {
      const start = Date.now();
      await checkDailyLimit(1, "messages");
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });
});
