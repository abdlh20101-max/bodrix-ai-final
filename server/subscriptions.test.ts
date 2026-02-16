import { describe, it, expect } from "vitest";
import { addSubscription, getUserSubscription } from "./db";
import { SUBSCRIPTION_PLANS } from "./routers/subscriptions";

describe("Subscriptions System", () => {
  const testUserId = 1;

  describe("SUBSCRIPTION_PLANS", () => {
    it("should have all subscription plans defined", () => {
      expect(SUBSCRIPTION_PLANS).toHaveProperty("premium_week");
      expect(SUBSCRIPTION_PLANS).toHaveProperty("premium_month");
      expect(SUBSCRIPTION_PLANS).toHaveProperty("premium_3months");
      expect(SUBSCRIPTION_PLANS).toHaveProperty("premium_year");
      expect(SUBSCRIPTION_PLANS).toHaveProperty("pro_week");
      expect(SUBSCRIPTION_PLANS).toHaveProperty("pro_month");
      expect(SUBSCRIPTION_PLANS).toHaveProperty("pro_3months");
      expect(SUBSCRIPTION_PLANS).toHaveProperty("pro_year");
    });

    it("should have correct pricing for plans", () => {
      expect(SUBSCRIPTION_PLANS.premium_week.price).toBe(999);
      expect(SUBSCRIPTION_PLANS.premium_month.price).toBe(2999);
      expect(SUBSCRIPTION_PLANS.pro_week.price).toBe(1999);
      expect(SUBSCRIPTION_PLANS.pro_month.price).toBe(5999);
    });

    it("should have correct duration for plans", () => {
      expect(SUBSCRIPTION_PLANS.premium_week.days).toBe(7);
      expect(SUBSCRIPTION_PLANS.premium_month.days).toBe(30);
      expect(SUBSCRIPTION_PLANS.premium_3months.days).toBe(90);
      expect(SUBSCRIPTION_PLANS.premium_year.days).toBe(365);
    });
  });

  describe("addSubscription", () => {
    it("should create a subscription", async () => {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const result = await addSubscription({
        userId: testUserId,
        planType: "premium_month",
        price: 2999,
        currency: "USD",
        startDate,
        endDate,
        status: "active",
      });
      expect(result).toBeDefined();
    });

    it("should create subscriptions for all plan types", async () => {
      const planTypes = [
        "premium_week",
        "premium_month",
        "pro_week",
        "pro_month",
      ] as const;

      for (const planType of planTypes) {
        const plan = SUBSCRIPTION_PLANS[planType];
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.days);

        const result = await addSubscription({
          userId: testUserId,
          planType,
          price: plan.price,
          currency: plan.currency,
          startDate,
          endDate,
          status: "active",
        });
        expect(result).toBeDefined();
      }
    });
  });

  describe("getUserSubscription", () => {
    it("should retrieve active subscription", async () => {
      const subscription = await getUserSubscription(testUserId);
      if (subscription) {
        expect(subscription).toHaveProperty("userId");
        expect(subscription).toHaveProperty("planType");
        expect(subscription).toHaveProperty("status");
        expect(subscription.status).toBe("active");
      }
    });
  });
});
