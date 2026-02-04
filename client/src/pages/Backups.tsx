import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, RotateCcw, Clock, CheckCircle, AlertCircle, HardDrive } from "lucide-react";
import { useLocation } from "wouter";

export default function Backups() {
  const [, navigate] = useLocation();
  const [backups, setBackups] = useState([
    {
      id: 1,
      date: "2026-02-04",
      time: "23:45",
      size: "2.5 MB",
      status: "completed",
      type: "automatic",
      messages: 1250,
      images: 340,
    },
    {
      id: 2,
      date: "2026-02-03",
      time: "23:30",
      size: "2.4 MB",
      status: "completed",
      type: "automatic",
      messages: 1200,
      images: 330,
    },
    {
      id: 3,
      date: "2026-02-02",
      time: "14:15",
      size: "2.3 MB",
      status: "completed",
      type: "manual",
      messages: 1150,
      images: 320,
    },
    {
      id: 4,
      date: "2026-02-01",
      time: "23:30",
      size: "2.2 MB",
      status: "completed",
      type: "automatic",
      messages: 1100,
      images: 310,
    },
  ]);

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    frequency: "daily",
    includeImages: true,
    includeMessages: true,
    includeSettings: true,
    encryption: true,
  });

  const handleCreateBackup = () => {
    const newBackup = {
      id: backups.length + 1,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("ar-SA"),
      size: "2.6 MB",
      status: "completed" as const,
      type: "manual" as const,
      messages: 1300,
      images: 350,
    };
    setBackups([newBackup, ...backups]);
  };

  const handleRestoreBackup = (backupId: number) => {
    alert(`سيتم استعادة النسخة الاحتياطية #${backupId}`);
  };

  const handleDownloadBackup = (backupId: number) => {
    alert(`سيتم تحميل النسخة الاحتياطية #${backupId}`);
  };

  const totalBackupSize = backups.reduce((sum, b) => {
    const size = parseFloat(b.size);
    return sum + size;
  }, 0);

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
                النسخ الاحتياطية
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                احفظ بيانات محادثاتك وصورك بأمان
              </p>
            </div>
          </div>

          <Button
            onClick={handleCreateBackup}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <HardDrive className="w-4 h-4" />
            إنشاء نسخة احتياطية الآن
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Settings */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                إعدادات النسخ الاحتياطية
              </h3>

              <div className="space-y-4">
                {/* Auto Backup */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={backupSettings.autoBackup}
                    onChange={(e) =>
                      setBackupSettings({
                        ...backupSettings,
                        autoBackup: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    نسخ احتياطي تلقائي
                  </span>
                </label>

                {/* Frequency */}
                {backupSettings.autoBackup && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      التكرار
                    </label>
                    <select
                      value={backupSettings.frequency}
                      onChange={(e) =>
                        setBackupSettings({
                          ...backupSettings,
                          frequency: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="daily">يومي</option>
                      <option value="weekly">أسبوعي</option>
                      <option value="monthly">شهري</option>
                    </select>
                  </div>
                )}

                <hr className="border-gray-200 dark:border-slate-700" />

                {/* Include Options */}
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  ما يتم حفظه
                </h4>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={backupSettings.includeMessages}
                    onChange={(e) =>
                      setBackupSettings({
                        ...backupSettings,
                        includeMessages: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    الرسائل
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={backupSettings.includeImages}
                    onChange={(e) =>
                      setBackupSettings({
                        ...backupSettings,
                        includeImages: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    الصور
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={backupSettings.includeSettings}
                    onChange={(e) =>
                      setBackupSettings({
                        ...backupSettings,
                        includeSettings: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    الإعدادات
                  </span>
                </label>

                <hr className="border-gray-200 dark:border-slate-700" />

                {/* Encryption */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={backupSettings.encryption}
                    onChange={(e) =>
                      setBackupSettings({
                        ...backupSettings,
                        encryption: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    تشفير النسخة
                  </span>
                </label>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6">
                  حفظ الإعدادات
                </Button>
              </div>

              {/* Storage Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  معلومات التخزين
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      عدد النسخ:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {backups.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      الحجم الكلي:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {totalBackupSize.toFixed(1)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      المتاح:
                    </span>
                    <span className="font-semibold text-green-600">
                      5 GB
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Backups List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {backups.length === 0 ? (
                <Card className="p-8 text-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <HardDrive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    لا توجد نسخ احتياطية حتى الآن
                  </p>
                </Card>
              ) : (
                backups.map((backup) => (
                  <Card
                    key={backup.id}
                    className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                          <HardDrive className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              نسخة احتياطية #{backup.id}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                backup.type === "automatic"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              }`}
                            >
                              {backup.type === "automatic" ? "تلقائي" : "يدوي"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            {backup.date} - {backup.time}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-semibold text-green-600">
                            مكتملة
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {backup.size}
                        </p>
                      </div>
                    </div>

                    {/* Backup Details */}
                    <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          الرسائل
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {backup.messages}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          الصور
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {backup.images}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          الحجم
                        </p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {backup.size}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleDownloadBackup(backup.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        تحميل
                      </Button>
                      <Button
                        onClick={() => handleRestoreBackup(backup.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        استعادة
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <Card className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-400">
                ملاحظة مهمة
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                النسخ الاحتياطية التلقائية يتم حفظها يومياً. يمكنك استعادة أي نسخة احتياطية في أي وقت. تأكد من تفعيل النسخ الاحتياطي التلقائي لحماية بيانات محادثاتك.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
