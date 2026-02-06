import React from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/_core/hooks/useLanguage";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdsterraBannerAd, AdsterraNativeAd } from "@/components/AdsterraAds";
import { SmartNotification } from "@/components/SmartNotification";
import { LogOut, MessageSquare, Zap, Image, TrendingUp, History as HistoryIcon, CreditCard, Settings, HelpCircle, User, Wallet as WalletIcon, Share2, Play, Shield, Sparkles, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import bodrixLogo from "@/assets/bodrix-logo-transparent.png";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const trpcUtils = trpc.useUtils();
  
  // تحديث البيانات عند دخول الصفحة
  React.useEffect(() => {
    trpcUtils.messages.getRemainingToday.invalidate();
    trpcUtils.images.getRemainingToday.invalidate();
    trpcUtils.points.getBalance.invalidate();
  }, []);
  
  const profileQuery = trpc.user.profile.useQuery();
  const pointsQuery = trpc.points.getBalance.useQuery();
  const messagesQuery = trpc.messages.getRemainingToday.useQuery();
  const imagesQuery = trpc.images.getRemainingToday.useQuery();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading || profileQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  const profile = profileQuery.data;
  const points = pointsQuery.data?.points || 0;
  const messages = messagesQuery.data;
  const images = imagesQuery.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Smart Notification for Low Messages */}
      <SmartNotification messagesLeft={messages?.remaining || 0} language="ar" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-purple-500/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Bodrix AI</h1>
              <p className="text-sm text-slate-400">مساعدك الذكي</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/help")}
              className="p-2 hover:bg-slate-700 rounded-lg transition text-slate-300 hover:text-white"
              title="المساعدة"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="p-2 hover:bg-slate-700 rounded-lg transition text-slate-300 hover:text-white"
              title="الإعدادات"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="text-right border-r border-slate-700 pr-4">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-red-600/20 border-red-500/50 text-red-400 hover:bg-red-600/30"
            >
              <LogOut className="w-4 h-4" />
              {t("nav.logout")}
            </Button>
          </div>
        </div>
      </header>

      {/* Top Banner Ad */}
      <div className="bg-slate-800/50 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <AdsterraBannerAd placement="e6bc5ef409e84c68b61266975c307ef3" className="rounded-lg" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                أهلاً بك، {user?.name?.split(" ")[0]}! 👋
              </h2>
              <p className="text-slate-300">
                ابدأ محادثة جديدة مع Bodrix AI لتحصل على إجابات ذكية وسريعة
              </p>
            </div>
            <Button
              onClick={() => navigate("/chat")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg text-lg font-semibold"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              ابدأ محادثة جديدة
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">الرسائل المتبقية</span>
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{messages?.remaining || 0}</p>
              <p className="text-xs text-slate-400 mt-1">{messages?.used || 0} / {messages?.limit || 0} مستخدمة</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-green-500/50 transition">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">الصور المتبقية</span>
                <Image className="w-5 h-5 text-green-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{images?.remaining || 0}</p>
              <p className="text-xs text-slate-400 mt-1">{images?.used || 0} / {images?.limit || 0} مستخدمة</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-yellow-500/50 transition">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">النقاط</span>
                <Zap className="w-5 h-5 text-yellow-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{points}</p>
              <p className="text-xs text-slate-400 mt-1">نقاط متاحة</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 hover:border-purple-500/50 transition">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">نوع الحساب</span>
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white capitalize">{profile?.accountType || "—"}</p>
              <p className="text-xs text-slate-400 mt-1">حسابك الحالي</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            الخيارات السريعة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Chat Button */}
            <Button
              onClick={() => navigate("/chat")}
              className="h-24 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <MessageSquare className="w-8 h-8" />
              <span className="text-sm font-semibold">محادثة جديدة</span>
            </Button>

            {/* Plans Button */}
            <Button
              onClick={() => navigate("/plans")}
              className="h-24 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <CreditCard className="w-8 h-8" />
              <span className="text-sm font-semibold">الخطط والباقات</span>
            </Button>

            {/* History Button */}
            <Button
              onClick={() => navigate("/history")}
              className="h-24 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <HistoryIcon className="w-8 h-8" />
              <span className="text-sm font-semibold">سجل المحادثات</span>
            </Button>

            {/* Profile Button */}
            <Button
              onClick={() => navigate("/profile")}
              className="h-24 bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <User className="w-8 h-8" />
              <span className="text-sm font-semibold">الملف الشخصي</span>
            </Button>

            {/* Wallet Button */}
            <Button
              onClick={() => navigate("/wallet")}
              className="h-24 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <WalletIcon className="w-8 h-8" />
              <span className="text-sm font-semibold">محفظتي</span>
            </Button>

            {/* Referrals Button */}
            <Button
              onClick={() => navigate("/referrals")}
              className="h-24 bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <Share2 className="w-8 h-8" />
              <span className="text-sm font-semibold">الإحالات</span>
            </Button>

            {/* Ads Button */}
            <Button
              onClick={() => navigate("/ads")}
              className="h-24 bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <Play className="w-8 h-8" />
              <span className="text-sm font-semibold">الإعلانات</span>
            </Button>

            {user?.role === "admin" && (
              <Button
                onClick={() => navigate("/admin")}
                className="h-24 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg shadow-lg hover:shadow-xl transition"
              >
                <Shield className="w-8 h-8" />
                <span className="text-sm font-semibold">لوحة التحكم</span>
              </Button>
            )}
          </div>
        </div>

        {/* Native Ad */}
        <div className="mb-8">
          <AdsterraNativeAd placement="dashboard_native" className="rounded-lg" />
        </div>

        {/* Info Banner */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-purple-500/30 mb-8">
          <CardContent className="pt-6">
            <p className="text-slate-200">
              💡 <strong className="text-white">نصيحة:</strong> جميع محادثاتك محفوظة وآمنة تماماً. يمكنك الوصول إليها في أي وقت من سجل المحادثات.
            </p>
          </CardContent>
        </Card>

        {/* Bottom Banner Ad */}
        <div className="mb-8">
          <AdsterraBannerAd placement="e6bc5ef409e84c68b61266975c307ef3" className="rounded-lg" />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-800/50 border-t border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-400">
          <p>&copy; 2026 Bodrix AI. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
