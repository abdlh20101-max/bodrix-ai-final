import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Search,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Zap,
  Shield,
  HelpCircle,
} from "lucide-react";

/**
 * Help Center Page
 * مركز المساعدة والدعم الشامل
 */

export default function HelpCenter() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "الكل", icon: BookOpen },
    { id: "getting-started", label: "البدء السريع", icon: Zap },
    { id: "billing", label: "الفواتير والدفع", icon: "💳" },
    { id: "security", label: "الأمان", icon: Shield },
    { id: "features", label: "الميزات", icon: "⭐" },
  ];

  const faqs = [
    {
      id: 1,
      category: "getting-started",
      question: "كيف أبدأ مع Bodrix AI؟",
      answer:
        "يمكنك البدء بإنشاء حساب مجاني على موقعنا. بعد التسجيل، ستحصل على وصول فوري إلى جميع الميزات الأساسية.",
    },
    {
      id: 2,
      category: "getting-started",
      question: "هل يمكنني استخدام Bodrix بدون دفع؟",
      answer:
        "نعم! لدينا خطة مجانية توفر 5 رسائل يومية و2 صور يومية. للحصول على ميزات أكثر، يمكنك الترقية إلى خطة Pro.",
    },
    {
      id: 3,
      category: "billing",
      question: "ما هي طرق الدفع المتاحة؟",
      answer:
        "نقبل جميع بطاقات الائتمان الرئيسية (Visa, MasterCard, American Express)، وPayPal، وتحويلات بنكية.",
    },
    {
      id: 4,
      category: "billing",
      question: "هل يمكنني استرجاع أموالي؟",
      answer:
        "نعم، نوفر ضمان استرجاع المال لمدة 30 يوم إذا لم تكن راضياً عن الخدمة.",
    },
    {
      id: 5,
      category: "security",
      question: "هل بيانات حسابي آمنة؟",
      answer:
        "نعم، نستخدم أحدث معايير التشفير (SSL/TLS) وحماية DDoS. بيانات المستخدمين محمية بالكامل.",
    },
    {
      id: 6,
      category: "security",
      question: "هل تشاركون بيانات المستخدمين مع أطراف ثالثة؟",
      answer:
        "لا، لا نشارك بيانات المستخدمين مع أي طرف ثالث. نحترم خصوصيتك بالكامل.",
    },
    {
      id: 7,
      category: "features",
      question: "ما الفرق بين خطة Pro و Enterprise؟",
      answer:
        "خطة Pro توفر رسائل وصور غير محدودة مع دعم بريدي. Enterprise تضيف دعم مخصص وAPI وصول وتقارير متقدمة.",
    },
    {
      id: 8,
      category: "features",
      question: "هل يمكنني استخدام API؟",
      answer:
        "نعم، خطة Enterprise توفر وصول كامل إلى API. يمكنك دمج Bodrix في تطبيقاتك الخاصة.",
    },
  ];

  const filteredFaqs =
    selectedCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  const searchedFaqs = filteredFaqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-5xl font-bold mb-6">مركز المساعدة</h1>
          <p className="text-xl text-slate-300 mb-8">
            نحن هنا لمساعدتك. ابحث عن الإجابات أو تواصل معنا مباشرة
          </p>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن سؤال..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            />
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">تواصل معنا</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Mail,
                title: "البريد الإلكتروني",
                description: "رد خلال 24 ساعة",
                contact: "support@bodrix.ai",
                action: "أرسل بريد",
              },
              {
                icon: MessageCircle,
                title: "الدردشة الحية",
                description: "رد فوري",
                contact: "متاح الآن",
                action: "ابدأ الدردشة",
              },
              {
                icon: Phone,
                title: "الهاتف",
                description: "اتصل بنا",
                contact: "+966 50 123 4567",
                action: "اتصل الآن",
              },
              {
                icon: Clock,
                title: "ساعات العمل",
                description: "نحن متاحون",
                contact: "24/7",
                action: "معلومات",
              },
            ].map((option, idx) => {
              const Icon = option.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-700/50 border border-slate-600 rounded-xl p-6 hover:border-slate-500 transition text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{option.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {option.description}
                  </p>
                  <p className="font-semibold mb-4">{option.contact}</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {option.action}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            الأسئلة الشائعة
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((category) => {
              const Icon = typeof category.icon === "string" ? null : category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {typeof category.icon === "string" && category.icon}
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            {searchedFaqs.length > 0 ? (
              searchedFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition"
                >
                  <button
                    onClick={() =>
                      setExpandedFaq(
                        expandedFaq === faq.id ? null : faq.id
                      )
                    }
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/50 transition"
                  >
                    <h3 className="text-lg font-semibold text-left">
                      {faq.question}
                    </h3>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {expandedFaq === faq.id && (
                    <div className="px-6 py-4 bg-slate-700/30 border-t border-slate-700">
                      <p className="text-slate-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">لم نجد نتائج لبحثك</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">هل لم تجد ما تبحث عنه؟</h2>
          <p className="text-xl text-slate-300 mb-8">
            فريقنا جاهز للمساعدة. تواصل معنا الآن
          </p>

          <Button
            onClick={() => {
              // Open contact form or chat
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
          >
            تواصل مع الدعم
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>&copy; 2026 Bodrix AI. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
