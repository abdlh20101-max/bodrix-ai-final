import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Award, Download, Share2, Calendar } from "lucide-react";
import { useLocation } from "wouter";

export default function Certificates() {
  const [, navigate] = useLocation();

  const [certificates, setCertificates] = useState([
    {
      id: "1",
      title: "شهادة الكاتب المحترف",
      description: "تم إصدارها لإتمام 100 مقالة بنجاح",
      issuedDate: "2026-02-03",
      expiryDate: "2027-02-03",
      issuer: "Bodrix AI",
      credentialId: "CERT-2026-001",
      status: "active",
      icon: "📜",
    },
    {
      id: "2",
      title: "شهادة محلل البيانات",
      description: "تم إصدارها لتحليل 50 مجموعة بيانات",
      issuedDate: "2026-01-15",
      expiryDate: "2027-01-15",
      issuer: "Bodrix AI",
      credentialId: "CERT-2026-002",
      status: "active",
      icon: "📊",
    },
    {
      id: "3",
      title: "شهادة الترجمة المتقدمة",
      description: "ترجمة 1000 كلمة بدقة عالية",
      issuedDate: "2025-12-20",
      expiryDate: "2026-12-20",
      issuer: "Bodrix AI",
      credentialId: "CERT-2025-003",
      status: "expiring_soon",
      icon: "🌍",
    },
  ]);

  const [awards, setAwards] = useState([
    {
      id: "1",
      name: "جائزة المستخدم النشط",
      description: "لأفضل نشاط خلال الشهر",
      awardedDate: "2026-02-01",
      rank: "ذهبي",
      icon: "🏆",
    },
    {
      id: "2",
      name: "جائزة الإنتاجية العالية",
      description: "لأعلى درجة إنتاجية",
      awardedDate: "2026-01-15",
      rank: "فضي",
      icon: "⭐",
    },
    {
      id: "3",
      name: "جائزة التعاون",
      description: "لأفضل تعاون مع المستخدمين",
      awardedDate: "2025-12-20",
      rank: "برونزي",
      icon: "🤝",
    },
  ]);

  const handleDownload = (certId: string) => {
    alert(`تم تحميل الشهادة ${certId} بنجاح!`);
  };

  const handleShare = (certId: string) => {
    alert(`تم نسخ رابط الشهادة ${certId}!`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      case "expiring_soon":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
      case "expired":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "نشط";
      case "expiring_soon":
        return "ينتهي قريباً";
      case "expired":
        return "منتهي";
      default:
        return status;
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-8 h-8" />
              الشهادات والجوائز
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              احتفظ بشهاداتك وجوائزك الرسمية
            </p>
          </div>
        </div>

        {/* Certificates */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            الشهادات ({certificates.length})
          </h2>

          <div className="space-y-4">
            {certificates.map((cert) => (
              <Card
                key={cert.id}
                className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{cert.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {cert.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          صادرة: {cert.issuedDate}
                        </span>
                        <span>الجهة المصدرة: {cert.issuer}</span>
                        <span>رقم الاعتماد: {cert.credentialId}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                      cert.status
                    )}`}
                  >
                    {getStatusLabel(cert.status)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(cert.id)}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    تحميل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare(cert.id)}
                    className="flex items-center gap-1"
                  >
                    <Share2 className="w-4 h-4" />
                    مشاركة
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            الجوائز ({awards.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award) => (
              <Card
                key={award.id}
                className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-center"
              >
                <p className="text-6xl mb-4">{award.icon}</p>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {award.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {award.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {award.awardedDate}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      award.rank === "ذهبي"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                        : award.rank === "فضي"
                        ? "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400"
                        : "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400"
                    }`}
                  >
                    {award.rank}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
