import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Send,
  Calendar,
  Users,
  BarChart3,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "push" | "social";
  status: "draft" | "scheduled" | "running" | "completed";
  scheduledDate: string;
  targetAudience: number;
  content: string;
}

export function MarketingAutomation() {
  const [activeTab, setActiveTab] = useState<
    "campaigns" | "content" | "analytics"
  >("campaigns");
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "حملة الترحيب",
      type: "email",
      status: "completed",
      scheduledDate: "2026-02-01",
      targetAudience: 1250,
      content: "أهلاً وسهلاً في Bodrix AI...",
    },
  ]);

  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");

  const handleCreateCampaign = () => {
    if (newCampaignName.trim()) {
      setCampaigns([
        ...campaigns,
        {
          id: Date.now().toString(),
          name: newCampaignName,
          type: "email",
          status: "draft",
          scheduledDate: new Date().toISOString().split("T")[0],
          targetAudience: 0,
          content: "",
        },
      ]);
      setNewCampaignName("");
      setShowNewCampaign(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-slate-700">
        {[
          { id: "campaigns", label: "الحملات", icon: Megaphone },
          { id: "content", label: "المحتوى", icon: Edit },
          { id: "analytics", label: "الإحصائيات", icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(tab.id as "campaigns" | "content" | "analytics")
            }
            className={`px-4 py-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaigns Tab */}
      {activeTab === "campaigns" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              الحملات التسويقية
            </h3>
            <Button
              onClick={() => setShowNewCampaign(!showNewCampaign)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              حملة جديدة
            </Button>
          </div>

          {showNewCampaign && (
            <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <div className="space-y-4">
                <input
                  type="text"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="اسم الحملة..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateCampaign}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    إنشاء
                  </Button>
                  <Button
                    onClick={() => setShowNewCampaign(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {campaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {campaign.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {campaign.type === "email" && "بريد إلكتروني"}
                    {campaign.type === "sms" && "رسالة نصية"}
                    {campaign.type === "push" && "إشعار فوري"}
                    {campaign.type === "social" && "وسائل اجتماعية"}
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

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    الحالة
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {campaign.status === "draft" && "مسودة"}
                    {campaign.status === "scheduled" && "مجدولة"}
                    {campaign.status === "running" && "جارية"}
                    {campaign.status === "completed" && "مكتملة"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    الجمهور المستهدف
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {campaign.targetAudience}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    التاريخ المجدول
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {campaign.scheduledDate}
                  </p>
                </div>
              </div>

              {campaign.status === "draft" && (
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  إرسال الحملة
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Content Tab */}
      {activeTab === "content" && (
        <div className="space-y-4">
          <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              توليد المحتوى بـ AI
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  نوع المحتوى
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white">
                  <option>عنوان جذاب</option>
                  <option>وصف منتج</option>
                  <option>منشور وسائل اجتماعية</option>
                  <option>بريد تسويقي</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  الكلمات المفتاحية
                </label>
                <input
                  type="text"
                  placeholder="مثال: AI, تسويق, أتمتة"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                توليد المحتوى
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                إجمالي الحملات
              </p>
              <p className="text-3xl font-bold text-orange-600">
                {campaigns.length}
              </p>
            </Card>
            <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                معدل النقر
              </p>
              <p className="text-3xl font-bold text-blue-600">23.5%</p>
            </Card>
            <Card className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                معدل التحويل
              </p>
              <p className="text-3xl font-bold text-green-600">8.2%</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
