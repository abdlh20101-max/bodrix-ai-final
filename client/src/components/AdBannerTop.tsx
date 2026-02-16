import { useEffect, useState } from "react";

/**
 * Persistent top banner component for Monetag ads
 * Shows on all pages without being intrusive
 */
export function AdBannerTop() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Monetag ads when component mounts
    if ((window as any).Monetag) {
      (window as any).Monetag.showAds();
      setIsLoaded(true);
    } else {
      // Wait for Monetag to load
      const checkMonetag = setInterval(() => {
        if ((window as any).Monetag) {
          (window as any).Monetag.showAds();
          setIsLoaded(true);
          clearInterval(checkMonetag);
        }
      }, 500);

      // Clear interval after 10 seconds
      setTimeout(() => clearInterval(checkMonetag), 10000);
    }
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-gray-200 dark:border-slate-600 py-1 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Monetag Ad Container */}
        <div
          id="monetag-ad-top"
          className="flex justify-center items-center min-h-[40px] bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600"
        >
          {!isLoaded && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              جاري تحميل الإعلانات...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
