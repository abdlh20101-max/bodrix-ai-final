import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Chrome } from "lucide-react";

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Bodrix AI</CardTitle>
          <CardDescription className="text-base">
            مرحباً بك في تطبيق الدردشة الذكي
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              قم بتسجيل الدخول للبدء في استخدام التطبيق
            </p>
          </div>

          <Button
            onClick={handleGoogleLogin}
            className="w-full h-12 text-base font-semibold flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          >
            <Chrome className="w-5 h-5" />
            تسجيل الدخول عبر Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">أو</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              🔐 نستخدم Google للمصادقة الآمنة. بيانات حسابك محمية بالكامل.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
