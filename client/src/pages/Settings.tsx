import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/_core/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Globe, Lock, LogOut, ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Settings() {
  const { user, logout } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const [, navigate] = useLocation();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-muted rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">الإعدادات</h1>
            <p className="text-sm text-muted-foreground">Settings</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              اللغة
            </CardTitle>
            <CardDescription>Language</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">اختر اللغة</label>
              <Select value={language} onValueChange={changeLanguage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              الإشعارات
            </CardTitle>
            <CardDescription>Notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">إشعارات التطبيق</p>
                <p className="text-sm text-muted-foreground">تلقي إشعارات داخل التطبيق</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">إشعارات البريد الإلكتروني</p>
                  <p className="text-sm text-muted-foreground">تلقي تحديثات عبر البريد</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              الخصوصية والأمان
            </CardTitle>
            <CardDescription>Privacy & Security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-foreground">
                🔒 بيانات حسابك محمية بالكامل. نحن لا نشارك معلوماتك مع أي جهة خارجية.
              </p>
            </div>
            <Button variant="outline" className="w-full">
              تغيير كلمة المرور
            </Button>
            <Button variant="outline" className="w-full">
              تنزيل بيانات حسابي
            </Button>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات الحساب</CardTitle>
            <CardDescription>Account Information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">الاسم</p>
                <p className="font-medium">{user?.name || "المستخدم"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                <p className="font-medium text-sm break-all">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نوع الحساب</p>
                <p className="font-medium">{user?.role === "admin" ? "مسؤول" : "مستخدم"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تاريخ التسجيل</p>
                <p className="font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("ar-SA") : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <div className="flex gap-4">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full h-12 flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </Button>
        </div>
      </main>
    </div>
  );
}
