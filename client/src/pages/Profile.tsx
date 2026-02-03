import { useLanguage } from "@/_core/hooks/useLanguage";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Calendar, Globe } from "lucide-react";

export default function Profile() {
  const { t, language, changeLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const profileQuery = trpc.user.profile.useQuery();
  const subscriptionQuery = trpc.subscriptions.getCurrent.useQuery();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("profile.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("profile.settings")}
          </p>
        </div>

        {/* Profile Card */}
        <Card className="p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-6">
          <div className="space-y-6">
            {/* Name */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("profile.name")}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {profile?.name || user.name || "N/A"}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("profile.email")}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {profile?.email || user.email || "N/A"}
                </p>
              </div>
            </div>

            {/* Account Type */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("profile.accountType")}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getAccountTypeLabel(profile?.accountType || "free")}
                </p>
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("profile.joinDate")}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString(language)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Subscription Card */}
        {subscription && (
          <Card className="p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {t("subscription.current")}
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Plan:</span> {subscription.planType}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Status:</span> {subscription.status}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Expires:</span>{" "}
                {new Date(subscription.endDate).toLocaleDateString(language)}
              </p>
            </div>
          </Card>
        )}

        {/* Settings Card */}
        <Card className="p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-6">
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
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
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
