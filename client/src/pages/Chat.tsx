import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AdsterraBannerAd, AdsterraNativeAd } from "@/components/AdsterraAds";
import { SmartNotification } from "@/components/SmartNotification";
import { OutOfMessagesNotification } from "@/components/OutOfMessagesNotification";
import { Loader2, Send, Sparkles, MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function Chat() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messagesRemaining, setMessagesRemaining] = useState(20);
  const [showOutOfMessagesModal, setShowOutOfMessagesModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Query to get remaining messages
  const { data: remainingData } = trpc.messages.getRemainingToday.useQuery();

  const trpcUtils = trpc.useUtils();
  
  // Mutation for sending message
  const sendMessageMutation = trpc.messages.send.useMutation({
    onSuccess: () => {
      trpcUtils.messages.getRemainingToday.invalidate();
    },
  });

  // Mutation for AI chat
  const aiChatMutation = trpc.ai.chat.useMutation({
    onSuccess: () => {
      trpcUtils.messages.getRemainingToday.invalidate();
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (remainingData) {
      setMessagesRemaining(remainingData.remaining);
      // Show out of messages modal if remaining is 0
      if (remainingData.remaining === 0) {
        setShowOutOfMessagesModal(true);
      }
    }
  }, [remainingData]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = input;
    setInput("");
    setIsLoading(true);

    try {
      // First, save the message to database (this decrements the daily limit)
      await sendMessageMutation.mutateAsync({
        content: messageContent,
        language: language as "ar" | "en",
      });

      // Then call AI chat
      const result = await aiChatMutation.mutateAsync({
        content: messageContent,
        language: language as "ar" | "en",
        conversationHistory: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: language === "ar" 
          ? "عذراً، حدث خطأ في الرد."
          : "Sorry, an error occurred.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-purple-500/30 px-4 py-4 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {language === "ar" ? "محادثة مع Bodrix AI" : "Chat with Bodrix AI"}
            </h1>
            <p className="text-sm text-slate-400">
              {language === "ar" ? "دردش مع الذكاء الاصطناعي" : "Chat with AI"}
            </p>
          </div>
        </div>
      </div>

      {/* Top Banner Ad */}
      <div className="px-4 py-2 bg-slate-800/50">
        <AdsterraBannerAd placement="e6bc5ef409e84c68b61266975c307ef3" className="rounded-lg" />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {language === "ar" ? "ابدأ محادثة جديدة" : "Start a new conversation"}
              </h2>
              <p className="text-slate-400">
                {language === "ar" 
                  ? "اسأل Bodrix AI أي سؤال وسيساعدك على الفور"
                  : "Ask Bodrix AI anything and get instant help"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={msg.id}>
                <div
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none shadow-lg"
                        : "bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.role === "user" ? "text-blue-100" : "text-slate-500"}`}>
                      {msg.timestamp.toLocaleTimeString(language === "ar" ? "ar-SA" : "en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Native Ad between messages (every 3 messages) */}
                {msg.role === "assistant" && (idx + 1) % 3 === 0 && (
                  <div className="my-4 px-2">
                    <AdsterraNativeAd placement="chat_native" className="rounded-lg" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Notifications */}
      <SmartNotification messagesLeft={messagesRemaining} language={language as 'ar' | 'en'} />
      <OutOfMessagesNotification
        isOpen={showOutOfMessagesModal}
        onDismiss={() => setShowOutOfMessagesModal(false)}
        onWatchAd={() => {
          setShowOutOfMessagesModal(false);
        }}
        language={language as 'ar' | 'en'}
      />

      {/* Input Area */}
      <div className="bg-slate-800 border-t border-purple-500/30 p-4 shadow-lg">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={language === "ar" ? "اكتب رسالتك..." : "Type your message..."}
            disabled={isLoading}
            className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-purple-500"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Hook to get language (fallback if not available)
function useLanguage() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en' | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  return { language };
}
