import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Calendar, Filter } from "lucide-react";
import { useLocation } from "wouter";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Reports() {
  const [, navigate] = useLocation();
  const [dateRange, setDateRange] = useState("month");
  const reportRef = useRef<HTMLDivElement>(null);

  // البيانات المثال
  const revenueData = [
    { month: "يناير", revenue: 4000, subscriptions: 2400 },
    { month: "فبراير", revenue: 3000, subscriptions: 1398 },
    { month: "مارس", revenue: 2000, subscriptions: 9800 },
    { month: "أبريل", revenue: 2780, subscriptions: 3908 },
    { month: "مايو", revenue: 1890, subscriptions: 4800 },
    { month: "يونيو", revenue: 2390, subscriptions: 3800 },
  ];

  const paymentMethodData = [
    { name: "Stripe", value: 45, color: "#3b82f6" },
    { name: "PayPal", value: 30, color: "#f59e0b" },
    { name: "تحويل بنكي", value: 20, color: "#10b981" },
    { name: "آخرى", value: 5, color: "#8b5cf6" },
  ];

  const userGrowthData = [
    { week: "الأسبوع 1", users: 100, active: 80 },
    { week: "الأسبوع 2", users: 150, active: 120 },
    { week: "الأسبوع 3", users: 220, active: 180 },
    { week: "الأسبوع 4", users: 300, active: 250 },
  ];

  const handleExportPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("bodrix-report.pdf");
    } catch (error) {
      console.error("خطأ في تصدير PDF:", error);
      alert("حدث خطأ في تصدير التقرير");
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ["الشهر", "الإيرادات", "الاشتراكات"],
      ...revenueData.map((item) => [item.month, item.revenue, item.subscriptions]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bodrix-report.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
              className="p-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                التقارير والإحصائيات
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                تحليل شامل للأداء والإيرادات
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleExportPDF}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تصدير PDF
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تصدير CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="quarter">هذا الربع</option>
              <option value="year">هذه السنة</option>
            </select>
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
        </Card>

        {/* Report Content */}
        <div ref={reportRef} className="bg-white dark:bg-slate-800 p-8 rounded-lg">
          {/* Title */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              تقرير الأداء الشامل
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {new Date().toLocaleDateString("ar-SA")}
            </p>
          </div>

          {/* Revenue Chart */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              الإيرادات والاشتراكات
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  name="الإيرادات"
                />
                <Line
                  type="monotone"
                  dataKey="subscriptions"
                  stroke="#10b981"
                  name="الاشتراكات"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Pie Chart */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                طرق الدفع
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* User Growth */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                نمو المستخدمين
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#f59e0b" name="إجمالي المستخدمين" />
                  <Bar dataKey="active" fill="#10b981" name="المستخدمون النشطون" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Summary Statistics */}
          <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ملخص الإحصائيات
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  إجمالي الإيرادات
                </p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  $14,060
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  متوسط المعاملة
                </p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  $234.33
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  معدل النمو
                </p>
                <p className="text-2xl font-bold text-purple-600 mt-2">
                  +45.2%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  معدل التحويل
                </p>
                <p className="text-2xl font-bold text-orange-600 mt-2">
                  18.5%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Print Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => window.print()}
            className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            طباعة التقرير
          </Button>
        </div>
      </div>
    </div>
  );
}
