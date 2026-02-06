import { Router, Request, Response, raw } from "express";
import Stripe from "stripe";
import { stripeManager } from "../stripe";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

/**
 * Stripe Webhook Handler
 * معالج أحداث Stripe
 */

// Use raw body parser for webhook signature verification
router.post(
  "/webhook",
  raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
      console.error("[Stripe Webhook] Missing signature");
      return res.status(400).json({ error: "Missing signature" });
    }

    // Verify webhook signature
    const event = stripeManager.verifyWebhookSignature(
      req.body as unknown as string,
      signature
    );

    if (!event) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    console.log(`[Stripe Webhook] Event received: ${event.type}`);

    try {
      // Handle different event types
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session
          );
          break;

        case "customer.subscription.updated":
          await handleSubscriptionUpdated(
            event.data.object as Stripe.Subscription
          );
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription
          );
          break;

        case "invoice.payment_succeeded":
          await handleInvoicePaymentSucceeded(
            event.data.object as Stripe.Invoice
          );
          break;

        case "invoice.payment_failed":
          await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        case "payment_intent.succeeded":
          await handlePaymentIntentSucceeded(
            event.data.object as Stripe.PaymentIntent
          );
          break;

        case "payment_intent.payment_failed":
          await handlePaymentIntentFailed(
            event.data.object as Stripe.PaymentIntent
          );
          break;

        default:
          console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error("[Stripe Webhook] Error processing event:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  }
);

/**
 * Handle checkout session completed
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  console.log(`[Stripe] Checkout session completed: ${session.id}`);

  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;
  const customerId = session.customer as string;

  if (!userId || !planId) {
    console.error("[Stripe] Missing userId or planId in metadata");
    return;
  }

  // Update user subscription in database
  console.log(
    `[Stripe] User ${userId} subscribed to plan ${planId} with customer ${customerId}`
  );

  // TODO: Update database with subscription info
  // await updateUserSubscription(userId, {
  //   stripeCustomerId: customerId,
  //   stripeSubscriptionId: session.subscription as string,
  //   planId,
  //   status: 'active'
  // });
}

/**
 * Handle subscription updated
 */
async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log(`[Stripe] Subscription updated: ${subscription.id}`);
  await stripeManager.handleSubscriptionUpdated(subscription);

  // TODO: Update database with new subscription status
}

/**
 * Handle subscription deleted
 */
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log(`[Stripe] Subscription deleted: ${subscription.id}`);
  await stripeManager.handleSubscriptionDeleted(subscription);

  // TODO: Update database to mark subscription as canceled
}

/**
 * Handle invoice payment succeeded
 */
async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice
): Promise<void> {
  console.log(`[Stripe] Invoice payment succeeded: ${invoice.id}`);
  await stripeManager.handlePaymentSucceeded(invoice);

  // TODO: Send confirmation email to user
}

/**
 * Handle invoice payment failed
 */
async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  console.log(`[Stripe] Invoice payment failed: ${invoice.id}`);
  await stripeManager.handlePaymentFailed(invoice);

  // TODO: Send payment failure notification to user
}

/**
 * Handle payment intent succeeded
 */
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  console.log(`[Stripe] Payment intent succeeded: ${paymentIntent.id}`);

  // TODO: Process order fulfillment
}

/**
 * Handle payment intent failed
 */
async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  console.log(`[Stripe] Payment intent failed: ${paymentIntent.id}`);

  // TODO: Notify user of payment failure
}

export default router;
