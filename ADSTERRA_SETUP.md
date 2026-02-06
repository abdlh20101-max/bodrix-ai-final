# Adsterra Ads Integration Guide

## نظام الإعلانات المتقدم - دليل التكامل

هذا الدليل يشرح كيفية تكامل إعلانات Adsterra في تطبيق Bodrix AI للربح من حركة المستخدمين.

---

## 1. إعداد حساب Adsterra

### الخطوات:

1. **إنشاء حساب**
   - اذهب إلى [Adsterra.com](https://adsterra.com)
   - انقر على "Sign Up" (التسجيل)
   - ملأ البيانات المطلوبة (البريد الإلكتروني، كلمة المرور، الدول المستهدفة)

2. **التحقق من البريد الإلكتروني**
   - تحقق من بريدك الإلكتروني
   - انقر على رابط التفعيل

3. **إضافة الموقع/التطبيق**
   - في لوحة التحكم، اذهب إلى "Websites" أو "Apps"
   - انقر على "Add New"
   - أدخل معلومات الموقع:
     - **Name**: Bodrix AI
     - **URL**: https://your-domain.com
     - **Category**: AI/Technology
     - **Traffic Source**: Direct

4. **الحصول على Placement IDs**
   - بعد إضافة الموقع، ستحصل على Placement IDs
   - احفظ هذه الـ IDs - ستحتاجها في الكود

---

## 2. أنواع الإعلانات المتاحة

### أ) Banner Ads (إعلانات البنر)
- **الحجم**: 728x90, 300x250, 300x600
- **الاستخدام**: أعلى الصفحة أو الجانب
- **الربح**: متوسط

```tsx
import { AdsterraBannerAd } from "@/components/AdsterraAds";

<AdsterraBannerAd placement="YOUR_PLACEMENT_ID" />
```

### ب) Native Ads (إعلانات أصلية)
- **الحجم**: متوافق مع التصميم
- **الاستخدام**: داخل المحتوى
- **الربح**: عالي

```tsx
import { AdsterraNativeAd } from "@/components/AdsterraAds";

<AdsterraNativeAd placement="YOUR_PLACEMENT_ID" />
```

### ج) Video Ads (إعلانات فيديو)
- **المدة**: 15-30 ثانية
- **الاستخدام**: بين الصفحات
- **الربح**: عالي جداً

```tsx
import { AdsterraVideoAd } from "@/components/AdsterraAds";

<AdsterraVideoAd placement="YOUR_PLACEMENT_ID" />
```

### د) Interstitial Ads (إعلانات بينية)
- **النوع**: ملء الشاشة
- **الاستخدام**: عند تغيير الصفحة
- **الربح**: عالي جداً

```tsx
import { AdsterraInterstitialAd } from "@/components/AdsterraAds";

<AdsterraInterstitialAd placement="YOUR_PLACEMENT_ID" />
```

---

## 3. التكامل في الصفحات

### مثال 1: إضافة بنر في الصفحة الرئيسية

```tsx
import { AdsterraBannerAd } from "@/components/AdsterraAds";

export default function Home() {
  return (
    <div>
      {/* محتوى الصفحة */}
      
      {/* إعلان بنر */}
      <AdsterraBannerAd 
        placement="YOUR_BANNER_PLACEMENT_ID"
        className="my-8"
      />
      
      {/* محتوى إضافي */}
    </div>
  );
}
```

### مثال 2: إضافة إعلان أصلي في قائمة

```tsx
import { AdsterraNativeAd } from "@/components/AdsterraAds";

export default function Dashboard() {
  return (
    <div>
      <h1>لوحة التحكم</h1>
      
      {/* محتوى */}
      <div className="content">
        {/* عناصر القائمة */}
      </div>
      
      {/* إعلان أصلي */}
      <AdsterraNativeAd 
        placement="YOUR_NATIVE_PLACEMENT_ID"
        className="my-6 p-4 bg-gray-50 rounded"
      />
    </div>
  );
}
```

### مثال 3: إعلان فيديو عند الترقية

```tsx
import { AdsterraVideoAd } from "@/components/AdsterraAds";

export default function Billing() {
  return (
    <div>
      <h1>الخطط والباقات</h1>
      
      {/* محتوى الخطط */}
      
      {/* إعلان فيديو */}
      <AdsterraVideoAd 
        placement="YOUR_VIDEO_PLACEMENT_ID"
        className="my-8"
      />
    </div>
  );
}
```

---

## 4. استراتيجية الربح الموصى بها

### التوزيع الأمثل:

| الصفحة | نوع الإعلان | الموقع | الترتيب |
|-------|-----------|--------|--------|
| الرئيسية | بنر + أصلي | أعلى + وسط | 1 |
| لوحة التحكم | بنر + أصلي | أعلى + جانب | 2 |
| الخطط | فيديو + بنر | وسط + أسفل | 3 |
| المدونة | أصلي + بنر | بين المقالات | 4 |
| الملف الشخصي | بنر | أعلى | 5 |

### نصائح لزيادة الربح:

1. **الموضع**: ضع الإعلانات حيث ينظر المستخدمون
2. **التوقيت**: لا تظهر إعلانات كثيرة دفعة واحدة
3. **الجودة**: استخدم إعلانات أصلية وفيديو للربح الأعلى
4. **الاستهداف**: اختر دول ذات تكلفة نقرة عالية
5. **الاختبار**: جرب أنواع مختلفة وقس النتائج

---

## 5. مراقبة الأداء

### في لوحة تحكم Adsterra:

1. اذهب إلى **Reports** (التقارير)
2. اختر الفترة الزمنية
3. راقب:
   - **Impressions**: عدد مرات عرض الإعلان
   - **Clicks**: عدد النقرات
   - **CTR**: معدل النقر (يجب أن يكون > 2%)
   - **Earnings**: الأرباح

### الأهداف:

- **CTR**: 2-5% (جيد)
- **CPM**: $2-10 (متوسط)
- **RPM**: $1-5 (متوسط)

---

## 6. أفضل الممارسات

### ✅ افعل:

- استخدم إعلانات أصلية وفيديو
- ضع الإعلانات في مواقع مرئية
- اختبر أنواع وأحجام مختلفة
- راقب الأداء بانتظام
- احترم خصوصية المستخدم

### ❌ لا تفعل:

- لا تضع إعلانات كثيرة جداً
- لا تخفي الإعلانات أو تخدع المستخدمين
- لا تضع إعلانات على صفحات الدفع
- لا تستخدم نقرات وهمية
- لا تنسَ تحديث الـ Placement IDs

---

## 7. استكشاف الأخطاء

### المشكلة: لا تظهر الإعلانات

**الحل:**
1. تحقق من Placement ID
2. تأكد من تفعيل الموقع في Adsterra
3. انتظر 24 ساعة للموافقة الأولية
4. افحص console للأخطاء

### المشكلة: أرباح منخفضة

**الحل:**
1. استخدم إعلانات فيديو وأصلية
2. زد عدد الإعلانات (بحكمة)
3. اختر دول ذات تكلفة نقرة عالية
4. حسّن تجربة المستخدم

### المشكلة: الإعلانات تؤثر على الأداء

**الحل:**
1. حمّل الإعلانات بشكل غير متزامن
2. استخدم lazy loading
3. قلل عدد الإعلانات
4. استخدم CDN

---

## 8. الربط مع Analytics

### تتبع الأرباح:

```tsx
// في صفحة Dashboard
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    // جلب البيانات من Adsterra API
    fetch("/api/adsterra/earnings")
      .then(res => res.json())
      .then(data => setEarnings(data.total));
  }, []);

  return (
    <div>
      <h2>أرباح اليوم: {earnings.toFixed(2)} $</h2>
    </div>
  );
}
```

---

## 9. الخطوات التالية

1. **أنشئ حساب Adsterra** وأضف الموقع
2. **احصل على Placement IDs**
3. **استبدل YOUR_PLACEMENT_ID** في الكود
4. **اختبر الإعلانات** في بيئة التطوير
5. **راقب الأداء** بعد النشر
6. **حسّن الاستراتيجية** بناءً على البيانات

---

## 10. الدعم والمساعدة

- **موقع Adsterra**: https://adsterra.com
- **مركز المساعدة**: https://adsterra.com/help
- **البريد الإلكتروني**: support@adsterra.com
- **الدردشة الحية**: متاحة في لوحة التحكم

---

**ملاحظة مهمة**: تأكد من الامتثال لسياسات Adsterra وعدم استخدام نقرات وهمية أو طرق احتيالية. هذا قد يؤدي إلى إيقاف الحساب.
