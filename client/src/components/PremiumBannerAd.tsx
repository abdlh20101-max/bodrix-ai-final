import { useState } from "react";
import { X, Sparkles, ArrowRight } from "lucide-react";

/**
 * Premium Banner Ad Component
 * مكون إعلان بنر متميز وجذاب
 */

interface PremiumBannerAdProps {
  variant?: "default" | "gradient" | "dark" | "light";
  position?: "top" | "bottom";
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const PremiumBannerAd = ({
  variant = "gradient",
  position = "top",
  dismissible = true,
  onDismiss,
}: PremiumBannerAdProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const variants = {
    default: "bg-gradient-to-r from-blue-500 to-blue-600",
    gradient:
      "bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-lg",
    dark: "bg-slate-900 border-b border-slate-700",
    light: "bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200",
  };

  const textColor = {
    default: "text-white",
    gradient: "text-white",
    dark: "text-white",
    light: "text-slate-900",
  };

  return (
    <div
      className={`${variants[variant]} ${position === "top" ? "sticky top-0" : "relative"} z-50 transition-all duration-300`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative px-4 py-4 sm:px-6 sm:py-5 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Main message */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm">
                <Sparkles className={`h-6 w-6 ${textColor[variant]}`} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-sm sm:text-base font-bold ${textColor[variant]} truncate`}>
                🎉 عرض خاص محدود الوقت!
              </p>
              <p
                className={`text-xs sm:text-sm ${textColor[variant]} opacity-90 hidden sm:block truncate`}
              >
                احصل على خطة Pro مع خصم 50% - اليوم فقط!
              </p>
            </div>
          </div>

          {/* Right side - CTA and close */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                // Navigate to plans page
                window.location.href = "/plans?promo=50off";
              }}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                variant === "light"
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg"
                  : "bg-white hover:bg-gray-100 text-slate-900 shadow-md hover:shadow-lg"
              }`}
            >
              <span className="hidden sm:inline">اشترك الآن</span>
              <span className="sm:hidden">اشترك</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {dismissible && (
              <button
                onClick={handleDismiss}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  variant === "light"
                    ? "hover:bg-orange-100 text-slate-900"
                    : "hover:bg-white/20 text-white"
                }`}
                aria-label="إغلاق الإعلان"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white/40 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Floating Banner Ad - يظهر كبطاقة عائمة
 */
export const FloatingBannerAd = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-2xl overflow-hidden border border-purple-400/50 backdrop-blur-sm">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>

        <div className="relative p-6">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="h-4 w-4 text-white" />
          </button>

          <div className="flex items-start gap-4 pr-8">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-white/20">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">
                ترقية مجانية!
              </h3>
              <p className="text-sm text-purple-100 mb-4">
                احصل على ميزات Pro مجاناً لمدة شهر واحد
              </p>

              <button className="w-full bg-white text-indigo-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2">
                استفد الآن
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Inline Banner Ad - إعلان مدمج في الصفحة
 */
export const InlineBannerAd = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="my-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-blue-900 dark:text-blue-100">
              اكتشف الميزات المتقدمة
            </h3>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            احصل على وصول غير محدود إلى جميع أدوات AI المتقدمة
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => {
              window.location.href = "/billing";
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            اشترك
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
          >
            <X className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumBannerAd;
