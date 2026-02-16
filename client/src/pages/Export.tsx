import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Share2, Copy, FileText, Image as ImageIcon, Archive } from "lucide-react";
import { useLocation } from "wouter";

export default function Export() {
  const [, navigate] = useLocation();
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [selectedConversation, setSelectedConversation] = useState("all");
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const conversations = [
    { id: "1", title: "محادثة عن الذكاء الاصطناعي", messages: 25, date: "2026-02-03" },
    { id: "2", title: "طلب كتابة مقال", messages: 12, date: "2026-02-02" },
    { id: "3", title: "توليد صور", messages: 18, date: "2026-02-01" },
    { id: "4", title: "ترجمة نصوص", messages: 8, date: "2026-01-31" },
  ];

  const handleExport = () => {
    console.log(`تصدير بصيغة ${selectedFormat} للمحادثة ${selectedConversation}`);
    alert(`تم تحميل الملف بصيغة ${selectedFormat}!`);
  };

  const handleGenerateShareLink = () => {
    const link = `https://bodrix.ai/shared/${Math.random().toString(36).substr(2, 9)}`;
    setShareLink(link);
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              التصدير والمشاركة
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              صدّر محادثاتك بصيغ مختلفة أو شارك الرسائل مع الآخرين
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Export Section */}
          <div>
            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Download className="w-6 h-6" />
                تصدير المحادثات
              </h2>

              <div className="space-y-6">
                {/* Conversation Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    اختر المحادثة
                  </label>
                  <select
                    value={selectedConversation}
                    onChange={(e) => setSelectedConversation(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="all">جميع المحادثات</option>
                    {conversations.map((conv) => (
                      <option key={conv.id} value={conv.id}>
                        {conv.title} ({conv.messages} رسالة)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Format Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    اختر صيغة التصدير
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "pdf", label: "PDF", icon: FileText, description: "ملف PDF قابل للطباعة" },
                      { id: "txt", label: "نص عادي", icon: FileText, description: "ملف نصي بسيط" },
                      { id: "json", label: "JSON", icon: Archive, description: "بيانات منظمة" },
                      { id: "html", label: "HTML", icon: FileText, description: "صفحة ويب" },
                    ].map((format) => (
                      <label
                        key={format.id}
                        className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition"
                        style={{
                          borderColor: selectedFormat === format.id ? "#3B82F6" : "#E5E7EB",
                          backgroundColor:
                            selectedFormat === format.id
                              ? "#EFF6FF"
                              : "transparent",
                        }}
                      >
                        <input
                          type="radio"
                          name="format"
                          value={format.id}
                          checked={selectedFormat === format.id}
                          onChange={(e) => setSelectedFormat(e.target.value)}
                          className="w-4 h-4"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {format.label}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {format.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Export Button */}
                <Button
                  onClick={handleExport}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  تحميل الملف
                </Button>
              </div>
            </Card>
          </div>

          {/* Share Section */}
          <div>
            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Share2 className="w-6 h-6" />
                مشاركة المحادثات
              </h2>

              <div className="space-y-6">
                {/* Share Description */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    أنشئ رابط مشاركة آمن لمحادثاتك. يمكن للآخرين عرض المحادثة بدون الحاجة لتسجيل الدخول.
                  </p>
                </div>

                {/* Share Link Generation */}
                {!shareLink ? (
                  <Button
                    onClick={handleGenerateShareLink}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    إنشاء رابط مشاركة
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        رابط المشاركة
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={shareLink}
                          readOnly
                          className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-slate-600 text-gray-900 dark:text-white text-sm border border-gray-300 dark:border-slate-500"
                        />
                        <Button
                          onClick={handleCopyLink}
                          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          {copied ? "تم النسخ" : "نسخ"}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        خيارات المشاركة
                      </p>
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        مشاركة عبر البريد
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        مشاركة عبر الواتس
                      </Button>
                    </div>

                    <Button
                      onClick={() => setShareLink(null)}
                      variant="outline"
                      className="w-full"
                    >
                      إنشاء رابط جديد
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Conversations List */}
        <Card className="mt-8 p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            المحادثات الأخيرة
          </h3>

          <div className="space-y-3">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {conv.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {conv.messages} رسالة • {conv.date}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    تصدير
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Share2 className="w-4 h-4" />
                    مشاركة
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
