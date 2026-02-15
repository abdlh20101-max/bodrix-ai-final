import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Gift, Zap, Star, Lock } from "lucide-react";
import { useLocation } from "wouter";

export default function Rewards() {
  const [, navigate] = useLocation();
  const [userPoints, setUserPoints] = useState(3850);

  const [rewards] = useState([
    {
      id: "1",
      name: "100 رسالة إضافية",
      description: "احصل على 100 رسالة إضافية",
      cost: 500,
      icon: "💬",
      category: "messages",
      available: true,
    },
    {
      id: "2",
      name: "50 صورة إضافية",
      description: "احصل على 50 صورة إضافية",
      cost: 400,
      icon: "🖼️",
      category: "images",
      available: true,
    },
    {
      id: "3",
      name: "شهر مجاني Pro",
      description: "اشتراك Pro مجاني لمدة شهر",
      cost: 1000,
      icon: "👑",
      category: "subscription",
      available: true,
    },
    {
      id: "4",
      name: "ترقية إلى Premium",
      description: "ترقية حسابك إلى Premium",
      cost: 2000,
      icon: "⭐",
      category: "subscription",
      available: true,
    },
    {
      id: "5",
      name: "شارة ذهبية",
      description: "شارة ذهبية حصرية",
      cost: 1500,
      icon: "🏆",
      category: "badges",
      available: true,
    },
    {
      id: "6",
      name: "عضوية VIP",
      description: "عضوية VIP لمدة 3 أشهر",
      cost: 3000,
      icon: "💎",
      category: "subscription",
      available: false,
    },
  ]);

  const [redeemed, setRedeemed] = useState([
    {
      id: "r1",
      name: "100 رسالة إضافية",
      date: "2026-02-01",
      cost: 500,
    },
    {
      id: "r2",
      name: "50 صورة إضافية",
      date: "2026-01-25",
      cost: 400,
    },
  ]);

  const handleRedeem = (reward: (typeof rewards)[0]) => {
    if (userPoints >= reward.cost) {
      setUserPoints(userPoints - reward.cost);
      setRedeemed([
        {
          id: `r${Date.now()}`,
          name: reward.name,
          date: new Date().toISOString().split("T")[0],
          cost: reward.cost,
        },
        ...redeemed,
      ]);
      alert(`تم استرجاع ${reward.name} بنجاح!`);
    } else {
      alert("نقاطك غير كافية!");
    }
  };

  const canAfford = (cost: number) => userPoints >= cost;

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
                <Gift className="w-8 h-8" />
                المكافآت والهدايا
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                استرجع نقاطك بمكافآت حصرية
              </p>
            </div>
          </div>

          <Card className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0">
            <div className="text-center">
              <p className="text-sm opacity-90">نقاطك الحالية</p>
              <p className="text-3xl font-bold flex items-center justify-center gap-2">
                <Zap className="w-6 h-6" />
                {userPoints}
              </p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rewards */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              المكافآت المتاحة
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rewards.map((reward) => (
                <Card
                  key={reward.id}
                  className={`p-6 border transition ${
                    reward.available
                      ? "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                      : "bg-gray-50 dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{reward.icon}</span>
                    {!reward.available && (
                      <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {reward.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {reward.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-yellow-500 flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      {reward.cost}
                    </span>

                    <Button
                      onClick={() => handleRedeem(reward)}
                      disabled={!reward.available || !canAfford(reward.cost)}
                      className={
                        canAfford(reward.cost) && reward.available
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : ""
                      }
                      size="sm"
                    >
                      {reward.available
                        ? canAfford(reward.cost)
                          ? "استرجع"
                          : "غير كافي"
                        : "غير متاح"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Redeemed */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              المكافآت المستخدمة
            </h2>

            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <div className="space-y-4">
                {redeemed.length > 0 ? (
                  redeemed.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50"
                    >
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {item.date}
                        </p>
                        <span className="text-xs font-semibold text-yellow-500 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          -{item.cost}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                    لم تستخدم أي مكافآت بعد
                  </p>
                )}
              </div>
            </Card>

            {/* Tips */}
            <Card className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💡 نصائح
              </h3>
              <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
                <li>✓ اكمل التحديات لكسب نقاط</li>
                <li>✓ شارك في المسابقات</li>
                <li>✓ حقق إنجازات جديدة</li>
                <li>✓ ساعد المستخدمين الآخرين</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
