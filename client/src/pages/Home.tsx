import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { PremiumBannerAd, FloatingBannerAd, InlineBannerAd } from "@/components/PremiumBannerAd";
import {
  Sparkles,
  Zap,
  MessageSquare,
  TrendingUp,
  Shield,
  Rocket,
  CheckCircle,
  ArrowRight,
  Users,
  BarChart3,
} from "lucide-react";

/**
 * Home Page - الصفحة الرئيسية
 * صفحة ترحيب جذابة مع عرض الميزات والعروض
 */

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Premium Banner Ad */}
      <PremiumBannerAd variant="gradient" position="top" />

      {/* Navigation */}
      <nav className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <span className="text-2xl font-bold">Bodrix AI</span>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
              <Button
                onClick={() => navigate("/plans")}
                variant="outline"
                className="text-white border-slate-600 hover:bg-slate-800"
              >
                الخطط والباقات
              </Button>
                <Button
                  onClick={() => navigate("/plans")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  اعرض الخطط
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => (window.location.href = getLoginUrl())}
                  variant="outline"
                  className="text-white border-slate-600 hover:bg-slate-800"
                >
                  تسجيل الدخول
                </Button>
                <Button
                  onClick={() => (window.location.href = getLoginUrl())}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  ابدأ الآن
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Background elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

          <div className="relative text-center mb-12">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-sm font-medium text-blue-300">
                🚀 تقنية AI متقدمة
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              مساعدك الذكي في كل مكان
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              استخدم قوة الذكاء الاصطناعي لتحسين إنتاجيتك وإبداعك. مع Bodrix AI، يمكنك إنجاز المزيد في وقت أقل.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-lg"
              >
                ابدأ مجاناً
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                onClick={() => navigate("/billing")}
                variant="outline"
                className="text-white border-slate-600 hover:bg-slate-800 px-8 py-6 text-lg rounded-lg"
              >
                اعرض الخطط
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Inline Banner Ad */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <InlineBannerAd />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            الميزات الرئيسية
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "ذكاء اصطناعي متقدم",
                description:
                  "نماذج AI الأحدث لتقديم نتائج دقيقة وسريعة",
              },
              {
                icon: Zap,
                title: "سرعة فائقة",
                description: "معالجة فورية للطلبات مع أداء عالي",
              },
              {
                icon: MessageSquare,
                title: "محادثات طبيعية",
                description:
                  "تفاعل سلس وطبيعي مع الذكاء الاصطناعي",
              },
              {
                icon: Shield,
                title: "أمان عالي",
                description: "حماية كاملة لبيانات المستخدم والخصوصية",
              },
              {
                icon: TrendingUp,
                title: "تحليلات متقدمة",
                description:
                  "رؤى عميقة حول استخدامك والنتائج",
              },
              {
                icon: Rocket,
                title: "تحديثات مستمرة",
                description: "ميزات جديدة وتحسينات دائمة",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-slate-600 hover:bg-slate-800/80 transition group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            خطط مناسبة لكل احتياجاتك
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "مجاني",
                price: "0",
                description: "للبدء",
                features: [
                  "5 رسائل يومية",
                  "2 صور يومية",
                  "دعم المجتمع",
                ],
                cta: "ابدأ الآن",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "99",
                description: "الأكثر شهرة",
                features: [
                  "رسائل غير محدودة",
                  "صور غير محدودة",
                  "أولويات عالية",
                  "دعم بريدي",
                ],
                cta: "اشترك الآن",
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "299",
                description: "للمحترفين",
                features: [
                  "كل شيء في Pro",
                  "دعم مخصص",
                  "API وصول",
                  "تقارير متقدمة",
                ],
                cta: "تواصل معنا",
                highlighted: false,
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-8 transition ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-purple-400 scale-105"
                    : "bg-slate-800 border border-slate-700 hover:border-slate-600"
                }`}
              >
                {plan.highlighted && (
                  <div className="mb-4 inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    ⭐ الأكثر شهرة
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-slate-400 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-slate-400 mr-2">ريال/شهر</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => navigate("/plans")}
                  className={`w-full ${
                    plan.highlighted
                      ? "bg-white text-blue-600 hover:bg-gray-100"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            موثوق من قبل آلاف المستخدمين
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                stat: "50,000+",
                label: "مستخدم نشط",
              },
              {
                icon: BarChart3,
                stat: "1M+",
                label: "رسالة معالجة",
              },
              {
                icon: TrendingUp,
                stat: "99.9%",
                label: "توفر الخدمة",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-3xl font-bold mb-2">{item.stat}</p>
                  <p className="text-slate-400">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Floating Banner Ad */}
      <FloatingBannerAd />

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">المنتج</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    الميزات
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    الأسعار
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    الأمان
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">الشركة</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    عن Bodrix
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    المدونة
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    الوظائف
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">القانوني</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    سياسة الخصوصية
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    شروط الخدمة
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    سياسة الملفات
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">التواصل</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="mailto:support@bodrix.ai" className="hover:text-white transition">
                    البريد الإلكتروني
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    تويتر
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    لينكدإن
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>&copy; 2026 Bodrix AI. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
