import axios, { AxiosInstance } from "axios";

/**
 * Tap Payments Integration Service
 * خدمة تكامل Tap Payments
 */

export interface TapPaymentConfig {
  secretKey: string;
  publicKey: string;
  baseUrl?: string;
}

export interface TapChargeRequest {
  amount: number;
  currency: string;
  description: string;
  customer?: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
  metadata?: Record<string, unknown>;
  redirect?: {
    url: string;
  };
}

export interface TapCharge {
  id: string;
  status: "initiated" | "captured" | "failed" | "declined";
  amount: number;
  currency: string;
  description: string;
  created_at: string;
  customer?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  metadata?: Record<string, unknown>;
}

export interface TapWebhookEvent {
  id: string;
  type: string;
  data: {
    object: TapCharge;
  };
  created_at: string;
}

class TapPaymentsManager {
  private client: AxiosInstance;
  private secretKey: string;
  private publicKey: string;

  constructor(config: TapPaymentConfig) {
    this.secretKey = config.secretKey;
    this.publicKey = config.publicKey;

    this.client = axios.create({
      baseURL: config.baseUrl || "https://api.tap.company/v2",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Create a charge (payment)
   */
  async createCharge(request: TapChargeRequest): Promise<TapCharge> {
    try {
      const response = await this.client.post<TapCharge>("/charges", request);
      return response.data;
    } catch (error) {
      console.error("[Tap Payments] Error creating charge:", error);
      throw error;
    }
  }

  /**
   * Get charge details
   */
  async getCharge(chargeId: string): Promise<TapCharge> {
    try {
      const response = await this.client.get<TapCharge>(`/charges/${chargeId}`);
      return response.data;
    } catch (error) {
      console.error("[Tap Payments] Error getting charge:", error);
      throw error;
    }
  }

  /**
   * Refund a charge
   */
  async refundCharge(chargeId: string, amount?: number): Promise<TapCharge> {
    try {
      const response = await this.client.post<TapCharge>(
        `/charges/${chargeId}/refund`,
        amount ? { amount } : {}
      );
      return response.data;
    } catch (error) {
      console.error("[Tap Payments] Error refunding charge:", error);
      throw error;
    }
  }

  /**
   * Create a customer
   */
  async createCustomer(data: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }): Promise<{ id: string }> {
    try {
      const response = await this.client.post<{ id: string }>(
        "/customers",
        data
      );
      return response.data;
    } catch (error) {
      console.error("[Tap Payments] Error creating customer:", error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    payload: string,
    signature: string
  ): TapWebhookEvent | null {
    try {
      // Tap Payments uses HMAC-SHA256 for signature verification
      const crypto = require("crypto");
      const hash = crypto
        .createHmac("sha256", this.secretKey)
        .update(payload)
        .digest("hex");

      if (hash === signature) {
        return JSON.parse(payload) as TapWebhookEvent;
      }

      console.error("[Tap Payments] Invalid webhook signature");
      return null;
    } catch (error) {
      console.error("[Tap Payments] Error verifying webhook:", error);
      return null;
    }
  }

  /**
   * Handle charge succeeded
   */
  async handleChargeSucceeded(charge: TapCharge): Promise<void> {
    console.log(`[Tap Payments] Charge succeeded: ${charge.id}`);
    // TODO: Update database with charge info
  }

  /**
   * Handle charge failed
   */
  async handleChargeFailed(charge: TapCharge): Promise<void> {
    console.log(`[Tap Payments] Charge failed: ${charge.id}`);
    // TODO: Notify user of payment failure
  }

  /**
   * Get public key for frontend
   */
  getPublicKey(): string {
    return this.publicKey;
  }
}

// Initialize Tap Payments manager
const tapPaymentsConfig: TapPaymentConfig = {
  secretKey: process.env.TAP_PAYMENTS_SECRET_KEY || "",
  publicKey: process.env.TAP_PAYMENTS_PUBLIC_KEY || "",
};

export const tapPaymentsManager = new TapPaymentsManager(tapPaymentsConfig);
