import { motion } from 'framer-motion';
import { Shield, Github, Twitter, Mail, Globe } from 'lucide-react';
import { useAuth, type ButtonConfig } from '../contexts/AuthContext';

export default function Footer() {
  const { settings } = useAuth();

  const visibleButtons = settings.buttons
    .filter((btn: ButtonConfig) => btn.position === 'footer' && btn.isVisible)
    .sort((a: ButtonConfig, b: ButtonConfig) => a.order - b.order);

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              className="flex items-center gap-2 mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Bodrix
              </span>
            </motion.div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              منصة شاملة لإدارة المحتوى والمستخدمين مع نظام مصادقة متكامل ولوحة تحكم قوية للادمن.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {visibleButtons.length > 0 ? (
                visibleButtons.map((btn: ButtonConfig) => (
                  <li key={btn.id}>
                    <a
                      href={btn.path}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {btn.label}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <a href="/" className="text-slate-400 hover:text-white transition-colors text-sm">الرئيسية</a>
                  </li>
                  <li>
                    <a href="/about" className="text-slate-400 hover:text-white transition-colors text-sm">عن الموقع</a>
                  </li>
                  <li>
                    <a href="/services" className="text-slate-400 hover:text-white transition-colors text-sm">الخدمات</a>
                  </li>
                  <li>
                    <a href="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">اتصل بنا</a>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@bodrix.com" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  info@bodrix.com
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  www.bodrix.com
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              <motion.a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Bodrix. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-slate-400 text-sm transition-colors">سياسة الخصوصية</a>
            <a href="#" className="text-slate-500 hover:text-slate-400 text-sm transition-colors">شروط الاستخدام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
