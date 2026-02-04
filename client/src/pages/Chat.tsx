import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/_core/hooks/useLanguage";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Upload, Link as LinkIcon } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export default function Chat() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const trpcUtils = trpc.useUtils();
  
  // Mutation for AI chat
  const aiChatMutation = trpc.ai.chat.useMutation({
    onSuccess: () => {
      // Invalidate cache after successful chat
      trpcUtils.messages.getRemainingToday.invalidate();
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call AI chat with conversation history
      const result = await aiChatMutation.mutateAsync({
        content: input,
        language: language as "ar" | "en",
        conversationHistory: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      // Add AI response to messages
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: result.response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Show error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: language === "ar" 
          ? "عذراً، حدث خطأ في الرد. حاول مرة أخرى."
          : "Sorry, an error occurred. Please try again.",
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
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="https://private-us-east-1.manuscdn.com/sessionFile/cQzbxoLvM4DfATDS98PDwn/sandbox/zfXzIeqSMauFzfB7ElSVwm-img-1_1770162031000_na1fn_Ym9kcml4LWxvZ28.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvY1F6YnhvTHZNNERmQVREUzk4UER3bi9zYW5kYm94L3pmWHpJZXFTTWF1RnpmQjdFbFNWd20taW1nLTFfMTc3MDE2MjAzMTAwMF9uYTFmbl9Ym9kcml4LWxvZ28ucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=fCCsBppOdboI29dR8T-AI2txRymrhLYSqI42qLb6QC3hmciDFasJsSJAvHgf~wGr9rvJ~skCWgm8GYmBjBif2ZZPSDw8VmGh6va9SMMb9VDoVe4h9GMbw5xJJe7QS0TtvDr5MRe6~KbRnSO7HZg4BGisMkrM1CJh24383fbzTYpyXRSRcW3NrT-aFLMlkCFGY5VmR7j3cblpdSBq1wMELzLg9R6~02qRd6moL923z5IcFsLDwczFZpuhroUzrNyeFf9ef7GXKEzqVfP9cXpOzbtg4MqQTexADyvjx7vE3W6f8HEs9Gsdcaw0WMaI~jWF4SrDIdZdAblP3ubPorteFg__" alt="Bodrix AI" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("chat.title")}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* عدد الرسائل تم إزالته */}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("home.title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("home.description")}
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`max-w-xs lg:max-w-md px-4 py-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-3xl rounded-tr-none"
                      : "bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-3xl rounded-tl-none shadow-md"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "user"
                        ? "text-blue-100"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString(language)}
                  </p>
                </Card>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="bg-white dark:bg-slate-700 px-4 py-3 rounded-3xl rounded-tl-none shadow-md">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              title={t("chat.uploadImage")}
            >
              <Upload className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              title={t("chat.addLink")}
            >
              <LinkIcon className="h-5 w-5" />
            </Button>
            <Input
              placeholder={t("chat.placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              className="rounded-full px-4"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
