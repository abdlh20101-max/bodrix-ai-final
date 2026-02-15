import { useState } from "react";
import { Brain, Megaphone, Sparkles, Zap, BarChart3, CreditCard, Users, TrendingUp, AlertCircle, FileText, Bell, ArrowLeft, Settings, MessageCircle, Lock } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { AIControlCenter } from "@/components/AIControlCenter";
import { MarketingAutomation } from "@/components/MarketingAutomation";
import { SmartSuggestions } from "@/components/SmartSuggestions";
import { AdvancedAnalytics } from "@/components/AdvancedAnalytics";
import { FeatureManager } from "@/components/FeatureManager";
import { PrivateChat } from "@/components/PrivateChat";
import { AdminChat } from "@/components/AdminChat";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="p-8 max-w-md bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h1 className="text-2xl font-bold text-red-600">الوصول مرفوض</h1>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            أنت لا تملك الصلاحيات اللازمة للوصول إلى لوحة تحكم المسؤول.
          </p>
          <Button onClick={() => navigate("/dashboard")} className="w-full">
            العودة إلى الرئيسية
          </Button>
        </Card>
      </div>
    );
  }

  const stats = {
    totalUsers: 1250,
    totalRevenue: 12450.50,
    activeSubscriptions: 340,
    totalReferrals: 2100,
    monthlyGrowth: 23.5,
    conversionRate: 18.2,
  };

  const recentPayments = [
    {
      id: 1,
      userId: "user_123",
      amount: 29.99,
      status: "completed",
      date: "2026-02-04",
      method: "stripe",
    },
    {
      id: 2,
      userId: "user_456",
      amount: 49.99,
      status: "completed",
      date: "2026-02-04",
      method: "paypal",
    },
    {
      id: 3,
      userId: "user_789",
      amount: 9.99,
      status: "pending",
      date: "2026-02-04",
      method: "stripe",
    },
  ];

  const topReferrers = [
    { userId: "user_001", referrals: 45, earnings: 450 },
    { userId: "user_002", referrals: 38, earnings: 380 },
    { userId: "user_003", referrals: 32, earnings: 320 },
    { userId: "user_004", referrals: 28, earnings: 280 },
    { userId: "user_005", referrals: 25, earnings: 250 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              لوحة تحكم المسؤول
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              مراقبة المدفوعات والاشتراكات والإحالات
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "نظرة عامة", icon: BarChart3 },
            { id: "ai-control", label: "التحكم بـ AI", icon: Brain },
            { id: "marketing", label: "التسويق الآلي", icon: Megaphone },
            { id: "suggestions", label: "الاقتراحات الذكية", icon: Sparkles },
            { id: "payments", label: "المدفوعات", icon: CreditCard },
            { id: "analytics", label: "الإحصائيات", icon: BarChart3 },
            { id: "subscriptions", label: "الاشتراكات", icon: TrendingUp },
            { id: "referrals", label: "الإحالات", icon: Users },
            { id: "reports", label: "التقارير", icon: FileText },
            { id: "notifications", label: "الإشعارات", icon: Bell },
            { id: "security", label: "الأمان", icon: Settings },
            { id: "features", label: "إدارة الميزات", icon: Zap },
            { id: "admin-chat", label: "دردشة الإدمن", icon: MessageCircle },
            { id: "private-chat", label: "دردشة خصوصية", icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "reports") {
                    navigate("/reports");
                  } else if (tab.id === "notifications") {
                    navigate("/notifications");
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                variant={activeTab === tab.id ? "default" : "outline"}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      إجمالي المستخدمين
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stats.totalUsers}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </Card>

              <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      إجمالي الإيرادات
                    </p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      ${stats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <CreditCard className="w-8 h-8 text-green-600" />
                </div>
              </Card>

              <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      الاشتراكات النشطة
                    </p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">
                      {stats.activeSubscriptions}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </Card>

              <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    نمو شهري
                  </p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    +{stats.monthlyGrowth}%
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    إجمالي الإحالات
                  </p>
                  <p className="text-3xl font-bold text-cyan-600 mt-2">
                    {stats.totalReferrals}
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    معدل التحويل
                  </p>
                  <p className="text-3xl font-bold text-pink-600 mt-2">
                    {stats.conversionRate}%
                  </p>
                </div>
              </Card>
            </div>

            {/* Recent Payments */}
            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                آخر المدفوعات
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        معرف المستخدم
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        المبلغ
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        الطريقة
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        الحالة
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        التاريخ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                      >
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {payment.userId}
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {payment.method === "stripe" ? "Stripe" : "PayPal"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              payment.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {payment.status === "completed"
                              ? "مكتمل"
                              : "قيد الانتظار"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {payment.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Top Referrers */}
            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                أفضل المحيلين
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        معرف المستخدم
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        عدد الإحالات
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        الأرباح
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topReferrers.map((referrer, index) => (
                      <tr
                        key={referrer.userId}
                        className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center font-semibold">
                              {index + 1}
                            </span>
                            <span className="text-gray-900 dark:text-white">
                              {referrer.userId}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white font-semibold">
                          {referrer.referrals}
                        </td>
                        <td className="py-3 px-4 text-green-600 font-semibold">
                          ${referrer.earnings.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === "features" && <FeatureManager />}

        {/* AI Control Tab */}
        {activeTab === "ai-control" && <AIControlCenter />}

        {/* Marketing Automation Tab */}
        {activeTab === "marketing" && <MarketingAutomation />}

        {/* Smart Suggestions Tab */}
        {activeTab === "suggestions" && <SmartSuggestions />}

        {/* Admin Chat Tab */}
        {activeTab === "admin-chat" && (
          <div className="h-96">
            <AdminChat />
          </div>
        )}

        {/* Private Chat Tab */}
        {activeTab === "private-chat" && (
          <div className="h-96">
            <PrivateChat />
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && <AdvancedAnalytics />}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">التحكم الأمني</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="font-semibold text-green-900 dark:text-green-400">✓ حالة الأمان: آمن</p>
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  إعادة تعيين كلمات المرور
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              جميع المدفوعات
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      معرف الدفع
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      المستخدم
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      المبلغ
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      الحالة
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      الإجراء
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        #{payment.id}
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {payment.userId}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            payment.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {payment.status === "completed"
                            ? "مكتمل"
                            : "قيد الانتظار"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">
                          عرض التفاصيل
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Subscriptions Tab */}
        {activeTab === "subscriptions" && (
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              الاشتراكات النشطة
            </h3>
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              <p>عدد الاشتراكات النشطة: {stats.activeSubscriptions}</p>
              <p className="text-sm mt-2">
                سيتم عرض تفاصيل الاشتراكات هنا عند تفعيل نظام الاشتراكات
              </p>
            </div>
          </Card>
        )}

        {/* Referrals Tab */}
        {activeTab === "referrals" && (
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              نظام الإحالات
            </h3>
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              <p>إجمالي الإحالات: {stats.totalReferrals}</p>
              <p className="text-sm mt-2">
                سيتم عرض تفاصيل الإحالات والمحيلين هنا
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
