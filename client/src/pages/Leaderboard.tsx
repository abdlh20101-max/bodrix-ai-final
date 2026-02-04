import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, TrendingUp, Filter } from "lucide-react";
import { useLocation } from "wouter";

export default function Leaderboard() {
  const [, navigate] = useLocation();
  const [timeRange, setTimeRange] = useState("month");
  const [category, setCategory] = useState("all");

  const [leaderboard] = useState([
    {
      rank: 1,
      name: "أحمد محمد",
      points: 5420,
      icon: "👑",
      level: 45,
      badges: 12,
      trend: "up",
    },
    {
      rank: 2,
      name: "فاطمة علي",
      points: 4890,
      icon: "🥈",
      level: 42,
      badges: 10,
      trend: "up",
    },
    {
      rank: 3,
      name: "محمود حسن",
      points: 4650,
      icon: "🥉",
      level: 40,
      badges: 9,
      trend: "down",
    },
    {
      rank: 4,
      name: "سارة إبراهيم",
      points: 4200,
      icon: "4️⃣",
      level: 38,
      badges: 8,
      trend: "up",
    },
    {
      rank: 5,
      name: "علي أحمد",
      points: 3950,
      icon: "5️⃣",
      level: 36,
      badges: 7,
      trend: "stable",
    },
    {
      rank: 6,
      name: "نور محمود",
      points: 3720,
      icon: "6️⃣",
      level: 34,
      badges: 6,
      trend: "up",
    },
    {
      rank: 7,
      name: "خديجة حسن",
      points: 3450,
      icon: "7️⃣",
      level: 32,
      badges: 5,
      trend: "down",
    },
    {
      rank: 8,
      name: "محمد علي",
      points: 3200,
      icon: "8️⃣",
      level: 30,
      badges: 4,
      trend: "stable",
    },
    {
      rank: 9,
      name: "ليلى أحمد",
      points: 2950,
      icon: "9️⃣",
      level: 28,
      badges: 3,
      trend: "up",
    },
    {
      rank: 10,
      name: "عمر محمد",
      points: 2700,
      icon: "🔟",
      level: 26,
      badges: 2,
      trend: "down",
    },
  ]);

  const [yourRank] = useState({
    rank: 12,
    name: "أنت",
    points: 3850,
    level: 35,
    badges: 7,
    trend: "up",
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "📈";
      case "down":
        return "📉";
      default:
        return "➡️";
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
                <Trophy className="w-8 h-8" />
                الترتيب العام
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                أفضل المستخدمين في المنصة
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <div className="flex gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Filter className="w-4 h-4" />
              الفترة:
            </span>
            {["week", "month", "year", "all"].map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
              >
                {range === "week"
                  ? "أسبوع"
                  : range === "month"
                  ? "شهر"
                  : range === "year"
                  ? "سنة"
                  : "الكل"}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
              الفئة:
            </span>
            {["all", "writers", "translators", "analysts"].map((cat) => (
              <Button
                key={cat}
                onClick={() => setCategory(cat)}
                variant={category === cat ? "default" : "outline"}
                size="sm"
              >
                {cat === "all"
                  ? "الكل"
                  : cat === "writers"
                  ? "الكتاب"
                  : cat === "translators"
                  ? "المترجمون"
                  : "المحللون"}
              </Button>
            ))}
          </div>
        </div>

        {/* Your Rank Card */}
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-8 border-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">ترتيبك الحالي</p>
              <p className="text-4xl font-bold">#{yourRank.rank}</p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold">{yourRank.points}</p>
              <p className="text-sm opacity-90">نقطة</p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold">المستوى {yourRank.level}</p>
              <p className="text-sm opacity-90">{yourRank.badges} شارات</p>
            </div>

            <span className="text-3xl">{getTrendIcon(yourRank.trend)}</span>
          </div>
        </Card>

        {/* Leaderboard */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            أفضل 10 متصدرين
          </h2>

          {leaderboard.map((user, idx) => (
            <Card
              key={user.rank}
              className={`p-4 border transition ${
                idx < 3
                  ? "bg-white dark:bg-slate-800 border-yellow-300 dark:border-yellow-600 shadow-lg"
                  : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-3xl">{user.icon}</span>

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      المستوى {user.level} • {user.badges} شارات
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-500">
                      {user.points}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      نقطة
                    </p>
                  </div>

                  <span className="text-2xl">{getTrendIcon(user.trend)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <Card className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
            💡 كيفية الصعود في الترتيب
          </h3>
          <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
            <li>✓ أكمل التحديات اليومية واربح نقاط إضافية</li>
            <li>✓ شارك في المسابقات الأسبوعية والشهرية</li>
            <li>✓ حقق إنجازات جديدة لفتح شارات</li>
            <li>✓ ساعد المستخدمين الآخرين واربح نقاط التعاون</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
