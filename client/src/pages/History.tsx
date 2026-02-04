import { useState } from "react";
import { useLanguage } from "@/_core/hooks/useLanguage";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Search, MessageCircle } from "lucide-react";

export default function History() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "user" | "assistant">("all");

  const messagesQuery = trpc.messages.getHistory.useQuery({ limit: 100 });
  const deleteMessageMutation = trpc.messages.delete.useMutation({
    onSuccess: () => {
      messagesQuery.refetch();
    },
  });

  const messages = (messagesQuery.data as any[]) || [];

  // Filter messages
  const filteredMessages = messages.filter((msg: any) => {
    const matchesSearch = msg.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || msg.role === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = (messageId: string) => {
    if (confirm(t("common.confirmDelete") || "هل تريد حذف هذه الرسالة؟")) {
      deleteMessageMutation.mutate({ messageId });
    }
  };

  if (messagesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t("history.title") || "سجل المحادثات"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("history.description") || "عرض جميع رسائلك السابقة والبحث فيها"}
          </p>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 mb-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder={t("history.searchPlaceholder") || "ابحث في المحادثات..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                className="text-sm"
              >
                {t("history.all") || "الكل"}
              </Button>
              <Button
                variant={filterType === "user" ? "default" : "outline"}
                onClick={() => setFilterType("user")}
                className="text-sm"
              >
                {t("history.myMessages") || "رسائلي"}
              </Button>
              <Button
                variant={filterType === "assistant" ? "default" : "outline"}
                onClick={() => setFilterType("assistant")}
                className="text-sm"
              >
                {t("history.aiResponses") || "ردود Bodrix"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <Card className="p-8 text-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {t("history.noMessages") || "لا توجد رسائل"}
              </p>
            </Card>
          ) : (
            filteredMessages.map((message: any) => (
              <Card
                key={message.id}
                className={`p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 ${
                  message.role === "user"
                    ? "border-l-4 border-l-blue-600"
                    : "border-l-4 border-l-green-600"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          message.role === "user"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {message.role === "user"
                          ? t("history.you") || "أنت"
                          : "Bodrix AI"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(message.createdAt).toLocaleString(language)}
                      </span>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100 break-words">
                      {message.content}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(String(message.id))}
                      disabled={deleteMessageMutation.isPending}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Stats */}
        <Card className="mt-8 p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {messages.filter((m: any) => m.role === "user").length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("history.myMessages") || "رسائلي"}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {messages.filter((m: any) => m.role === "assistant").length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("history.aiResponses") || "ردود Bodrix"}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {messages.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("history.total") || "الإجمالي"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
