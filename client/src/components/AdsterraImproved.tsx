import { useEffect, useState } from 'react';

export function AdsterraImproved() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Adsterra script with improved error handling
    const loadAdsterra = () => {
      try {
        // First, set the options
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

        // Then load the invoke script
        const adScript = document.createElement('script');
        adScript.type = 'text/javascript';
        adScript.src = 'https://www.highperformanceformat.com/e6bc5ef409e84c68b61266975c307ef3/invoke.js';
        adScript.async = true;
        adScript.onload = () => {
          setIsLoaded(true);
          console.log('Adsterra ad loaded successfully');
        };
        adScript.onerror = () => {
          console.error('Failed to load Adsterra ad');
          setIsLoaded(false);
        };
        document.head.appendChild(adScript);
      } catch (error) {
        console.error('Error loading Adsterra:', error);
      }
    };

    // Load after a short delay to ensure DOM is ready
    const timer = setTimeout(loadAdsterra, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center my-8 px-4">
      <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-2">
        <div id="adsterra-container" className="flex justify-center min-h-[100px]">
          {!isLoaded && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              جاري تحميل الإعلان...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
