import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

/**
 * Tap Payments Checkout Component
 * مكون الدفع عبر Tap Payments
 */

interface TapCheckoutProps {
  planId: string;
  planName: string;
  amount: number;
  description?: string;
  onSuccess?: (chargeId: string) => void;
  onError?: (error: Error) => void;
}

export function TapCheckout({
  planId,
  planName,
  amount,
  description = "Subscription Payment",
  onSuccess,
  onError,
}: TapCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [chargeId, setChargeId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Get Tap public key
  const { data: keyData } = trpc.tapBilling.getPublicKey.useQuery();

  // Create charge mutation
  const createChargeMutation = trpc.tapBilling.createCharge.useMutation({
    onSuccess: (data) => {
      setChargeId(data.chargeId);
      setStatus("success");
      onSuccess?.(data.chargeId);
    },
    onError: (error) => {
      setStatus("error");
      setErrorMessage(error.message);
      onError?.(new Error(error.message));
    },
  });

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setStatus("processing");
      setErrorMessage("");

      // Get current URL for redirect
      const redirectUrl = `${window.location.origin}/billing/success`;

      // Create charge
      await createChargeMutation.mutateAsync({
        amount,
        currency: "SAR",
        description,
        planId,
        redirectUrl,
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Payment failed");
      onError?.(error instanceof Error ? error : new Error("Payment failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{planName}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount Display */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="text-sm text-muted-foreground">Total Amount</div>
          <div className="text-3xl font-bold">
            {amount.toFixed(2)} <span className="text-lg">SAR</span>
          </div>
        </div>

        {/* Status Messages */}
        {status === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-900">Payment Successful</p>
              <p className="text-sm text-green-700 mt-1">Charge ID: {chargeId}</p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-900">Payment Failed</p>
              <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Checkout Button */}
        {status !== "success" && (
          <Button
            onClick={handleCheckout}
            disabled={isLoading || !keyData?.publicKey}
            className="w-full"
            size="lg"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? "Processing..." : "Pay with Tap"}
          </Button>
        )}

        {/* Success Button */}
        {status === "success" && (
          <Button
            onClick={() => {
              setStatus("idle");
              setChargeId("");
            }}
            className="w-full"
            variant="outline"
          >
            Make Another Payment
          </Button>
        )}

        {/* Tap Payments Info */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          <p>Secure payment powered by Tap Payments</p>
          <p className="mt-1">Your payment information is encrypted and secure</p>
        </div>
      </CardContent>
    </Card>
  );
}
