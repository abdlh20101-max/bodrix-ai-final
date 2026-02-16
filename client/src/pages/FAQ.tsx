import { useLanguage } from "@/_core/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

interface FAQItem {
  id: string;
  question: { ar: string; en: string };
  answer: { ar: string; en: string };
}

const faqItems: FAQItem[] = [
  {
    id: "1",
    question: {
      ar: "كم عدد الرسائل المتاحة يومياً؟",
      en: "How many messages are available daily?",
    },
    answer: {
      ar: "المستخدمون المجانيون يحصلون على 20 رسالة يومية. يمكنك زيادة هذا العدد بمشاهدة الإعلانات أو الاشتراك في خطة مدفوعة.",
      en: "Free users get 20 messages daily. You can increase this by watching ads or subscribing to a paid plan.",
    },
  },
  {
    id: "2",
    question: {
      ar: "كيف يمكنني زيادة عدد الرسائل؟",
      en: "How can I increase my message count?",
    },
    answer: {
      ar: "يمكنك زيادة عدد الرسائل بـ:\n1. مشاهدة الإعلانات (+8 رسائل)\n2. مشاركة التطبيق مع أصدقاء (+15 رسالة)\n3. الاشتراك في خطة مدفوعة (رسائل غير محدودة)",
      en: "You can increase messages by:\n1. Watching ads (+8 messages)\n2. Sharing with friends (+15 messages)\n3. Subscribing to a paid plan (unlimited messages)",
    },
  },
  {
    id: "3",
    question: {
      ar: "ما الفرق بين الخطط المختلفة؟",
      en: "What's the difference between plans?",
    },
    answer: {
      ar: "خطة Free: 20 رسالة يومية، 2-3 صور يومية\nخطة Starter: 100 رسالة يومية، بدون إعلانات\nخطة Premium: رسائل غير محدودة، مصادر تعليمية\nخطة Pro: كل المميزات + مصادر متقدمة + أولوية في الدعم",
      en: "Free: 20 daily messages, 2-3 daily images\nStarter: 100 daily messages, no ads\nPremium: Unlimited messages, educational resources\nPro: All features + advanced resources + priority support",
    },
  },
  {
    id: "4",
    question: {
      ar: "هل يمكنني حفظ محادثاتي؟",
      en: "Can I save my conversations?",
    },
    answer: {
      ar: "نعم! جميع محادثاتك محفوظة تلقائياً في حسابك. يمكنك الوصول إليها في أي وقت من جهاز أي.",
      en: "Yes! All your conversations are automatically saved. You can access them anytime from any device.",
    },
  },
  {
    id: "5",
    question: {
      ar: "هل بيانات حسابي آمنة؟",
      en: "Is my account data secure?",
    },
    answer: {
      ar: "نعم، بيانات حسابك محمية بالكامل. نحن نستخدم تشفير SSL وأفضل ممارسات الأمان. لا نشارك معلوماتك مع أي جهة خارجية.",
      en: "Yes, your data is fully protected. We use SSL encryption and best security practices. We never share your information with third parties.",
    },
  },
  {
    id: "6",
    question: {
      ar: "كيف يمكنني الاتصال بالدعم؟",
      en: "How can I contact support?",
    },
    answer: {
      ar: "يمكنك التواصل معنا عبر البريد الإلكتروني: support@bodrix.ai أو من خلال صفحة الاتصال في التطبيق.",
      en: "You can reach us via email: support@bodrix.ai or through the contact page in the app.",
    },
  },
];

export default function FAQ() {
  const { language } = useLanguage();
  const [, navigate] = useLocation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-muted rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {language === "ar" ? "الأسئلة الشائعة" : "FAQ"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {language === "ar" ? "إجابات على أسئلتك" : "Answers to your questions"}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        {faqItems.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover:border-primary/50 transition"
            onClick={() => toggleExpand(item.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {language === "ar" ? item.question.ar : item.question.en}
                </CardTitle>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    expandedId === item.id ? "rotate-180" : ""
                  }`}
                />
              </div>
            </CardHeader>
            {expandedId === item.id && (
              <CardContent className="pt-0">
                <p className="text-muted-foreground whitespace-pre-line">
                  {language === "ar" ? item.answer.ar : item.answer.en}
                </p>
              </CardContent>
            )}
          </Card>
        ))}

        {/* Contact Section */}
        <Card className="bg-primary/10 border-primary/20 mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">
              {language === "ar" ? "لم تجد الإجابة؟" : "Didn't find the answer?"}
            </CardTitle>
            <CardDescription>
              {language === "ar"
                ? "تواصل معنا وسنساعدك في أسرع وقت"
                : "Contact us and we'll help you ASAP"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              {language === "ar" ? "اتصل بنا" : "Contact Us"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
