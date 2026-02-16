import {
  Shield,
  User,
  Settings,
  MessageSquare,
  Image,
  CreditCard,
  Users,
  LayoutDashboard,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  Globe,
  Palette,
  Layout,
  FileText,
  Database,
  Lock,
  Smartphone,
  Mail,
  MoreVertical,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { toast } from "sonner";
import { useAuth } from "../_core/hooks/useAuth";

// --- Components for different admin sections ---

function DashboardOverview() {
  // Mock data for overview
  const stats = [
    { title: "إجمالي المستخدمين", value: "1,234", icon: Users, change: "+12%" },
    { title: "الرسائل اليوم", value: "45,678", icon: MessageSquare, change: "+5%" },
    { title: "الصور المولدة", value: "890", icon: Image, change: "+8%" },
    { title: "الإيرادات", value: "$12,345", icon: CreditCard, change: "+15%" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change} من الشهر الماضي</p>
          </CardContent>
        </Card>
      ))}
      
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>نشاط النظام</CardTitle>
          <CardDescription>نظرة عامة على أداء النظام خلال الأسبوع الماضي</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
          {/* Placeholder for a chart */}
          مخطط بياني للنشاط (قيد التطوير)
        </CardContent>
      </Card>
    </div>
  );
}

function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users, refetch } = trpc.user.getAll.useQuery({ search: searchTerm });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="بحث عن مستخدم..."
            className="pr-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="ml-2 h-4 w-4" /> إضافة مستخدم
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">البريد الإلكتروني</TableHead>
              <TableHead className="text-right">الدور</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email || user.phone || user.username}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    نشط
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function SiteSettings() {
  const { data: configs, refetch } = trpc.siteConfig.getAll.useQuery();
  const updateConfig = trpc.siteConfig.update.useMutation({
    onSuccess: () => {
      toast.success("تم حفظ الإعدادات بنجاح");
      refetch();
    },
    onError: (err) => {
      toast.error(`فشل الحفظ: ${err.message}`);
    },
  });

  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (configs) {
      const newSettings: Record<string, string> = {};
      Object.entries(configs).forEach(([key, val]) => {
        newSettings[key] = val.value;
      });
      setSettings(newSettings);
    }
  }, [configs]);

  const handleSave = (key: string, value: string) => {
    updateConfig.mutate({ key, value });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>إعدادات عامة</CardTitle>
          <CardDescription>تحكم في اسم الموقع، الشعار، والألوان الأساسية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="siteName">اسم الموقع</Label>
            <div className="flex gap-2">
              <Input 
                id="siteName" 
                value={settings["site_name"] || "Bodrix AI"} 
                onChange={(e) => setSettings({...settings, "site_name": e.target.value})}
              />
              <Button onClick={() => handleSave("site_name", settings["site_name"])}>حفظ</Button>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="primaryColor">اللون الأساسي</Label>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 flex-1">
                <input 
                  type="color" 
                  className="h-9 w-9 rounded border cursor-pointer"
                  value={settings["primary_color"] || "#3b82f6"}
                  onChange={(e) => setSettings({...settings, "primary_color": e.target.value})}
                />
                <Input 
                  value={settings["primary_color"] || "#3b82f6"} 
                  onChange={(e) => setSettings({...settings, "primary_color": e.target.value})}
                />
              </div>
              <Button onClick={() => handleSave("primary_color", settings["primary_color"])}>حفظ</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات التسجيل</CardTitle>
          <CardDescription>التحكم في شروط التسجيل والدخول</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>السماح بتسجيل الزوار</Label>
              <p className="text-sm text-muted-foreground">تفعيل خيار الدخول كضيف</p>
            </div>
            <Switch 
              checked={settings["allow_guest"] === "true"}
              onCheckedChange={(c) => {
                setSettings({...settings, "allow_guest": String(c)});
                handleSave("allow_guest", String(c));
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>تفعيل التحقق من الجوال</Label>
              <p className="text-sm text-muted-foreground">إرسال كود OTP عند التسجيل بالجوال</p>
            </div>
            <Switch 
              checked={settings["enable_otp"] === "true"}
              onCheckedChange={(c) => {
                setSettings({...settings, "enable_otp": String(c)});
                handleSave("enable_otp", String(c));
              }}
            />
          </div>

          <div className="grid gap-2 pt-4 border-t">
            <Label htmlFor="customCss">CSS مخصص</Label>
            <textarea
              id="customCss"
              className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
              placeholder=".button { background: red; }"
              value={settings["custom_css"] || ""}
              onChange={(e) => setSettings({...settings, "custom_css": e.target.value})}
            />
            <Button onClick={() => handleSave("custom_css", settings["custom_css"])}>حفظ CSS</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ContentManagement() {
  const utils = trpc.useUtils();
  const { data: configs } = trpc.siteConfig.getAll.useQuery();
  const updateConfig = trpc.siteConfig.update.useMutation({
    onSuccess: () => {
      toast.success("تم التحديث بنجاح");
      utils.siteConfig.getAll.invalidate();
    },
  });

  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    if (configs) {
      const menuConfig = configs.find(c => c.key === "sidebar_menu");
      if (menuConfig && menuConfig.value) {
        try {
          setMenuItems(JSON.parse(menuConfig.value));
        } catch (e) {
          console.error("Failed to parse menu config", e);
        }
      } else {
        // Default menu if not set
        setMenuItems([
          { id: "home", label: "الرئيسية", path: "/dashboard", icon: "LayoutDashboard", active: true },
          { id: "chat", label: "المحادثة", path: "/chat", icon: "MessageSquare", active: true },
          { id: "wallet", label: "المحفظة", path: "/wallet", icon: "Wallet", active: true },
        ]);
      }
    }
  }, [configs]);

  const handleSaveMenu = () => {
    updateConfig.mutate({
      key: "sidebar_menu",
      value: JSON.stringify(menuItems),
      type: "json",
    });
  };

  const toggleMenuItem = (index: number) => {
    const newMenu = [...menuItems];
    newMenu[index].active = !newMenu[index].active;
    setMenuItems(newMenu);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إدارة القائمة الجانبية</CardTitle>
          <CardDescription>التحكم في عناصر القائمة الجانبية (إظهار/إخفاء)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">الرابط</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.label}</TableCell>
                  <TableCell dir="ltr" className="text-right">{item.path}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={item.active} 
                      onCheckedChange={() => toggleMenuItem(index)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveMenu}>حفظ التغييرات</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>سجلات الأمان</CardTitle>
          <CardDescription>آخر محاولات الدخول والنشاطات المشبوهة</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">المستخدم</TableHead>
                <TableHead className="text-right">النشاط</TableHead>
                <TableHead className="text-right">IP Address</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>admin</TableCell>
                <TableCell>تسجيل دخول</TableCell>
                <TableCell>192.168.1.1</TableCell>
                <TableCell>منذ 5 دقائق</TableCell>
                <TableCell><Badge variant="default">نجاح</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>unknown</TableCell>
                <TableCell>محاولة دخول فاشلة</TableCell>
                <TableCell>10.0.0.5</TableCell>
                <TableCell>منذ ساعة</TableCell>
                <TableCell><Badge variant="destructive">فشل</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات الحماية المتقدمة</CardTitle>
          <CardDescription>التحكم في سياسات كلمات المرور والجلسات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>فرض تغيير كلمة المرور دورياً</Label>
              <p className="text-sm text-muted-foreground">إجبار المستخدمين على تغيير كلمة المرور كل 90 يوم</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>حظر IPs المشبوهة تلقائياً</Label>
              <p className="text-sm text-muted-foreground">حظر العناوين التي تكرر محاولات الدخول الفاشلة</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Main Admin Layout ---

export default function AdminPanel() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Protect admin route
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      setLocation("/");
      toast.error("غير مصرح لك بالدخول لهذه الصفحة");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading || !user) return <div className="flex h-screen items-center justify-center">جاري التحميل...</div>;

  const menuItems = [
    { id: "overview", label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "users", label: "المستخدمين", icon: Users },
    { id: "settings", label: "إعدادات الموقع", icon: Settings },
    { id: "content", label: "إدارة المحتوى", icon: FileText },
    { id: "security", label: "الأمان", icon: Shield },
    { id: "logs", label: "سجلات النظام", icon: Database },
  ];

  return (
    <div className="flex min-h-screen bg-background" dir="rtl">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-l bg-card md:flex">
        <div className="flex h-14 items-center border-b px-4 font-bold text-lg">
          <Shield className="ml-2 h-5 w-5 text-primary" />
          لوحة الإدارة
        </div>
        <ScrollArea className="flex-1">
          <nav className="grid gap-1 p-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="ml-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user.name?.[0] || "A"}
            </div>
            <div className="text-sm">
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">مدير النظام</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setLocation("/")}>
            <LogOut className="ml-2 h-4 w-4" />
            العودة للموقع
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {menuItems.find(m => m.id === activeTab)?.label}
          </h1>
          <div className="mr-auto flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-6xl">
            {activeTab === "overview" && <DashboardOverview />}
            {activeTab === "users" && <UserManagement />}
            {activeTab === "settings" && <SiteSettings />}
            {activeTab === "content" && <ContentManagement />}
            {activeTab === "security" && <SecuritySettings />}
            {/* Add other sections as needed */}
          </div>
        </main>
      </div>
    </div>
  );
}
