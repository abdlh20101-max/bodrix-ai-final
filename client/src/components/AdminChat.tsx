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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      // Simulate AI response based on mode
      setTimeout(() => {
        let responseContent = '';

        switch (aiMode) {
          case 'autonomous':
            responseContent = `🤖 Autonomous Mode: I've analyzed your request and started implementing changes automatically.`;
            break;
          case 'creative':
            responseContent = `✨ Creative Mode: I have some innovative ideas for your project...`;
            break;
          default:
            responseContent = `AI Response: Processing your request: "${input.substring(0, 40)}..."`;
        }

        const aiMessage: AdminMessage = {
          id: `msg_${Date.now() + 1}`,
          content: responseContent,
          sender: 'ai',
          timestamp: new Date(),
          status: 'received',
          type: 'message',
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
    }
  };

  /**
   * Copy message
   * نسخ الرسالة
   */
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  /**
   * Clear chat
   * مسح الدردشة
   */
  const handleClearChat = () => {
    if (confirm(t('common.confirmDelete') || 'هل تريد مسح الدردشة؟')) {
      setMessages([]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {language === 'ar' ? 'دردشة الإدمن' : 'Admin Chat'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {aiMode === 'autonomous' && '🤖 Autonomous'}
              {aiMode === 'creative' && '✨ Creative'}
              {aiMode === 'normal' && '💬 Normal'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
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

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700 space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {language === 'ar' ? 'وضع الـ AI' : 'AI Mode'}
            </label>
            <div className="flex gap-2">
              {(['normal', 'autonomous', 'creative'] as const).map(mode => (
                <Button
                  key={mode}
                  variant={aiMode === mode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAiMode(mode)}
                >
                  {mode === 'normal' && '💬'}
                  {mode === 'autonomous' && '🤖'}
                  {mode === 'creative' && '✨'}
                  {language === 'ar'
                    ? mode === 'normal'
                      ? 'عادي'
                      : mode === 'autonomous'
                      ? 'مستقل'
                      : 'إبداعي'
                    : mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>
                {language === 'ar'
                  ? 'ابدأ محادثة مع الـ AI'
                  : 'Start a conversation with AI'}
              </p>
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              <Card
                className={`max-w-xs lg:max-w-md px-4 py-2 group hover:shadow-md transition-shadow ${
                  msg.sender === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm break-words">{msg.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs opacity-70">
                        {msg.timestamp.toLocaleTimeString(
                          language === 'ar' ? 'ar-SA' : 'en-US'
                        )}
                      </p>
                      {msg.type !== 'message' && (
                        <span className="text-xs px-2 py-0.5 bg-opacity-30 bg-white rounded">
                          {msg.type}
                        </span>
                      )}
                    </div>
                  </div>
                  {msg.sender === 'ai' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyMessage(msg.content)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  )}
                </div>
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
      <div className="p-4 border-t border-gray-200 dark:border-slate-700 space-y-2">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              language === 'ar'
                ? 'اطلب من الـ AI تحسين المشروع...'
                : 'Ask AI to improve your project...'
            }
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Commands */}
        <div className="flex flex-wrap gap-2">
          {[
            { cmd: '/analyze', label: language === 'ar' ? 'تحليل' : 'Analyze' },
            { cmd: '/optimize', label: language === 'ar' ? 'تحسين' : 'Optimize' },
            { cmd: '/test', label: language === 'ar' ? 'اختبار' : 'Test' },
            { cmd: '/deploy', label: language === 'ar' ? 'نشر' : 'Deploy' },
          ].map(({ cmd, label }) => (
            <Button
              key={cmd}
              variant="outline"
              size="sm"
              onClick={() => {
                setInput(cmd);
              }}
              className="text-xs"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
