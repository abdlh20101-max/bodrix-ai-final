import { Request, Response } from "express";
import { tapPaymentsManager, TapWebhookEvent } from "../tapPayments";

/**
 * Tap Payments Webhook Handler
 * معالج أحداث Tap Payments
 */
export async function handleTapWebhook(
  req: Request,
  res: Response
): Promise<void> {
  const signature = req.headers["x-tap-signature"] as string;

  if (!signature) {
    console.error("[Tap Webhook] Missing signature");
    res.status(400).json({ error: "Missing signature" });
    return;
  }

  // Verify webhook signature
  const event = tapPaymentsManager.verifyWebhookSignature(
    JSON.stringify(req.body),
    signature
  );

  if (!event) {
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  console.log(`[Tap Webhook] Event received: ${event.type}`);

  try {
    // Handle different event types
    switch (event.type) {
      case "charge.captured":
        await handleChargeSucceeded(event);
        break;

      case "charge.failed":
        await handleChargeFailed(event);
        break;

      case "charge.refunded":
        await handleChargeRefunded(event);
        break;

      case "charge.declined":
        await handleChargeDeclined(event);
        break;

      default:
        console.log(`[Tap Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Tap Webhook] Error processing event:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

/**
 * Handle charge succeeded
 */
async function handleChargeSucceeded(event: TapWebhookEvent): Promise<void> {
  const charge = event.data.object;
  console.log(`[Tap] Charge succeeded: ${charge.id}`);

  // Extract metadata
  const userId = (charge.metadata?.userId as string) || "";
  const planId = (charge.metadata?.planId as string) || "";

  if (!userId || !planId) {
    console.error("[Tap] Missing userId or planId in metadata");
    return;
  }

  console.log(
    `[Tap] User ${userId} paid for plan ${planId} - Amount: ${charge.amount} ${charge.currency}`
  );

  // TODO: Update database with payment info
  // await updateUserSubscription(userId, {
  //   tapChargeId: charge.id,
  //   planId,
  //   status: 'active',
  //   amount: charge.amount,
  //   currency: charge.currency
  // });

  // TODO: Send confirmation email
}

/**
 * Handle charge failed
 */
async function handleChargeFailed(event: TapWebhookEvent): Promise<void> {
  const charge = event.data.object;
  console.log(`[Tap] Charge failed: ${charge.id}`);

  const userId = (charge.metadata?.userId as string) || "";

  if (!userId) {
    console.error("[Tap] Missing userId in metadata");
    return;
  }

  console.log(`[Tap] Payment failed for user ${userId}`);

  // TODO: Notify user of payment failure
  // await sendPaymentFailureEmail(userId);
}

/**
 * Handle charge refunded
 */
async function handleChargeRefunded(event: TapWebhookEvent): Promise<void> {
  const charge = event.data.object;
  console.log(`[Tap] Charge refunded: ${charge.id}`);

  const userId = (charge.metadata?.userId as string) || "";

  if (!userId) {
    console.error("[Tap] Missing userId in metadata");
    return;
  }

  console.log(`[Tap] Refund processed for user ${userId}`);

  // TODO: Update database to mark subscription as refunded
  // await updateUserSubscription(userId, {
  //   status: 'refunded',
  //   refundedAt: new Date()
  // });
}

/**
 * Handle charge declined
 */
async function handleChargeDeclined(event: TapWebhookEvent): Promise<void> {
  const charge = event.data.object;
  console.log(`[Tap] Charge declined: ${charge.id}`);

  const userId = (charge.metadata?.userId as string) || "";

  if (!userId) {
    console.error("[Tap] Missing userId in metadata");
    return;
  }

  console.log(`[Tap] Payment declined for user ${userId}`);

  // TODO: Notify user with reason for decline
  // await sendPaymentDeclinedEmail(userId, charge);
}
