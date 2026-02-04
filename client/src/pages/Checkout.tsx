import { useLanguage } from "@/_core/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock } from "lucide-react";
import { useLocation } from "wouter";

export default function Checkout() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              خدمة الدفع
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              نظام الدفع قيد الإعداد
            </p>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card className="p-12 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
              <Clock className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            قريباً جداً! ⏳
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            نظام الدفع والاشتراكات قيد الإعداد حالياً
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
              ✅ ما هو متاح الآن:
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
              <li>✓ محادثات غير محدودة مع AI</li>
              <li>✓ الإعلانات والأرباح (Monetag)</li>
              <li>✓ نظام الإحالات</li>
              <li>✓ المحفظة الإلكترونية</li>
              <li>✓ جميع المميزات الأساسية</li>
            </ul>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-green-900 dark:text-green-200 mb-3">
              🚀 قريباً:
            </h3>
            <ul className="space-y-2 text-sm text-green-800 dark:text-green-300">
              <li>✓ نظام الدفع والاشتراكات</li>
              <li>✓ خطط مميزة</li>
              <li>✓ مميزات متقدمة</li>
              <li>✓ سحب الأرباح</li>
            </ul>
          </div>

          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            العودة إلى لوحة التحكم
          </Button>
        </Card>
      </div>
    </div>
  );
}
