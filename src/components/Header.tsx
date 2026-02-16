import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, Settings, Shield } from 'lucide-react';
import { useAuth, type ButtonConfig } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import AdminPanel from './AdminPanel';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const { user, settings, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const visibleButtons = settings.buttons
    .filter((btn: ButtonConfig) => btn.position === 'header' && btn.isVisible)
    .sort((a: ButtonConfig, b: ButtonConfig) => a.order - b.order);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Bodrix
              </span>
            </motion.a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {visibleButtons.map((btn: ButtonConfig) => (
                <motion.a
                  key={btn.id}
                  href={btn.path}
                  className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {btn.label}
                </motion.a>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Admin Settings - Only for admin */}
              {user?.isAdmin && (
                <motion.button
                  onClick={() => setIsAdminOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden lg:inline">الإعدادات</span>
                </motion.button>
              )}

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-200 hidden sm:inline">
                      {user.username || user.phone || 'ضيف'}
                    </span>
                    {user.isAdmin && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                        Admin
                      </span>
                    )}
                  </motion.button>

                  {/* Dropdown */}
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 mt-2 w-48 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden"
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs text-slate-400 border-b border-slate-700 mb-2">
                          {user.loginType === 'guest' ? 'دخول سريع' : `مرحباً ${user.username || user.phone}`}
                        </div>
                        {user.isAdmin && (
                          <button
                            onClick={() => {
                              setIsAdminOpen(true);
                              setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-amber-400 hover:bg-slate-700 rounded-lg transition-colors text-sm"
                          >
                            <Settings className="w-4 h-4" />
                            الإعدادات
                          </button>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-slate-700 rounded-lg transition-colors text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          تسجيل الخروج
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">تسجيل الدخول</span>
                </motion.button>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 bg-slate-800 rounded-xl text-slate-300 hover:text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-4 border-t border-slate-800"
            >
              <div className="flex flex-col gap-2">
                {visibleButtons.map((btn: ButtonConfig) => (
                  <a
                    key={btn.id}
                    href={btn.path}
                    className="px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-sm font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {btn.label}
                  </a>
                ))}
                {user?.isAdmin && (
                  <button
                    onClick={() => {
                      setIsAdminOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 text-amber-400 hover:bg-slate-800 rounded-xl transition-colors text-sm font-medium text-right"
                  >
                    <Settings className="w-4 h-4" />
                    الإعدادات
                  </button>
                )}
              </div>
            </motion.nav>
          )}
        </div>
      </motion.header>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </>
  );
}
