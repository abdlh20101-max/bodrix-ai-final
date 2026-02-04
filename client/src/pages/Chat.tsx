import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AdBannerTop } from "@/components/AdBannerTop";
import { AdManager } from "@/components/AdManager";
import { SmartNotification } from "@/components/SmartNotification";
import { OutOfMessagesNotification } from "@/components/OutOfMessagesNotification";
import { Loader2, Send } from "lucide-react";
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      <AdBannerTop />
      <div className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-slate-800">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          {language === "ar" ? "محادثة مع Bodrix AI" : "Chat with Bodrix AI"}
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Card className="max-w-md p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {language === "ar"
                  ? "ابدأ محادثة جديدة"
                  : "Start a new conversation"}
              </p>
            </Card>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-xs px-4 py-2 ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </Card>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <SmartNotification messagesLeft={messagesRemaining} language={language as 'ar' | 'en'} />
      <OutOfMessagesNotification
        isOpen={showOutOfMessagesModal}
        onDismiss={() => setShowOutOfMessagesModal(false)}
        onWatchAd={() => {
          // TODO: Implement ad watching logic
          setShowOutOfMessagesModal(false);
        }}
        language={language as 'ar' | 'en'}
      />
      <AdManager />
      <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-slate-800">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={language === "ar" ? "اكتب رسالتك..." : "Type your message..."}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="gap-2"
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
