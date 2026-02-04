import { useState } from "react";
import { useLanguage } from "@/_core/hooks/useLanguage";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Smartphone, Landmark } from "lucide-react";
import { useLocation } from "wouter";

interface CheckoutProps {
  planId: string;
  planName: string;
  price: number;
}

export default function Checkout() {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<
    "stripe" | "apple_pay" | "google_pay" | "paypal" | "bank_transfer"
  >("stripe");
  const [isProcessing, setIsProcessing] = useState(false);

  // Get plan from URL params or state
  const searchParams = new URLSearchParams(window.location.search);
  const planId = searchParams.get("planId") || "";
  const planName = searchParams.get("planName") || "";
  const price = Number(searchParams.get("price")) || 0;

  const subscriptionMutation = trpc.subscriptions.create.useMutation({
    onSuccess: (data) => {
      alert(t("checkout.success") || "تم الاشتراك بنجاح!");
      navigate("/plans");
    },
    onError: (error) => {
      alert(t("checkout.error") || "حدث خطأ: " + error.message);
      setIsProcessing(false);
    },
  });

  const handlePayment = async () => {
    if (!planId) {
      alert(t("checkout.selectPlan") || "الرجاء اختيار خطة");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    // In a real app, this would integrate with payment gateways
    setTimeout(() => {
      subscriptionMutation.mutate({
        planType: planId as any,
        paymentMethod,
        transactionId: `TXN-${Date.now()}`,
      });
    }, 2000);
  };

  const paymentMethods = [
    {
      id: "stripe",
      name: "Stripe",
      icon: <CreditCard className="w-6 h-6" />,
      description: "بطاقة ائتمان أو خصم",
    },
    {
      id: "apple_pay",
      name: "Apple Pay",
      icon: <Smartphone className="w-6 h-6" />,
      description: "الدفع عبر Apple Pay",
    },
    {
      id: "google_pay",
      name: "Google Pay",
      icon: <Smartphone className="w-6 h-6" />,
      description: "الدفع عبر Google Pay",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <CreditCard className="w-6 h-6" />,
      description: "الدفع عبر PayPal",
    },
    {
      id: "bank_transfer",
      name: t("checkout.bankTransfer") || "تحويل بنكي",
      icon: <Landmark className="w-6 h-6" />,
      description: "تحويل مباشر إلى حساب الراجحي",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/plans")}
            className="p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("checkout.title") || "إتمام الدفع"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("checkout.subtitle") || "اختر طريقة الدفع المفضلة"}
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <Card className="p-6 mb-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("checkout.orderSummary") || "ملخص الطلب"}
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                {t("checkout.plan") || "الخطة"}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {planName}
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-slate-700 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("checkout.total") || "الإجمالي"}
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  ${(price / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("checkout.paymentMethod") || "طريقة الدفع"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() =>
                  setPaymentMethod(method.id as typeof paymentMethod)
                }
                className={`p-4 rounded-lg border-2 transition ${
                  paymentMethod === method.id
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-slate-700 hover:border-blue-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-gray-600 dark:text-gray-400">
                    {method.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {method.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {method.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Bank Transfer Info */}
          {paymentMethod === "bank_transfer" && (
            <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                {t("checkout.bankDetails") || "تفاصيل الحساب البنكي"}
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>{t("checkout.bankName") || "اسم البنك"}:</strong> بنك الراجحي
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>{t("checkout.accountName") || "اسم الحساب"}:</strong> عبدالله الحصيني
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>{t("checkout.accountNumber") || "رقم الحساب"}:</strong> XXXX XXXX XXXX
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>{t("checkout.ibanNumber") || "رقم IBAN"}:</strong> SA XX XXXX XXXX XXXX XXXX XXXX
                </p>
              </div>
            </Card>
          )}

          {/* Email for Receipt */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t("checkout.email") || "البريد الإلكتروني"}
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              className="w-full"
            />
          </div>

          {/* Terms */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t("checkout.terms") ||
                "بالنقر على زر الدفع، أوافق على الشروط والأحكام"}
            </p>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing || subscriptionMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            {isProcessing || subscriptionMutation.isPending ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t("checkout.processing") || "جاري المعالجة..."}
              </span>
            ) : (
              `${t("checkout.pay") || "ادفع الآن"} $${(price / 100).toFixed(2)}`
            )}
          </Button>
        </Card>
      </div>
    </div>
  );
}
