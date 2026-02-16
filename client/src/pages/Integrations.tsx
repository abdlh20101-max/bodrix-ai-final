import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Link2, Zap, Mail, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Integrations() {
  const [, navigate] = useLocation();
  const [showApiKey, setShowApiKey] = useState(false);

  const [integrations, setIntegrations] = useState([
    {
      id: "slack",
      name: "Slack",
      description: "تلقي إشعارات وأرسل رسائل مباشرة من Slack",
      icon: "💬",
      status: "connected",
      connectedAt: "2026-02-01",
      features: ["إشعارات", "إرسال رسائل", "تحديثات فورية"],
    },
    {
      id: "gmail",
      name: "Gmail",
      description: "أرسل رسائل بريد إلكتروني مباشرة من التطبيق",
      icon: "📧",
      status: "connected",
      connectedAt: "2026-02-02",
      features: ["إرسال بريد", "جدولة الرسائل", "متابعة"],
    },
    {
      id: "teams",
      name: "Microsoft Teams",
      description: "تعاون مع فريقك عبر Microsoft Teams",
      icon: "👥",
      status: "disconnected",
      features: ["مشاركة المحادثات", "الإشعارات", "التعاون"],
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "ربط مع آلاف التطبيقات عبر Zapier",
      icon: "⚡",
      status: "disconnected",
      features: ["أتمتة", "تكامل متقدم", "سير عمل مخصص"],
    },
    {
      id: "github",
      name: "GitHub",
      description: "ربط مع مستودعات GitHub الخاصة بك",
      icon: "🐙",
      status: "disconnected",
      features: ["مزامنة الملفات", "التحديثات", "التعاون"],
    },
    {
      id: "notion",
      name: "Notion",
      description: "احفظ المحادثات في Notion تلقائياً",
      icon: "📝",
      status: "disconnected",
      features: ["حفظ تلقائي", "قواعد البيانات", "المزامنة"],
    },
  ]);

  const handleConnect = (id: string) => {
    setIntegrations(
      integrations.map((int) =>
        int.id === id
          ? { ...int, status: "connected", connectedAt: new Date().toISOString().split("T")[0] }
          : int
      )
    );
    alert(`تم الاتصال بـ ${integrations.find((i) => i.id === id)?.name} بنجاح!`);
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(
      integrations.map((int) =>
        int.id === id ? { ...int, status: "disconnected" } : int
      )
    );
  };

  const connectedCount = integrations.filter((i) => i.status === "connected").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Link2 className="w-8 h-8" />
              التكامل مع التطبيقات
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              ربط Bodrix AI مع التطبيقات المفضلة لديك
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">التطبيقات المتصلة</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {connectedCount}
            </p>
          </Card>
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">التطبيقات المتاحة</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {integrations.length}
            </p>
          </Card>
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">API Key</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowApiKey(!showApiKey)}
              className="w-full"
            >
              {showApiKey ? "إخفاء" : "عرض"}
            </Button>
          </Card>
        </div>

        {/* API Key Display */}
        {showApiKey && (
          <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              مفتاح API الخاص بك
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <code className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                sk_live_51234567890abcdefghijklmnop
              </code>
              <Button size="sm" variant="outline">
                نسخ
              </Button>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              ⚠️ لا تشارك هذا المفتاح مع أحد. استخدمه فقط في التطبيقات الموثوقة.
            </p>
          </Card>
        )}

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <Card
              key={integration.id}
              className={`p-6 border transition ${
                integration.status === "connected"
                  ? "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                  : "bg-gray-50 dark:bg-slate-800/50 border-gray-300 dark:border-slate-600"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{integration.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {integration.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      {integration.status === "connected" ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-600">متصل</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-400">غير متصل</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {integration.description}
              </p>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  المميزات:
                </p>
                <div className="flex flex-wrap gap-1">
                  {integration.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {integration.status === "connected" && integration.connectedAt && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  متصل منذ: {integration.connectedAt}
                </p>
              )}

              <Button
                onClick={() =>
                  integration.status === "connected"
                    ? handleDisconnect(integration.id)
                    : handleConnect(integration.id)
                }
                className={`w-full ${
                  integration.status === "connected"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {integration.status === "connected" ? "قطع الاتصال" : "الاتصال"}
              </Button>
            </Card>
          ))}
        </div>

        {/* Documentation */}
        <Card className="mt-8 p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📚 الموارد والتوثيق
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                دليل API
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                تعرف على كيفية استخدام API الخاص بنا للتكامل المتقدم
              </p>
              <Button size="sm" variant="outline">
                اقرأ الدليل
              </Button>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                أمثلة الكود
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                أمثلة عملية لكيفية استخدام التكاملات
              </p>
              <Button size="sm" variant="outline">
                عرض الأمثلة
              </Button>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                الدعم الفني
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                احصل على المساعدة من فريق الدعم الخاص بنا
              </p>
              <Button size="sm" variant="outline">
                اتصل بنا
              </Button>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                طلب تكامل جديد
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                لا تجد التطبيق الذي تريده؟ اطلب تكامل جديد
              </p>
              <Button size="sm" variant="outline">
                أرسل طلب
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
