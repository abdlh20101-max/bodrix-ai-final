# دليل إعداد المدفوعات الحقيقية

## 1. إعداد Stripe

### الخطوات:

1. **إنشاء حساب Stripe**
   - اذهب إلى https://stripe.com
   - انقر على "Sign up"
   - أدخل بيانات عملك

2. **الحصول على مفاتيح API**
   - اذهب إلى Dashboard
   - انقر على "Developers" → "API Keys"
   - انسخ:
     - `Publishable key` (المفتاح العام)
     - `Secret key` (المفتاح السري)

3. **إضافة المفاتيح إلى المشروع**
   ```bash
   # أضف إلى ملف .env
   STRIPE_PUBLIC_KEY=pk_live_xxxxx
   STRIPE_SECRET_KEY=sk_live_xxxxx
   VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
   ```

4. **تثبيت مكتبة Stripe**
   ```bash
   pnpm add stripe @stripe/react-stripe-js @stripe/stripe-js
   ```

5. **إعداد Webhook**
   - اذهب إلى Developers → Webhooks
   - انقر على "Add endpoint"
   - أدخل URL الـ webhook: `https://yourdomain.com/api/webhooks/stripe`
   - اختر الأحداث:
     - `charge.succeeded`
     - `charge.failed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

---

## 2. إعداد PayPal

### الخطوات:

1. **إنشاء حساب PayPal Business**
   - اذهب إلى https://www.paypal.com/business
   - اختر "Create a Business Account"
   - أدخل بيانات عملك

2. **الحصول على مفاتيح API**
   - اذهب إلى "Account Settings" → "API Signature"
   - انسخ:
     - `API Username`
     - `API Password`
     - `Signature`

3. **أو استخدم OAuth 2.0**
   - اذهب إلى "Apps & Credentials"
   - انقر على "Create App"
   - انسخ:
     - `Client ID`
     - `Secret`

4. **إضافة المفاتيح إلى المشروع**
   ```bash
   # أضف إلى ملف .env
   PAYPAL_CLIENT_ID=xxxxx
   PAYPAL_CLIENT_SECRET=xxxxx
   PAYPAL_MODE=live  # أو sandbox للاختبار
   VITE_PAYPAL_CLIENT_ID=xxxxx
   ```

5. **تثبيت مكتبة PayPal**
   ```bash
   pnpm add @paypal/checkout-server-sdk
   ```

6. **إعداد Webhook**
   - اذهب إلى "Notifications" → "Webhooks"
   - انقر على "Create Webhook"
   - أدخل URL: `https://yourdomain.com/api/webhooks/paypal`
   - اختر الأحداث:
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.CAPTURE.DENIED`
     - `BILLING.SUBSCRIPTION.CREATED`
     - `BILLING.SUBSCRIPTION.UPDATED`

---

## 3. كود التكامل - Stripe

### Server Side (server/routers/payments.ts):

```typescript
import Stripe from 'stripe';
import { protectedProcedure, router } from '../_core/trpc';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const paymentsRouter = router({
  // إنشاء جلسة دفع
  createCheckoutSession: protectedProcedure
    .input(z.object({
      planId: z.string(),
      amount: z.number(),
      planName: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: input.planName,
                description: `${input.planName} Plan`,
              },
              unit_amount: Math.round(input.amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
        customer_email: ctx.user.email || undefined,
        metadata: {
          userId: ctx.user.id,
          planId: input.planId,
        },
      });

      return { sessionId: session.id };
    }),

  // التحقق من حالة الدفع
  getPaymentStatus: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      return {
        status: session.payment_status,
        amount: session.amount_total ? session.amount_total / 100 : 0,
      };
    }),
});
```

### Client Side (client/src/pages/CheckoutStripe.tsx):

```typescript
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { trpc } from '@/lib/trpc';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function CheckoutStripe() {
  const { data: sessionData } = trpc.payments.createCheckoutSession.useQuery({
    planId: 'pro',
    amount: 29.99,
    planName: 'Pro Plan',
  });

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret: sessionData?.clientSecret }}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
```

---

## 4. كود التكامل - PayPal

### Server Side (server/routers/paypal.ts):

```typescript
import { protectedProcedure, router } from '../_core/trpc';
import { z } from 'zod';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const environment = process.env.PAYPAL_MODE === 'live' 
  ? new checkoutNodeJssdk.LiveEnvironment(
      process.env.PAYPAL_CLIENT_ID!,
      process.env.PAYPAL_CLIENT_SECRET!
    )
  : new checkoutNodeJssdk.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID!,
      process.env.PAYPAL_CLIENT_SECRET!
    );

const client = new checkoutNodeJssdk.PayPalHttpClient(environment);

export const paypalRouter = router({
  // إنشاء طلب دفع
  createOrder: protectedProcedure
    .input(z.object({
      planId: z.string(),
      amount: z.number(),
      planName: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        payer: {
          email_address: ctx.user.email,
        },
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: input.amount.toString(),
            },
            description: input.planName,
          },
        ],
        application_context: {
          return_url: `${process.env.FRONTEND_URL}/checkout/paypal/success`,
          cancel_url: `${process.env.FRONTEND_URL}/checkout/paypal/cancel`,
        },
      });

      const order = await client.execute(request);
      return { orderId: order.result.id };
    }),

  // التقاط الدفع
  captureOrder: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(input.orderId);
      const capture = await client.execute(request);
      
      // حفظ الدفع في قاعدة البيانات
      // await db.addPayment({...})
      
      return { status: capture.result.status };
    }),
});
```

### Client Side (client/src/pages/CheckoutPayPal.tsx):

```typescript
import { PayPalScriptProvider, PayPalButtons } from '@paypal/checkout-react';
import { trpc } from '@/lib/trpc';

export default function CheckoutPayPal() {
  const createOrder = trpc.paypal.createOrder.useMutation();
  const captureOrder = trpc.paypal.captureOrder.useMutation();

  return (
    <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
      <PayPalButtons
        createOrder={async () => {
          const data = await createOrder.mutateAsync({
            planId: 'pro',
            amount: 29.99,
            planName: 'Pro Plan',
          });
          return data.orderId;
        }}
        onApprove={async (data) => {
          await captureOrder.mutateAsync({ orderId: data.orderID });
        }}
      />
    </PayPalScriptProvider>
  );
}
```

---

## 5. الاشتراكات المتكررة

### Stripe Subscriptions:

```typescript
// إنشاء اشتراك
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: 'price_xxxxx' }], // السعر المتكرر
  payment_behavior: 'default_incomplete',
  expand: ['latest_invoice.payment_intent'],
});

// إلغاء الاشتراك
await stripe.subscriptions.del(subscriptionId);

// تحديث الاشتراك
await stripe.subscriptions.update(subscriptionId, {
  items: [{ id: itemId, price: 'price_xxxxx' }],
});
```

### PayPal Subscriptions:

```typescript
// إنشاء خطة اشتراك
const plan = await client.execute(
  new billingPlansSDK.BillingPlansCreateRequest()
    .requestBody({
      product_id: 'PROD-XXXXX',
      name: 'Pro Plan',
      billing_cycles: [{
        frequency: { interval_unit: 'MONTH', interval_count: 1 },
        tenure_type: 'REGULAR',
        sequence: 1,
        total_cycles: 0, // غير محدود
        pricing_scheme: {
          fixed_price: { value: '29.99', currency_code: 'USD' },
        },
      }],
    })
);

// إنشاء اشتراك
const subscription = await client.execute(
  new billingSubscriptionsSDK.BillingSubscriptionsCreateRequest()
    .requestBody({
      plan_id: plan.id,
      subscriber: { email_address: userEmail },
    })
);
```

---

## 6. Webhook Handlers

### Stripe Webhook (server/webhooks/stripe.ts):

```typescript
import Stripe from 'stripe';
import { Router, Request, Response } from 'express';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

router.post('/stripe', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'charge.succeeded':
        // حفظ الدفع الناجح
        console.log('Payment succeeded:', event.data.object);
        break;
      case 'customer.subscription.updated':
        // تحديث الاشتراك
        console.log('Subscription updated:', event.data.object);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error}`);
  }
});

export default router;
```

---

## 7. متغيرات البيئة المطلوبة

```bash
# Stripe
STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx

# PayPal
PAYPAL_CLIENT_ID=xxxxx
PAYPAL_CLIENT_SECRET=xxxxx
PAYPAL_MODE=live
VITE_PAYPAL_CLIENT_ID=xxxxx

# URLs
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

---

## 8. اختبار المدفوعات

### بطاقات اختبار Stripe:
- **نجاح**: `4242 4242 4242 4242`
- **فشل**: `4000 0000 0000 0002`
- **CVC**: أي 3 أرقام
- **التاريخ**: أي تاريخ مستقبلي

### حسابات اختبار PayPal:
- استخدم حساب Sandbox من PayPal Developer
- اختبر في بيئة Sandbox قبل الانتقال إلى Live

---

## 9. الخطوات التالية

1. ✅ أنشئ حساب Stripe و PayPal
2. ✅ احصل على مفاتيح API
3. ✅ أضف المفاتيح إلى ملف .env
4. ✅ ثبّت المكتبات المطلوبة
5. ✅ أنشئ Webhook endpoints
6. ✅ اختبر المدفوعات في بيئة Sandbox
7. ✅ انتقل إلى Live عند التأكد

---

**ملاحظة:** هذا الدليل يوفر الأساسيات. تأكد من قراءة التوثيق الرسمي لـ Stripe و PayPal للحصول على تفاصيل أكثر.
