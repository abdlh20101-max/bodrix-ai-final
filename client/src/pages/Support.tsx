import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, MessageSquare, Clock, CheckCircle, AlertCircle, Tag, Send } from "lucide-react";
import { useLocation } from "wouter";

export default function Support() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"open" | "resolved">("open");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: "",
    category: "general",
    description: "",
    priority: "medium",
  });

  const [tickets, setTickets] = useState([
    {
      id: "TKT-001",
      title: "مشكلة في تسجيل الدخول",
      category: "account",
      description: "لا أستطيع تسجيل الدخول باستخدام حسابي",
      priority: "high",
      status: "open",
      createdAt: "2026-02-03",
      aiResponse: "جاري التحقق من مشكلتك. يرجى التأكد من أن كلمة المرور صحيحة وأن حسابك مفعل.",
      tags: ["تسجيل دخول", "حساب"],
    },
    {
      id: "TKT-002",
      title: "طلب إضافة ميزة جديدة",
      category: "feature",
      description: "أود إضافة ميزة تصدير المحادثات كـ PDF",
      priority: "low",
      status: "open",
      createdAt: "2026-02-02",
      aiResponse: "شكراً على الاقتراح! سيتم دراسة هذه الميزة وإضافتها في التحديث القادم.",
      tags: ["ميزة جديدة", "تصدير"],
    },
    {
      id: "TKT-003",
      title: "مشكلة في الأداء",
      category: "bug",
      description: "التطبيق بطيء جداً عند إرسال رسائل متعددة",
      priority: "medium",
      status: "resolved",
      createdAt: "2026-02-01",
      aiResponse: "تم حل المشكلة! قمنا بتحسين الأداء وتسريع معالجة الرسائل.",
      tags: ["أداء", "بطء"],
    },
  ]);

  const handleCreateTicket = () => {
    if (newTicket.title && newTicket.description) {
      const ticket = {
        id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
        ...newTicket,
        status: "open" as const,
        createdAt: new Date().toISOString().split("T")[0],
        aiResponse: "جاري معالجة طلبك... سيتم الرد عليك قريباً من قبل فريق الدعم أو النظام الذكي.",
        tags: [],
      };
      setTickets([ticket, ...tickets]);
      setNewTicket({ title: "", category: "general", description: "", priority: "medium" });
      setShowNewTicket(false);
    }
  };

  const filteredTickets = tickets.filter((t) => t.status === activeTab);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      general: "عام",
      account: "الحساب",
      bug: "خطأ",
      feature: "ميزة جديدة",
      billing: "الفواتير",
      other: "أخرى",
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                الدعم الفني
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                تواصل مع فريق الدعم أو احصل على ردود آلية من الذكاء الاصطناعي
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowNewTicket(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            تذكرة جديدة
          </Button>
        </div>

        {/* New Ticket Form */}
        {showNewTicket && (
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              إنشاء تذكرة دعم جديدة
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  العنوان
                </label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, title: e.target.value })
                  }
                  placeholder="أدخل عنوان المشكلة أو الطلب"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    الفئة
                  </label>
                  <select
                    value={newTicket.category}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, category: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="general">عام</option>
                    <option value="account">الحساب</option>
                    <option value="bug">خطأ</option>
                    <option value="feature">ميزة جديدة</option>
                    <option value="billing">الفواتير</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    الأولوية
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, priority: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  الوصف
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) =>
                    setNewTicket({ ...newTicket, description: e.target.value })
                  }
                  placeholder="اشرح المشكلة أو الطلب بالتفصيل"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateTicket}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  إرسال
                </Button>
                <Button
                  onClick={() => setShowNewTicket(false)}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-gray-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab("open")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "open"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            التذاكر المفتوحة ({tickets.filter((t) => t.status === "open").length})
          </button>
          <button
            onClick={() => setActiveTab("resolved")}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "resolved"
                ? "text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            التذاكر المحلولة ({tickets.filter((t) => t.status === "resolved").length})
          </button>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.length === 0 ? (
            <Card className="p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                لا توجد تذاكر {activeTab === "open" ? "مفتوحة" : "محلولة"}
              </p>
            </Card>
          ) : (
            filteredTickets.map((ticket) => (
              <Card
                key={ticket.id}
                className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {ticket.id}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority === "high"
                          ? "عالية"
                          : ticket.priority === "medium"
                          ? "متوسطة"
                          : "منخفضة"}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                        {getCategoryLabel(ticket.category)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {ticket.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {ticket.description}
                    </p>

                    {/* Tags */}
                    {ticket.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {ticket.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 flex items-center gap-1"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* AI Response */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-3">
                      <div className="flex items-start gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                          رد من الذكاء الاصطناعي
                        </p>
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {ticket.aiResponse}
                      </p>
                    </div>
                  </div>

                  {/* Status Icon */}
                  <div className="ml-4">
                    {ticket.status === "open" ? (
                      <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {ticket.createdAt}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    عرض التفاصيل
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
