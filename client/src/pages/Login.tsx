import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { User, Phone, UserCircle, LogIn, UserPlus } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type Method = "username" | "phone" | "guest";
type Mode = "login" | "register";

export default function Login() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [method, setMethod] = useState<Method>("username");
  
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    password: "",
    name: "",
  });
  
  const [error, setError] = useState("");

  const loginUsername = trpc.auth.loginUsername.useMutation({
    onSuccess: () => {
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/dashboard");
    },
    onError: (e) => setError(e.message),
  });

  const loginPhone = trpc.auth.loginPhone.useMutation({
    onSuccess: () => {
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/dashboard");
    },
    onError: (e) => setError(e.message),
  });

  const loginGuest = trpc.auth.loginGuest.useMutation({
    onSuccess: () => {
      toast.success("تم الدخول كضيف بنجاح");
      navigate("/dashboard");
    },
    onError: (e) => setError(e.message),
  });

  const register = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("تم إنشاء الحساب بنجاح");
      navigate("/dashboard");
    },
    onError: (e) => setError(e.message),
  });

  const validate = () => {
    if (mode === "register") {
      // Strict validation for registration
      if (method === "username") {
        if (formData.username.length < 6) return "اسم المستخدم يجب أن يكون 6 خانات على الأقل";
        if (!/^[a-zA-Z]/.test(formData.username)) return "اسم المستخدم يجب أن يبدأ بحرف";
      }
      if (method === "phone") {
        if (!/^\+\d+$/.test(formData.phone)) return "رقم الجوال يجب أن يبدأ بـ + متبوعاً بالأرقام (مثال: +966...)";
      }
      if (formData.password.length < 8) return "كلمة السر يجب أن تكون 8 خانات على الأقل";
      if (!/^[a-zA-Z]/.test(formData.password)) return "كلمة السر يجب أن تبدأ بحرف";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (method === "guest") {
      loginGuest.mutate();
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (mode === "login") {
      if (method === "username") {
        loginUsername.mutate({ username: formData.username, password: formData.password });
      } else {
        loginPhone.mutate({ phone: formData.phone.replace(/\s/g, ""), password: formData.password });
      }
    } else {
      // Register
      register.mutate({
        username: method === "username" ? formData.username : undefined,
        phone: method === "phone" ? formData.phone.replace(/\s/g, "") : undefined,
        password: formData.password,
        name: formData.name,
      });
    }
  };

  const isLoading = loginUsername.isPending || loginPhone.isPending || loginGuest.isPending || register.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20 p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-2xl border-primary/10">
        <CardHeader className="space-y-2 text-center pb-2">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Bodrix AI
          </CardTitle>
          <CardDescription className="text-base">
            {mode === "login" ? "تسجيل الدخول للمنصة" : "إنشاء حساب جديد"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Toggle Login/Register */}
          <div className="flex p-1 bg-muted rounded-lg">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === "login" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => { setMode("login"); setError(""); }}
            >
              تسجيل دخول
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === "register" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => { setMode("register"); setError(""); if (method === "guest") setMethod("username"); }}
            >
              حساب جديد
            </button>
          </div>

          {/* Method Selection */}
          <div className="flex gap-2 justify-center">
            <Button
              variant={method === "username" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => { setMethod("username"); setError(""); }}
            >
              <User className="w-4 h-4 ml-2" />
              يوزر نيم
            </Button>
            <Button
              variant={method === "phone" ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => { setMethod("phone"); setError(""); }}
            >
              <Phone className="w-4 h-4 ml-2" />
              جوال
            </Button>
            {mode === "login" && (
              <Button
                variant={method === "guest" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => { setMethod("guest"); setError(""); }}
              >
                <UserCircle className="w-4 h-4 ml-2" />
                ضيف
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {method === "guest" ? (
              <div className="text-center py-4 space-y-2">
                <UserCircle className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  الدخول كضيف يمنحك صلاحيات محدودة لتجربة المنصة.
                </p>
              </div>
            ) : (
              <>
                {mode === "register" && (
                  <div className="space-y-2">
                    <Label>الاسم (اختياري)</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="الاسم الظاهر"
                    />
                  </div>
                )}

                {method === "username" && (
                  <div className="space-y-2">
                    <Label>اسم المستخدم {mode === "register" && <span className="text-xs text-muted-foreground">(6+ خانات، يبدأ بحرف)</span>}</Label>
                    <Input
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      placeholder="username"
                      dir="ltr"
                      className="text-left"
                    />
                  </div>
                )}

                {method === "phone" && (
                  <div className="space-y-2">
                    <Label>رقم الجوال {mode === "register" && <span className="text-xs text-muted-foreground">(مثال: +96650...)</span>}</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+96650xxxxxxx"
                      dir="ltr"
                      className="text-left"
                      type="tel"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>كلمة السر {mode === "register" && <span className="text-xs text-muted-foreground">(8+ خانات، تبدأ بحرف)</span>}</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="********"
                    dir="ltr"
                    className="text-left"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20 flex items-center gap-2">
                <span className="font-bold">!</span> {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <span className="animate-pulse">جاري المعالجة...</span>
              ) : (
                <>
                  {method === "guest" ? "دخول كضيف" : (mode === "login" ? "تسجيل الدخول" : "إنشاء حساب")}
                  {mode === "login" || method === "guest" ? <LogIn className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-xs text-muted-foreground pb-6">
          Bodrix AI &copy; {new Date().getFullYear()} جميع الحقوق محفوظة
        </CardFooter>
      </Card>
    </div>
  );
}
