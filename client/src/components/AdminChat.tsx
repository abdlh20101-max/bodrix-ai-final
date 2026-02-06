/**
 * Admin Chat Component
 * مكون دردشة الإدمن
 * 
 * Public admin chat for project management
 * دردشة إدمن عامة لإدارة المشروع
 */

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/_core/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Trash2, Copy, Settings } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface AdminMessage {
  id: string;
  content: string;
  sender: 'admin' | 'ai';
  timestamp: Date;
  status: 'sent' | 'received' | 'processing';
  type: 'message' | 'command' | 'query' | 'suggestion';
}

export function AdminChat() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [aiMode, setAiMode] = useState<'normal' | 'autonomous' | 'creative'>('normal');
  const [aiProvider, setAiProvider] = useState<'openai' | 'claude' | 'gemini'>('openai');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // tRPC mutations
  const sendMessageMutation = trpc.aiChat.sendMessage.useMutation();
  const getHistoryQuery = trpc.aiChat.getHistory.useQuery({
    chatType: 'admin',
    limit: 50,
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history
  useEffect(() => {
    if (getHistoryQuery.data?.messages) {
      const loadedMessages = getHistoryQuery.data.messages.map((msg: any) => ({
        id: `msg_${msg.id}`,
        content: msg.userMessage,
        sender: 'admin' as const,
        timestamp: new Date(msg.createdAt),
        status: 'received' as const,
        type: 'message' as const,
      }));
      setMessages(loadedMessages);
    }
  }, [getHistoryQuery.data]);

  /**
   * Detect message type
   * كشف نوع الرسالة
   */
  const detectMessageType = (text: string): AdminMessage['type'] => {
    if (text.startsWith('/')) return 'command';
    if (text.includes('?')) return 'query';
    if (text.includes('suggest') || text.includes('اقترح')) return 'suggestion';
    return 'message';
  };

  /**
   * Send message
   * إرسال رسالة
   */
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const adminMessage: AdminMessage = {
      id: `msg_${Date.now()}`,
      content: input,
      sender: 'admin',
      timestamp: new Date(),
      status: 'sent',
      type: detectMessageType(input),
    };

    setMessages(prev => [...prev, adminMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send to AI via tRPC
      const response = await sendMessageMutation.mutateAsync({
        message: input,
        chatType: 'admin',
        aiProvider,
        aiModel: aiProvider === 'openai' ? 'gpt-4' : aiProvider === 'claude' ? 'claude-3-opus' : 'gemini-pro',
      });

      if (response.success) {
        const aiMessage: AdminMessage = {
          id: `msg_${Date.now() + 1}`,
          content: response.message,
          sender: 'ai',
          timestamp: new Date(),
          status: 'received',
          type: 'message',
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: AdminMessage = {
        id: `msg_${Date.now() + 1}`,
        content: `خطأ: ${error instanceof Error ? error.message : 'فشل الاتصال بـ AI'}`,
        sender: 'ai',
        timestamp: new Date(),
        status: 'received',
        type: 'message',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear chat
   * مسح الدردشة
   */
  const handleClearChat = () => {
    if (confirm(t('common.confirmDelete') || 'هل تريد مسح جميع الرسائل؟')) {
      setMessages([]);
    }
  };

  /**
   * Copy message
   * نسخ الرسالة
   */
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
      {/* Header with Settings */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {language === 'ar' ? 'دردشة الإدمن' : 'Admin Chat'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'ar' ? `الوضع: ${aiMode === 'autonomous' ? '🤖 مستقل' : aiMode === 'creative' ? '✨ إبداعي' : '💬 عادي'}` : `Mode: ${aiMode}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              title={language === 'ar' ? 'الإعدادات' : 'Settings'}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="text-red-600 hover:text-red-700"
              title={language === 'ar' ? 'مسح الدردشة' : 'Clear chat'}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {language === 'ar' ? 'الوضع' : 'Mode'}
              </label>
              <div className="flex gap-2 mt-2">
                {(['normal', 'autonomous', 'creative'] as const).map(mode => (
                  <Button
                    key={mode}
                    size="sm"
                    variant={aiMode === mode ? 'default' : 'outline'}
                    onClick={() => setAiMode(mode)}
                    className="text-xs"
                  >
                    {mode === 'autonomous' ? '🤖' : mode === 'creative' ? '✨' : '💬'}
                    {language === 'ar' 
                      ? (mode === 'autonomous' ? ' مستقل' : mode === 'creative' ? ' إبداعي' : ' عادي')
                      : ` ${mode}`}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {language === 'ar' ? 'نموذج الـ AI' : 'AI Model'}
              </label>
              <div className="flex gap-2 mt-2">
                {(['openai', 'claude', 'gemini'] as const).map(provider => (
                  <Button
                    key={provider}
                    size="sm"
                    variant={aiProvider === provider ? 'default' : 'outline'}
                    onClick={() => setAiProvider(provider)}
                    className="text-xs"
                  >
                    {provider === 'openai' ? 'GPT-4' : provider === 'claude' ? 'Claude' : 'Gemini'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>{language === 'ar' ? 'لا توجد رسائل بعد' : 'No messages yet'}</p>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg group relative ${
                  msg.sender === 'admin'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </p>
                {msg.sender === 'ai' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopyMessage(msg.content)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-slate-700 px-4 py-2 rounded-lg">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={language === 'ar' ? 'اكتب أمرك أو سؤالك...' : 'Type your command or question...'}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
