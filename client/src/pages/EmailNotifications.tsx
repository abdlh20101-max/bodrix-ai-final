import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mail, Bell, Settings, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function EmailNotifications() {
  const [, navigate] = useLocation();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "daily_limit",
      title: "تنبيه الحد اليومي",
      description: "تنبيه عند الاقتراب من الحد الأقصى للرسائل اليومية",
      enabled: true,
      frequency: "عند الاقتراب",
    },
    {
      id: 2,
      type: "new_response",
      title: "رد جديد من Bodrix",
      description: "إخطار عند تلقي رد جديد من الذكاء الاصطناعي",
      enabled: true,
      frequency: "فوري",
    },
    {
      id: 3,
      type: "payment_success",
      title: "تأكيد الدفع",
      description: "إخطار عند نجاح عملية دفع",
      enabled: true,
      frequency: "فوري",
    },
    {
      id: 4,
      type: "subscription_renewal",
      title: "تجديد الاشتراك",
      description: "إخطار قبل تجديد الاشتراك بـ 3 أيام",
      enabled: true,
      frequency: "قبل 3 أيام",
    },
    {
      id: 5,
      type: "referral_bonus",
      title: "مكافأة الإحالة",
      description: "إخطار عند كسب مكافأة من إحالة صديق",
      enabled: true,
      frequency: "فوري",
    },
    {
      id: 6,
      type: "weekly_digest",
      title: "الملخص الأسبوعي",
      description: "ملخص أسبوعي لنشاطك واستخدامك",
      enabled: true,
      frequency: "أسبوعي",
    },
    {
      id: 7,
      type: "promotions",
      title: "العروض الترويجية",
      description: "إخطارات حول العروض والخصومات الخاصة",
      enabled: false,
      frequency: "حسب الحاجة",
    },
    {
      id: 8,
      type: "badge_earned",
      title: "شارة جديدة",
      description: "إخطار عند كسب شارة جديدة",
      enabled: true,
      frequency: "فوري",
    },
  ]);

  const [emailPreferences, setEmailPreferences] = useState({
    frequency: "immediate",
    digest: "weekly",
    unsubscribeAll: false,
  });

  const handleToggleNotification = (id: number) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, enabled: !n.enabled } : n
      )
    );
  };

  const handleSavePreferences = () => {
    console.log("حفظ التفضيلات:", emailPreferences);
    alert("تم حفظ التفضيلات بنجاح!");
  };

  const enabledCount = notifications.filter((n) => n.enabled).length;

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              الإشعارات البريدية
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              إدارة الإشعارات والتنبيهات التي تصل إلى بريدك الإلكتروني
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ملخص الإشعارات
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    الإشعارات المفعلة
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {enabledCount}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    الإجمالي
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {notifications.length}
                  </p>
                </div>

                <Button
                  onClick={() => {
                    setNotifications(
                      notifications.map((n) => ({ ...n, enabled: true }))
                    );
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  تفعيل الكل
                </Button>

                <Button
                  onClick={() => {
                    setNotifications(
                      notifications.map((n) => ({ ...n, enabled: false }))
                    );
                  }}
                  variant="outline"
                  className="w-full"
                >
                  تعطيل الكل
                </Button>
              </div>

              {/* Preferences */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  التفضيلات
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-2">
                      تكرار الإرسال
                    </label>
                    <select
                      value={emailPreferences.frequency}
                      onChange={(e) =>
                        setEmailPreferences({
                          ...emailPreferences,
                          frequency: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="immediate">فوري</option>
                      <option value="daily">يومي</option>
                      <option value="weekly">أسبوعي</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-2">
                      الملخص
                    </label>
                    <select
                      value={emailPreferences.digest}
                      onChange={(e) =>
                        setEmailPreferences({
                          ...emailPreferences,
                          digest: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="daily">يومي</option>
                      <option value="weekly">أسبوعي</option>
                      <option value="monthly">شهري</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailPreferences.unsubscribeAll}
                      onChange={(e) =>
                        setEmailPreferences({
                          ...emailPreferences,
                          unsubscribeAll: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      إلغاء الاشتراك من الكل
                    </span>
                  </label>
                </div>

                <Button
                  onClick={handleSavePreferences}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                >
                  حفظ التفضيلات
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Notifications List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`p-3 rounded-lg ${
                          notification.enabled
                            ? "bg-blue-100 dark:bg-blue-900/30"
                            : "bg-gray-100 dark:bg-slate-700/50"
                        }`}
                      >
                        {notification.type === "daily_limit" && (
                          <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        )}
                        {notification.type === "new_response" && (
                          <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                        )}
                        {notification.type === "payment_success" && (
                          <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        )}
                        {notification.type === "subscription_renewal" && (
                          <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        )}
                        {notification.type === "referral_bonus" && (
                          <Bell className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        )}
                        {notification.type === "weekly_digest" && (
                          <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        )}
                        {notification.type === "promotions" && (
                          <Bell className="w-6 h-6 text-red-600 dark:text-red-400" />
                        )}
                        {notification.type === "badge_earned" && (
                          <CheckCircle className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {notification.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded">
                            {notification.frequency}
                          </span>
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={notification.enabled}
                        onChange={() => handleToggleNotification(notification.id)}
                        className="w-5 h-5 rounded"
                      />
                    </label>
                  </div>
                </Card>
              ))}
            </div>

            {/* Info Box */}
            <Card className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300">
                    ملاحظة
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                    يمكنك تغيير هذه الإعدادات في أي وقت. سيتم إرسال الإشعارات إلى البريد الإلكتروني المسجل في حسابك.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
