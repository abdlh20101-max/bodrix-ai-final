import { useState } from "react";
import { useLanguage } from "@/_core/hooks/useLanguage";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Calendar, Globe, Camera, Save, X, Award, Phone, MapPin } from "lucide-react";

export default function Profile() {
  const { t, language, changeLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const profileQuery = trpc.user.profile.useQuery();
  const subscriptionQuery = trpc.subscriptions.getCurrent.useQuery();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "عبدالله الحصيني",
    email: user?.email || "abdih201@gmail.com",
    phone: "+966501234567",
    location: "الرياض، السعودية",
    bio: "مهتم بالذكاء الاصطناعي والتكنولوجيا",
  });

  const [badges] = useState([
    { id: 1, name: "المبتدئ", icon: "🎯", description: "أرسل أول رسالة", earned: true },
    { id: 2, name: "الناشط", icon: "⚡", description: "أرسل 100 رسالة", earned: true },
    { id: 3, name: "المحترف", icon: "🏆", description: "أرسل 500 رسالة", earned: true },
    { id: 4, name: "المحيل", icon: "🔗", description: "أحل 5 أشخاص", earned: false },
    { id: 5, name: "المشاهد", icon: "👀", description: "شاهد 10 إعلانات", earned: true },
    { id: 6, name: "المقيّم", icon: "⭐", description: "أضف 10 تقييمات", earned: false },
  ]);

  if (!user || profileQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{t("common.loading")}</p>
      </div>
    );
  }

  const profile = profileQuery.data;
  const subscription = subscriptionQuery.data;

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "free":
        return t("subscription.free");
      case "premium":
        return t("subscription.premium");
      case "pro":
        return t("subscription.pro");
      case "developer":
        return "Developer";
      default:
        return type;
    }
  };

  const handleSaveProfile = () => {
    console.log("حفظ البيانات:", profileData);
    setIsEditing(false);
    alert("تم حفظ البيانات بنجاح!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("profile.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("profile.settings")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card className="p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  معلومات الحساب
                </h2>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    تحرير
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      الاسم
                    </label>
                    <Input
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      البريد الإلكتروني
                    </label>
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      رقم الهاتف
                    </label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      الموقع
                    </label>
                    <Input
                      value={profileData.location}
                      onChange={(e) =>
                        setProfileData({ ...profileData, location: e.target.value })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      السيرة الذاتية
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      حفظ
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      إلغاء
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">الاسم</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {profileData.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">البريد الإلكتروني</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {profileData.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">رقم الهاتف</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {profileData.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                      <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">الموقع</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {profileData.location}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">السيرة الذاتية</p>
                    <p className="text-gray-900 dark:text-white">{profileData.bio}</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Badges Section */}
            <Card className="p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Award className="w-6 h-6" />
                الشارات والإنجازات
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg text-center transition ${
                      badge.earned
                        ? "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border border-yellow-200 dark:border-yellow-700"
                        : "bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 opacity-50"
                    }`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {badge.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {badge.description}
                    </p>
                    {badge.earned && (
                      <div className="mt-2 text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                        ✓ مكتسبة
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Subscription Card */}
            {subscription && (
              <Card className="p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("subscription.current")}
                </h2>
                <div className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">الخطة:</span> {subscription.planType}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">الحالة:</span> {subscription.status}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold">تنتهي في:</span>{" "}
                    {new Date(subscription.endDate).toLocaleDateString(language)}
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Settings Card */}
            <Card className="p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t("profile.settings")}
              </h2>
              <div className="space-y-4">
                {/* Language Selector */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <label className="text-gray-700 dark:text-gray-300 font-medium">
                      {t("profile.language")}
                    </label>
                  </div>
                  <Select value={language} onValueChange={(value) => changeLanguage(value as any)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Account Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  إحصائيات الحساب
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">تاريخ الانضمام:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {profile?.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString(language)
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">الرسائل:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">1,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">الصور:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">340</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">الشارات:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">3</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.history.back()}
          >
            {t("common.back")}
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => logout()}
          >
            {t("nav.logout")}
          </Button>
        </div>
      </div>
    </div>
  );
}
