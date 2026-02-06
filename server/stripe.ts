import Stripe from "stripe";

/**
 * Stripe Payment Integration
 * نظام الدفع والاشتراكات
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceId: string;
  amount: number; // in cents
  currency: string;
  interval: "month" | "year";
  features: string[];
  usageLimit?: number; // commands per month
}

export interface UserSubscription {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  planId: string;
  status: "active" | "canceled" | "past_due" | "unpaid";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

// Predefined subscription plans
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: "free",
    name: "مجاني",
    description: "خطة مجانية محدودة",
    priceId: "",
    amount: 0,
    currency: "USD",
    interval: "month",
    features: ["10 مهام شهرياً", "دعم أساسي"],
    usageLimit: 10,
  },
  pro: {
    id: "pro",
    name: "احترافي",
    description: "خطة احترافية مع ميزات متقدمة",
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    amount: 2999, // $29.99
    currency: "USD",
    interval: "month",
    features: [
      "500 مهمة شهرياً",
      "أولويات مخصصة",
      "دعم أولوي",
      "تحليلات متقدمة",
    ],
    usageLimit: 500,
  },
  enterprise: {
    id: "enterprise",
    name: "مؤسسي",
    description: "خطة مؤسسية بدون حدود",
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "",
    amount: 9999, // $99.99
    currency: "USD",
    interval: "month",
    features: [
      "مهام غير محدودة",
      "أولويات مخصصة",
      "دعم 24/7",
      "تحليلات متقدمة",
      "API مخصص",
      "مدير حساب مخصص",
    ],
  },
};

class StripeManager {
  /**
   * Create checkout session
   */
  async createCheckoutSession(
    userId: string,
    planId: string,
    userEmail: string
  ): Promise<string> {
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan || !plan.priceId) {
      throw new Error(`Invalid plan: ${planId}`);
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_APP_URL || "http://localhost:3000"}/billing/cancel`,
      metadata: {
        userId,
        planId,
      },
    });

    return session.url || "";
  }

  /**
   * Create or update customer
   */
  async createOrUpdateCustomer(
    userId: string,
    email: string,
    name?: string
  ): Promise<string> {
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return customers.data[0].id;
    }

    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    return customer.id;
  }

  /**
   * Get subscription
   */
  async getSubscription(stripeSubscriptionId: string): Promise<Stripe.Subscription> {
    return stripe.subscriptions.retrieve(stripeSubscriptionId);
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    stripeSubscriptionId: string,
    immediate = false
  ): Promise<Stripe.Subscription> {
    if (immediate) {
      return stripe.subscriptions.cancel(stripeSubscriptionId);
    }

    return stripe.subscriptions.update(stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
  }

  /**
   * Get invoice
   */
  async getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    return stripe.invoices.retrieve(invoiceId);
  }

  /**
   * List invoices for customer
   */
  async listInvoices(customerId: string, limit = 10): Promise<Stripe.Invoice[]> {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit,
    });

    return invoices.data;
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    body: string,
    signature: string
  ): Stripe.Event | null {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
      return stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error("[Stripe] Webhook signature verification failed:", error);
      return null;
    }
  }

  /**
   * Handle subscription updated event
   */
  async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    console.log(
      `[Stripe] Subscription updated: ${subscription.id} - Status: ${subscription.status}`
    );
    // Update user subscription in database
  }

  /**
   * Handle subscription deleted event
   */
  async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    console.log(`[Stripe] Subscription deleted: ${subscription.id}`);
    // Update user subscription in database
  }

  /**
   * Handle payment succeeded event
   */
  async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    console.log(`[Stripe] Payment succeeded: ${invoice.id}`);
    // Update user subscription and send confirmation
  }

  /**
   * Handle payment failed event
   */
  async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    console.log(`[Stripe] Payment failed: ${invoice.id}`);
    // Notify user about failed payment
  }

  /**
   * Get usage for subscription
   */
  async getUsageMetrics(
    customerId: string
  ): Promise<{
    currentUsage: number;
    limit: number;
    percentageUsed: number;
  }> {
    // This would be implemented based on your usage tracking system
    return {
      currentUsage: 0,
      limit: 0,
      percentageUsed: 0,
    };
  }

  /**
   * Get subscription plan details
   */
  getPlanDetails(planId: string): SubscriptionPlan | null {
    return SUBSCRIPTION_PLANS[planId] || null;
  }

  /**
   * Get all available plans
   */
  getAllPlans(): SubscriptionPlan[] {
    return Object.values(SUBSCRIPTION_PLANS);
  }
}

export const stripeManager = new StripeManager();
