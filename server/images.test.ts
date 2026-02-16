import { describe, it, expect } from "vitest";
import { addImage, getUserImages, checkDailyLimit, incrementDailyUsage } from "./db";

describe("Images System", () => {
  const testUserId = 1;

  describe("addImage", () => {
    it("should add image to database", async () => {
      const result = await addImage({
        userId: testUserId,
        url: "https://example.com/image.jpg",
        fileName: "test-image.jpg",
        fileSize: 1024000,
        mimeType: "image/jpeg",
      });
      expect(result).toBeDefined();
    });

    it("should add image with message reference", async () => {
      const result = await addImage({
        userId: testUserId,
        url: "https://example.com/image2.jpg",
        fileName: "test-image2.jpg",
        fileSize: 2048000,
        mimeType: "image/jpeg",
        messageId: 1,
      });
      expect(result).toBeDefined();
    });
  });

  describe("getUserImages", () => {
    it("should retrieve user images", async () => {
      const images = await getUserImages(testUserId, 10);
      expect(Array.isArray(images)).toBe(true);
    });

    it("should respect limit parameter", async () => {
      const images = await getUserImages(testUserId, 5);
      expect(images.length).toBeLessThanOrEqual(5);
    });
  });

  describe("Image daily limits", () => {
    it("should track daily image usage", async () => {
      const limitBefore = await checkDailyLimit(testUserId, "images");
      await incrementDailyUsage(testUserId, "images", 1);
      const limitAfter = await checkDailyLimit(testUserId, "images");
      expect(limitAfter.used).toBeGreaterThanOrEqual(limitBefore.used);
    });

    it("should not exceed daily image limit", async () => {
      const limit = await checkDailyLimit(testUserId, "images");
      expect(limit.remaining).toBeGreaterThanOrEqual(0);
      expect(limit.used).toBeLessThanOrEqual(limit.limit);
    });
  });
});
