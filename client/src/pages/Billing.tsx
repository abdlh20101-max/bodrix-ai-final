import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TapCheckout } from "@/components/TapCheckout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, Check } from "lucide-react";

/**
 * Billing Page
 * صفحة الفواتير والدفع
 */

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export default function Billing() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");
  const [showCheckout, setShowCheckout] = useState(false);

  // Get available plans
  const { data: plansData, isLoading: plansLoading } = trpc.tapBilling.getPlans.useQuery();

  const plans: Plan[] = [
    {
      id: "free",
      name: "Free Plan",
      price: 0,
      currency: "SAR",
      description: "Perfect for getting started",
      features: [
        "Up to 10 projects",
        "Basic analytics",
        "Community support",
        "1 GB storage",
      ],
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: 99,
      currency: "SAR",
      description: "For growing teams",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "100 GB storage",
        "Team collaboration",
        "Custom integrations",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      price: 299,
      currency: "SAR",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Dedicated support",
        "Unlimited storage",
        "Advanced security",
        "SLA guarantee",
        "Custom features",
        "API access",
      ],
    },
  ];

  const currentPlan = plans.find((p) => p.id === selectedPlan);

  return (
    <div className="container py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Billing & Plans</h1>
        <p className="text-muted-foreground text-lg">
          Choose the perfect plan for your needs
        </p>
      </div>

      {/* Current Subscription Info */}
      {user && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Current Subscription</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {user.role === "admin" ? "Enterprise" : "Pro"} Plan
                </p>
              </div>
              <Badge className="bg-blue-600">Active</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plansLoading ? (
          <div className="col-span-3 flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition ${
                plan.popular ? "border-blue-500 border-2 shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600">Most Popular</Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div>
                  <div className="text-4xl font-bold">
                    {plan.price}
                    <span className="text-lg text-muted-foreground ml-1">{plan.currency}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">per month</p>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                {plan.id === "free" ? (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setSelectedPlan(plan.id);
                      setShowCheckout(true);
                    }}
                    className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                  >
                    Upgrade to {plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Checkout Section */}
      {showCheckout && currentPlan && currentPlan.id !== "free" && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Purchase</CardTitle>
              <CardDescription>
                Upgrade to {currentPlan.name} for {currentPlan.price} {currentPlan.currency}/month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TapCheckout
                planId={currentPlan.id}
                planName={currentPlan.name}
                amount={currentPlan.price}
                description={`${currentPlan.name} - Monthly Subscription`}
                onSuccess={(chargeId) => {
                  setShowCheckout(false);
                  alert(`Payment successful! Charge ID: ${chargeId}`);
                }}
                onError={(error) => {
                  alert(`Payment failed: ${error.message}`);
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* FAQ Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Can I change plans anytime?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards and bank transfers through Tap Payments.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Is there a free trial?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Yes, start with our Free Plan and upgrade whenever you're ready.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">What about refunds?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                We offer a 30-day money-back guarantee. Contact support for refund requests.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
