import { describe, it, expect, beforeAll } from "vitest";

describe("PayPal Integration", () => {
  let accessToken: string;

  beforeAll(async () => {
    // Test 1: Get PayPal Access Token
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("PayPal credentials not found in environment variables");
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    try {
      const response = await fetch("https://api.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
      });

      if (!response.ok) {
        throw new Error(`PayPal auth failed: ${response.statusText}`);
      }

      const data = (await response.json()) as { access_token: string };
      accessToken = data.access_token;
    } catch (error) {
      console.error("PayPal token error:", error);
      throw error;
    }
  });

  it("should authenticate with PayPal API", () => {
    expect(accessToken).toBeDefined();
    expect(accessToken.length).toBeGreaterThan(0);
  });

  it("should create a PayPal order", async () => {
    if (!accessToken) {
      throw new Error("Access token not available");
    }

    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "10.00",
          },
        },
      ],
    };

    const response = await fetch("https://api.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal order creation failed: ${error}`);
    }

    const order = (await response.json()) as { id: string; status: string };
    expect(order.id).toBeDefined();
    expect(order.status).toBe("CREATED");
  });

  it("should validate PayPal credentials format", () => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_SECRET;

    expect(clientId).toBeDefined();
    expect(clientSecret).toBeDefined();
    expect(clientId?.length).toBeGreaterThan(10);
    expect(clientSecret?.length).toBeGreaterThan(10);
  });
});
