import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell, MessageSquare, AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { useLocation } from "wouter";

export default function RealTimeNotifications() {
  const [, navigate] = useLocation();
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "message",
      title: "رسالة جديدة",
      message: "وصلت لك رسالة جديدة من Bodrix AI",
      time: "الآن",
      read: false,
      icon: MessageSquare,
    },
    {
      id: "2",
      type: "success",
      title: "تم بنجاح",
      message: "تم تحديث ملفك الشخصي بنجاح",
      time: "منذ دقيقة",
      read: false,
      icon: CheckCircle,
    },
    {
      id: "3",
      type: "warning",
      title: "تنبيه",
      message: "أنت اقتربت من حد الرسائل اليومية",
      time: "منذ 5 دقائق",
      read: true,
      icon: AlertCircle,
    },
    {
      id: "4",
      type: "info",
      title: "معلومة",
      message: "تم إضافة ميزة جديدة: تصدير المحادثات",
      time: "منذ ساعة",
      read: true,
      icon: Info,
    },
  ]);

  const [settings, setSettings] = useState({
    messageNotifications: true,
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    desktopNotifications: true,
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
      case "message":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
      case "info":
        return "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800";
      default:
        return "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "message":
        return "text-blue-600 dark:text-blue-400";
      case "success":
        return "text-green-600 dark:text-green-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "info":
        return "text-purple-600 dark:text-purple-400";
      default:
        return "text-gray-600 dark:text-gray-400";
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
                الإشعارات الفورية
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {unreadCount} إشعارات جديدة
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              className="text-sm"
            >
              تحديد الكل كمقروء
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notifications List */}
          <div className="lg:col-span-2 space-y-4">
            {notifications.length === 0 ? (
              <Card className="p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  لا توجد إشعارات
                </p>
              </Card>
            ) : (
              notifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <Card
                    key={notification.id}
                    className={`p-4 border transition ${getNotificationColor(
                      notification.type
                    )} ${!notification.read ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <IconComponent
                        className={`w-6 h-6 flex-shrink-0 mt-0.5 ${getIconColor(
                          notification.type
                        )}`}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {notification.time}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs"
                          >
                            مقروء
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(notification.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          {/* Settings */}
          <div>
            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                إعدادات الإشعارات
              </h3>

              <div className="space-y-4">
                {[
                  {
                    key: "messageNotifications",
                    label: "إشعارات الرسائل",
                  },
                  {
                    key: "emailNotifications",
                    label: "إشعارات البريد",
                  },
                  {
                    key: "pushNotifications",
                    label: "إشعارات الدفع",
                  },
                  {
                    key: "soundEnabled",
                    label: "تفعيل الصوت",
                  },
                  {
                    key: "desktopNotifications",
                    label: "إشعارات سطح المكتب",
                  },
                ].map((setting) => (
                  <label
                    key={setting.key}
                    className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50"
                  >
                    <input
                      type="checkbox"
                      checked={
                        settings[setting.key as keyof typeof settings]
                      }
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          [setting.key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {setting.label}
                    </span>
                  </label>
                ))}
              </div>

              <Button
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              >
                حفظ الإعدادات
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
