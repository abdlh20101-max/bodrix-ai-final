import { useState } from "react";
import { useLanguage } from "@/_core/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Copy, Share2, TrendingUp, Users } from "lucide-react";
import { useLocation } from "wouter";
import { AdManager } from "@/components/AdManager";
import { AdBannerTop } from "@/components/AdBannerTop";

export default function Referrals() {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);

  const referralLink = `https://bodrix.ai/ref/${Math.random().toString(36).substr(2, 9)}`;
  const referralStats = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarnings: 240.50,
    pendingEarnings: 45.00,
    conversionRate: 66.7,
  };

  const referralList = [
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed@example.com",
      joinDate: "2026-02-01",
      status: "active",
      earnings: 25.00,
    },
    {
      id: 2,
      name: "فاطمة علي",
      email: "fatima@example.com",
      joinDate: "2026-01-28",
      status: "active",
      earnings: 30.00,
    },
    {
      id: 3,
      name: "محمود حسن",
      email: "mahmoud@example.com",
      joinDate: "2026-01-25",
      status: "pending",
      earnings: 0.00,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: "Bodrix AI",
        text: "انضم إلى Bodrix AI واحصل على 10 دولار مكافأة ترحيب!",
        url: referralLink,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <AdBannerTop />
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("referrals.title") || "برنامج الإحالات"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("referrals.subtitle") || "اكسب أموال بإحالة أصدقائك"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("referrals.totalReferrals") || "إجمالي الإحالات"}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {referralStats.totalReferrals}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("referrals.activeReferrals") || "إحالات نشطة"}
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {referralStats.activeReferrals}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("referrals.totalEarnings") || "إجمالي الأرباح"}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${referralStats.totalEarnings.toFixed(2)}
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("referrals.conversionRate") || "معدل التحويل"}
              </p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {referralStats.conversionRate}%
              </p>
            </div>
          </Card>
        </div>

        {/* Referral Link Section */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t("referrals.shareYourLink") || "شارك رابطك الفريد"}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("referrals.linkDescription") || "شارك هذا الرابط مع أصدقائك واكسب 20% من أرباحهم"}
          </p>

          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-white dark:bg-slate-800"
            />
            <Button
              onClick={handleCopyLink}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "تم النسخ" : "نسخ"}
            </Button>
            <Button
              onClick={handleShareLink}
              variant="outline"
              className="bg-white dark:bg-slate-800"
            >
              <Share2 className="w-4 h-4 mr-2" />
              شارك
            </Button>
          </div>
        </Card>

        {/* Referrals List */}
        <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("referrals.myReferrals") || "إحالاتي"}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    {t("referrals.name") || "الاسم"}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    {t("referrals.email") || "البريد الإلكتروني"}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    {t("referrals.joinDate") || "تاريخ الانضمام"}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    {t("referrals.status") || "الحالة"}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    {t("referrals.earnings") || "الأرباح"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {referralList.map((referral) => (
                  <tr
                    key={referral.id}
                    className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {referral.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {referral.email}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {referral.joinDate}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          referral.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {referral.status === "active" ? "نشط" : "قيد الانتظار"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      ${referral.earnings.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Withdrawal Section */}
        <Card className="p-6 mt-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("referrals.withdrawal") || "سحب الأرباح"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t("referrals.pendingEarnings") || "الأرباح المعلقة"}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${referralStats.pendingEarnings.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t("referrals.minimumWithdrawal") || "الحد الأدنى للسحب"}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                $50.00
              </p>
            </div>
          </div>

          <Button
            disabled={referralStats.pendingEarnings < 50}
            className="w-full bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {referralStats.pendingEarnings < 50
              ? `${t("referrals.needMore") || "تحتاج"} $${(50 - referralStats.pendingEarnings).toFixed(2)} ${t("referrals.more") || "أكثر"}`
              : t("referrals.withdrawNow") || "اسحب الآن"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
