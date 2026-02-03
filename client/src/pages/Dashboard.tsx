import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, MessageSquare, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bodrix AI</h1>
            <p className="text-sm text-gray-600">مساعدك الذكي</p>
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
              تسجيل الخروج
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

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* New Chat Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                محادثة جديدة
              </CardTitle>
              <CardDescription>ابدأ محادثة جديدة مع المساعد الذكي</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                ابدأ الآن
              </Button>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                المميزات
              </CardTitle>
              <CardDescription>اكتشف كل ما يمكن للمساعد فعله</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ إجابات فورية وذكية</li>
                <li>✓ دعم اللغة العربية</li>
                <li>✓ محفوظات المحادثات</li>
              </ul>
            </CardContent>
          </Card>

          {/* Account Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👤 حسابك
              </CardTitle>
              <CardDescription>معلومات حسابك وإعداداتك</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium text-gray-700">الدور:</span>{" "}
                  <span className="text-gray-600 capitalize">{user?.role}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">تاريخ الانضمام:</span>{" "}
                  <span className="text-gray-600">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("ar-SA")
                      : "—"}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Banner */}
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardContent className="pt-6">
            <p className="text-gray-700">
              💡 <strong>نصيحة:</strong> يمكنك طرح أي سؤال وسيقوم Bodrix AI بمساعدتك بأفضل طريقة ممكنة.
              جميع محادثاتك محفوظة وآمنة.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
