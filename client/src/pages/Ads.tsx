import { useState, useEffect } from "react";
import { useLanguage } from "@/_core/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Clock, DollarSign, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { AdsterraBannerAd } from "@/components/AdsterraAds";

export default function Ads() {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adCount, setAdCount] = useState(0);

  useEffect(() => {
    if ((window as any).Monetag) {
      (window as any).Monetag.showAds();
    }
  }, []);

  const adsStats = {
    totalAdsWatched: 45,
    totalEarnings: 67.50,
    todayEarnings: 5.00,
    adsAvailable: 12,
  };

  const adsList = [
    {
      id: 1,
      title: "تطبيق جديد - تعلم البرمجة",
      duration: 30,
      reward: 0.50,
      category: "تعليم",
    },
    {
      id: 2,
      title: "منصة تجارة إلكترونية",
      duration: 60,
      reward: 1.00,
      category: "تسوق",
    },
    {
      id: 3,
      title: "لعبة موبايل جديدة",
      duration: 45,
      reward: 0.75,
      category: "ألعاب",
    },
    {
      id: 4,
      title: "خدمة استضافة ويب",
      duration: 30,
      reward: 0.50,
      category: "تقنية",
    },
    {
      id: 5,
      title: "تطبيق الاستثمار",
      duration: 60,
      reward: 1.00,
      category: "مالي",
    },
    {
      id: 6,
      title: "دورة تدريبية أونلاين",
      duration: 45,
      reward: 0.75,
      category: "تعليم",
    },
  ];

  const handleWatchAd = (adId: number, duration: number, reward: number) => {
    setIsWatchingAd(true);
    
    // محاكاة مشاهدة الإعلان
    setTimeout(() => {
      setIsWatchingAd(false);
      setAdCount(adCount + 1);
      alert(`تم! حصلت على $${reward.toFixed(2)}`);
    }, duration * 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
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
              {t("ads.title") || "شاهد الإعلانات واكسب"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("ads.subtitle") || "شاهد إعلانات قصيرة واكسب أموال حقيقية"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("ads.totalWatched") || "إجمالي المشاهدات"}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {adsStats.totalAdsWatched}
                </p>
              </div>
              <Play className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("ads.totalEarnings") || "إجمالي الأرباح"}
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  ${adsStats.totalEarnings.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("ads.todayEarnings") || "أرباح اليوم"}
                </p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  ${adsStats.todayEarnings.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("ads.available") || "إعلانات متاحة"}
                </p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {adsStats.adsAvailable}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adsList.map((ad) => (
            <Card
              key={ad.id}
              className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {ad.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {ad.category}
                  </p>
                </div>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  ${ad.reward.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{ad.duration} ثانية</span>
              </div>

              <Button
                onClick={() => handleWatchAd(ad.id, ad.duration, ad.reward)}
                disabled={isWatchingAd}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white disabled:opacity-50"
              >
                {isWatchingAd ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    جاري المشاهدة...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    شاهد الآن
                  </span>
                )}
              </Button>
            </Card>
          ))}
        </div>

        {/* Adsterra Banner Ad */}
        <div className="mt-8">
          <AdsterraBannerAd placement="e6bc5ef409e84c68b61266975c307ef3" className="rounded-lg" />
        </div>

        {/* Info Section */}
        <Card className="p-6 mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💡 {t("ads.tips") || "نصائح لزيادة أرباحك"}
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li>✓ شاهد إعلانات جديدة كل يوم للحصول على أرباح إضافية</li>
            <li>✓ شارك رابط الإحالة لزيادة أرباحك بنسبة 20%</li>
            <li>✓ اسحب أرباحك عندما تصل إلى $50</li>
            <li>✓ كلما زادت مشاهداتك، زادت الإعلانات المتاحة</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
