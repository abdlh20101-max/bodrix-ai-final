import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Zap, Plus, Trash2, Copy, Play, Pause } from "lucide-react";
import { useLocation } from "wouter";

export default function Automation() {
  const [, navigate] = useLocation();
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    content: "",
    category: "general",
  });

  const [templates, setTemplates] = useState([
    {
      id: "1",
      name: "كتابة مقال",
      description: "قالب لكتابة مقالات احترافية",
      category: "writing",
      usageCount: 45,
      enabled: true,
      content: "اكتب مقالة عن [الموضوع] بطريقة احترافية...",
    },
    {
      id: "2",
      name: "تحليل بيانات",
      description: "قالب لتحليل البيانات والإحصائيات",
      category: "analysis",
      usageCount: 32,
      enabled: true,
      content: "حلل البيانات التالية: [البيانات]...",
    },
    {
      id: "3",
      name: "ترجمة نصوص",
      description: "قالب لترجمة النصوص بدقة",
      category: "translation",
      usageCount: 28,
      enabled: false,
      content: "ترجم النص التالي من [اللغة المصدر] إلى [اللغة الهدف]...",
    },
    {
      id: "4",
      name: "توليد أفكار",
      description: "قالب لتوليد أفكار إبداعية",
      category: "creativity",
      usageCount: 56,
      enabled: true,
      content: "اقترح 10 أفكار إبداعية لـ [الموضوع]...",
    },
  ]);

  const [automations, setAutomations] = useState([
    {
      id: "1",
      name: "إرسال تقرير يومي",
      trigger: "كل يوم الساعة 9 صباحاً",
      action: "إرسال تقرير يومي عبر البريد",
      enabled: true,
    },
    {
      id: "2",
      name: "حفظ النسخ الاحتياطية",
      trigger: "كل يوم الساعة 12 ليلاً",
      action: "حفظ نسخة احتياطية من البيانات",
      enabled: true,
    },
    {
      id: "3",
      name: "تنظيف المحادثات القديمة",
      trigger: "كل أسبوع",
      action: "حذف المحادثات الأقدم من 30 يوم",
      enabled: false,
    },
  ]);

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.content) {
      setTemplates([
        ...templates,
        {
          id: String(Math.max(...templates.map((t) => parseInt(t.id)), 0) + 1),
          ...newTemplate,
          usageCount: 0,
          enabled: true,
        },
      ]);
      setNewTemplate({ name: "", description: "", content: "", category: "general" });
      setShowNewTemplate(false);
    }
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const handleToggleTemplate = (id: string) => {
    setTemplates(
      templates.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleToggleAutomation = (id: string) => {
    setAutomations(
      automations.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      general: "عام",
      writing: "كتابة",
      analysis: "تحليل",
      translation: "ترجمة",
      creativity: "إبداع",
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-8 h-8" />
                الأتمتة والقوالب
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                أنشئ قوالب وأتمتة العمليات المتكررة
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowNewTemplate(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            قالب جديد
          </Button>
        </div>

        {/* New Template Form */}
        {showNewTemplate && (
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              إنشاء قالب جديد
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  اسم القالب
                </label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, name: e.target.value })
                  }
                  placeholder="أدخل اسم القالب"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  الوصف
                </label>
                <input
                  type="text"
                  value={newTemplate.description}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, description: e.target.value })
                  }
                  placeholder="وصف القالب"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  الفئة
                </label>
                <select
                  value={newTemplate.category}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, category: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="general">عام</option>
                  <option value="writing">كتابة</option>
                  <option value="analysis">تحليل</option>
                  <option value="translation">ترجمة</option>
                  <option value="creativity">إبداع</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  محتوى القالب
                </label>
                <textarea
                  value={newTemplate.content}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, content: e.target.value })
                  }
                  placeholder="أدخل محتوى القالب (استخدم [المتغير] للمتغيرات)"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateTemplate}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  إنشاء
                </Button>
                <Button
                  onClick={() => setShowNewTemplate(false)}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Templates */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            القوالب ({templates.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`p-6 border transition ${
                  template.enabled
                    ? "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                    : "bg-gray-50 dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {template.description}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                    {getCategoryLabel(template.category)}
                  </span>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  {template.content}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    استخدم {template.usageCount} مرة
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleTemplate(template.id)}
                    >
                      {template.enabled ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Copy className="w-4 h-4" />
                      نسخ
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Automations */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            الأتمتة ({automations.length})
          </h2>

          <div className="space-y-3">
            {automations.map((automation) => (
              <Card
                key={automation.id}
                className={`p-4 border transition ${
                  automation.enabled
                    ? "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                    : "bg-gray-50 dark:bg-slate-800/50 border-gray-300 dark:border-slate-600 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {automation.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span className="font-semibold">المحفز:</span> {automation.trigger}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">الإجراء:</span> {automation.action}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleToggleAutomation(automation.id)}
                      className={
                        automation.enabled
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-400 hover:bg-gray-500 text-white"
                      }
                    >
                      {automation.enabled ? "مفعل" : "معطل"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
