import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  TrendingUp,
  Zap,
} from "lucide-react";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
  implementation: string;
  estimatedTime: string;
}

export function SmartSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "1",
      title: "تحسين معدل التحويل",
      description:
        "يمكن زيادة معدل التحويل بنسبة 15% بتحسين صفحة الخطط والعرض الأولي",
      impact: "high",
      category: "تحسين الأداء",
      implementation: "تحديث واجهة صفحة الخطط مع CTA أقوى",
      estimatedTime: "2-3 ساعات",
    },
    {
      id: "2",
      title: "إضافة ميزة المشاركة الاجتماعية",
      description:
        "السماح للمستخدمين بمشاركة النتائج على وسائل التواصل الاجتماعي",
      impact: "medium",
      category: "ميزات جديدة",
      implementation: "إضافة أزرار مشاركة مع تتبع الإحالات",
      estimatedTime: "4-5 ساعات",
    },
    {
      id: "3",
      title: "تحسين أداء الموقع",
      description: "تقليل وقت التحميل بنسبة 30% من خلال تحسين الصور والـ CDN",
      impact: "high",
      category: "الأداء التقنية",
      implementation: "ضغط الصور وتحسين الـ Caching",
      estimatedTime: "1-2 ساعات",
    },
  ]);

  const [feedbackGiven, setFeedbackGiven] = useState<{
    [key: string]: "helpful" | "not-helpful";
  }>({});

  const handleFeedback = (id: string, type: "helpful" | "not-helpful") => {
    setFeedbackGiven({ ...feedbackGiven, [id]: type });
  };

  const handleImplement = (id: string) => {
    alert(`تم تطبيق الاقتراح: ${id}`);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-yellow-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            الاقتراحات الذكية
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            اقتراحات مدعومة بـ AI لتحسين منصتك
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                إجمالي الاقتراحات
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {suggestions.length}
              </p>
            </div>
            <Lightbulb className="w-8 h-8 text-yellow-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                اقتراحات عالية التأثير
              </p>
              <p className="text-2xl font-bold text-red-600">
                {suggestions.filter((s) => s.impact === "high").length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                الملاحظات المفيدة
              </p>
              <p className="text-2xl font-bold text-green-600">
                {Object.values(feedbackGiven).filter((f) => f === "helpful")
                  .length}
              </p>
            </div>
            <ThumbsUp className="w-8 h-8 text-green-600 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <Card
            key={suggestion.id}
            className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {suggestion.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getImpactColor(suggestion.impact)}`}
                  >
                    {suggestion.impact === "high" && "تأثير عالي"}
                    {suggestion.impact === "medium" && "تأثير متوسط"}
                    {suggestion.impact === "low" && "تأثير منخفض"}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {suggestion.description}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  الفئة
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {suggestion.category}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  الوقت المتوقع
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {suggestion.estimatedTime}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  خطوات التطبيق
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {suggestion.implementation}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  onClick={() => handleFeedback(suggestion.id, "helpful")}
                  variant="outline"
                  size="sm"
                  className={`${
                    feedbackGiven[suggestion.id] === "helpful"
                      ? "bg-green-50 dark:bg-green-900/20 text-green-600"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleFeedback(suggestion.id, "not-helpful")}
                  variant="outline"
                  size="sm"
                  className={`${
                    feedbackGiven[suggestion.id] === "not-helpful"
                      ? "bg-red-50 dark:bg-red-900/20 text-red-600"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={() => handleImplement(suggestion.id)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                تطبيق الاقتراح
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
