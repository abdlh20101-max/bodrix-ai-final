import { useLanguage } from "@/_core/hooks/useLanguage";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Check, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  days: number;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "premium_week",
    name: "Premium أسبوع",
    price: 9.99,
    currency: "USD",
    days: 7,
    features: [
      "رسائل غير محدودة",
      "أولوية في الدعم",
      "إزالة الإعلانات",
      "مميزات متقدمة",
    ],
  },
  {
    id: "premium_month",
    name: "Premium شهر",
    price: 29.99,
    currency: "USD",
    days: 30,
    features: [
      "رسائل غير محدودة",
      "أولوية في الدعم",
      "إزالة الإعلانات",
      "مميزات متقدمة",
      "تحليلات متقدمة",
    ],
    popular: true,
  },
  {
    id: "premium_year",
    name: "Premium سنة",
    price: 99.99,
    currency: "USD",
    days: 365,
    features: [
      "رسائل غير محدودة",
      "أولوية في الدعم",
      "إزالة الإعلانات",
      "مميزات متقدمة",
      "تحليلات متقدمة",
      "دعم 24/7",
    ],
  },
];

export default function Checkout() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createPayPalSubscriptionMutation = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      toast.success(language === "ar" ? "تم إنشاء الاشتراك بنجاح" : "Subscription created successfully");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || (language === "ar" ? "حدث خطأ" : "An error occurred"));
      setIsLoading(false);
    },
  });

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate("/");
      return;
    }

    setSelectedPlan(planId);
    setIsLoading(true);

    try {
      await createPayPalSubscriptionMutation.mutateAsync({
        planType: planId as any,
        paymentMethod: "paypal",
        transactionId: `TXN-${Date.now()}`,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {language === "ar" ? "الخطط والاشتراكات" : "Plans & Subscriptions"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {language === "ar"
                ? "اختر الخطة المناسبة لك"
                : "Choose the right plan for you"}
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative p-8 transition-all ${
                plan.popular
                  ? "border-2 border-blue-500 shadow-lg scale-105"
                  : "border border-gray-200 dark:border-slate-700"
              } bg-white dark:bg-slate-800`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    {language === "ar" ? "الأكثر شيوعاً" : "Most Popular"}
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ${plan.price}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  {language === "ar" ? `لمدة ${plan.days} يوم` : `for ${plan.days} days`}
                </span>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isLoading && selectedPlan === plan.id}
                className={`w-full py-3 font-semibold ${
                  plan.popular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white"
                }`}
              >
                {isLoading && selectedPlan === plan.id ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    {language === "ar" ? "جاري المعالجة..." : "Processing..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {language === "ar" ? "اشترك الآن" : "Subscribe Now"}
                  </span>
                )}
              </Button>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {language === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {language === "ar"
                  ? "هل يمكنني إلغاء الاشتراك؟"
                  : "Can I cancel my subscription?"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === "ar"
                  ? "نعم، يمكنك إلغاء الاشتراك في أي وقت من لوحة التحكم"
                  : "Yes, you can cancel your subscription anytime from the dashboard"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {language === "ar"
                  ? "ما هي طرق الدفع المتاحة؟"
                  : "What payment methods are available?"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === "ar"
                  ? "نحن نقبل جميع بطاقات الائتمان والخصم عبر PayPal"
                  : "We accept all credit and debit cards via PayPal"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                {language === "ar"
                  ? "هل هناك فترة تجريبية مجانية؟"
                  : "Is there a free trial period?"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {language === "ar"
                  ? "لا، لكن يمكنك استخدام النسخة المجانية بدون حد"
                  : "No, but you can use the free version without limits"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
