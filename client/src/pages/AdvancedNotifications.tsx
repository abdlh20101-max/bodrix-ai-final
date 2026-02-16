import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell, Settings, Trash2, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function AdvancedNotifications() {
  const [, navigate] = useLocation();
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "إنجاز جديد!",
      message: "لقد أنجزت تحدي الكاتب وحصلت على 100 نقطة",
      type: "achievement",
      timestamp: "2026-02-04 11:30",
      read: false,
      icon: "🏆",
    },
    {
      id: "2",
      title: "رسالة من الدعم",
      message: "تم الرد على تذكرة الدعم الخاصة بك",
      type: "support",
      timestamp: "2026-02-04 10:15",
      read: false,
      icon: "💬",
    },
    {
      id: "3",
      title: "تحدي جديد متاح!",
      message: "تحدي الترجمة متاح الآن - اربح 250 نقطة",
      type: "challenge",
      timestamp: "2026-02-04 09:00",
      read: true,
      icon: "🎯",
    },
    {
      id: "4",
      title: "ترقية حسابك",
      message: "يمكنك الآن الترقية إلى Pro بسعر خاص",
      type: "promotion",
      timestamp: "2026-02-03 20:45",
      read: true,
      icon: "⭐",
    },
    {
      id: "5",
      title: "نشاط متصدرين",
      message: "أنت الآن في المرتبة 12 من أفضل المستخدمين",
      type: "leaderboard",
      timestamp: "2026-02-03 15:30",
      read: true,
      icon: "📊",
    },
  ]);

  const [settings, setSettings] = useState({
    achievements: true,
    challenges: true,
    support: true,
    promotions: false,
    leaderboard: true,
    email: true,
    push: true,
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "achievement":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "challenge":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "support":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "promotion":
        return "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800";
      case "leaderboard":
        return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
                <Bell className="w-8 h-8" />
                الإخطارات المتقدمة
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                إدارة إخطاراتك والإعدادات
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              وضع علامة على الكل كمقروء ({unreadCount})
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notifications */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              إخطاراتك ({notifications.length})
            </h2>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <Card
                  key={notif.id}
                  className={`p-4 border transition ${
                    notif.read
                      ? "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 opacity-70"
                      : `${getNotificationColor(notif.type)} border`
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{notif.icon}</span>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {notif.title}
                        </h3>
                        {!notif.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {notif.timestamp}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {!notif.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(notif.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              الإعدادات
            </h2>

            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    أنواع الإخطارات
                  </h3>

                  <div className="space-y-2">
                    {[
                      { key: "achievements", label: "الإنجازات" },
                      { key: "challenges", label: "التحديات" },
                      { key: "support", label: "الدعم" },
                      { key: "promotions", label: "العروض الترويجية" },
                      { key: "leaderboard", label: "الترتيب" },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            settings[item.key as keyof typeof settings]
                          }
                          onChange={(e) =>
                            setSettings({
                              ...settings,
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

                <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    القنوات
                  </h3>

                  <div className="space-y-2">
                    {[
                      { key: "email", label: "البريد الإلكتروني" },
                      { key: "push", label: "إشعارات المتصفح" },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            settings[item.key as keyof typeof settings]
                          }
                          onChange={(e) =>
                            setSettings({
                              ...settings,
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

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
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
