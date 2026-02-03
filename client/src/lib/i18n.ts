// Language translations for Bodrix AI
export type Language = 'ar' | 'en';

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.chat': 'المحادثة',
    'nav.dashboard': 'لوحة التحكم',
    'nav.plans': 'الخطط',
    'nav.profile': 'الملف الشخصي',
    'nav.logout': 'تسجيل الخروج',
    'nav.login': 'تسجيل الدخول',

    // Home Page
    'home.title': 'مرحباً بك في Bodrix AI',
    'home.subtitle': 'منصة الذكاء الاصطناعي المتقدمة',
    'home.description': 'احصل على إجابات ذكية وحلول سريعة مع Bodrix AI',
    'home.cta': 'ابدأ الآن',
    'home.features': 'المميزات',

    // Chat Page
    'chat.title': 'محادثة Bodrix',
    'chat.placeholder': 'اكتب رسالتك هنا...',
    'chat.send': 'إرسال',
    'chat.messagesLeft': 'الرسائل المتبقية',
    'chat.imagesLeft': 'الصور المتبقية',
    'chat.uploadImage': 'رفع صورة',
    'chat.addLink': 'إضافة رابط',
    'chat.limitReached': 'لقد وصلت إلى الحد اليومي',
    'chat.watchAdForMore': 'شاهد إعلان لزيادة الرسائل',
    'chat.shareForMore': 'شارك مع أصدقائك لزيادة الرسائل',

    // Points System
    'points.title': 'نقاطي',
    'points.balance': 'الرصيد الحالي',
    'points.history': 'سجل النقاط',
    'points.watchAd': 'مشاهدة إعلان',
    'points.share': 'مشاركة',
    'points.referral': 'إحالة',
    'points.dailyLogin': 'تسجيل يومي',
    'points.review': 'تقييم',
    'points.earned': 'نقاط مكتسبة',
    'points.reason': 'السبب',
    'points.date': 'التاريخ',

    // Subscriptions
    'subscription.title': 'الخطط والاشتراكات',
    'subscription.free': 'مجاني',
    'subscription.premium': 'Premium',
    'subscription.pro': 'Pro',
    'subscription.current': 'الخطة الحالية',
    'subscription.upgrade': 'ترقية',
    'subscription.subscribe': 'اشترك الآن',
    'subscription.perMonth': 'شهرياً',
    'subscription.perWeek': 'أسبوعياً',
    'subscription.per3Months': 'كل 3 أشهر',
    'subscription.perYear': 'سنوياً',
    'subscription.features': 'المميزات',
    'subscription.unlimitedMessages': 'رسائل غير محدودة',
    'subscription.unlimitedImages': 'صور غير محدودة',
    'subscription.noAds': 'بدون إعلانات',
    'subscription.educationalResources': 'مصادر تعليمية',
    'subscription.advancedResources': 'مصادر متقدمة',
    'subscription.prioritySupport': 'دعم أولوية',

    // Profile
    'profile.title': 'الملف الشخصي',
    'profile.name': 'الاسم',
    'profile.email': 'البريد الإلكتروني',
    'profile.accountType': 'نوع الحساب',
    'profile.joinDate': 'تاريخ الانضمام',
    'profile.language': 'اللغة',
    'profile.settings': 'الإعدادات',
    'profile.edit': 'تعديل',
    'profile.save': 'حفظ',
    'profile.cancel': 'إلغاء',

    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.stats': 'الإحصائيات',
    'dashboard.totalMessages': 'إجمالي الرسائل',
    'dashboard.totalImages': 'إجمالي الصور',
    'dashboard.totalPoints': 'إجمالي النقاط',
    'dashboard.recentActivity': 'النشاط الأخير',
    'dashboard.noActivity': 'لا توجد أنشطة حالياً',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.success': 'تم بنجاح',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.save': 'حفظ',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.ok': 'حسناً',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.chat': 'Chat',
    'nav.dashboard': 'Dashboard',
    'nav.plans': 'Plans',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.login': 'Login',

    // Home Page
    'home.title': 'Welcome to Bodrix AI',
    'home.subtitle': 'Advanced AI Platform',
    'home.description': 'Get smart answers and quick solutions with Bodrix AI',
    'home.cta': 'Get Started',
    'home.features': 'Features',

    // Chat Page
    'chat.title': 'Bodrix Chat',
    'chat.placeholder': 'Type your message here...',
    'chat.send': 'Send',
    'chat.messagesLeft': 'Messages Left',
    'chat.imagesLeft': 'Images Left',
    'chat.uploadImage': 'Upload Image',
    'chat.addLink': 'Add Link',
    'chat.limitReached': 'You have reached your daily limit',
    'chat.watchAdForMore': 'Watch an ad for more messages',
    'chat.shareForMore': 'Share with friends for more messages',

    // Points System
    'points.title': 'My Points',
    'points.balance': 'Current Balance',
    'points.history': 'Points History',
    'points.watchAd': 'Watch Ad',
    'points.share': 'Share',
    'points.referral': 'Referral',
    'points.dailyLogin': 'Daily Login',
    'points.review': 'Review',
    'points.earned': 'Points Earned',
    'points.reason': 'Reason',
    'points.date': 'Date',

    // Subscriptions
    'subscription.title': 'Plans & Subscriptions',
    'subscription.free': 'Free',
    'subscription.premium': 'Premium',
    'subscription.pro': 'Pro',
    'subscription.current': 'Current Plan',
    'subscription.upgrade': 'Upgrade',
    'subscription.subscribe': 'Subscribe Now',
    'subscription.perMonth': 'Per Month',
    'subscription.perWeek': 'Per Week',
    'subscription.per3Months': 'Per 3 Months',
    'subscription.perYear': 'Per Year',
    'subscription.features': 'Features',
    'subscription.unlimitedMessages': 'Unlimited Messages',
    'subscription.unlimitedImages': 'Unlimited Images',
    'subscription.noAds': 'No Ads',
    'subscription.educationalResources': 'Educational Resources',
    'subscription.advancedResources': 'Advanced Resources',
    'subscription.prioritySupport': 'Priority Support',

    // Profile
    'profile.title': 'Profile',
    'profile.name': 'Name',
    'profile.email': 'Email',
    'profile.accountType': 'Account Type',
    'profile.joinDate': 'Join Date',
    'profile.language': 'Language',
    'profile.settings': 'Settings',
    'profile.edit': 'Edit',
    'profile.save': 'Save',
    'profile.cancel': 'Cancel',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.stats': 'Statistics',
    'dashboard.totalMessages': 'Total Messages',
    'dashboard.totalImages': 'Total Images',
    'dashboard.totalPoints': 'Total Points',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.noActivity': 'No activity yet',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.save': 'Save',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
  },
};

// Get translation
export function t(key: string, language: Language = 'ar'): string {
  return translations[language][key] || key;
}

// Get all translations for a language
export function getTranslations(language: Language) {
  return translations[language];
}
