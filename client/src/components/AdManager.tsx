import { useEffect, useState } from 'react';

/**
 * AdManager Component
 * Simple Adsterra ad loader
 */
export function AdManager() {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    loadAdsterra();
  }, []);

  const loadAdsterra = () => {
    try {
      // Set Adsterra options
      const optionsScript = document.createElement('script');
      optionsScript.type = 'text/javascript';
      optionsScript.innerHTML = `
        var atOptions = {
          'key': 'e6bc5ef409e84c68b61266975c307ef3',
          'format': 'iframe',
          'height': 90,
          'width': 728,
          'params': {}
        };
      `;
      document.head.appendChild(optionsScript);

      // Load Adsterra invoke script
      const adScript = document.createElement('script');
      adScript.type = 'text/javascript';
      adScript.src = 'https://www.highperformanceformat.com/e6bc5ef409e84c68b61266975c307ef3/invoke.js';
      adScript.async = true;
      adScript.onload = () => {
        setAdLoaded(true);
        console.log('✅ Adsterra ad loaded successfully');
      };
      adScript.onerror = () => {
        console.warn('⚠️ Adsterra failed to load');
        setAdLoaded(true);
      };
      document.head.appendChild(adScript);

      // Timeout fallback
      const timeout = setTimeout(() => {
        if (!adLoaded) {
          console.warn('⏱️ Adsterra timeout');
          setAdLoaded(true);
        }
      }, 5000);

      return () => clearTimeout(timeout);
    } catch (error) {
      console.error('Error loading Adsterra:', error);
      setAdLoaded(true);
    }
  };

  return (
    <div className="flex justify-center my-8 px-4">
      <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-2">
        <div id="ad-container" className="flex justify-center min-h-[100px]">
          <div id="adsterra-container" className="w-full">
            {/* Adsterra ad will be injected here */}
          </div>
          
          {!adLoaded && (
            <div className="text-center text-gray-400 dark:text-gray-500 py-4 text-sm">
              جاري تحميل الإعلان...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Extend window type for Adsterra
declare global {
  interface Window {
    atOptions?: any;
  }
}
