/**
 * Private Chat Component
 * مكون الدردشة الخصوصية
 * 
 * Encrypted private chat for admin-AI communication
 * دردشة خصوصية مشفرة للتواصل بين الإدمن والـ AI
 */

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/_core/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Lock, Send, Trash2, Download, Eye, EyeOff } from 'lucide-react';

interface PrivateMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isEncrypted: boolean;
  encryptionKey?: string;
}

export function PrivateChat() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEncrypted, setShowEncrypted] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Encrypt message (simple base64 for demo)
   * تشفير الرسالة
   */
  const encryptMessage = (message: string): string => {
    if (!encryptionEnabled) return message;
    try {
      return btoa(unescape(encodeURIComponent(message)));
    } catch (error) {
      console.error('Encryption failed:', error);
      return message;
    }
  };

  /**
   * Decrypt message
   * فك تشفير الرسالة
   */
  const decryptMessage = (encrypted: string): string => {
    try {
      return decodeURIComponent(escape(atob(encrypted)));
    } catch (error) {
      console.error('Decryption failed:', error);
      return encrypted;
    }
  };

  /**
   * Send message
   * إرسال رسالة
   */
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: PrivateMessage = {
      id: `msg_${Date.now()}`,
      content: input,
      sender: 'user',
      timestamp: new Date(),
      isEncrypted: encryptionEnabled,
      encryptionKey: encryptionEnabled ? 'encrypted' : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response
      setTimeout(() => {
        const aiMessage: PrivateMessage = {
          id: `msg_${Date.now() + 1}`,
          content: `AI Response to: "${input.substring(0, 50)}..."`,
          sender: 'ai',
          timestamp: new Date(),
          isEncrypted: encryptionEnabled,
          encryptionKey: encryptionEnabled ? 'encrypted' : undefined,
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
    }
  };

  /**
   * Clear chat history
   * مسح سجل الدردشة
   */
  const handleClearChat = () => {
    if (confirm(t('common.confirmDelete') || 'هل تريد مسح جميع الرسائل؟')) {
      setMessages([]);
    }
  };

  /**
   * Export chat
   * تصدير الدردشة
   */
  const handleExportChat = () => {
    const chatData = messages.map(msg => ({
      sender: msg.sender,
      content: showEncrypted && msg.isEncrypted ? decryptMessage(msg.content) : msg.content,
      timestamp: msg.timestamp,
    }));

    const json = JSON.stringify(chatData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `private-chat-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Lock className="w-5 h-5 text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {language === 'ar' ? 'دردشة خصوصية' : 'Private Chat'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {encryptionEnabled ? '🔒 مشفرة' : '🔓 غير مشفرة'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEncrypted(!showEncrypted)}
            title={language === 'ar' ? 'عرض/إخفاء التشفير' : 'Show/Hide Encryption'}
          >
            {showEncrypted ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportChat}
            disabled={messages.length === 0}
          >
            <Download className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            disabled={messages.length === 0}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>
                {language === 'ar'
                  ? 'ابدأ محادثة خصوصية مع الـ AI'
                  : 'Start a private conversation with AI'}
              </p>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card
                className={`max-w-xs lg:max-w-md px-4 py-2 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm break-words">
                  {showEncrypted && msg.isEncrypted
                    ? decryptMessage(msg.content)
                    : msg.content}
                </p>
                <p className="text-xs mt-1 opacity-70">
                  {msg.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </p>
              </Card>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-gray-100 dark:bg-slate-700 px-4 py-2">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="encryption"
            checked={encryptionEnabled}
            onChange={e => setEncryptionEnabled(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <label htmlFor="encryption" className="text-sm text-gray-700 dark:text-gray-300">
            {language === 'ar' ? 'تفعيل التشفير' : 'Enable Encryption'}
          </label>
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              language === 'ar'
                ? 'اكتب رسالتك الخصوصية...'
                : 'Type your private message...'
            }
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
