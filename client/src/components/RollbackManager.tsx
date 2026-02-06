import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface Backup {
  id: string;
  timestamp: Date;
  type: string;
  size: string;
  canRestore: boolean;
}

interface RollbackManagerProps {
  onRollback?: (backupId: string) => Promise<void>;
}

export const RollbackManager: React.FC<RollbackManagerProps> = ({ onRollback }) => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [confirmRollback, setConfirmRollback] = useState(false);

  useEffect(() => {
    loadBackups();
    // Refresh every 5 minutes
    const interval = setInterval(loadBackups, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadBackups = async () => {
    setLoading(true);
    try {
      // Mock data - would be replaced with actual API call
      const mockBackups: Backup[] = [
        {
          id: "backup_hourly_1707204000000",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          type: "hourly",
          size: "245 MB",
          canRestore: true,
        },
        {
          id: "backup_hourly_1707200400000",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          type: "hourly",
          size: "242 MB",
          canRestore: true,
        },
        {
          id: "backup_daily_1707118800000",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          type: "daily",
          size: "238 MB",
          canRestore: true,
        },
      ];
      setBackups(mockBackups);
    } catch (error) {
      console.error("Failed to load backups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async () => {
    if (!selectedBackup || !onRollback) return;

    setIsRollingBack(true);
    try {
      await onRollback(selectedBackup);
      setConfirmRollback(false);
      setSelectedBackup(null);
      // Reload backups after rollback
      setTimeout(loadBackups, 2000);
    } catch (error) {
      console.error("Rollback failed:", error);
    } finally {
      setIsRollingBack(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      hourly: "نسخة كل ساعة",
      daily: "نسخة يومية",
      weekly: "نسخة أسبوعية",
      manual: "نسخة يدوية",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5" />
            استرجاع النسخة الاحتياطية
          </CardTitle>
          <CardDescription>
            استرجع موقعك إلى أي نسخة احتياطية سابقة بنقرة واحدة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold">تحذير: الاسترجاع لا يمكن التراجع عنه</p>
              <p className="text-xs mt-1">
                سيتم استبدال جميع الملفات والبيانات بالنسخة المختارة
              </p>
            </div>
          </div>

          {/* Backups List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">النسخ الاحتياطية المتاحة:</h3>

            {loading ? (
              <div className="text-center py-8 text-gray-500">
                جاري تحميل النسخ الاحتياطية...
              </div>
            ) : backups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد نسخ احتياطية متاحة
              </div>
            ) : (
              <div className="space-y-2">
                {backups.map((backup) => (
                  <div
                    key={backup.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedBackup === backup.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedBackup(backup.id)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="backup"
                        value={backup.id}
                        checked={selectedBackup === backup.id}
                        onChange={() => setSelectedBackup(backup.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-sm">
                            {getTypeLabel(backup.type)}
                          </span>
                          {backup.canRestore && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {formatDate(backup.timestamp)}
                        </p>
                        <p className="text-xs text-gray-500">الحجم: {backup.size}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirmation Dialog */}
          {confirmRollback && selectedBackup && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-red-900">تأكيد الاسترجاع</p>
                  <p className="text-xs text-red-800 mt-1">
                    هل أنت متأكد من رغبتك في استرجاع هذه النسخة؟ لا يمكن التراجع عن هذا الإجراء.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRollback}
                  disabled={isRollingBack}
                >
                  {isRollingBack ? "جاري الاسترجاع..." : "تأكيد الاسترجاع"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setConfirmRollback(false)}
                  disabled={isRollingBack}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => setConfirmRollback(true)}
              disabled={!selectedBackup || confirmRollback || isRollingBack}
              variant="destructive"
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              استرجاع هذه النسخة
            </Button>
            <Button
              onClick={loadBackups}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              تحديث القائمة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">إحصائيات النسخ الاحتياطية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{backups.length}</p>
              <p className="text-xs text-gray-600">نسخ متاحة</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">24/7</p>
              <p className="text-xs text-gray-600">نسخ تلقائية</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
