import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell, Check, X, Settings } from "lucide-react";
import { useLocation } from "wouter";

export default function Notifications() {
  const [, navigate] = useLocation();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "payment",
      title: "دفع جديد",
      message: "تم استقبال دفع بقيمة $29.99 من المستخدم user_123",
      timestamp: "منذ 5 دقائق",
      read: false,
      icon: "💳",
    },
    {
      id: 2,
      type: "subscription",
      title: "اشتراك جديد",
      message: "تم إنشاء اشتراك جديد للخطة Pro من المستخدم user_456",
      timestamp: "منذ 15 دقيقة",
      read: false,
      icon: "📅",
    },
    {
      id: 3,
      type: "referral",
      title: "إحالة جديدة",
      message: "تم إحالة 3 مستخدمين جدد من قبل user_789",
      timestamp: "منذ 30 دقيقة",
      read: false,
      icon: "👥",
    },
    {
      id: 4,
      type: "milestone",
      title: "تحقيق معلم",
      message: "وصلنا إلى 1000 مستخدم نشط!",
      timestamp: "منذ ساعة",
      read: true,
      icon: "🎉",
    },
    {
      id: 5,
      type: "alert",
      title: "تنبيه نظام",
      message: "معدل الخادم وصل إلى 85%",
      timestamp: "منذ ساعتين",
      read: true,
      icon: "⚠️",
    },
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    payments: true,
    subscriptions: true,
    referrals: true,
    milestones: true,
    alerts: true,
    email: true,
    push: true,
  });

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
              className="p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                الإشعارات
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {unreadCount} إشعارات جديدة
              </p>
            </div>
          </div>

          <Button
            onClick={handleMarkAllAsRead}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            تحديد الكل كمقروء
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notifications List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <Card className="p-8 text-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    لا توجد إشعارات
                  </p>
                </Card>
              ) : (
                notifications.map((notif) => (
                  <Card
                    key={notif.id}
                    className={`p-4 border-l-4 transition ${
                      notif.read
                        ? "bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 opacity-75"
                        : "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-600"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <span className="text-2xl">{notif.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {notif.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            {notif.message}
                          </p>
                          <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                            {notif.timestamp}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {!notif.read && (
                          <Button
                            onClick={() => handleMarkAsRead(notif.id)}
                            size="sm"
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDeleteNotification(notif.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Settings */}
          <div>
            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  إعدادات الإشعارات
                </h3>
              </div>

              <div className="space-y-4">
                {/* Notification Types */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    أنواع الإشعارات
                  </h4>
                  <div className="space-y-2">
                    {[
                      { key: "payments", label: "المدفوعات" },
                      { key: "subscriptions", label: "الاشتراكات" },
                      { key: "referrals", label: "الإحالات" },
                      { key: "milestones", label: "المعالم" },
                      { key: "alerts", label: "التنبيهات" },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            notificationSettings[
                              item.key as keyof typeof notificationSettings
                            ]
                          }
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              [item.key]: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-slate-700" />

                {/* Delivery Methods */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    طرق الاستقبال
                  </h4>
                  <div className="space-y-2">
                    {[
                      { key: "email", label: "البريد الإلكتروني" },
                      { key: "push", label: "إشعارات فورية" },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            notificationSettings[
                              item.key as keyof typeof notificationSettings
                            ]
                          }
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              [item.key]: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6">
                  حفظ الإعدادات
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
