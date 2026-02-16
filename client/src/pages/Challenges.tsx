import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Flame, Trophy, Clock } from "lucide-react";
import { useLocation } from "wouter";

export default function Challenges() {
  const [, navigate] = useLocation();

  const [challenges] = useState([
    {
      id: "1",
      title: "تحدي الكاتب",
      description: "اكتب 10 مقالات في أسبوع واحد",
      icon: "✍️",
      difficulty: "سهل",
      reward: 100,
      progress: 7,
      total: 10,
      deadline: "2026-02-10",
      status: "in_progress",
    },
    {
      id: "2",
      title: "تحدي الترجمة",
      description: "ترجم 50 نص إلى لغات مختلفة",
      icon: "🌍",
      difficulty: "متوسط",
      reward: 250,
      progress: 32,
      total: 50,
      deadline: "2026-02-15",
      status: "in_progress",
    },
    {
      id: "3",
      title: "تحدي التحليل",
      description: "حلل 20 مجموعة بيانات",
      icon: "📊",
      difficulty: "صعب",
      reward: 500,
      progress: 0,
      total: 20,
      deadline: "2026-02-20",
      status: "not_started",
    },
    {
      id: "4",
      title: "تحدي الإبداع",
      description: "أنشئ 5 صور فنية باستخدام AI",
      icon: "🎨",
      difficulty: "متوسط",
      reward: 200,
      progress: 5,
      total: 5,
      deadline: "2026-02-05",
      status: "completed",
    },
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: "أحمد محمد", points: 5420, icon: "👑" },
    { rank: 2, name: "فاطمة علي", points: 4890, icon: "🥈" },
    { rank: 3, name: "محمود حسن", points: 4650, icon: "🥉" },
    { rank: 4, name: "سارة إبراهيم", points: 4200, icon: "4️⃣" },
    { rank: 5, name: "علي أحمد", points: 3950, icon: "5️⃣" },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "سهل":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      case "متوسط":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
      case "صعب":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "not_started":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

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
              <Flame className="w-8 h-8" />
              التحديات والمسابقات
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              شارك في التحديات واربح جوائز
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Challenges */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              التحديات النشطة
            </h2>

            <div className="space-y-4">
              {challenges.map((challenge) => (
                <Card
                  key={challenge.id}
                  className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{challenge.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {challenge.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {challenge.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${getDifficultyColor(
                          challenge.difficulty
                        )}`}
                      >
                        {challenge.difficulty}
                      </span>
                      <p className="text-lg font-bold text-yellow-500">
                        +{challenge.reward} نقطة
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        التقدم
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {challenge.progress}/{challenge.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`${getStatusColor(
                          challenge.status
                        )} h-full rounded-full transition-all`}
                        style={{
                          width: `${(challenge.progress / challenge.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      ينتهي في {challenge.deadline}
                    </span>
                    <Button
                      size="sm"
                      disabled={challenge.status === "completed"}
                      className={
                        challenge.status === "completed"
                          ? "bg-green-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      }
                    >
                      {challenge.status === "completed"
                        ? "مكتمل ✓"
                        : "المشاركة"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              الترتيب
            </h2>

            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{user.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          المرتبة {user.rank}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-yellow-500">{user.points}</p>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                عرض الترتيب الكامل
              </Button>
            </Card>

            {/* Your Rank */}
            <Card className="mt-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                ترتيبك الحالي
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                #12
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                3,850 نقطة
              </p>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                اكسب المزيد من النقاط
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
