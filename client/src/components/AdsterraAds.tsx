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
 * إعلان بنر قياسي (728x90)
 */
export const AdsterraBannerAd = ({
  placement = "e6bc5ef409e84c68b61266975c307ef3",
  className = "",
}: {
  placement?: string;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear container
    containerRef.current.innerHTML = "";

    // Create options script
    const optionsScript = document.createElement("script");
    optionsScript.type = "text/javascript";
    optionsScript.innerHTML = `
      atOptions = {
        'key' : '${placement}',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    containerRef.current.appendChild(optionsScript);

    // Create invoke script
    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = `https://www.highperformanceformat.com/${placement}/invoke.js`;
    invokeScript.async = true;
    containerRef.current.appendChild(invokeScript);

  }, [placement]);

  return (
    <div className={`flex justify-center my-4 ${className}`}>
      <div
        ref={containerRef}
        className="adsterra-banner-container min-h-[90px] min-w-[728px] bg-slate-800/10 rounded flex items-center justify-center"
      >
        {/* Ad will be rendered here */}
      </div>
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

  return null;
};

/**
 * Generic Adsterra Ad Component
 */
export const AdsterraAd = ({
  adType = "banner",
  placement = "e6bc5ef409e84c68b61266975c307ef3",
  className = "",
}: AdsterraAdProps) => {
  switch (adType) {
    case "banner":
      return (
        <AdsterraBannerAd
          placement={placement}
          className={className}
        />
      );
    case "native":
      return (
        <AdsterraNativeAd
          placement={placement}
          className={className}
        />
      );
    case "video":
      return (
        <AdsterraVideoAd
          placement={placement}
          className={className}
        />
      );
    case "interstitial":
      return (
        <AdsterraInterstitialAd placement={placement} />
      );
    default:
      return (
        <AdsterraBannerAd
          placement={placement}
          className={className}
        />
      );
  }
};

declare global {
  interface Window {
    AdsterraAds?: {
      renderAd: (placement: string) => void;
      [key: string]: any;
    };
  }
}

export default AdsterraAd;
