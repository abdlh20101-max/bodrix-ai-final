import { useLanguage } from "@/_core/hooks/useLanguage";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useLocation } from "wouter";
import { AdManager } from "@/components/AdManager";
import { AdBannerTop } from "@/components/AdBannerTop";

export default function Plans() {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();
  const plansQuery = trpc.subscriptions.getPlans.useQuery();
  const currentSubscriptionQuery = trpc.subscriptions.getCurrent.useQuery();

  if (plansQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{t("common.loading")}</p>
      </div>
    );
  }

  const plans = plansQuery.data || [];
  const currentPlan = currentSubscriptionQuery.data;

  // Group plans by type
  const premiumPlans = plans.filter((p) => p.id.startsWith("premium"));
  const proPlans = plans.filter((p) => p.id.startsWith("pro"));

  const PlanCard = ({
    plan,
    isPro = false,
  }: {
    plan: (typeof plans)[0];
    isPro?: boolean;
  }) => {
    const isCurrentPlan = currentPlan?.planType === plan.id;
    const price = (plan.price / 100).toFixed(2);

    return (
      <Card
        className={`p-6 flex flex-col h-full ${
          isPro
            ? "border-2 border-purple-600 shadow-lg scale-105"
            : "border border-gray-200 dark:border-slate-700"
        }`}
      >
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {plan.name}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-blue-600">${price}</span>
            <span className="text-gray-600 dark:text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">
              {plan.days === 7 && t("subscription.perWeek")}
              {plan.days === 30 && t("subscription.perMonth")}
              {plan.days === 90 && t("subscription.per3Months")}
              {plan.days === 365 && t("subscription.perYear")}
            </span>
          </div>
        </div>

        <div className="flex-1 mb-6">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            {t("subscription.features")}
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Check className="h-4 w-4 text-green-600" />
              {t("subscription.unlimitedMessages")}
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Check className="h-4 w-4 text-green-600" />
              {t("subscription.unlimitedImages")}
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Check className="h-4 w-4 text-green-600" />
              {t("subscription.noAds")}
            </li>
            {!isPro && (
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Check className="h-4 w-4 text-green-600" />
                {t("subscription.educationalResources")}
              </li>
            )}
            {isPro && (
              <>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="h-4 w-4 text-green-600" />
                  {t("subscription.advancedResources")}
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="h-4 w-4 text-green-600" />
                  {t("subscription.prioritySupport")}
                </li>
              </>
            )}
          </ul>
        </div>

        <Button
          onClick={() => {
            if (!isCurrentPlan) {
              navigate(`/checkout?planId=${plan.id}&planName=${plan.name}&price=${plan.price}`);
            }
          }}
          className={`w-full ${
            isCurrentPlan
              ? "bg-gray-400 cursor-not-allowed"
              : isPro
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
          disabled={isCurrentPlan}
        >
          {isCurrentPlan ? t("subscription.current") : t("subscription.subscribe")}
        </Button>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <AdBannerTop />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t("subscription.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("home.description")}
          </p>
        </div>

        {/* Premium Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t("subscription.premium")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {premiumPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>

        {/* Pro Plans */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t("subscription.pro")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {proPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} isPro={true} />
            ))}
          </div>
        </div>

        {/* Free Plan Info */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t("subscription.free")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              20 {t("chat.messagesLeft")} و 2-3 {t("chat.imagesLeft")} {t("common.dailyLogin")}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {t("chat.watchAdForMore")} • {t("chat.shareForMore")}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
