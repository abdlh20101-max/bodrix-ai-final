import { AlertCircle, Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LowMessagesNotificationProps {
  remaining: number;
  language: "ar" | "en";
  onWatchAd?: () => void;
}

export function LowMessagesNotification({
  remaining,
  language,
  onWatchAd,
}: LowMessagesNotificationProps) {
  if (remaining > 3) return null;

  const isArabic = language === "ar";

  return (
    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800 dark:text-orange-200">
        <div className="flex items-center justify-between">
          <span>
            {isArabic
              ? `تبقى لك ${remaining} رسائل فقط`
              : `You have ${remaining} messages left`}
          </span>
          {onWatchAd && (
            <button
              onClick={onWatchAd}
              className="ml-2 inline-flex items-center gap-1 rounded bg-orange-600 px-3 py-1 text-sm font-medium text-white hover:bg-orange-700"
            >
              <Zap className="h-3 w-3" />
              {isArabic ? "شاهد إعلان" : "Watch Ad"}
            </button>
          )}
        </div>
        <p className="mt-1 text-xs">
          {isArabic
            ? "شاهد إعلان للحصول على 10 رسائل إضافية"
            : "Watch an ad to get 10 more messages"}
        </p>
      </AlertDescription>
    </Alert>
  );
}
