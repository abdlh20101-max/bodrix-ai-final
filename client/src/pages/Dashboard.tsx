import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/_core/hooks/useLanguage";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdBanner } from "@/components/AdBanner";
import { LogOut, MessageSquare, Zap, Image, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const { t } = useLanguage();
  const [, navigate] = useLocation();
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
            <img src="https://private-us-east-1.manuscdn.com/sessionFile/cQzbxoLvM4DfATDS98PDwn/sandbox/g1J1S9pV1XeaVY8DtTzPBi_1770165907673_na1fn_Ym9kcml4LWxvZ28tdHJhbnNwYXJlbnQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80" alt="Bodrix AI" className="h-12 w-12" />
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            أهلاً بك، {user?.name?.split(" ")[0]}! 👋
          </h2>
          <p className="text-gray-600">
            ابدأ محادثة جديدة مع Bodrix AI لتحصل على إجابات ذكية وسريعة
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">{t("chat.messagesLeft")}</span>
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
