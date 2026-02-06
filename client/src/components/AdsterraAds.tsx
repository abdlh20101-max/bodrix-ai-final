import { useEffect, useRef } from "react";

/**
 * Adsterra Ads Integration
 * تكامل إعلانات Adsterra للربح من التطبيق
 */

interface AdsterraAdProps {
  adType: "banner" | "native" | "video" | "interstitial";
  placement?: string;
  className?: string;
}

/**
 * Banner Ad Component
 * إعلان بنر قياسي
 */
export const AdsterraBannerAd = ({
  placement = "banner_top",
  className = "",
}: {
  placement?: string;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Adsterra script
    const script = document.createElement("script");
    script.src = "//a.adsterra.com/s/js/160/uds.js";
    script.async = true;
    script.onload = () => {
      // Push ad to container
      if (window.AdsterraAds) {
        window.AdsterraAds.renderAd(placement);
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [placement]);

  return (
    <div
      ref={containerRef}
      className={`adsterra-ad-container ${className}`}
      data-placement={placement}
    >
      {/* Ad will be rendered here by Adsterra script */}
    </div>
  );
};

/**
 * Native Ad Component
 * إعلان أصلي متوافق مع التصميم
 */
export const AdsterraNativeAd = ({
  placement = "native_content",
  className = "",
}: {
  placement?: string;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//a.adsterra.com/s/js/160/uds.js";
    script.async = true;
    script.onload = () => {
      if (window.AdsterraAds) {
        window.AdsterraAds.renderAd(placement);
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [placement]);

  return (
    <div
      ref={containerRef}
      className={`adsterra-native-ad ${className}`}
      data-placement={placement}
    />
  );
};

/**
 * Video Ad Component
 * إعلان فيديو
 */
export const AdsterraVideoAd = ({
  placement = "video_content",
  className = "",
}: {
  placement?: string;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//a.adsterra.com/s/js/160/uds.js";
    script.async = true;
    script.onload = () => {
      if (window.AdsterraAds) {
        window.AdsterraAds.renderAd(placement);
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [placement]);

  return (
    <div
      ref={containerRef}
      className={`adsterra-video-ad ${className}`}
      data-placement={placement}
    />
  );
};

/**
 * Interstitial Ad Component
 * إعلان بيني (يظهر بين الصفحات)
 */
export const AdsterraInterstitialAd = ({
  placement = "interstitial",
}: {
  placement?: string;
}) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//a.adsterra.com/s/js/160/uds.js";
    script.async = true;
    script.onload = () => {
      if (window.AdsterraAds) {
        window.AdsterraAds.renderAd(placement);
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [placement]);

  return null; // Interstitial ads don't need a visible container
};

/**
 * Generic Adsterra Ad Component
 * مكون عام لأي نوع إعلان
 */
export const AdsterraAd = ({
  adType = "banner",
  placement = "default",
  className = "",
}: AdsterraAdProps) => {
  switch (adType) {
    case "banner":
      return (
        <AdsterraBannerAd
          placement={placement || "banner_top"}
          className={className}
        />
      );
    case "native":
      return (
        <AdsterraNativeAd
          placement={placement || "native_content"}
          className={className}
        />
      );
    case "video":
      return (
        <AdsterraVideoAd
          placement={placement || "video_content"}
          className={className}
        />
      );
    case "interstitial":
      return (
        <AdsterraInterstitialAd placement={placement || "interstitial"} />
      );
    default:
      return (
        <AdsterraBannerAd
          placement={placement || "banner_top"}
          className={className}
        />
      );
  }
};

// Type augmentation for window object
declare global {
  interface Window {
    AdsterraAds?: {
      renderAd: (placement: string) => void;
      [key: string]: any;
    };
  }
}

export default AdsterraAd;
