import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Share2, Copy, TrendingUp, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function AdvancedReferrals() {
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);

  const referralCode = "BODRIX2024ABC123";
  const referralLink = `https://bodrix.ai/join?ref=${referralCode}`;

  const [stats] = useState({
    totalReferrals: 24,
    activeReferrals: 18,
    totalEarnings: 2450,
    pendingEarnings: 350,
    conversionRate: 75,
  });

  const [referrals] = useState([
    {
      id: "1",
      name: "أحمد محمد",
      email: "ahmed@example.com",
      joinDate: "2026-01-15",
      status: "active",
      earnings: 150,
      icon: "👤",
    },
    {
      id: "2",
      name: "فاطمة علي",
      email: "fatima@example.com",
      joinDate: "2026-01-20",
      status: "active",
      earnings: 200,
      icon: "👩",
    },
    {
      id: "3",
      name: "محمود حسن",
      email: "mahmoud@example.com",
      joinDate: "2026-02-01",
      status: "pending",
      earnings: 0,
      icon: "👨",
    },
    {
      id: "4",
      name: "سارة إبراهيم",
      email: "sarah@example.com",
      joinDate: "2025-12-20",
      status: "active",
      earnings: 180,
      icon: "👩",
    },
    {
      id: "5",
      name: "علي أحمد",
      email: "ali@example.com",
      joinDate: "2025-12-25",
      status: "active",
      earnings: 220,
      icon: "👤",
    },
  ]);

  const [tiers] = useState([
    {
      level: 1,
      name: "البداية",
      referrals: "0-5",
      commission: "10%",
      bonus: 0,
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    },
    {
      level: 2,
      name: "النمو",
      referrals: "6-15",
      commission: "15%",
      bonus: 50,
      color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    },
    {
      level: 3,
      name: "الاحترافي",
      referrals: "16-30",
      commission: "20%",
      bonus: 200,
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
    },
    {
      level: 4,
      name: "النخبة",
      referrals: "30+",
      commission: "25%",
      bonus: 500,
      color: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    },
  ]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                <Share2 className="w-8 h-8" />
                برنامج الإحالات المتقدم
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                احصل على عمولات من كل إحالة ناجحة
              </p>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white mb-8 border-0">
          <h2 className="text-xl font-bold mb-4">رابط الإحالة الخاص بك</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30"
            />
            <Button
              onClick={handleCopy}
              className="bg-white text-blue-600 hover:bg-gray-100 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {copied ? "تم النسخ!" : "نسخ"}
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الإحالات</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalReferrals}
            </p>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">الإحالات النشطة</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.activeReferrals}
            </p>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الأرباح</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              ${stats.totalEarnings}
            </p>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">الأرباح المعلقة</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              ${stats.pendingEarnings}
            </p>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">معدل التحويل</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.conversionRate}%
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Referrals List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Users className="w-6 h-6" />
              الإحالات ({referrals.length})
            </h2>

            <div className="space-y-3">
              {referrals.map((ref) => (
                <Card
                  key={ref.id}
                  className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-2xl">{ref.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {ref.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {ref.email}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                          ref.status === "active"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                        }`}
                      >
                        {ref.status === "active" ? "نشط" : "معلق"}
                      </span>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        +${ref.earnings}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {ref.joinDate}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Tiers */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              مستويات العمولة
            </h2>

            <div className="space-y-3">
              {tiers.map((tier) => (
                <Card
                  key={tier.level}
                  className={`p-4 border ${tier.color}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {tier.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {tier.referrals} إحالات
                      </p>
                    </div>
                    <span className="text-2xl">
                      {tier.level === 1
                        ? "🔵"
                        : tier.level === 2
                        ? "🟢"
                        : tier.level === 3
                        ? "🟣"
                        : "🟡"}
                    </span>
                  </div>

                  <div className="border-t border-current border-opacity-20 pt-2">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      عمولة: {tier.commission}
                    </p>
                    {tier.bonus > 0 && (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        مكافأة: ${tier.bonus}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
