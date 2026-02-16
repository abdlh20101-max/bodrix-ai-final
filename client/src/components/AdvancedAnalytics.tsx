import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Download,
  Calendar,
  Filter,
} from "lucide-react";

interface AnalyticsData {
  date: string;
  users: number;
  revenue: number;
  conversions: number;
  engagement: number;
}

export function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState("30days");
  const [analyticsData] = useState<AnalyticsData[]>([
    {
      date: "2026-02-01",
      users: 1250,
      revenue: 2450,
      conversions: 125,
      engagement: 78,
    },
    {
      date: "2026-02-02",
      users: 1320,
      revenue: 2680,
      conversions: 135,
      engagement: 82,
    },
    {
      date: "2026-02-03",
      users: 1410,
      revenue: 2890,
      conversions: 145,
      engagement: 85,
    },
  ]);

  const totalUsers = analyticsData.reduce((sum, d) => sum + d.users, 0);
  const totalRevenue = analyticsData.reduce((sum, d) => sum + d.revenue, 0);
  const avgEngagement =
    analyticsData.reduce((sum, d) => sum + d.engagement, 0) /
    analyticsData.length;

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          الإحصائيات المتقدمة
        </h2>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          >
            <option value="7days">آخر 7 أيام</option>
            <option value="30days">آخر 30 يوم</option>
            <option value="90days">آخر 90 يوم</option>
            <option value="1year">آخر سنة</option>
          </select>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                إجمالي المستخدمين
              </p>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {totalUsers.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                إجمالي الإيرادات
              </p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                معدل الانخراط
              </p>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                {avgEngagement.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600 opacity-50" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                معدل النمو
              </p>
              <p className="text-2xl font-bold text-orange-600 mt-2">+12.8%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-600 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          البيانات التفصيلية
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  التاريخ
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  المستخدمون
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  الإيرادات
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  التحويلات
                </th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                  الانخراط
                </th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((data, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                >
                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    {data.date}
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    {data.users.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-green-600">
                    ${data.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    {data.conversions}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${data.engagement}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {data.engagement}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
          💡 رؤى مهمة
        </h3>
        <ul className="space-y-2 text-blue-800 dark:text-blue-200">
          <li>✓ معدل النمو اليومي حوالي 5.6% - اتجاه إيجابي قوي</li>
          <li>✓ معدل الانخراط يتحسن بشكل مستمر (78% → 85%)</li>
          <li>✓ متوسط الإيرادات اليومية $2,673 - فوق المتوسط</li>
          <li>✓ معدل التحويل يزداد بنسبة 8% يومياً</li>
        </ul>
      </Card>
    </div>
  );
}
