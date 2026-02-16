import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Zap,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  Play,
} from "lucide-react";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  maxTokens: number;
  temperature: number;
  enabled: boolean;
}

interface CustomPrompt {
  id: string;
  name: string;
  content: string;
  category: string;
}

export function AIControlCenter() {
  const [activeSection, setActiveSection] = useState<
    "models" | "prompts" | "testing" | "settings"
  >("models");
  const [models, setModels] = useState<AIModel[]>([
    {
      id: "gpt4",
      name: "GPT-4 Turbo",
      provider: "OpenAI",
      maxTokens: 4096,
      temperature: 0.7,
      enabled: true,
    },
    {
      id: "claude3",
      name: "Claude 3 Opus",
      provider: "Anthropic",
      maxTokens: 2048,
      temperature: 0.8,
      enabled: true,
    },
  ]);

  const [prompts, setPrompts] = useState<CustomPrompt[]>([
    {
      id: "1",
      name: "Professional Assistant",
      content: "You are a professional AI assistant...",
      category: "General",
    },
  ]);

  const [testInput, setTestInput] = useState("");
  const [testOutput, setTestOutput] = useState("");

  const handleTestAI = () => {
    // Simulate AI response
    setTestOutput(
      `AI Response to: "${testInput}"\n\nهذا رد تجريبي من نموذج AI المختار.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-slate-700">
        {[
          { id: "models", label: "النماذج", icon: Brain },
          { id: "prompts", label: "التعليمات", icon: Edit },
          { id: "testing", label: "الاختبار", icon: Play },
          { id: "settings", label: "الإعدادات", icon: Zap },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() =>
              setActiveSection(section.id as "models" | "prompts" | "testing" | "settings")
            }
            className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 ${
              activeSection === section.id
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Models Section */}
      {activeSection === "models" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              نماذج AI المتاحة
            </h3>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              إضافة نموذج
            </Button>
          </div>

          {models.map((model) => (
            <Card
              key={model.id}
              className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {model.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {model.provider}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    الحد الأقصى للـ Tokens
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {model.maxTokens}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    درجة الإبداع
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {model.temperature}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={model.enabled}
                  onChange={() => {
                    setModels(
                      models.map((m) =>
                        m.id === model.id ? { ...m, enabled: !m.enabled } : m
                      )
                    );
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {model.enabled ? "مفعل ✓" : "معطل"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Prompts Section */}
      {activeSection === "prompts" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              التعليمات المخصصة
            </h3>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              إضافة تعليمة
            </Button>
          </div>

          {prompts.map((prompt) => (
            <Card
              key={prompt.id}
              className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {prompt.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {prompt.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {prompt.content}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Testing Section */}
      {activeSection === "testing" && (
        <div className="space-y-4">
          <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              اختبر نموذج AI
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  أدخل نصاً للاختبار
                </label>
                <textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  rows={4}
                  placeholder="أدخل نصاً لاختبار الرد..."
                />
              </div>

              <Button
                onClick={handleTestAI}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                اختبر الآن
              </Button>

              {testOutput && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    الرد من AI
                  </label>
                  <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {testOutput}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Settings Section */}
      {activeSection === "settings" && (
        <div className="space-y-4">
          <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              إعدادات عامة
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  الحد الأقصى لطول الرد (أحرف)
                </label>
                <input
                  type="number"
                  defaultValue="2000"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  مهلة الاستجابة (ثانية)
                </label>
                <input
                  type="number"
                  defaultValue="30"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  حفظ الإعدادات
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-gray-600 dark:text-gray-400"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  إعادة تعيين
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
