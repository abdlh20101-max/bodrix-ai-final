import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BarChart3, TrendingUp, Users, MessageSquare, Image as ImageIcon, Calendar } from "lucide-react";
import { useLocation } from "wouter";

export default function Analytics() {
  const [, navigate] = useLocation();
  const [timeRange, setTimeRange] = useState("week");

  const stats = [
    { label: "إجمالي الرسائل", value: "1,234", icon: MessageSquare, color: "blue" },
    { label: "إجمالي الصور", value: "567", icon: ImageIcon, color: "green" },
    { label: "عدد المحادثات", value: "89", icon: Users, color: "purple" },
    { label: "معدل الاستخدام", value: "87%", icon: TrendingUp, color: "orange" },
  ];

  const dailyData = [
    { day: "السبت", messages: 45, images: 12 },
    { day: "الأحد", messages: 52, images: 18 },
    { day: "الاثنين", messages: 38, images: 9 },
    { day: "الثلاثاء", messages: 61, images: 25 },
    { day: "الأربعاء", messages: 55, images: 15 },
    { day: "الخميس", messages: 48, images: 11 },
    { day: "الجمعة", messages: 72, images: 30 },
  ];

  const topQuestions = [
    { question: "كيف أستخدم الذكاء الاصطناعي؟", count: 156 },
    { question: "ما هي أفضل الممارسات؟", count: 142 },
    { question: "كيف أحسّن الإنتاجية؟", count: 128 },
    { question: "ما هي الميزات الجديدة؟", count: 115 },
    { question: "كيف أحل المشاكل؟", count: 98 },
  ];

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    };
    return colors[color] || colors.blue;
  };

  const maxValue = Math.max(...dailyData.map((d) => d.messages + d.images));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
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
                <BarChart3 className="w-8 h-8" />
                التحليلات المتقدمة
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                احصائيات شاملة عن استخدامك للتطبيق
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {["day", "week", "month", "year"].map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                variant={timeRange === range ? "default" : "outline"}
                className="text-sm"
              >
                {range === "day"
                  ? "يوم"
                  : range === "week"
                  ? "أسبوع"
                  : range === "month"
                  ? "شهر"
                  : "سنة"}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <Card
                key={idx}
                className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </h3>
                  <div className={`p-2 rounded-lg ${getColorClass(stat.color)}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  ↑ 12% من الأسبوع الماضي
                </p>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Daily Usage Chart */}
          <Card className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              الاستخدام اليومي
            </h3>

            <div className="space-y-4">
              {dailyData.map((data, idx) => {
                const total = data.messages + data.images;
                const percentage = (total / maxValue) * 100;

                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {data.day}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {total} استخدام
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Usage Breakdown */}
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              توزيع الاستخدام
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    الرسائل
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    68%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: "68%" }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    الصور
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    32%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: "32%" }} />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <span className="font-semibold">نصيحة:</span> استخدم الصور أكثر لتحسين الإنتاجية
              </p>
            </div>
          </Card>
        </div>

        {/* Top Questions */}
        <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            أكثر الأسئلة شيوعاً
          </h3>

          <div className="space-y-3">
            {topQuestions.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {idx + 1}. {item.question}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {item.count} مرة
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {Math.round((item.count / topQuestions[0].count) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
