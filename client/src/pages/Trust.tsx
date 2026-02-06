import { Shield, Lock, Eye, CheckCircle, Award, Zap, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

/**
 * Trust & Security Page
 * صفحة الثقة والأمان لبناء ثقة المستخدمين
 */

export default function Trust() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <span className="text-2xl font-bold">Bodrix AI</span>
          </button>

          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="text-white border-slate-600 hover:bg-slate-800"
          >
            العودة للرئيسية
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">الأمان والثقة أولاً</h1>
          <p className="text-xl text-slate-300">
            نحن نلتزم بأعلى معايير الأمان والخصوصية لحماية بيانات المستخدمين
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            ميزات الأمان
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Lock,
                title: "تشفير من طرف إلى طرف",
                description:
                  "جميع البيانات مشفرة باستخدام أحدث معايير التشفير",
              },
              {
                icon: Shield,
                title: "حماية DDoS",
                description:
                  "حماية متقدمة ضد هجمات الحرمان من الخدمة",
              },
              {
                icon: Eye,
                title: "مراقبة 24/7",
                description:
                  "مراقبة مستمرة للأمان والأداء على مدار الساعة",
              },
              {
                icon: Award,
                title: "شهادات أمان",
                description:
                  "معتمد من قبل أفضل معايير الأمان الدولية",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-700/50 border border-slate-600 rounded-xl p-6 hover:border-slate-500 transition"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            الشهادات والمعايير
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "ISO 27001",
                description:
                  "معيار إدارة أمان المعلومات الدولي",
                icon: "🔐",
              },
              {
                title: "GDPR",
                description:
                  "الامتثال الكامل لقانون حماية البيانات الأوروبي",
                icon: "🛡️",
              },
              {
                title: "SOC 2",
                description:
                  "معايير الأمان والموثوقية والسرية",
                icon: "✓",
              },
              {
                title: "SSL/TLS",
                description:
                  "تشفير آمن لجميع الاتصالات",
                icon: "🔒",
              },
            ].map((cert, idx) => (
              <div
                key={idx}
                className="bg-slate-800 border border-slate-700 rounded-xl p-8 hover:border-slate-600 transition"
              >
                <div className="text-4xl mb-4">{cert.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{cert.title}</h3>
                <p className="text-slate-400">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Policy */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">سياسة الخصوصية</h2>

          <div className="space-y-8">
            {[
              {
                title: "جمع البيانات",
                content:
                  "نجمع فقط البيانات الضرورية لتقديم الخدمة. لا نبيع أو نشارك بيانات المستخدمين مع أطراف ثالثة.",
              },
              {
                title: "استخدام البيانات",
                content:
                  "تُستخدم بيانات المستخدم فقط لتحسين الخدمة وتقديم تجربة أفضل. نحترم خصوصيتك بالكامل.",
              },
              {
                title: "حقوق المستخدم",
                content:
                  "لديك الحق في الوصول إلى بيانات حسابك وحذفها وتعديلها في أي وقت.",
              },
              {
                title: "الاتصال بنا",
                content:
                  "إذا كان لديك أي أسئلة حول الخصوصية، يمكنك التواصل معنا على privacy@bodrix.ai",
              },
            ].map((policy, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-2xl font-bold mb-3">{policy.title}</h3>
                <p className="text-slate-400 text-lg">{policy.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            إحصائيات الثقة
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                stat: "500K+",
                label: "مستخدم موثوق",
              },
              {
                icon: Zap,
                stat: "99.99%",
                label: "توفر الخدمة",
              },
              {
                icon: Globe,
                stat: "150+",
                label: "دولة",
              },
              {
                icon: Shield,
                stat: "0",
                label: "خرق أمني",
              },
            ].map((metric, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <metric.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-4xl font-bold mb-2">{metric.stat}</p>
                <p className="text-slate-400">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">دعم العملاء</h2>
          <p className="text-xl text-slate-300 mb-8">
            فريقنا متاح 24/7 للإجابة على أسئلتك والمساعدة في أي مشاكل
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
              تواصل معنا
            </Button>
            <Button
              variant="outline"
              className="text-white border-slate-600 hover:bg-slate-800 px-8 py-6 text-lg"
            >
              مركز المساعدة
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>&copy; 2026 Bodrix AI. جميع الحقوق محفوظة.</p>
          <div className="flex justify-center gap-6 mt-6">
            <a href="#" className="hover:text-white transition">
              سياسة الخصوصية
            </a>
            <a href="#" className="hover:text-white transition">
              شروط الخدمة
            </a>
            <a href="#" className="hover:text-white transition">
              اتصل بنا
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
