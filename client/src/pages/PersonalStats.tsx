import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Zap, Clock, Target } from "lucide-react";
import { useLocation } from "wouter";

export default function PersonalStats() {
  const [, navigate] = useLocation();
  const [timeRange, setTimeRange] = useState("month");

  const stats = {
    totalMessages: 1234,
    totalImages: 567,
    totalConversations: 89,
    averageResponseTime: "2.3s",
    productivityScore: 87,
    streakDays: 15,
  };

  const dailyActivity = [
    { day: "السبت", messages: 45, images: 12, time: "2h 15m" },
    { day: "الأحد", messages: 52, images: 18, time: "2h 45m" },
    { day: "الاثنين", messages: 38, images: 9, time: "1h 30m" },
    { day: "الثلاثاء", messages: 61, images: 25, time: "3h 20m" },
    { day: "الأربعاء", messages: 55, images: 15, time: "2h 50m" },
    { day: "الخميس", messages: 48, images: 11, time: "2h 10m" },
    { day: "الجمعة", messages: 72, images: 30, time: "4h 00m" },
  ];

  const achievements = [
    { name: "المتحدث الأول", description: "أول محادثة", icon: "🎯" },
    { name: "المئة رسالة", description: "أرسل 100 رسالة", icon: "💯" },
    { name: "الأسبوع الذهبي", description: "نشاط يومي لمدة 7 أيام", icon: "⭐" },
    { name: "الصورة الأولى", description: "أول صورة تم إنشاؤها", icon: "🖼️" },
  ];

  const topCategories = [
    { category: "الكتابة", usage: 45, color: "bg-blue-500" },
    { category: "التحليل", usage: 25, color: "bg-green-500" },
    { category: "الترجمة", usage: 15, color: "bg-purple-500" },
    { category: "الإبداع", usage: 10, color: "bg-orange-500" },
    { category: "أخرى", usage: 5, color: "bg-gray-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
                <TrendingUp className="w-8 h-8" />
                إحصائياتي الشخصية
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                تابع إنتاجيتك والمهام المنجزة
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {["week", "month", "year"].map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                variant={timeRange === range ? "default" : "outline"}
              >
                {range === "week" ? "أسبوع" : range === "month" ? "شهر" : "سنة"}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                إجمالي الرسائل
              </h3>
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalMessages}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              ↑ 12% من الشهر الماضي
            </p>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                درجة الإنتاجية
              </h3>
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.productivityScore}%
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              ممتاز جداً
            </p>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                سلسلة النشاط
              </h3>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.streakDays}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              يوم متتالي
            </p>
          </Card>
        </div>

        {/* Daily Activity */}
        <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            النشاط اليومي
          </h3>

          <div className="space-y-4">
            {dailyActivity.map((day, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {day.day}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {day.messages} رسالة • {day.images} صورة • {day.time}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                    style={{
                      width: `${((day.messages + day.images) / 100) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Achievements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              الإنجازات
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, idx) => (
                <Card
                  key={idx}
                  className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-center"
                >
                  <p className="text-3xl mb-2">{achievement.icon}</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {achievement.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              أكثر الفئات استخداماً
            </h3>
            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <div className="space-y-4">
                {topCategories.map((cat, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {cat.category}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {cat.usage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`${cat.color} h-full rounded-full transition-all`}
                        style={{ width: `${cat.usage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
