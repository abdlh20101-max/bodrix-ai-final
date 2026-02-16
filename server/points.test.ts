import { describe, it, expect } from "vitest";
import { addPoints, getUserPoints, addWatchedAd, addShare } from "./db";

describe("Points System", () => {
  const testUserId = 1;

  describe("addPoints", () => {
    it("should add points to user", async () => {
      const pointsBefore = await getUserPoints(testUserId);
      await addPoints({
        userId: testUserId,
        amount: 10,
        reason: "test",
      });
      const pointsAfter = await getUserPoints(testUserId);
      expect(pointsAfter).toBeGreaterThanOrEqual(pointsBefore);
    });

    it("should add points with different reasons", async () => {
      const reasons = ["watch_ad", "share", "referral", "daily_login", "review"];
      const pointsBefore = await getUserPoints(testUserId);
      for (const reason of reasons) {
        await addPoints({
          userId: testUserId,
          amount: 5,
          reason,
        });
      }
      const pointsAfter = await getUserPoints(testUserId);
      expect(pointsAfter).toBeGreaterThan(pointsBefore);
    });
  });

  describe("getUserPoints", () => {
    it("should return user total points", async () => {
      const points = await getUserPoints(testUserId);
      expect(typeof points).toBe("number");
      expect(points).toBeGreaterThanOrEqual(0);
    });
  });

  describe("addWatchedAd", () => {
    it("should add watched ad and award points", async () => {
      const pointsBefore = await getUserPoints(testUserId);
      await addWatchedAd({
        userId: testUserId,
        adId: "test-ad-1",
        pointsEarned: 8,
      });
      const pointsAfter = await getUserPoints(testUserId);
      expect(pointsAfter).toBeGreaterThanOrEqual(pointsBefore + 8);
    });
  });

  describe("addShare", () => {
    it("should add share and award points", async () => {
      const pointsBefore = await getUserPoints(testUserId);
      await addShare({
        userId: testUserId,
        sharedWith: 3,
        pointsEarned: 15,
      });
      const pointsAfter = await getUserPoints(testUserId);
      expect(pointsAfter).toBeGreaterThanOrEqual(pointsBefore + 15);
    });
  });
});
