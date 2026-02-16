import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Zap, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

type LoginTab = 'guest' | 'username' | 'phone';

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<LoginTab>('guest');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, validateUsername, validatePhone, validatePassword } = useAuth();

  const resetForm = () => {
    setUsername('');
    setPhone('');
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  const handleTabChange = (tab: LoginTab) => {
    setActiveTab(tab);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (activeTab === 'guest') {
        const success = login('guest');
        if (success) {
          resetForm();
          onClose();
        }
      } else if (activeTab === 'username') {
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.valid) {
          setError(usernameValidation.message);
          setIsLoading(false);
          return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
          setError(passwordValidation.message);
          setIsLoading(false);
          return;
        }

        const success = login('username', { username, password });
        if (success) {
          resetForm();
          onClose();
        } else {
          setError('اسم المستخدم أو كلمة المرور غير صحيحة');
        }
      } else if (activeTab === 'phone') {
        const phoneValidation = validatePhone(phone);
        if (!phoneValidation.valid) {
          setError(phoneValidation.message);
          setIsLoading(false);
          return;
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
          setError(passwordValidation.message);
          setIsLoading(false);
          return;
        }

        const success = login('phone', { phone, password });
        if (success) {
          resetForm();
          onClose();
        } else {
          setError('رقم الجوال أو كلمة المرور غير صحيحة');
        }
      }
    } catch {
      setError('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhone = (value: string) => {
    // Allow only + and digits
    const cleaned = value.replace(/[^\+\d]/g, '');
    return cleaned;
  };

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-700">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">تسجيل الدخول</h2>
                      <p className="text-white/70 text-sm">اختر طريقة الدخول المناسبة</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-700">
                <button
                  onClick={() => handleTabChange('guest')}
                  className={`flex-1 py-4 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'guest'
                      ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/10'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  دخول سريع
                </button>
                <button
                  onClick={() => handleTabChange('username')}
                  className={`flex-1 py-4 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'username'
                      ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/10'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <User className="w-4 h-4" />
                  اسم المستخدم
                </button>
                <button
                  onClick={() => handleTabChange('phone')}
                  className={`flex-1 py-4 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'phone'
                      ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/10'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  رقم الجوال
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <AnimatePresence mode="wait">
                  {activeTab === 'guest' && (
                    <motion.div
                      key="guest"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="text-center py-8"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">دخول سريع</h3>
                      <p className="text-slate-400 text-sm">
                        سيتم تسجيل دخولك كضيف مؤقت. بعض الميزات قد تكون محدودة.
                      </p>
                    </motion.div>
                  )}

                  {activeTab === 'username' && (
                    <motion.div
                      key="username"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          اسم المستخدم
                        </label>
                        <div className="relative">
                          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="أدخل اسم المستخدم (يبدأ بحرف، 6 خانات)"
                            className="w-full pr-10 pl-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-right"
                            dir="rtl"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          كلمة المرور
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="أدخل كلمة المرور (تبدأ بحرف، 8 خانات)"
                            className="w-full pr-4 pl-12 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-right"
                            dir="rtl"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'phone' && (
                    <motion.div
                      key="phone"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          رقم الجوال
                        </label>
                        <div className="relative">
                          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(formatPhone(e.target.value))}
                            placeholder="+966XXXXXXXXX"
                            className="w-full pr-10 pl-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-left"
                            dir="ltr"
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1 text-right">
                          أدخل رمز الدولة متبوعاً برقم الجوال (مثال: +966501234567)
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          كلمة المرور
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="أدخل كلمة المرور (تبدأ بحرف، 8 خانات)"
                            className="w-full pr-4 pl-12 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors text-right"
                            dir="rtl"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      تسجيل الدخول
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    ليس لديك حساب؟ سجل الآن
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
