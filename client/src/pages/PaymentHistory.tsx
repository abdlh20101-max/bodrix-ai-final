import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { TapCheckout } from "@/components/TapCheckout";
import { Loader2, Download, RefreshCw, AlertCircle } from "lucide-react";

/**
 * Payment History Page
 * صفحة سجل الدفع
 */

interface PaymentRecord {
  id: string;
  chargeId: string;
  amount: number;
  currency: string;
  status: "captured" | "failed" | "refunded" | "declined";
  planId: string;
  planName: string;
  date: string;
  description: string;
}

export function PaymentHistory() {
  const { user, loading: authLoading } = useAuth();
  const [selectedCharge, setSelectedCharge] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in production, fetch from API
  const [payments] = useState<PaymentRecord[]>([
    {
      id: "1",
      chargeId: "ch_test_123",
      amount: 99,
      currency: "SAR",
      status: "captured",
      planId: "pro",
      planName: "Pro Plan",
      date: "2026-02-06",
      description: "Monthly subscription",
    },
    {
      id: "2",
      chargeId: "ch_test_456",
      amount: 299,
      currency: "SAR",
      status: "captured",
      planId: "enterprise",
      planName: "Enterprise Plan",
      date: "2026-01-06",
      description: "Monthly subscription",
    },
  ]);

  // Get subscription plans
  const { data: plansData } = trpc.tapBilling.getPlans.useQuery();

  // Get charge status
  const { data: chargeData, isLoading: chargeLoading } =
    trpc.tapBilling.getChargeStatus.useQuery(
      { chargeId: selectedCharge },
      { enabled: !!selectedCharge }
    );

  // Refund mutation
  const refundMutation = trpc.tapBilling.refundCharge.useMutation({
    onSuccess: () => {
      alert("Refund processed successfully");
      setSelectedCharge("");
    },
    onError: (error) => {
      alert(`Refund failed: ${error.message}`);
    },
  });

  const filteredPayments = payments.filter(
    (payment) =>
      payment.chargeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "captured":
        return "bg-green-100 text-green-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "declined":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-8">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-900">Authentication Required</p>
              <p className="text-sm text-yellow-700 mt-1">
                Please log in to view your payment history
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your payments and subscriptions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <div className="flex gap-2">
            <Input
              placeholder="Search by charge ID or plan name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {/* Payments List */}
          <div className="space-y-4">
            {filteredPayments.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  <p>No payments found</p>
                </CardContent>
              </Card>
            ) : (
              filteredPayments.map((payment) => (
                <Card key={payment.id} className="cursor-pointer hover:shadow-md transition">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{payment.planName}</CardTitle>
                        <CardDescription>{payment.description}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-semibold">
                          {payment.amount.toFixed(2)} {payment.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-semibold">{payment.date}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Charge ID</p>
                        <p className="font-mono text-xs">{payment.chargeId}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Plan ID</p>
                        <p className="font-mono text-xs">{payment.planId}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCharge(payment.chargeId)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {payment.status === "captured" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            refundMutation.mutate({ chargeId: payment.chargeId })
                          }
                          disabled={refundMutation.isPending}
                        >
                          {refundMutation.isPending && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          )}
                          Request Refund
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Charge Details */}
          {selectedCharge && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Charge Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {chargeLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : chargeData ? (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Charge ID</p>
                      <p className="font-mono text-xs break-all">{chargeData.chargeId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(chargeData.status)}>
                        {chargeData.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-semibold">
                        {chargeData.amount.toFixed(2)} {chargeData.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-sm">{chargeData.description}</p>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* Available Plans */}
          {plansData?.plans && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Available Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {plansData.plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-3 border rounded-lg hover:bg-muted transition"
                  >
                    <p className="font-medium text-sm">{plan.name}</p>
                    <p className="text-lg font-bold">
                      {plan.price} {plan.currency}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {plan.features.length} features
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
