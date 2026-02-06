# Tap Payments Integration - Complete Guide

## 🎯 Overview

This document describes the complete Tap Payments integration for the Bodrix AI platform. The system includes payment processing, subscription management, webhook handling, and a user-facing billing interface.

## 📦 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
├─────────────────────────────────────────────────────────┤
│  • Billing Page (/billing)                              │
│  • Payment History (/payment-history)                   │
│  • Tap Checkout Component                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend (Express + tRPC)               │
├─────────────────────────────────────────────────────────┤
│  • Tap Payments Service (tapPayments.ts)                │
│  • Billing Router (routers/tapBilling.ts)               │
│  • Webhook Handler (routes/tap-webhook.ts)              │
│  • Database Schema (drizzle/schema.ts)                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Tap Payments API (Saudi Arabia)            │
├─────────────────────────────────────────────────────────┤
│  • Charge Creation                                      │
│  • Payment Processing                                   │
│  • Refund Management                                    │
│  • Webhook Events                                       │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Features Implemented

### 1. Payment Processing

**File**: `server/tapPayments.ts`

- Create charges with customer information
- Support for multiple currencies (SAR, AED, KWD, etc.)
- Metadata attachment for tracking
- Redirect URLs for post-payment flows

```typescript
const charge = await tapPaymentsManager.createCharge({
  amount: 99,
  currency: "SAR",
  description: "Pro Plan - Monthly",
  customer: {
    first_name: "Ahmed",
    email: "ahmed@example.com"
  },
  metadata: {
    userId: "user_123",
    planId: "pro"
  }
});
```

### 2. Billing API Endpoints

**File**: `server/routers/tapBilling.ts`

#### createCharge (Mutation)
Create a new payment charge

```typescript
await trpc.tapBilling.createCharge.mutate({
  amount: 99,
  currency: "SAR",
  description: "Pro Plan",
  planId: "pro",
  redirectUrl: "https://example.com/billing/success"
});
```

#### getChargeStatus (Query)
Get current status of a charge

```typescript
const status = await trpc.tapBilling.getChargeStatus.useQuery({
  chargeId: "ch_test_123"
});
```

#### refundCharge (Mutation)
Process a refund

```typescript
await trpc.tapBilling.refundCharge.mutate({
  chargeId: "ch_test_123",
  amount: 99 // optional, full refund if omitted
});
```

#### getPublicKey (Query)
Get Tap public key for frontend

```typescript
const { publicKey } = await trpc.tapBilling.getPublicKey.useQuery();
```

#### getPlans (Query)
Get available subscription plans

```typescript
const { plans } = await trpc.tapBilling.getPlans.useQuery();
```

### 3. Frontend Components

#### TapCheckout Component

**File**: `client/src/components/TapCheckout.tsx`

Reusable checkout component with:
- Plan selection
- Amount display
- Payment processing
- Success/error states
- Secure payment handling

```tsx
<TapCheckout
  planId="pro"
  planName="Pro Plan"
  amount={99}
  description="Monthly subscription"
  onSuccess={(chargeId) => console.log("Payment successful:", chargeId)}
  onError={(error) => console.error("Payment failed:", error)}
/>
```

#### Billing Page

**File**: `client/src/pages/Billing.tsx`

Complete billing interface with:
- Plan comparison grid
- Current subscription display
- Checkout integration
- FAQ section
- Responsive design

**Route**: `/billing`

#### Payment History Page

**File**: `client/src/pages/PaymentHistory.tsx`

User transaction history with:
- Transaction list with filtering
- Charge details view
- Refund request functionality
- Available plans sidebar
- Status badges

**Route**: `/payment-history`

### 4. Webhook Handler

**File**: `server/routes/tap-webhook.ts`

Handles real-time payment events:
- `charge.captured` - Payment successful
- `charge.failed` - Payment failed
- `charge.refunded` - Refund processed
- `charge.declined` - Card declined

Features:
- Signature verification
- Timestamp validation
- Event logging
- Database updates
- Error handling

**Endpoint**: `POST /api/tap/webhook`

## 🔐 Security

### API Keys

Stored securely in environment variables:

```env
TAP_SECRET_KEY=sk_test_HAUaS7ICH4dqP2BYumJgi0Gr5bvkt
TAP_PUBLIC_KEY=pk_test_HAUaSAHU3iDetpSlLFzydKmMV0ZBo
```

### Webhook Verification

All webhooks are verified using:
1. **Signature Verification**: HMAC-SHA256 signature
2. **Timestamp Validation**: Within 5 minutes
3. **Event Logging**: All events logged for audit

### Data Protection

- Sensitive data encrypted in transit (HTTPS)
- PCI DSS compliance through Tap Payments
- No card data stored locally
- User data isolated by authentication

## 📊 Database Schema

### Charges Table

```sql
CREATE TABLE charges (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  chargeId VARCHAR(255) NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SAR',
  status VARCHAR(50) NOT NULL,
  planId VARCHAR(50),
  description TEXT,
  metadata JSON,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Subscriptions Table

```sql
CREATE TABLE subscriptions (
  id VARCHAR(255) PRIMARY KEY,
  userId VARCHAR(255) NOT NULL UNIQUE,
  planId VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  currentPeriodStart TIMESTAMP,
  currentPeriodEnd TIMESTAMP,
  canceledAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🧪 Testing

### Test Card Numbers

| Card | Number | Status |
|------|--------|--------|
| Visa | 4111111111111111 | Success |
| Mastercard | 5555555555554444 | Success |
| Decline | 4000000000000002 | Decline |

**Expiry**: Any future date
**CVV**: Any 3 digits

### Test Flow

1. Go to `/billing`
2. Select "Pro Plan"
3. Click "Upgrade to Pro Plan"
4. Use test card: `4111111111111111`
5. Expiry: `12/25`, CVV: `123`
6. Click "Pay with Tap"
7. Verify success message
8. Check `/payment-history` for transaction

### Webhook Testing

```bash
# Send test webhook
curl -X POST http://localhost:3000/api/tap/webhook \
  -H "Content-Type: application/json" \
  -H "X-Tap-Signature: <signature>" \
  -d '{
    "type": "charge.captured",
    "data": {
      "id": "ch_test_123",
      "status": "captured",
      "amount": 99,
      "currency": "SAR"
    }
  }'
```

## 📱 User Flow

### Payment Flow

```
1. User visits /billing
   ↓
2. Selects subscription plan
   ↓
3. Clicks "Upgrade" button
   ↓
4. TapCheckout component loads
   ↓
5. User enters payment details
   ↓
6. Tap Payments processes charge
   ↓
7. Webhook sent to /api/tap/webhook
   ↓
8. Database updated with charge status
   ↓
9. User subscription activated
   ↓
10. Redirect to /billing/success
```

### Refund Flow

```
1. User visits /payment-history
   ↓
2. Finds completed payment
   ↓
3. Clicks "Request Refund"
   ↓
4. Refund processed via API
   ↓
5. Webhook confirms refund
   ↓
6. Status updated to "refunded"
   ↓
7. User notified
```

## 🔧 Configuration

### Environment Variables

```env
# Tap Payments Keys
TAP_SECRET_KEY=sk_test_...
TAP_PUBLIC_KEY=pk_test_...

# Webhook Configuration
TAP_WEBHOOK_SECRET=your_webhook_secret

# Application URLs
VITE_APP_URL=https://your-domain.com
```

### Tap Dashboard Setup

1. Create Tap Payments account
2. Generate API keys
3. Configure webhook URL: `https://your-domain.com/api/tap/webhook`
4. Enable payment events
5. Test with test keys
6. Switch to production keys

## 📈 Monitoring

### Key Metrics

- **Payment Success Rate**: `successful_charges / total_charges`
- **Refund Rate**: `refunded_charges / total_charges`
- **Webhook Delivery**: `received_webhooks / sent_webhooks`
- **Average Transaction Time**: Time from charge creation to capture

### Logging

All events logged to:
- Server logs: `.manus-logs/devserver.log`
- Database: `charges` and `subscriptions` tables
- Tap Dashboard: Real-time transaction view

### Alerts

Set up alerts for:
- Failed payments
- Webhook delivery failures
- Unusual refund activity
- API errors

## 🐛 Troubleshooting

### Payment Not Processing

1. Verify API keys are correct
2. Check test card is valid
3. Ensure amount is positive
4. Check network connectivity

### Webhook Not Received

1. Verify webhook URL is correct
2. Check firewall allows HTTPS
3. Ensure domain is publicly accessible
4. Check server logs for errors

### Refund Failed

1. Verify charge ID is correct
2. Check charge status is "captured"
3. Ensure refund amount <= original amount
4. Check API key permissions

## 📚 API Reference

### Tap Payments Manager

```typescript
// Create charge
await tapPaymentsManager.createCharge(chargeData)

// Get charge details
await tapPaymentsManager.getCharge(chargeId)

// Refund charge
await tapPaymentsManager.refundCharge(chargeId, amount?)

// Get public key
tapPaymentsManager.getPublicKey()

// Verify webhook
tapPaymentsManager.verifyWebhookSignature(payload, signature)
```

## 🚀 Deployment

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Webhook URL updated in Tap dashboard
- [ ] Database migrations run
- [ ] API keys rotated
- [ ] SSL certificate valid
- [ ] Error handling tested
- [ ] Monitoring set up

### Production Deployment

1. Switch to production API keys
2. Update webhook URL to production domain
3. Enable payment notifications
4. Set up monitoring and alerts
5. Test with real payments (small amount)
6. Monitor for 24 hours
7. Scale infrastructure if needed

## 📞 Support

### Tap Payments Support

- **Website**: https://tap.company
- **Documentation**: https://docs.tap.company
- **Support Email**: support@tap.company
- **Status Page**: https://status.tap.company

### Application Support

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: See `/docs` directory
- **Logs**: Check `.manus-logs/` directory

## 📝 Changelog

### v1.0.0 (February 2026)

- ✅ Initial Tap Payments integration
- ✅ Payment processing API
- ✅ Webhook handler
- ✅ Billing page
- ✅ Payment history page
- ✅ TapCheckout component
- ✅ Refund functionality
- ✅ Subscription management

## 📄 License

This integration is part of the Bodrix AI platform and follows the same license terms.

---

**Last Updated**: February 2026
**Status**: ✅ Production Ready
**Version**: 1.0.0
