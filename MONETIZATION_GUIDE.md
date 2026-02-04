# دليل الربح والمحفظة الإلكترونية - Bodrix AI

## 1️⃣ ربط الإعلانات للربح

### خيار أول: Google AdSense (الأفضل والأشهر)

#### الخطوات:
1. **إنشاء حساب Google AdSense:**
   - اذهب إلى: https://www.google.com/adsense/start/
   - اضغط "البدء الآن" (Get Started)
   - سجل دخول بحسابك على Google
   - أدخل عنوان موقعك: `bodrix.manus.space`

2. **إضافة كود AdSense إلى الموقع:**
   - بعد الموافقة، ستحصل على كود AdSense
   - أضف الكود في ملف `client/index.html`:

```html
<!-- في داخل <head> -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
     crossorigin="anonymous"></script>
```

3. **إضافة إعلانات في الصفحات:**
   - في أي صفحة تريد إضافة إعلانات:

```html
<div style="text-align: center; margin: 20px 0;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
       data-ad-slot="xxxxxxxxxx"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
```

4. **الربح:**
   - تحصل على 68% من عائدات الإعلانات
   - الحد الأدنى للسحب: $100
   - الدفع شهري عبر التحويل البنكي

---

### خيار ثاني: Propeller Ads (أسرع في الموافقة)

#### الخطوات:
1. **إنشاء حساب:**
   - اذهب إلى: https://www.propellerads.com/
   - اضغط "Sign Up" (تسجيل جديد)
   - أدخل بيانات الموقع

2. **الحصول على كود الإعلانات:**
   - بعد الموافقة، اذهب إلى Dashboard
   - اختر "Create Campaign"
   - اختر "Website" ثم "Banner Ads"
   - انسخ الكود المُولد

3. **إضافة الكود في الموقع:**
   - أضف الكود في `client/src/pages/Ads.tsx`:

```jsx
import { useEffect } from 'react';

export default function Ads() {
  useEffect(() => {
    // تحميل سكريبت Propeller Ads
    const script = document.createElement('script');
    script.src = 'https://a.propellerads.com/YOUR_PUBLISHER_ID.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <h1>الإعلانات</h1>
      <div id="propeller-ads-container"></div>
    </div>
  );
}
```

4. **الربح:**
   - تحصل على 50-70% من عائدات الإعلانات
   - الحد الأدنى للسحب: $5-$10
   - الدفع أسبوعي أو شهري

---

## 2️⃣ إنشاء حساب محفظة إلكترونية

### خيار أول: Stripe (الأفضل للدفع الدولي)

#### الخطوات:
1. **إنشاء حساب Stripe:**
   - اذهب إلى: https://dashboard.stripe.com/register
   - أدخل بيانات عملك:
     - الاسم: عبدالله الحصيني
     - البريد الإلكتروني: abdulah@example.com
     - البلد: المملكة العربية السعودية
     - رقم الهاتف: +966...

2. **إضافة حساب بنكي:**
   - في Dashboard، اذهب إلى "Settings" > "Bank Accounts"
   - اضغط "Add Bank Account"
   - أدخل بيانات حسابك البنكي:
     - اسم البنك: الراجحي
     - رقم الحساب: XXXXXXXXXX
     - IBAN: SA...

3. **الحصول على مفاتيح API:**
   - اذهب إلى "Developers" > "API Keys"
   - انسخ:
     - **Publishable Key**: pk_live_...
     - **Secret Key**: sk_live_...

4. **ربط Stripe بالموقع:**
   - أضف المفاتيح في ملف `.env`:

```env
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

5. **إنشاء عملية دفع:**

```jsx
import { loadStripe } from '@stripe/js';

const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY);

const handleCheckout = async () => {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 100 }) // $100
  });

  const session = await response.json();
  await stripe.redirectToCheckout({ sessionId: session.id });
};
```

---

### خيار ثاني: PayPal (سهل وموثوق)

#### الخطوات:
1. **إنشاء حساب PayPal:**
   - اذهب إلى: https://www.paypal.com/
   - اضغط "Sign Up"
   - اختر "Business Account"
   - أدخل البيانات

2. **تفعيل حساب المتاجر:**
   - اذهب إلى "Account Settings"
   - اختر "Business" > "Merchant Services"
   - فعّل "Website Payments"

3. **الحصول على بيانات الدفع:**
   - اذهب إلى "Tools" > "API Signature"
   - انسخ:
     - API Username
     - API Password
     - API Signature

4. **ربط PayPal بالموقع:**

```env
PAYPAL_CLIENT_ID=your_client_id
PAYPAL_SECRET=your_secret
```

5. **إنشاء زر الدفع:**

```jsx
import { PayPalButtons } from "@paypal/checkout-js";

export default function PayPalCheckout() {
  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: "100.00" }
          }]
        });
      }}
      onApprove={(data, actions) => {
        return actions.order.capture().then(() => {
          alert("تم الدفع بنجاح!");
        });
      }}
    />
  );
}
```

---

## 3️⃣ سحب الأرباح إلى حسابك البنكي

### من Google AdSense:
1. اذهب إلى "Payments" > "Payment Methods"
2. أضف حساب بنكي جديد
3. أدخل بيانات حسابك الراجحي
4. انتظر التحويل (يستغرق 2-3 أسابيع)

### من Stripe:
1. الأموال تُحول تلقائياً إلى حسابك البنكي
2. الدفع يتم كل يوم أو كل أسبوع (حسب الإعدادات)
3. تحقق من "Payouts" في Dashboard

### من PayPal:
1. اذهب إلى "Wallet" > "Transfer Money"
2. اختر "Transfer to Your Bank"
3. أدخل بيانات حسابك البنكي
4. أكمل العملية

---

## 4️⃣ إعدادات إضافية مهمة

### تتبع الأرباح:
```jsx
// في Dashboard
const [earnings, setEarnings] = useState({
  googleAdsense: 0,
  propellerAds: 0,
  stripe: 0,
  paypal: 0,
  total: 0
});

// تحديث يومي
useEffect(() => {
  const updateEarnings = async () => {
    const response = await fetch('/api/earnings');
    const data = await response.json();
    setEarnings(data);
  };
  
  updateEarnings();
  const interval = setInterval(updateEarnings, 3600000); // كل ساعة
  return () => clearInterval(interval);
}, []);
```

### الإشعارات عند الوصول للحد الأدنى:
```jsx
useEffect(() => {
  if (earnings.total >= 100) {
    sendNotification("🎉 لقد وصلت إلى $100! يمكنك سحب الأموال الآن");
  }
}, [earnings.total]);
```

---

## 5️⃣ نصائح مهمة للربح

✅ **لزيادة الأرباح:**
1. أضف إعلانات في مكان ظاهر (Header, Sidebar)
2. استخدم عدة مصادر إعلانية (Google + Propeller)
3. أكثر من عدد الزوار (SEO, Social Media)
4. اختبر مواضع الإعلانات المختلفة

✅ **تجنب المشاكل:**
- لا تنقر على إعلاناتك الخاصة
- لا تشجع المستخدمين على النقر على الإعلانات
- لا تستخدم روبوتات لزيادة الزيارات
- لا تخفي الإعلانات أو تخدع المستخدمين

---

## 📞 الدعم والمساعدة

- **Google AdSense Support**: https://support.google.com/adsense
- **Stripe Support**: https://support.stripe.com
- **PayPal Support**: https://www.paypal.com/support
- **Propeller Ads Support**: https://www.propellerads.com/support

---

**ملاحظة:** جميع المبالغ بالدولار الأمريكي. التحويل إلى الريال السعودي يتم تلقائياً عند السحب.
