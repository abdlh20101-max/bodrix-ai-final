# 🤖 Bodrix AI - منصة الذكاء الاصطناعي المتقدمة

**Bodrix AI - Advanced AI Chatbot Platform**

---

## 📖 جدول المحتويات | Table of Contents

- [العربية](#-bodrix-ai---منصة-الذكاء-الاصطناعي-المتقدمة)
- [English](#-bodrix-ai---advanced-ai-chatbot-platform-1)

---

## 🇸🇦 النسخة العربية

### 📝 نبذة عن المشروع

**Bodrix AI** هي منصة ذكاء اصطناعي متقدمة توفر خدمات محادثة ذكية مع نظام متعدد المستويات للمستخدمين. المشروع مصمم بعناية لتقديم تجربة استخدام استثنائية مع نظام نقاط مرن وخيارات اشتراك متنوعة.

### ✨ المميزات الرئيسية

#### 🎯 نظام المستخدمين الأربعة

1. **حساب المطور (Developer)**
   - رسائل غير محدودة
   - صور غير محدودة
   - بدون إعلانات
   - وصول كامل للإحصائيات
   - إدارة المستخدمين والاشتراكات
   - AI متقدم جداً بآخر التحديثات

2. **حساب عميل عام (Free)**
   - 20 رسالة يومية
   - 2-3 صور يومية
   - بنرات إعلانية صغيرة غير مزعجة
   - خيارات زيادة الرسائل:
     - مشاهدة إعلان: +8 رسائل + صورة
     - مشاركة مع 3 أصدقاء: +15 رسالة + صورتين
     - مشاهدة إعلانين: +25 رسالة + صورتين

3. **اشتراك Premium**
   - رسائل غير محدودة
   - صور غير محدودة
   - مصادر تعليمية إضافية
   - بدون إعلانات
   - خطط اشتراك:
     - أسبوع: $9.99
     - شهر: $29.99
     - 3 أشهر: $79.99
     - سنة: $199.99

4. **اشتراك Pro**
   - رسائل غير محدودة
   - صور غير محدودة
   - مصادر متقدمة (مغلقة المصدر)
   - بدون إعلانات
   - أولوية في الدعم الفني
   - خطط اشتراك:
     - أسبوع: $19.99
     - شهر: $59.99
     - 3 أشهر: $159.99
     - سنة: $399.99

#### 💡 نظام النقاط والمكافآت

المستخدمون يمكنهم كسب نقاط إضافية من خلال:

- ✅ مشاهدة إعلان: +8 رسائل + صورة واحدة
- ✅ مشاركة مع صديق: +5 رسائل + صورة واحدة
- ✅ كتابة تقييم: +3 رسائل
- ✅ إحالة صديق جديد: +20 رسالة + صورتين
- ✅ تسجيل يومي: +1 رسالة

#### 🌐 دعم اللغات

- 🇸🇦 العربية (الكاملة)
- 🇬🇧 الإنجليزية (الكاملة)
- 🌍 وغيرها من اللغات الشائعة

#### 🎨 التصميم والواجهة

- خلفية هادئة ومريحة للعين
- لوقو مميز لـ Bodrix بخط جميل
- واجهة مستخدم حديثة وسهلة الاستخدام
- دعم الصور والروابط في المحادثات
- تصميم متجاوب (Responsive)

### 🛠️ المتطلبات التقنية

- **Node.js**: 18.0 أو أحدث
- **npm** أو **pnpm**: مدير الحزم
- **قاعدة بيانات**: MySQL/TiDB
- **متصفح**: Chrome, Firefox, Safari, Edge (الإصدارات الحديثة)

### 📥 التثبيت والتشغيل

#### 1. فك ضغط الملف

```bash
unzip bodrix-ai-final.zip
cd bodrix-ai-final
```

#### 2. تثبيت المكتبات

```bash
pnpm install
# أو
npm install
```

#### 3. إعداد ملف البيئة

أنشئ ملف `.env` في جذر المشروع:

```env
# قاعدة البيانات
DATABASE_URL=mysql://user:password@localhost:3306/bodrix_ai

# المصادقة
NEXTAUTH_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret-here

# Google OAuth (اختياري)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Manus OAuth
VITE_OAUTH_PORTAL_URL=your-oauth-portal-url
OAUTH_SERVER_URL=your-oauth-server-url
VITE_APP_ID=your-app-id

# المالك
OWNER_NAME=عبدالله الحصيني
OWNER_OPEN_ID=your-owner-id
```

#### 4. إعداد قاعدة البيانات

```bash
pnpm db:push
```

#### 5. تشغيل المشروع

```bash
# وضع التطوير
pnpm dev

# وضع الإنتاج
pnpm build
pnpm start
```

افتح المتصفح على: `http://localhost:3000`

### 📁 هيكل المشروع

```
bodrix-ai-final/
├── client/                 # واجهة المستخدم (React)
│   ├── src/
│   │   ├── pages/         # صفحات التطبيق
│   │   ├── components/    # المكونات المعاد استخدامها
│   │   ├── lib/           # مكتبات مساعدة
│   │   └── App.tsx        # التطبيق الرئيسي
│   └── public/            # الملفات الثابتة
├── server/                # خادم الويب (Express + tRPC)
│   ├── routers.ts         # إجراءات tRPC
│   ├── db.ts              # مساعدات قاعدة البيانات
│   └── _core/             # ملفات النظام الأساسية
├── drizzle/               # قاعدة البيانات (Drizzle ORM)
│   ├── schema.ts          # نموذج قاعدة البيانات
│   └── migrations/        # تحديثات قاعدة البيانات
├── shared/                # الملفات المشتركة
├── package.json           # معلومات المشروع
├── LICENSE                # رخصة MIT
└── README.md              # هذا الملف
```

### 🧪 الاختبار

```bash
# تشغيل جميع الاختبارات
pnpm test

# تشغيل الاختبارات مع المراقبة
pnpm test --watch
```

### 📊 قاعدة البيانات

يستخدم المشروع **Drizzle ORM** مع **MySQL**. الجداول الرئيسية:

- **users**: بيانات المستخدمين
- **messages**: الرسائل المحفوظة
- **images**: الصور المرفوعة
- **points**: نقاط المستخدمين
- **subscriptions**: بيانات الاشتراكات
- **ads**: الإعلانات المشاهدة
- **referrals**: الإحالات والدعوات

### 🔐 الأمان

- ✅ المصادقة عبر OAuth
- ✅ تشفير كلمات المرور
- ✅ التحقق من الصلاحيات
- ✅ حماية من الهجمات الشائعة
- ✅ HTTPS في الإنتاج

### 📞 الدعم والمساعدة

للمساعدة أو الإبلاغ عن مشاكل:

- 📧 البريد الإلكتروني: `abdlh20101@gmail.com`
- 🐛 الإبلاغ عن الأخطاء: فضلاً أرسل تفاصيل المشكلة

### 📄 الترخيص

هذا المشروع مرخص تحت **MIT License**. انظر ملف `LICENSE` للتفاصيل.

### 👨‍💻 المطور

**عبدالله الحصيني** (Abdullah Al-Husseini)
- 📧 البريد: `abdlh20101@gmail.com`
- 📅 تاريخ الإنشاء: 2026

---

## 🇬🇧 English Version

### 📝 About the Project

**Bodrix AI** is an advanced artificial intelligence platform that provides intelligent conversation services with a multi-tier user system. The project is carefully designed to deliver an exceptional user experience with a flexible points system and diverse subscription options.

### ✨ Key Features

#### 🎯 Four-Tier User System

1. **Developer Account**
   - Unlimited messages
   - Unlimited images
   - No advertisements
   - Full access to statistics
   - User and subscription management
   - Advanced AI with latest updates

2. **Free User Account**
   - 20 daily messages
   - 2-3 daily images
   - Small, non-intrusive ad banners
   - Options to increase messages:
     - Watch ad: +8 messages + 1 image
     - Share with 3 friends: +15 messages + 2 images
     - Watch 2 ads: +25 messages + 2 images

3. **Premium Subscription**
   - Unlimited messages
   - Unlimited images
   - Additional educational resources
   - No advertisements
   - Subscription plans:
     - Week: $9.99
     - Month: $29.99
     - 3 Months: $79.99
     - Year: $199.99

4. **Pro Subscription**
   - Unlimited messages
   - Unlimited images
   - Advanced resources (closed source)
   - No advertisements
   - Priority support
   - Subscription plans:
     - Week: $19.99
     - Month: $59.99
     - 3 Months: $159.99
     - Year: $399.99

#### 💡 Points and Rewards System

Users can earn additional points through:

- ✅ Watch advertisement: +8 messages + 1 image
- ✅ Share with friend: +5 messages + 1 image
- ✅ Write review: +3 messages
- ✅ Refer new friend: +20 messages + 2 images
- ✅ Daily login: +1 message

#### 🌐 Language Support

- 🇸🇦 Arabic (Full)
- 🇬🇧 English (Full)
- 🌍 Other popular languages

#### 🎨 Design and Interface

- Calm and eye-friendly background
- Distinctive Bodrix logo with beautiful font
- Modern and user-friendly interface
- Support for images and links in conversations
- Responsive design

### 🛠️ Technical Requirements

- **Node.js**: 18.0 or higher
- **npm** or **pnpm**: Package manager
- **Database**: MySQL/TiDB
- **Browser**: Chrome, Firefox, Safari, Edge (recent versions)

### 📥 Installation and Running

#### 1. Extract the File

```bash
unzip bodrix-ai-final.zip
cd bodrix-ai-final
```

#### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

#### 3. Setup Environment File

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/bodrix_ai

# Authentication
NEXTAUTH_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret-here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Manus OAuth
VITE_OAUTH_PORTAL_URL=your-oauth-portal-url
OAUTH_SERVER_URL=your-oauth-server-url
VITE_APP_ID=your-app-id

# Owner
OWNER_NAME=Abdullah Al-Husseini
OWNER_OPEN_ID=your-owner-id
```

#### 4. Setup Database

```bash
pnpm db:push
```

#### 5. Run the Project

```bash
# Development mode
pnpm dev

# Production mode
pnpm build
pnpm start
```

Open your browser to: `http://localhost:3000`

### 📁 Project Structure

```
bodrix-ai-final/
├── client/                 # User Interface (React)
│   ├── src/
│   │   ├── pages/         # Application pages
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Helper libraries
│   │   └── App.tsx        # Main application
│   └── public/            # Static files
├── server/                # Web Server (Express + tRPC)
│   ├── routers.ts         # tRPC procedures
│   ├── db.ts              # Database helpers
│   └── _core/             # Core system files
├── drizzle/               # Database (Drizzle ORM)
│   ├── schema.ts          # Database schema
│   └── migrations/        # Database migrations
├── shared/                # Shared files
├── package.json           # Project information
├── LICENSE                # MIT License
└── README.md              # This file
```

### 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests with watch mode
pnpm test --watch
```

### 📊 Database

The project uses **Drizzle ORM** with **MySQL**. Main tables:

- **users**: User data
- **messages**: Saved messages
- **images**: Uploaded images
- **points**: User points
- **subscriptions**: Subscription data
- **ads**: Viewed advertisements
- **referrals**: Referrals and invitations

### 🔐 Security

- ✅ OAuth authentication
- ✅ Password encryption
- ✅ Permission verification
- ✅ Protection against common attacks
- ✅ HTTPS in production

### 📞 Support and Help

For assistance or to report issues:

- 📧 Email: `abdlh20101@gmail.com`
- 🐛 Report bugs: Please send detailed problem description

### 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

### 👨‍💻 Developer

**Abdullah Al-Husseini** (عبدالله الحصيني)
- 📧 Email: `abdlh20101@gmail.com`
- 📅 Creation Date: 2026

---

## 🚀 الخطوات التالية | Next Steps

تم إعداد المشروع بنجاح! الآن يمكنك البدء في تطوير المميزات الإضافية.

The project is ready! You can now start developing additional features.

---

**شكراً لاستخدامك Bodrix AI! | Thank you for using Bodrix AI!** 🎉
