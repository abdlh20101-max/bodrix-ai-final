import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search as SearchIcon, Filter, Calendar, MessageSquare } from "lucide-react";
import { useLocation } from "wouter";

export default function Search() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [searchResults, setSearchResults] = useState([
    {
      id: 1,
      type: "message",
      title: "كيف أستخدم الذكاء الاصطناعي في عملي؟",
      preview: "شرح مفصل عن كيفية استخدام AI في العمل اليومي...",
      date: "2026-02-04",
      relevance: 95,
    },
    {
      id: 2,
      type: "message",
      title: "ما هي أفضل ممارسات البرمجة؟",
      preview: "نصائح مهمة لكتابة كود نظيف وفعال...",
      date: "2026-02-03",
      relevance: 87,
    },
    {
      id: 3,
      type: "message",
      title: "شرح خوارزميات البحث",
      preview: "شرح شامل لخوارزميات البحث المختلفة...",
      date: "2026-02-02",
      relevance: 78,
    },
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // محاكاة البحث
    console.log("البحث عن:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/history")}
            className="p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              البحث المتقدم
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              ابحث عن محادثاتك السابقة والرسائل
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن رسالة أو محادثة..."
              className="w-full px-6 py-4 pr-14 rounded-lg border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <SearchIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </form>

        {/* Filters */}
        <Card className="p-6 mb-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Type Filter */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                نوع البحث
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="all">الكل</option>
                <option value="messages">الرسائل</option>
                <option value="conversations">المحادثات</option>
                <option value="images">الصور</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                الفترة الزمنية
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="all">الكل</option>
                <option value="today">اليوم</option>
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="year">هذه السنة</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              >
                <SearchIcon className="w-4 h-4" />
                بحث
              </Button>
            </div>
          </div>
        </Card>

        {/* Search Results */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {searchResults.length} نتيجة بحث
          </h2>

          <div className="space-y-4">
            {searchResults.length === 0 ? (
              <Card className="p-8 text-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  لم نجد نتائج تطابق بحثك
                </p>
              </Card>
            ) : (
              searchResults.map((result) => (
                <Card
                  key={result.id}
                  className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-600 uppercase">
                          {result.type === "message" ? "رسالة" : "محادثة"}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {result.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {result.preview}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {result.date}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {result.relevance}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        تطابق
                      </div>
                      <div className="mt-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                        {result.relevance}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
