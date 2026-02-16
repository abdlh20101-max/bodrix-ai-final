import { motion } from 'framer-motion';
import {
  Code, Palette, Globe, Smartphone, Database, Shield,
  ArrowRight, CheckCircle, Sparkles, Zap, Lock, Cloud, Award
} from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Code,
      title: 'تطوير الويب',
      description: 'بناء مواقع وتطبيقات ويب تفاعلية متجاوزة باستخدام أحدث التقنيات.',
      features: ['React & Next.js', 'Node.js الخلفية', 'TypeScript', 'APIs حديثة'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Palette,
      title: 'تصميم UI/UX',
      description: 'تصميم واجهات مستخدم جذابة وتجارب سلسلة تحافظ العملاء.',
      features: ['Figma التصميم', 'Adobe XD', 'Prototyping', 'User Research'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Smartphone,
      title: 'تطبيقات الموبايل',
      description: 'تطوير تطبيقات موبايل أصيلية لـ iOS و Android بأداء عالي.',
      features: ['React Native', 'Flutter', 'iOS Native', 'Android Native'],
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Database,
      title: 'إدارة قواعد البيانات',
      description: 'تصميم وإدارة قواعد بيانات قابلة للتطور مع حماية كاملة.',
      features: ['PostgreSQL', 'MongoDB', 'Redis', 'Data Migration'],
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: Shield,
      title: 'الأمان السيبراني',
      description: 'حماية تطبيقاتك وبياناتك من التهديدات السيبرانية.',
      features: ['Penetration Testing', 'Security Audit', 'Compliance', 'Monitoring'],
      color: 'from-red-500 to-rose-500',
    },
    {
      icon: Cloud,
      title: 'البنية السحابية',
      description: 'إدارة البنية التحتية واستضافة الموارد بكفاءة.',
      features: ['AWS & Azure', 'Docker', 'Kubernetes', 'CI/CD'],
      color: 'from-indigo-500 to-violet-500',
    },
  ];

  const process = [
    {
      step: '01',
      title: 'الاستكشاف',
      description: 'نبدأ بفهم متطلباتك وأهدافك التجارية.',
    },
    {
      step: '02',
      title: 'التصميم',
      description: 'نصمم حلولاً بصرية تتناسب مع رؤيتك ومستخدميك.',
    },
    {
      step: '03',
      title: 'التطوير',
      description: 'نبني الحلول باستخدام أحدث التقنيات وأفضل الممارسات.',
    },
    {
      step: '04',
      title: 'الإطلاق',
      description: 'نطلق مشروعك ونواصلك بالدعم المستمر.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 pt-24">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>خدماتنا</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              حلول شاملة
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                لتحويل رقميك
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400 max-w-2xl mx-auto"
            >
              نقدم مجموعة واسعة من الخدمات التقنية المصممة لمساعدتك على النجاح في عالم رقمي متسارع
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden hover:border-blue-500/50 transition-all"
              >
                <div className="p-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700">
                  <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                    اطلب الخدمة
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              كيف نعمل
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 max-w-2xl mx-auto"
            >
              منهجية عملنا المبسطة تمنحك تجربة سلسلة ونتائج رائعة
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 h-full">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent opacity-50">
                    {step.step}
                  </span>
                  <h3 className="text-xl font-semibold text-white mt-4 mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-slate-700" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                لماذا تختارنا؟
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                نحن شريكون في نجاحك، ونسعى جاهدين لتوفير أفضل الحلول التي تتناسب مع احتياجاتك وميزانيتك.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Zap, title: 'أداء سريع', desc: 'نولي اهتمامًا للسرعة في تنفيذ المشاريع' },
                  { icon: Lock, title: 'أمان تام', desc: 'حماية كاملة لبياناتك وتطبيقاتك' },
                  { icon: Globe, title: 'دعم عالمي', desc: 'فريق منتشر عبر العالم جاهز للمساعدة' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl border border-slate-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                      <p className="text-3xl font-bold text-white">98%</p>
                      <p className="text-sm text-slate-400">رضا العملاء</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                      <p className="text-3xl font-bold text-white">200+</p>
                      <p className="text-sm text-slate-400">مشروع منجز</p>
                    </div>
                  </div>
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto">
                    <Award className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-xl font-bold text-white mt-4">شهادات الإتقان</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                هل أنت جاهز للبدء؟
              </h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                دعنا نساعدك في تحويل فكرتك إلى واقع. اتصل بنا الآن وابدأ رحلتك.
              </p>
              <motion.a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold hover:bg-white/90 transition-colors shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ابدأ مشروعك
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
