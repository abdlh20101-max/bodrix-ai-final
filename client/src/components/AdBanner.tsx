import { useEffect } from "react";

interface AdBannerProps {
  type?: "horizontal" | "vertical" | "square";
  className?: string;
}

export function AdBanner({ type = "horizontal", className = "" }: AdBannerProps) {
  useEffect(() => {
    // Load Propeller Ads script
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://cdn.propellerads.com/js/ads.js";
    script.onload = () => {
      // Initialize Propeller Ads
      if (window._pa) {
        window._pa.init({
          siteId: "YOUR_SITE_ID", // Replace with your Propeller Ads site ID
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const getAdDimensions = () => {
    switch (type) {
      case "vertical":
        return "w-64 h-96";
      case "square":
        return "w-80 h-80";
      case "horizontal":
      default:
        return "w-full h-24";
    }
  };

  return (
    <div
      className={`flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden ${getAdDimensions()} ${className}`}
      id="propeller-ad"
    >
      {/* Propeller Ads will inject content here */}
      <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
        إعلان
      </div>
    </div>
  );
}

// Extend window type for Propeller Ads
declare global {
  interface Window {
    _pa?: {
      init: (config: any) => void;
    };
  }
}
