import { useEffect } from 'react';

export function AdsterraAd() {
  useEffect(() => {
    // Load Adsterra script
    const script = document.createElement('script');
    script.innerHTML = `
      atOptions = {
        'key' : 'e6bc5ef409e84c68b61266975c307ef3',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;
    document.head.appendChild(script);

    const adScript = document.createElement('script');
    adScript.src = 'https://www.highperformanceformat.com/e6bc5ef409e84c68b61266975c307ef3/invoke.js';
    adScript.async = true;
    document.head.appendChild(adScript);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="flex justify-center my-8 px-4">
      <div id="adsterra-container" className="w-full max-w-2xl rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-2">
        {/* Adsterra ad will be injected here */}
      </div>
    </div>
  );
}
