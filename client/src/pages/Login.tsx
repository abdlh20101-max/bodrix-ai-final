import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Chrome, Sparkles, Shield, Zap, MessageSquare } from "lucide-react";

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Bodrix AI</h1>
          <p className="text-slate-400">مساعدك الذكي للإجابة على جميع أسئلتك</p>
        </div>

        <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700 shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-4">
            <CardTitle className="text-2xl font-bold text-white">تسجيل الدخول</CardTitle>
            <CardDescription className="text-slate-400">
              مرحباً بك في تطبيق الدردشة الذكي
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleGoogleLogin}
              className="w-full h-14 text-base font-semibold flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all"
            >
              <Chrome className="w-6 h-6" />
              تسجيل الدخول عبر Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800/50 text-slate-400">المميزات</span>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <MessageSquare className="w-5 h-5 text-blue-400 mb-2" />
                <p className="text-sm text-white font-medium">دردشة ذكية</p>
                <p className="text-xs text-slate-400">إجابات فورية ودقيقة</p>
              </div>
              <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <Zap className="w-5 h-5 text-yellow-400 mb-2" />
                <p className="text-sm text-white font-medium">سرعة فائقة</p>
                <p className="text-xs text-slate-400">ردود في ثوانٍ</p>
              </div>
              <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <Shield className="w-5 h-5 text-green-400 mb-2" />
                <p className="text-sm text-white font-medium">آمن 100%</p>
                <p className="text-xs text-slate-400">بياناتك محمية</p>
              </div>
              <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <Sparkles className="w-5 h-5 text-purple-400 mb-2" />
                <p className="text-sm text-white font-medium">ذكاء متقدم</p>
                <p className="text-xs text-slate-400">تقنية GPT-4</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-lg border border-blue-500/20">
              <p className="text-sm text-slate-300 text-center">
                🔐 نستخدم Google للمصادقة الآمنة
                <br />
                <span className="text-xs text-slate-400">بيانات حسابك محمية بالكامل</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          &copy; 2026 Bodrix AI. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
}
