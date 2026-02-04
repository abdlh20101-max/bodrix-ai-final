import React from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/_core/hooks/useLanguage";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdBanner } from "@/components/AdBanner";
import { LogOut, MessageSquare, Zap, Image, TrendingUp, History as HistoryIcon, CreditCard, Settings, HelpCircle, User, Wallet as WalletIcon, Share2, Play } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  const profile = profileQuery.data;
  const points = pointsQuery.data?.points || 0;
  const messages = messagesQuery.data;
  const images = imagesQuery.data;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={bodrixLogo} alt="Bodrix AI" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Bodrix AI</h1>
              <p className="text-sm text-muted-foreground">مساعدك الذكي</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/settings")}
              className="p-2 hover:bg-muted rounded-lg transition"
              title="الإعدادات"
            >
              ⚙️
            </button>
            <button
              onClick={() => navigate("/faq")}
              className="p-2 hover:bg-muted rounded-lg transition"
              title="الأسئلة الشائعة"
            >
              ❓
            </button>
            <button
              onClick={() => navigate("/history")}
              className="p-2 hover:bg-muted rounded-lg transition"
              title="سجل المحادثات"
            >
              <HistoryIcon className="w-5 h-5" />
            </button>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t("nav.logout")}
              </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            أهلاً بك، {user?.name?.split(" ")[0]}! 👋
          </h2>
          <p className="text-muted-foreground">
            ابدأ محادثة جديدة مع Bodrix AI لتحصل على إجابات ذكية وسريعة
          </p>
          <Button
            onClick={() => navigate("/chat")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            ابدأ محادثة جديدة
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{t("chat.messagesLeft")}</span>
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{messages?.remaining || 0}</p>
              <p className="text-xs text-gray-600 mt-1">{messages?.used || 0} / {messages?.limit || 0} {t("common.used")}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{t("chat.imagesLeft")}</span>
                <Image className="w-5 h-5 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{images?.remaining || 0}</p>
              <p className="text-xs text-gray-600 mt-1">{images?.used || 0} / {images?.limit || 0} {t("common.used")}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{t("points.balance")}</span>
                <Zap className="w-5 h-5 text-yellow-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900">{points}</p>
              <p className="text-xs text-gray-600 mt-1">{t('points.balance')}</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{t("profile.accountType")}</span>
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-900 capitalize">{profile?.accountType || "—"}</p>
              <p className="text-xs text-gray-600 mt-1">{t('profile.accountType')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4">الخيارات السريعة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Chat Button */}
            <Button
              onClick={() => navigate("/chat")}
              className="h-24 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg"
            >
              <MessageSquare className="w-8 h-8" />
              <span className="text-sm font-semibold">محادثة جديدة</span>
            </Button>

            {/* Plans Button */}
            <Button
              onClick={() => navigate("/plans")}
              className="h-24 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg"
            >
              <CreditCard className="w-8 h-8" />
              <span className="text-sm font-semibold">الخطط والباقات</span>
            </Button>

            {/* History Button */}
            <Button
              onClick={() => navigate("/history")}
              className="h-24 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg"
            >
              <HistoryIcon className="w-8 h-8" />
              <span className="text-sm font-semibold">سجل المحادثات</span>
            </Button>

            {/* Profile Button */}
            <Button
              onClick={() => navigate("/profile")}
              className="h-24 bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg"
            >
              <User className="w-8 h-8" />
              <span className="text-sm font-semibold">الملف الشخصي</span>
            </Button>

            {/* Wallet Button */}
            <Button
              onClick={() => navigate("/wallet")}
              className="h-24 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg"
            >
              <WalletIcon className="w-8 h-8" />
              <span className="text-sm font-semibold">محفظتي</span>
            </Button>

            {/* Referrals Button */}
            <Button
              onClick={() => navigate("/referrals")}
              className="h-24 bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg"
            >
              <Share2 className="w-8 h-8" />
              <span className="text-sm font-semibold">الإحالات</span>
            </Button>

            {/* Ads Button */}
            <Button
              onClick={() => navigate("/ads")}
              className="h-24 bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg"
            >
              <Play className="w-8 h-8" />
              <span className="text-sm font-semibold">الإعلانات</span>
            </Button>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Settings Button */}
            <Button
              onClick={() => navigate("/settings")}
              className="h-20 bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg"
            >
              <Settings className="w-8 h-8" />
              <span className="text-sm font-semibold">الإعدادات</span>
            </Button>

            {/* FAQ Button */}
            <Button
              onClick={() => navigate("/faq")}
              className="h-20 bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white flex flex-col items-center justify-center gap-2 rounded-lg"
            >
              <HelpCircle className="w-8 h-8" />
              <span className="text-sm font-semibold">الأسئلة الشائعة</span>
            </Button>
          </div>
        </div>

        {/* Ad Banner */}
        <div className="my-8">
          <AdBanner type="horizontal" />
        </div>

        {/* Info Banner */}
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardContent className="pt-6">
            <p className="text-gray-700">
              💡 <strong>{t("common.tip")}:</strong> {t("home.description")}
              جميع محادثاتك محفوظة وآمنة.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
