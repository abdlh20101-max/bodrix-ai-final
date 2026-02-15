import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { User, Phone, UserCircle } from "lucide-react";
import { useLocation } from "wouter";

type Tab = "username" | "phone" | "guest";

export default function Login() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const loginUsername = trpc.auth.loginUsername.useMutation({
    onSuccess: () => navigate("/dashboard"),
    onError: (e) => setError(e.message),
  });
  const loginPhone = trpc.auth.loginPhone.useMutation({
    onSuccess: () => navigate("/dashboard"),
    onError: (e) => setError(e.message),
  });
  const loginGuest = trpc.auth.loginGuest.useMutation({
    onSuccess: () => navigate("/dashboard"),
    onError: (e) => setError(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (tab === "username") {
      if (!username.trim() || !password) {
        setError("أدخل اسم المستخدم وكلمة السر");
        return;
      }
      loginUsername.mutate({ username: username.trim(), password });
    } else if (tab === "phone") {
      if (!phone.trim() || !password) {
        setError("أدخل رقم الجوال وكلمة السر");
        return;
      }
      const normalized = phone.replace(/\s/g, "");
      loginPhone.mutate({ phone: normalized, password });
    } else {
      loginGuest.mutate();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Bodrix AI</CardTitle>
          <CardDescription className="text-base">مرحباً بك في تطبيق الدردشة الذكي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2 border-b border-border pb-2">
            <Button
              variant={tab === "username" ? "default" : "ghost"}
              size="sm"
              className="flex-1"
              onClick={() => { setTab("username"); setError(""); }}
            >
              <User className="w-4 h-4 ml-1" />
              يوزر نيم
            </Button>
            <Button
              variant={tab === "phone" ? "default" : "ghost"}
              size="sm"
              className="flex-1"
              onClick={() => { setTab("phone"); setError(""); }}
            >
              <Phone className="w-4 h-4 ml-1" />
              جوال
            </Button>
            <Button
              variant={tab === "guest" ? "default" : "ghost"}
              size="sm"
              className="flex-1"
              onClick={() => { setTab("guest"); setError(""); }}
            >
              <UserCircle className="w-4 h-4 ml-1" />
              ضيف
            </Button>
          </div>

          {tab !== "guest" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "username" && (
                <div>
                  <Label>اسم المستخدم (6+ خانات، يبدأ بحرف)</Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="مثال: bod"
                    className="mt-1"
                    autoComplete="username"
                    minLength={6}
                  />
                </div>
              )}
              {tab === "phone" && (
                <div>
                  <Label>رقم الجوال (يبدأ بكود الدولة +966)</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+966501234567"
                    className="mt-1"
                    type="tel"
                    dir="ltr"
                  />
                </div>
              )}
              {tab !== "guest" && (
                <div>
                  <Label>كلمة السر (9+ خانات، تبدأ بحرف)</Label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="********"
                    className="mt-1"
                    autoComplete="current-password"
                    minLength={9}
                  />
                </div>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                className="w-full"
                disabled={loginUsername.isPending || loginPhone.isPending || loginGuest.isPending}
              >
                {loginUsername.isPending || loginPhone.isPending ? "جاري الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          )}

          {tab === "guest" && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                الدخول كضيف يسمح بتجربة التطبيق بدون حساب. انقر الزر أعلاه للدخول مباشرة.
              </p>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                className="w-full"
                onClick={() => loginGuest.mutate()}
                disabled={loginGuest.isPending}
              >
                {loginGuest.isPending ? "جاري الدخول..." : "دخول كضيف"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
