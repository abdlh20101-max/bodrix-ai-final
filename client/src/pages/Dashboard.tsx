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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="https://private-us-east-1.manuscdn.com/sessionFile/cQzbxoLvM4DfATDS98PDwn/sandbox/zfXzIeqSMauFzfB7ElSVwm-img-1_1770162031000_na1fn_Ym9kcml4LWxvZ28.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvY1F6YnhvTHZNNERmQVREUzk4UER3bi9zYW5kYm94L3pmWHpJZXFTTWF1RnpmQjdFbFNWd20taW1nLTFfMTc3MDE2MjAzMTAwMF9uYTFmbl9Ym9kcml4LWxvZ28ucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=fCCsBppOdboI29dR8T-AI2txRymrhLYSqI42qLb6QC3hmciDFasJsSJAvHgf~wGr9rvJ~skCWgm8GYmBjBif2ZZPSDw8VmGh6va9SMMb9VDoVe4h9GMbw5xJJe7QS0TtvDr5MRe6~KbRnSO7HZg4BGisMkrM1CJh24383fbzTYpyXRSRcW3NrT-aFLMlkCFGY5VmR7j3cblpdSBq1wMELzLg9R6~02qRd6moL923z5IcFsLDwczFZpuhroUzrNyeFf9ef7GXKEzqVfP9cXpOzbtg4MqQTexADyvjx7vE3W6f8HEs9Gsdcaw0WMaI~jWF4SrDIdZdAblP3ubPorteFg__" alt="Bodrix AI" className="h-10 w-10" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bodrix AI</h1>
              <p className="text-sm text-gray-600">مساعدك الذكي</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
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
              <p className="text-xs text-gray-600 mt-1">نقاط متاحة</p>
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
              <p className="text-xs text-gray-600 mt-1">نوع الحساب الحالي</p>
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
