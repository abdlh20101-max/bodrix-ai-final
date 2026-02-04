import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SmartNotificationProps {
  messagesLeft: number;
  onDismiss?: () => void;
  language?: 'ar' | 'en';
}

export function SmartNotification({ messagesLeft, onDismiss, language = 'ar' }: SmartNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification when messages are running low (less than 5)
    if (messagesLeft > 0 && messagesLeft <= 5) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [messagesLeft]);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div className="fixed bottom-20 right-4 left-4 md:right-6 md:left-auto md:w-96 z-40 animate-in slide-in-from-bottom-5">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-orange-500 rounded-lg shadow-lg p-4 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-orange-600">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0 dark:text-orange-400" />
          <div className="flex-1">
            <h3 className="font-semibold text-orange-900 dark:text-orange-200">
              {language === 'ar' ? '⚠️ تنبيه مهم' : '⚠️ Important Notice'}
            </h3>
            <p className="text-sm text-orange-800 dark:text-orange-300 mt-1">
              {language === 'ar'
                ? `تبقى لك ${messagesLeft} رسالة فقط! شاهد إعلان للحصول على 10 رسائل إضافية.`
                : `You have only ${messagesLeft} messages left! Watch an ad to get 10 more messages.`}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
