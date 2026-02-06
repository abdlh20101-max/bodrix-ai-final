# Tap Payments Webhook Configuration Guide

## 📋 Overview

This guide explains how to configure the Tap Payments webhook to receive real-time payment events for your Bodrix AI application.

## 🔧 Webhook Endpoint

Your webhook endpoint is already configured at:

```
https://your-domain.com/api/tap/webhook
```

Replace `your-domain.com` with your actual domain:
- **Development**: `http://localhost:3000/api/tap/webhook`
- **Production**: `https://your-production-domain.com/api/tap/webhook`

## 📝 Configuration Steps

### Step 1: Log in to Tap Payments Dashboard

1. Visit [Tap Payments Dashboard](https://dashboard.tap.company)
2. Log in with your account credentials
3. Navigate to **Settings** → **Webhooks**

### Step 2: Add Webhook URL

1. Click **Add New Webhook** button
2. In the **Webhook URL** field, enter:
   ```
   https://your-domain.com/api/tap/webhook
   ```

3. Select the events you want to receive:
   - ✅ **charge.captured** - Payment successful
   - ✅ **charge.failed** - Payment failed
   - ✅ **charge.refunded** - Refund processed
   - ✅ **charge.declined** - Card declined

4. Click **Save** or **Create Webhook**

### Step 3: Test the Webhook

1. After creating the webhook, Tap Payments will send a test event
2. Check your server logs to verify the webhook was received:
   ```
   [Tap Webhook] Received event: charge.captured
   ```

3. You should see a response:
   ```json
   {
     "success": true,
     "message": "Webhook processed successfully"
   }
   ```

## 🔐 Security Features

Your webhook implementation includes:

- **Signature Verification**: All webhooks are verified using Tap's secret key
- **Timestamp Validation**: Prevents replay attacks
- **Event Logging**: All events are logged for audit trails
- **Error Handling**: Graceful error handling with proper HTTP responses

## 📊 Webhook Events

### charge.captured

Triggered when a payment is successfully captured.

```json
{
  "type": "charge.captured",
  "data": {
    "id": "ch_test_123",
    "status": "captured",
    "amount": 99,
    "currency": "SAR",
    "description": "Pro Plan - Monthly Subscription",
    "metadata": {
      "userId": "user_123",
      "planId": "pro"
    }
  }
}
```

### charge.failed

Triggered when a payment fails.

```json
{
  "type": "charge.failed",
  "data": {
    "id": "ch_test_456",
    "status": "failed",
    "amount": 99,
    "currency": "SAR",
    "reason": "Insufficient funds"
  }
}
```

### charge.refunded

Triggered when a refund is processed.

```json
{
  "type": "charge.refunded",
  "data": {
    "id": "ch_test_789",
    "status": "refunded",
    "amount": 99,
    "currency": "SAR",
    "refundedAmount": 99
  }
}
```

## 🔄 Webhook Flow

```
1. Customer makes payment
   ↓
2. Tap Payments processes charge
   ↓
3. Webhook event triggered
   ↓
4. Your server receives event at /api/tap/webhook
   ↓
5. Event is verified and logged
   ↓
6. Database updated with payment status
   ↓
7. User subscription activated
```

## 🛠️ Backend Implementation

The webhook handler is located at:
```
server/routes/tap-webhook.ts
```

Key functions:
- `handleChargeEvent()` - Processes charge events
- `verifyWebhookSignature()` - Verifies webhook authenticity
- `updatePaymentStatus()` - Updates database with payment info

## 📱 Frontend Integration

Users can:

1. **View Payment History**: `/payment-history`
   - See all transactions
   - Check payment status
   - Request refunds

2. **Manage Billing**: `/billing`
   - Choose subscription plan
   - Make payments via Tap Checkout
   - View available plans

3. **Checkout**: `/checkout`
   - Complete payment process
   - Redirect after payment

## 🔑 API Keys

Your Tap Payments credentials are stored securely:

```env
TAP_SECRET_KEY=sk_test_HAUaS7ICH4dqP2BYumJgi0Gr5bvkt
TAP_PUBLIC_KEY=pk_test_HAUaSAHU3iDetpSlLFzydKmMV0ZBo
```

**⚠️ Important**: Never commit API keys to version control. Use environment variables.

## 🧪 Testing

### Test with Tap Test Cards

Use these test card numbers:

| Card Type | Number | Status |
|-----------|--------|--------|
| Visa | 4111111111111111 | Success |
| Mastercard | 5555555555554444 | Success |
| Invalid | 4000000000000002 | Decline |

**Expiry**: Any future date (e.g., 12/25)
**CVV**: Any 3 digits (e.g., 123)

### Manual Testing

1. Go to `/billing`
2. Select a plan
3. Click "Pay with Tap"
4. Use test card credentials
5. Check `/payment-history` for the transaction

## 📊 Monitoring

Monitor webhook events in your logs:

```bash
# View recent webhook events
tail -f .manus-logs/devserver.log | grep "Tap Webhook"

# Count successful webhooks
grep "Webhook processed successfully" .manus-logs/devserver.log | wc -l
```

## ⚠️ Troubleshooting

### Webhook Not Received

1. Verify URL is correct and accessible
2. Check firewall/security groups allow HTTPS
3. Ensure your domain is publicly accessible
4. Check server logs for errors

### Signature Verification Failed

1. Verify `TAP_SECRET_KEY` is correct
2. Check webhook payload hasn't been modified
3. Ensure timestamp is within 5 minutes

### Payment Status Not Updating

1. Check database connection
2. Verify user exists in database
3. Check for SQL errors in logs

## 📞 Support

For issues with Tap Payments:
- **Tap Support**: https://support.tap.company
- **Documentation**: https://docs.tap.company
- **Status Page**: https://status.tap.company

For issues with this implementation:
- Check server logs: `.manus-logs/devserver.log`
- Review webhook handler: `server/routes/tap-webhook.ts`
- Test endpoint: `POST /api/tap/webhook`

## ✅ Checklist

- [ ] Tap Payments account created
- [ ] API keys added to environment variables
- [ ] Webhook URL configured in Tap dashboard
- [ ] Test webhook received successfully
- [ ] Payment history page accessible
- [ ] Billing page displays plans
- [ ] Test payment completed successfully
- [ ] Webhook event logged in database
- [ ] User subscription activated
- [ ] Refund functionality tested

## 🚀 Next Steps

1. **Go Live**: Replace test keys with production keys
2. **Monitor**: Set up alerts for failed payments
3. **Optimize**: Track conversion rates and payment success
4. **Expand**: Add more payment methods or plans

---

**Last Updated**: February 2026
**Status**: ✅ Production Ready
