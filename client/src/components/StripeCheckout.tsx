import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Stripe Checkout Component
 * مكون الدفع عبر Stripe
 */

interface StripeCheckoutProps {
  planId: string;
  onSuccess?: () => void;
}

export function StripeCheckout({ planId, onSuccess }: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutMutation = trpc.billing.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        // Open checkout in new tab
        window.open(data.url, "_blank");
        toast.success("جاري فتح صفحة الدفع...");
        onSuccess?.();
      }
    },
    onError: (error) => {
      toast.error(`خطأ: ${error.message}`);
      setIsLoading(false);
    },
  });

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      await createCheckoutMutation.mutateAsync({ planId });
    } catch (error) {
      console.error("Checkout error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading || createCheckoutMutation.isPending}
      className="w-full"
      size="lg"
    >
      {isLoading || createCheckoutMutation.isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          جاري المعالجة...
        </>
      ) : (
        "الاشتراك الآن"
      )}
    </Button>
  );
}

/**
 * Subscription Plans Display
 */
interface SubscriptionPlansProps {
  onSelectPlan?: (planId: string) => void;
}

export function SubscriptionPlans({ onSelectPlan }: SubscriptionPlansProps) {
  const { data: plans, isLoading } = trpc.billing.getPlans.useQuery();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  if (isLoading) {
    return <div className="text-center">جاري التحميل...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      {plans?.map((plan) => (
        <Card
          key={plan.id}
          className={`relative p-6 transition-all ${
            selectedPlan === plan.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          {/* Popular Badge */}
          {plan.id === "pro" && (
            <Badge className="absolute top-4 right-4 bg-blue-500">
              الأكثر شهرة
            </Badge>
          )}

          {/* Plan Name */}
          <h3 className="text-xl font-bold mb-2">{plan.name}</h3>

          {/* Price */}
          <div className="mb-6">
            <span className="text-4xl font-bold">
              {plan.price === 0 ? "مجاني" : `${plan.price} ${plan.currency}`}
            </span>
            {plan.price > 0 && (
              <span className="text-gray-600 text-sm mr-2">/ شهر</span>
            )}
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-6">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          {plan.id === "free" ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSelectedPlan(plan.id);
                onSelectPlan?.(plan.id);
              }}
            >
              ابدأ مجاناً
            </Button>
          ) : (
            <StripeCheckout
              planId={plan.id}
              onSuccess={() => {
                setSelectedPlan(plan.id);
                onSelectPlan?.(plan.id);
              }}
            />
          )}
        </Card>
      ))}
    </div>
  );
}

/**
 * Billing Portal
 */
export function BillingPortal() {
  const { data: subscription, isLoading } =
    trpc.billing.getSubscription.useQuery();
  const { data: history } = trpc.billing.getBillingHistory.useQuery({
    limit: 10,
  });
  const { data: usage } = trpc.billing.getUsageMetrics.useQuery();

  if (isLoading) {
    return <div className="text-center">جاري التحميل...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Current Subscription */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">اشتراكك الحالي</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">الخطة</p>
            <p className="text-lg font-semibold">{subscription?.planId}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">الحالة</p>
            <Badge variant="outline">{subscription?.status}</Badge>
          </div>
          <div>
            <p className="text-gray-600 text-sm">بداية الفترة</p>
            <p className="text-sm">
              {subscription?.currentPeriodStart &&
                new Date(subscription.currentPeriodStart).toLocaleDateString(
                  "ar-SA"
                )}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">نهاية الفترة</p>
            <p className="text-sm">
              {subscription?.currentPeriodEnd &&
                new Date(subscription.currentPeriodEnd).toLocaleDateString(
                  "ar-SA"
                )}
            </p>
          </div>
        </div>
      </Card>

      {/* Usage Metrics */}
      {usage && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">استخدامك</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">المهام المستخدمة</span>
                <span className="text-sm text-gray-600">
                  {usage.currentUsage} / {usage.limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${usage.percentageUsed}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Billing History */}
      {history && history.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">السجل المالي</h2>
          <div className="space-y-2">
            {history.map((invoice: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border-b last:border-b-0"
              >
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(invoice.date).toLocaleDateString("ar-SA")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${(invoice.amount / 100).toFixed(2)}
                  </p>
                  <Badge variant="outline">{invoice.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
