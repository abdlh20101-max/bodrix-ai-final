import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Zap, Lock } from "lucide-react";
import { useLocation } from "wouter";

export default function Achievements() {
  const [, navigate] = useLocation();

  const [achievements, setAchievements] = useState([
    {
      id: "1",
      name: "المتحدث الأول",
      description: "أرسل أول رسالة",
      icon: "🎯",
      progress: 100,
      unlocked: true,
      unlockedDate: "2026-01-15",
      rarity: "common",
    },
    {
      id: "2",
      name: "المئة رسالة",
      description: "أرسل 100 رسالة",
      icon: "💯",
      progress: 100,
      unlocked: true,
      unlockedDate: "2026-01-25",
      rarity: "uncommon",
    },
    {
      id: "3",
      name: "الأسبوع الذهبي",
      description: "نشاط يومي لمدة 7 أيام متتالية",
      icon: "⭐",
      progress: 100,
      unlocked: true,
      unlockedDate: "2026-02-01",
      rarity: "rare",
    },
    {
      id: "4",
      name: "الصورة الأولى",
      description: "أول صورة تم إنشاؤها",
      icon: "🖼️",
      progress: 100,
      unlocked: true,
      unlockedDate: "2026-01-20",
      rarity: "common",
    },
    {
      id: "5",
      name: "الألف رسالة",
      description: "أرسل 1000 رسالة",
      icon: "🚀",
      progress: 78,
      unlocked: false,
      rarity: "epic",
    },
    {
      id: "6",
      name: "الشهر الذهبي",
      description: "نشاط يومي لمدة 30 يوم",
      icon: "👑",
      progress: 45,
      unlocked: false,
      rarity: "legendary",
    },
    {
      id: "7",
      name: "مترجم ماهر",
      description: "ترجم 100 نص",
      icon: "🌍",
      progress: 65,
      unlocked: false,
      rarity: "rare",
    },
    {
      id: "8",
      name: "محلل بيانات",
      description: "حلل 50 مجموعة بيانات",
      icon: "📊",
      progress: 32,
      unlocked: false,
      rarity: "uncommon",
    },
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400";
      case "uncommon":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      case "rare":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
      case "epic":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400";
      case "legendary":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400";
    }
  };

  const getRarityLabel = (rarity: string) => {
    const labels: Record<string, string> = {
      common: "عادي",
      uncommon: "نادر",
      rare: "نادر جداً",
      epic: "ملحمي",
      legendary: "أسطوري",
    };
    return labels[rarity] || rarity;
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

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
                <Zap className="w-8 h-8" />
                الإنجازات والشارات
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                اكسب شارات وأنجز تحديات جديدة
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              تقدمك
            </h3>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {unlockedCount}/{totalCount}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            أنت قد أنجزت {unlockedCount} شارة من {totalCount}. استمر في العمل!
          </p>
        </Card>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`p-6 border transition ${
                achievement.unlocked
                  ? "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                  : "bg-gray-50 dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 opacity-60"
              }`}
            >
              <div className="text-center">
                <div className="text-5xl mb-3 relative">
                  {achievement.icon}
                  {!achievement.unlocked && (
                    <Lock className="w-6 h-6 absolute top-0 right-0 text-gray-600 dark:text-gray-400" />
                  )}
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {achievement.name}
                </h3>

                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {achievement.description}
                </p>

                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-3 ${getRarityColor(
                    achievement.rarity
                  )}`}
                >
                  {getRarityLabel(achievement.rarity)}
                </span>

                {!achievement.unlocked && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {achievement.progress}%
                    </p>
                  </div>
                )}

                {achievement.unlocked && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    تم فتحه في {achievement.unlockedDate}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <Card className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            💡 نصائح للحصول على المزيد من الشارات
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>✓ حافظ على نشاط يومي لفتح شارات السلسلة</li>
            <li>✓ استخدم جميع ميزات التطبيق لفتح شارات متنوعة</li>
            <li>✓ شارك مع الآخرين وتعاون لفتح شارات التعاون</li>
            <li>✓ حقق أرقاماً عالية في الاستخدام لفتح شارات الإنجاز</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
