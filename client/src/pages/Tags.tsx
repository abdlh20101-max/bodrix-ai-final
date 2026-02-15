import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Tag, Trash2, Edit2, X } from "lucide-react";
import { useLocation } from "wouter";

export default function Tags() {
  const [, navigate] = useLocation();
  const [showNewTag, setShowNewTag] = useState(false);
  const [newTag, setNewTag] = useState({ name: "", color: "#3B82F6" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [tags, setTags] = useState([
    { id: "1", name: "عاجل", color: "#EF4444", count: 12 },
    { id: "2", name: "سؤال", color: "#3B82F6", count: 45 },
    { id: "3", name: "اقتراح", color: "#10B981", count: 23 },
    { id: "4", name: "خطأ", color: "#F59E0B", count: 18 },
    { id: "5", name: "تم حله", color: "#8B5CF6", count: 67 },
    { id: "6", name: "قيد المراجعة", color: "#EC4899", count: 9 },
    { id: "7", name: "معلومات", color: "#06B6D4", count: 34 },
    { id: "8", name: "تحسين", color: "#14B8A6", count: 15 },
  ]);

  const handleAddTag = () => {
    if (newTag.name.trim()) {
      setTags([
        ...tags,
        {
          id: String(Math.max(...tags.map((t) => parseInt(t.id)), 0) + 1),
          name: newTag.name,
          color: newTag.color,
          count: 0,
        },
      ]);
      setNewTag({ name: "", color: "#3B82F6" });
      setShowNewTag(false);
    }
  };

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter((t) => t.id !== id));
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
                التصنيفات والعلامات
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                صنّف محادثاتك ورسائلك بعلامات لتسهيل البحث والتنظيم
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowNewTag(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            علامة جديدة
          </Button>
        </div>

        {/* New Tag Form */}
        {showNewTag && (
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              إنشاء علامة جديدة
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  اسم العلامة
                </label>
                <input
                  type="text"
                  value={newTag.name}
                  onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                  placeholder="أدخل اسم العلامة"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  اللون
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={newTag.color}
                    onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                    className="w-16 h-10 rounded-lg cursor-pointer"
                  />
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-slate-600"
                    style={{ backgroundColor: newTag.color }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddTag}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  إنشاء
                </Button>
                <Button
                  onClick={() => setShowNewTag(false)}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tags.map((tag) => (
            <Card
              key={tag.id}
              className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tag.name}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(tag.id)}
                    className="p-1"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTag(tag.id)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    عدد الاستخدامات
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tag.count}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    عرض الرسائل
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  >
                    تطبيق
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <Card className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-300">
                نصيحة
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                استخدم العلامات لتنظيم محادثاتك ورسائلك. يمكنك تطبيق عدة علامات على رسالة واحدة للتصنيف الأفضل.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
