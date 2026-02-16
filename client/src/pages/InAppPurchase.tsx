import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Zap, Check } from "lucide-react";
import { useLocation } from "wouter";

export default function InAppPurchase() {
  const [, navigate] = useLocation();
  const [userBalance, setUserBalance] = useState(3850);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const [packages] = useState([
    {
      id: "1",
      name: "الحزمة الأساسية",
      points: 100,
      price: 9.99,
      discount: 0,
      icon: "💙",
      popular: false,
    },
    {
      id: "2",
      name: "الحزمة الموصى بها",
      points: 500,
      price: 39.99,
      discount: 10,
      icon: "💜",
      popular: true,
    },
    {
      id: "3",
      name: "الحزمة الاحترافية",
      points: 1200,
      price: 79.99,
      discount: 20,
      icon: "💛",
      popular: false,
    },
    {
      id: "4",
      name: "الحزمة الفاخرة",
      points: 3000,
      price: 179.99,
      discount: 30,
      icon: "💚",
      popular: false,
    },
  ]);

  const [paymentMethods] = useState([
    { id: "stripe", name: "Stripe", icon: "💳" },
    { id: "paypal", name: "PayPal", icon: "🅿️" },
    { id: "apple", name: "Apple Pay", icon: "🍎" },
    { id: "google", name: "Google Pay", icon: "🔵" },
  ]);

  const [selectedPayment, setSelectedPayment] = useState("stripe");
  const [showCheckout, setShowCheckout] = useState(false);

  const getSelectedPackage = () =>
    packages.find((p) => p.id === selectedPackage);

  const handlePurchase = () => {
    const pkg = getSelectedPackage();
    if (pkg) {
      setUserBalance(userBalance + pkg.points);
      alert(
        `تم شراء ${pkg.points} نقطة بنجاح! رصيدك الجديد: ${userBalance + pkg.points}`
      );
      setSelectedPackage(null);
      setShowCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingCart className="w-8 h-8" />
                شراء النقاط
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                اشترِ نقاط إضافية واستمتع بمميزات أكثر
              </p>
            </div>
          </div>

          <Card className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
            <p className="text-sm opacity-90">رصيدك الحالي</p>
            <p className="text-3xl font-bold flex items-center gap-2">
              <Zap className="w-6 h-6" />
              {userBalance}
            </p>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            اختر حزمتك
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`p-6 border transition cursor-pointer ${
                  selectedPackage === pkg.id
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400 ring-2 ring-blue-500"
                    : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600"
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <div className="relative mb-4">
                  <p className="text-4xl">{pkg.icon}</p>
                  {pkg.popular && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      الأفضل
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {pkg.name}
                </h3>

                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1">
                  <Zap className="w-6 h-6" />
                  {pkg.points}
                </p>

                <div className="mb-4">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ${pkg.price}
                  </p>
                  {pkg.discount > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      وفّر {pkg.discount}%
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {(pkg.price / pkg.points).toFixed(3)}$ لكل نقطة
                  </span>
                  {selectedPackage === pkg.id && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {showCheckout && selectedPackage && (
          <Card className="p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              إتمام الشراء
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  ملخص الطلب
                </h3>

                <Card className="p-4 bg-gray-50 dark:bg-slate-700/50 border-0 mb-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        الحزمة
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {getSelectedPackage()?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        النقاط
                      </span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        {getSelectedPackage()?.points}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-slate-600 pt-3 flex justify-between">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        الإجمالي
                      </span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ${getSelectedPackage()?.price}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  طريقة الدفع
                </h3>

                <div className="space-y-3 mb-6">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                        selectedPayment === method.id
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400"
                          : "bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="hidden"
                      />
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {method.name}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                <Button
                  onClick={handlePurchase}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                >
                  إتمام الشراء
                </Button>
              </div>
            </div>
          </Card>
        )}

        {!showCheckout && selectedPackage && (
          <div className="flex gap-4">
            <Button
              onClick={() => setShowCheckout(true)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
            >
              متابعة للدفع
            </Button>
            <Button
              onClick={() => setSelectedPackage(null)}
              variant="outline"
              className="flex-1"
            >
              إلغاء
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
