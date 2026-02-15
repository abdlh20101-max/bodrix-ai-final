import { useEffect, useState } from 'react';
import { AlertTriangle, X, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OutOfMessagesNotificationProps {
  isOpen: boolean;
  onDismiss?: () => void;
  onWatchAd?: () => void;
  language?: 'ar' | 'en';
}

export function OutOfMessagesNotification({
  isOpen,
  onDismiss,
  onWatchAd,
  language = 'ar',
}: OutOfMessagesNotificationProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleWatchAd = () => {
    onWatchAd?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-white" />
            <h2 className="text-lg font-bold text-white">
              {language === 'ar' ? '⚠️ انتهت رسائلك!' : '⚠️ Out of Messages!'}
            </h2>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white hover:bg-white/20 p-1 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-center">
            {language === 'ar'
              ? 'لقد استنفذت حد رسائلك اليومي. شاهد إعلان للحصول على 10 رسائل إضافية مجاناً!'
              : 'You have used all your daily messages. Watch an ad to get 10 free messages!'}
          </p>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-4 mb-6 border border-amber-200 dark:border-amber-700">
            <div className="flex items-start gap-3">
              <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
                  {language === 'ar' ? '🎁 احصل على مكافأة' : '🎁 Get Rewarded'}
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                  {language === 'ar'
                    ? 'كل إعلان = 10 رسائل إضافية'
                    : 'Each ad = 10 extra messages'}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleWatchAd}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 rounded-lg transition"
            >
              {language === 'ar' ? '▶️ شاهد إعلان' : '▶️ Watch Ad'}
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="flex-1"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            {language === 'ar'
              ? 'يمكنك مشاهدة عدة إعلانات يومياً'
              : 'You can watch multiple ads daily'}
          </p>
        </div>
      </div>
    </div>
  );
}
