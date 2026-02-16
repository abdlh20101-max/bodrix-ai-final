import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Copy, Download, Globe, Volume2, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function Translation() {
  const [, navigate] = useLocation();
  const [sourceLanguage, setSourceLanguage] = useState("ar");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [sourceText, setSourceText] = useState("مرحبا بك في Bodrix AI");
  const [translatedText, setTranslatedText] = useState("Welcome to Bodrix AI");
  const [copied, setCopied] = useState(false);

  const languages = [
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "pt", name: "Português", flag: "🇵🇹" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  ];

  const handleTranslate = () => {
    // محاكاة الترجمة
    setTranslatedText(`[${targetLanguage.toUpperCase()}] ${sourceText}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleClearAll = () => {
    setSourceText("");
    setTranslatedText("");
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-8 h-8" />
              الترجمة المتقدمة
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              ترجم محادثاتك إلى لغات متعددة مع الحفاظ على السياق
            </p>
          </div>
        </div>

        {/* Translation Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Source */}
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                اللغة المصدر
              </label>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="أدخل النص المراد ترجمته"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
              rows={8}
            />

            <div className="mt-4 flex gap-2">
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="flex-1"
              >
                مسح
              </Button>
              <Button
                onClick={() => window.speechSynthesis.speak(new SpeechSynthesisUtterance(sourceText))}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                استمع
              </Button>
            </div>
          </Card>

          {/* Target */}
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                اللغة المستهدفة
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              value={translatedText}
              readOnly
              placeholder="ستظهر الترجمة هنا"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 text-gray-900 dark:text-white resize-none"
              rows={8}
            />

            <div className="mt-4 flex gap-2">
              <Button
                onClick={handleCopy}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? "تم النسخ" : "نسخ"}
              </Button>
              <Button
                onClick={() => window.speechSynthesis.speak(new SpeechSynthesisUtterance(translatedText))}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                استمع
              </Button>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={handleSwapLanguages}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
          >
            ⇄ تبديل اللغات
          </Button>
          <Button
            onClick={handleTranslate}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            ترجم الآن
          </Button>
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            تحميل
          </Button>
        </div>

        {/* Translation History */}
        <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            سجل الترجمات
          </h3>

          <div className="space-y-3">
            {[
              { from: "ar", to: "en", text: "مرحبا بك" },
              { from: "en", to: "es", text: "Hello" },
              { from: "fr", to: "de", text: "Bonjour" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {languages.find((l) => l.code === item.from)?.name} →{" "}
                    {languages.find((l) => l.code === item.to)?.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {item.text}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  إعادة
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
