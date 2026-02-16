import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users, Share2, Lock, Unlock, UserPlus, Trash2, Eye, Edit2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Collaboration() {
  const [, navigate] = useLocation();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedPermission, setSelectedPermission] = useState("view");

  const [collaborators, setCollaborators] = useState([
    {
      id: "1",
      name: "أحمد محمد",
      email: "ahmed@example.com",
      role: "owner",
      joinedAt: "2026-02-01",
      avatar: "👨",
    },
    {
      id: "2",
      name: "فاطمة علي",
      email: "fatima@example.com",
      role: "editor",
      joinedAt: "2026-02-02",
      avatar: "👩",
    },
    {
      id: "3",
      name: "محمود حسن",
      email: "mahmoud@example.com",
      role: "viewer",
      joinedAt: "2026-02-03",
      avatar: "👨",
    },
  ]);

  const [sharedConversations, setSharedConversations] = useState([
    {
      id: "1",
      title: "مشروع جديد",
      sharedWith: 3,
      lastModified: "2026-02-03",
      isPublic: false,
    },
    {
      id: "2",
      title: "ملاحظات الاجتماع",
      sharedWith: 5,
      lastModified: "2026-02-02",
      isPublic: true,
    },
    {
      id: "3",
      title: "خطة العمل",
      sharedWith: 2,
      lastModified: "2026-02-01",
      isPublic: false,
    },
  ]);

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      alert(`تم إرسال دعوة إلى ${inviteEmail} بصلاحيات ${selectedPermission}`);
      setInviteEmail("");
      setShowInvite(false);
    }
  };

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(collaborators.filter((c) => c.id !== id));
  };

  const handleChangePermission = (id: string, newRole: string) => {
    setCollaborators(
      collaborators.map((c) => (c.id === id ? { ...c, role: newRole } : c))
    );
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      owner: "مالك",
      editor: "محرر",
      viewer: "عارض",
      commenter: "معلق",
    };
    return roles[role] || role;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
      case "editor":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
      case "viewer":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      case "commenter":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400";
    }
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-8 h-8" />
                التعاون والمشاركة
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                شارك محادثاتك مع الآخرين وتعاون معهم في الوقت الفعلي
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowInvite(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            دعوة متعاون
          </Button>
        </div>

        {/* Invite Form */}
        {showInvite && (
          <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              دعوة متعاون جديد
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="أدخل البريد الإلكتروني"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  الصلاحيات
                </label>
                <select
                  value={selectedPermission}
                  onChange={(e) => setSelectedPermission(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="viewer">عارض (قراءة فقط)</option>
                  <option value="commenter">معلق (قراءة + تعليقات)</option>
                  <option value="editor">محرر (قراءة + تعديل)</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleInvite}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  إرسال الدعوة
                </Button>
                <Button
                  onClick={() => setShowInvite(false)}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Collaborators List */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                المتعاونون ({collaborators.length})
              </h3>

              <div className="space-y-3">
                {collaborators.map((collab) => (
                  <div
                    key={collab.id}
                    className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{collab.avatar}</span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {collab.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {collab.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {collab.role !== "owner" && (
                        <select
                          value={collab.role}
                          onChange={(e) =>
                            handleChangePermission(collab.id, e.target.value)
                          }
                          className={`px-3 py-1 rounded-full text-sm font-semibold border-0 ${getRoleColor(
                            collab.role
                          )}`}
                        >
                          <option value="viewer">عارض</option>
                          <option value="commenter">معلق</option>
                          <option value="editor">محرر</option>
                        </select>
                      )}
                      {collab.role === "owner" && (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(
                            collab.role
                          )}`}
                        >
                          {getRoleLabel(collab.role)}
                        </span>
                      )}

                      {collab.role !== "owner" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveCollaborator(collab.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sharing Settings */}
          <div>
            <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                إعدادات المشاركة
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      رابط عام
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      السماح بالتعليقات
                    </span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      السماح بالتعديل
                    </span>
                  </label>
                </div>
              </div>

              <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                حفظ الإعدادات
              </Button>
            </Card>
          </div>
        </div>

        {/* Shared Conversations */}
        <Card className="mt-8 p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            المحادثات المشاركة
          </h3>

          <div className="space-y-3">
            {sharedConversations.map((conv) => (
              <div
                key={conv.id}
                className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {conv.title}
                    </p>
                    {conv.isPublic ? (
                      <Unlock className="w-4 h-4 text-green-600" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    مشاركة مع {conv.sharedWith} أشخاص • آخر تعديل: {conv.lastModified}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
