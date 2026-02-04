import { useEffect } from 'react';

export function PropellerAdsComponent() {
  useEffect(() => {
    // PropellerAds script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://a.adspirit.com/ad/tag.js';
    script.onload = () => {
      // Initialize PropellerAds after script loads
      if (window._adspirit) {
        window._adspirit.push({
          'adzone': 28546234, // Your PropellerAds zone ID
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
    };
  }, []);

  return (
    <div className="flex justify-center my-8 px-4">
      <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-2">
        <div id="propeller-ad-container" className="flex justify-center">
          {/* PropellerAds will be injected here */}
        </div>
      </div>
    </div>
  );
}

// Extend window type for PropellerAds
declare global {
  interface Window {
    _adspirit?: any;
  }
}
