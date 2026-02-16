import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Palette, Layout, Users, Settings, Plus, Trash2,
  MoveUp, MoveDown, Eye, EyeOff, Save, Image,
  MousePointer, Check, ChevronRight
} from 'lucide-react';
import { useAuth, type Page, type Banner, type ButtonConfig } from '../contexts/AuthContext';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'theme' | 'pages' | 'buttons' | 'banners' | 'users';

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('theme');
  const [saveMessage, setSaveMessage] = useState('');
  
  const {
    user,
    users,
    settings,
    updateSettings,
    addPage,
    removePage,
    updatePage,
    addBanner,
    removeBanner,
    addButton,
    removeButton,
    updateButton,
    deleteUser,
  } = useAuth();

  if (!user?.isAdmin) return null;

  const handleSave = () => {
    setSaveMessage('تم حفظ الإعدادات بنجاح!');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleColorChange = (key: keyof typeof settings.theme, value: string) => {
    updateSettings({
      theme: { ...settings.theme, [key]: value }
    });
  };

  const tabs = [
    { id: 'theme' as AdminTab, label: 'الألوان', icon: Palette },
    { id: 'pages' as AdminTab, label: 'الصفحات', icon: Layout },
    { id: 'buttons' as AdminTab, label: 'الأزرار', icon: MousePointer },
    { id: 'banners' as AdminTab, label: 'البنرات', icon: Image },
    { id: 'users' as AdminTab, label: 'المستخدمين', icon: Users },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-slate-900 rounded-2xl shadow-2xl z-50 overflow-hidden border border-slate-700 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 md:p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white">لوحة التحكم</h2>
                  <p className="text-white/70 text-xs md:text-sm">إعدادات الموقع الكاملة</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {saveMessage && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm"
                  >
                    <Check className="w-4 h-4" />
                    {saveMessage}
                  </motion.div>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar */}
              <div className="w-16 md:w-64 bg-slate-800 border-l border-slate-700 flex flex-col">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 md:py-4 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-amber-500/20 text-amber-400 border-r-2 border-amber-400'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="hidden md:inline font-medium">{tab.label}</span>
                    {activeTab === tab.id && (
                      <ChevronRight className="w-4 h-4 mr-auto hidden md:block" />
                    )}
                  </button>
                ))}
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {/* Theme Tab */}
                {activeTab === 'theme' && (
                  <ThemeSettings
                    theme={settings.theme}
                    onColorChange={handleColorChange}
                    onSave={handleSave}
                  />
                )}

                {/* Pages Tab */}
                {activeTab === 'pages' && (
                  <PagesSettings
                    pages={settings.pages}
                    onAdd={addPage}
                    onRemove={removePage}
                    onUpdate={updatePage}
                    onSave={handleSave}
                  />
                )}

                {/* Buttons Tab */}
                {activeTab === 'buttons' && (
                  <ButtonsSettings
                    buttons={settings.buttons}
                    onAdd={addButton}
                    onRemove={removeButton}
                    onUpdate={updateButton}
                    onSave={handleSave}
                  />
                )}

                {/* Banners Tab */}
                {activeTab === 'banners' && (
                  <BannersSettings
                    banners={settings.banners}
                    onAdd={addBanner}
                    onRemove={removeBanner}
                    onSave={handleSave}
                  />
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <UsersSettings
                    users={users}
                    onDelete={deleteUser}
                    onSave={handleSave}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Theme Settings Component
function ThemeSettings({ theme, onColorChange, onSave }: {
  theme: { primaryColor: string; secondaryColor: string; backgroundColor: string; textColor: string };
  onColorChange: (key: 'primaryColor' | 'secondaryColor' | 'backgroundColor' | 'textColor', value: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Palette className="w-5 h-5 text-amber-400" />
        إعدادات الألوان
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorInput
          label="اللون الرئيسي"
          value={theme.primaryColor}
          onChange={(v) => onColorChange('primaryColor', v)}
        />
        <ColorInput
          label="اللون الثانوي"
          value={theme.secondaryColor}
          onChange={(v) => onColorChange('secondaryColor', v)}
        />
        <ColorInput
          label="لون الخلفية"
          value={theme.backgroundColor}
          onChange={(v) => onColorChange('backgroundColor', v)}
        />
        <ColorInput
          label="لون النص"
          value={theme.textColor}
          onChange={(v) => onColorChange('textColor', v)}
        />
      </div>

      <button
        onClick={onSave}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
      >
        <Save className="w-5 h-5" />
        حفظ الإعدادات
      </button>
    </div>
  );
}

function ColorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-lg cursor-pointer border-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
        />
      </div>
    </div>
  );
}

// Pages Settings Component
function PagesSettings({ pages, onAdd, onRemove, onUpdate, onSave }: {
  pages: Page[];
  onAdd: (page: Omit<Page, 'id'>) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Page>) => void;
  onSave: () => void;
}) {
  const [newPageName, setNewPageName] = useState('');
  const [newPagePath, setNewPagePath] = useState('');

  const handleAdd = () => {
    if (newPageName && newPagePath) {
      onAdd({
        name: newPageName,
        path: newPagePath,
        isVisible: true,
        order: pages.length + 1,
      });
      setNewPageName('');
      setNewPagePath('');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Layout className="w-5 h-5 text-amber-400" />
        إدارة الصفحات
      </h3>

      {/* Add New Page */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
        <h4 className="text-sm font-medium text-slate-300">إضافة صفحة جديدة</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="اسم الصفحة"
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
          />
          <input
            type="text"
            value={newPagePath}
            onChange={(e) => setNewPagePath(e.target.value)}
            placeholder="/path"
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          إضافة صفحة
        </button>
      </div>

      {/* Pages List */}
      <div className="space-y-2">
        {pages.sort((a, b) => a.order - b.order).map((page) => (
          <div key={page.id} className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl border border-slate-700">
            <button
              onClick={() => onUpdate(page.id, { isVisible: !page.isVisible })}
              className={`p-2 rounded-lg transition-colors ${
                page.isVisible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'
              }`}
            >
              {page.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <div className="flex-1">
              <p className="font-medium text-white">{page.name}</p>
              <p className="text-sm text-slate-400">{page.path}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdate(page.id, { order: Math.max(1, page.order - 1) })}
                className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <MoveUp className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => onUpdate(page.id, { order: page.order + 1 })}
                className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <MoveDown className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => onRemove(page.id)}
                className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onSave}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
      >
        <Save className="w-5 h-5" />
        حفظ الإعدادات
      </button>
    </div>
  );
}

// Buttons Settings Component
function ButtonsSettings({ buttons, onAdd, onRemove, onUpdate, onSave }: {
  buttons: ButtonConfig[];
  onAdd: (btn: Omit<ButtonConfig, 'id'>) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ButtonConfig>) => void;
  onSave: () => void;
}) {
  const [newBtnLabel, setNewBtnLabel] = useState('');
  const [newBtnPath, setNewBtnPath] = useState('');
  const [newBtnPosition, setNewBtnPosition] = useState<ButtonConfig['position']>('header');

  const handleAdd = () => {
    if (newBtnLabel && newBtnPath) {
      onAdd({
        label: newBtnLabel,
        path: newBtnPath,
        position: newBtnPosition,
        isVisible: true,
        order: buttons.filter(b => b.position === newBtnPosition).length + 1,
      });
      setNewBtnLabel('');
      setNewBtnPath('');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <MousePointer className="w-5 h-5 text-amber-400" />
        إدارة الأزرار
      </h3>

      {/* Add New Button */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
        <h4 className="text-sm font-medium text-slate-300">إضافة زر جديد</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={newBtnLabel}
            onChange={(e) => setNewBtnLabel(e.target.value)}
            placeholder="نص الزر"
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
          />
          <input
            type="text"
            value={newBtnPath}
            onChange={(e) => setNewBtnPath(e.target.value)}
            placeholder="/path"
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
          />
          <select
            value={newBtnPosition}
            onChange={(e) => setNewBtnPosition(e.target.value as ButtonConfig['position'])}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
          >
            <option value="header">الرأسية</option>
            <option value="footer">التذييل</option>
            <option value="sidebar">الشريط الجانبي</option>
          </select>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          إضافة زر
        </button>
      </div>

      {/* Buttons List */}
      <div className="space-y-2">
        {['header', 'footer', 'sidebar'].map((pos) => (
          <div key={pos}>
            <h4 className="text-sm font-medium text-slate-400 mb-2">
              {pos === 'header' ? 'الرأسية' : pos === 'footer' ? 'التذييل' : 'الشريط الجانبي'}
            </h4>
            {buttons
              .filter((b) => b.position === pos)
              .sort((a, b) => a.order - b.order)
              .map((btn) => (
                <div key={btn.id} className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl border border-slate-700 mb-2">
                  <button
                    onClick={() => onUpdate(btn.id, { isVisible: !btn.isVisible })}
                    className={`p-2 rounded-lg transition-colors ${
                      btn.isVisible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {btn.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <div className="flex-1">
                    <p className="font-medium text-white">{btn.label}</p>
                    <p className="text-sm text-slate-400">{btn.path}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdate(btn.id, { order: Math.max(1, btn.order - 1) })}
                      className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      <MoveUp className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => onUpdate(btn.id, { order: btn.order + 1 })}
                      className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      <MoveDown className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => onRemove(btn.id)}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      <button
        onClick={onSave}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
      >
        <Save className="w-5 h-5" />
        حفظ الإعدادات
      </button>
    </div>
  );
}

// Banners Settings Component
function BannersSettings({ banners, onAdd, onRemove, onSave }: {
  banners: Banner[];
  onAdd: (banner: Omit<Banner, 'id'>) => void;
  onRemove: (id: string) => void;
  onSave: () => void;
}) {
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [newBannerLink, setNewBannerLink] = useState('');

  const handleAdd = () => {
    if (newBannerTitle && newBannerUrl) {
      onAdd({
        title: newBannerTitle,
        imageUrl: newBannerUrl,
        link: newBannerLink || '#',
        isActive: true,
        order: banners.length + 1,
      });
      setNewBannerTitle('');
      setNewBannerUrl('');
      setNewBannerLink('');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Image className="w-5 h-5 text-amber-400" />
        إدارة البنرات
      </h3>

      {/* Add New Banner */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
        <h4 className="text-sm font-medium text-slate-300">إضافة بنر جديد</h4>
        <div className="space-y-3">
          <input
            type="text"
            value={newBannerTitle}
            onChange={(e) => setNewBannerTitle(e.target.value)}
            placeholder="عنوان البنر"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
          />
          <input
            type="text"
            value={newBannerUrl}
            onChange={(e) => setNewBannerUrl(e.target.value)}
            placeholder="رابط الصورة"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
          />
          <input
            type="text"
            value={newBannerLink}
            onChange={(e) => setNewBannerLink(e.target.value)}
            placeholder="رابط التحويل (اختياري)"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          إضافة بنر
        </button>
      </div>

      {/* Banners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.sort((a, b) => a.order - b.order).map((banner) => (
          <div key={banner.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="aspect-video bg-slate-700 flex items-center justify-center">
              {banner.imageUrl ? (
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
              ) : (
                <Image className="w-12 h-12 text-slate-500" />
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white truncate">{banner.title}</h4>
                <button
                  onClick={() => onRemove(banner.id)}
                  className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-slate-400 truncate">{banner.link}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onSave}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
      >
        <Save className="w-5 h-5" />
        حفظ الإعدادات
      </button>
    </div>
  );
}

// Users Settings Component
interface UserType {
  id: string;
  username?: string;
  phone?: string;
  isAdmin: boolean;
  loginType: 'guest' | 'username' | 'phone';
  createdAt: string;
}

function UsersSettings({ users, onDelete, onSave }: {
  users: UserType[];
  onDelete: (id: string) => void;
  onSave: () => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Users className="w-5 h-5 text-amber-400" />
        إدارة المستخدمين
      </h3>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">المستخدم</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">نوع الحساب</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">تاريخ الإنشاء</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-300">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {(user.username || user.phone || 'G')[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {user.username || user.phone || 'ضيف'}
                        </p>
                        {user.isAdmin && (
                          <span className="text-xs text-amber-400">مشرف</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.loginType === 'guest'
                        ? 'bg-slate-600 text-slate-300'
                        : user.loginType === 'username'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {user.loginType === 'guest' ? 'ضيف' : user.loginType === 'username' ? 'اسم مستخدم' : 'رقم جوال'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-4 py-3">
                    {!user.isAdmin && (
                      <button
                        onClick={() => onDelete(user.id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h4 className="text-sm font-medium text-slate-300 mb-2">معلومات سريعة</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 p-3 rounded-lg">
            <p className="text-2xl font-bold text-white">{users.length}</p>
            <p className="text-sm text-slate-400">إجمالي المستخدمين</p>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg">
            <p className="text-2xl font-bold text-emerald-400">
              {users.filter(u => u.loginType === 'username').length}
            </p>
            <p className="text-sm text-slate-400">باسم المستخدم</p>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg">
            <p className="text-2xl font-bold text-blue-400">
              {users.filter(u => u.loginType === 'phone').length}
            </p>
            <p className="text-sm text-slate-400">برقم الجوال</p>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg">
            <p className="text-2xl font-bold text-slate-400">
              {users.filter(u => u.loginType === 'guest').length}
            </p>
            <p className="text-sm text-slate-400">ضيف</p>
          </div>
        </div>
      </div>

      <button
        onClick={onSave}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
      >
        <Save className="w-5 h-5" />
        حفظ الإعدادات
      </button>
    </div>
  );
}
