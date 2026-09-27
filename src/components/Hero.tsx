import React from 'react';
import { ArrowRight, ShieldCheck, Clock, Video, Heart, Activity, Stethoscope, Sparkles, Newspaper } from 'lucide-react';
import { motion } from 'motion/react';

import { useLanguage } from '../contexts/LanguageContext';

export function Hero({ onNavigate, onAuthOpen }: { onNavigate: (page: string) => void, onAuthOpen: (mode: 'signin' | 'signup') => void }) {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900 min-h-[100dvh] md:min-h-[90vh] flex flex-col justify-center transition-colors">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 dark:bg-slate-800/30 skew-x-[-12deg] translate-x-1/4 z-0 hidden lg:block transition-colors" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.05)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.1)_0%,transparent_50%)]" />
      
      {/* Dynamic Pulse Grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none overflow-hidden transition-opacity">
        <div className="absolute top-0 left-0 w-full h-full dark:[background-image:radial-gradient(#ffffff_1px,transparent_1px)]" style={{ backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/3 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary-100/30 dark:bg-primary-900/40 rounded-full blur-[80px] md:blur-[120px] transition-colors"
        />
      </div>
      
      <div className="relative flex-1 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-6 pb-20 md:py-32 z-10 w-full flex items-center pt-safe pb-safe">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center w-full mt-10 md:mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              damping: 20,
              stiffness: 100,
              mass: 0.8
            }}
            className="text-left w-full max-w-2xl mx-auto lg:mx-0"
          >
            <div className="inline-flex items-center space-x-2 bg-primary-100/50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-[10px] md:text-xs font-black tracking-widest mb-6 md:mb-8 border border-primary-200 dark:border-primary-800 shadow-sm transition-colors">
              <Activity className="w-3.5 h-3.5 md:w-4 h-4 animate-pulse" />
              <span>{t('hero_badge')}</span>
            </div>
            
            <h1 className="text-[2.75rem] leading-[0.95] sm:text-7xl lg:text-8xl font-black font-display text-slate-900 dark:text-white tracking-tighter mb-6 md:mb-8 italic break-words transition-colors">
              {t('hero_title_healing')} <br />
              <span className="text-primary-600 not-italic">{t('hero_title_limits')}</span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-8 md:mb-12 leading-relaxed font-medium transition-colors">
              {t('hero_desc')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full">
              <motion.button 
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -2 }}
                onClick={() => onAuthOpen('signin')}
                className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[2rem] text-sm md:text-lg font-black transition-all shadow-xl shadow-primary-600/30 dark:shadow-primary-600/20 flex items-center justify-center group uppercase tracking-widest cursor-pointer ring-4 ring-primary-600/10 dark:ring-primary-600/5 active:scale-95"
                aria-label={t('hero_btn_signin')}
              >
                 {t('hero_btn_signin')}
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -2 }}
                onClick={() => onNavigate('blog')}
                className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[2rem] text-sm md:text-lg font-black transition-all flex items-center justify-center group uppercase tracking-widest cursor-pointer active:scale-95 border border-slate-200 dark:border-slate-700"
                aria-label={t('hero_btn_insights')}
              >
                {t('hero_btn_insights')}
                <Newspaper className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:-rotate-12 transition-transform" />
              </motion.button>
            </div>

            <div className="mt-12 md:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 bg-slate-50 dark:bg-slate-800/50 lg:bg-transparent lg:dark:bg-transparent p-6 lg:p-0 rounded-3xl lg:rounded-none border border-slate-100 dark:border-slate-700 lg:border-none lg:dark:border-none transition-colors">
              <div className="flex flex-col justify-center">
                <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">12K+</span>
                <span className="text-[10px] md:text-[9px] font-black text-slate-400 tracking-widest mt-1 uppercase">{t('hero_stat_patients')}</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">500+</span>
                <span className="text-[10px] md:text-[9px] font-black text-slate-400 tracking-widest mt-1 uppercase">{t('hero_stat_doctors')}</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">100%</span>
                <span className="text-[10px] md:text-[9px] font-black text-slate-400 tracking-widest mt-1 uppercase">{t('hero_stat_secure')}</span>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center space-x-1 relative">
                   <Heart className="hidden sm:block absolute -left-6 top-1 w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                   <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">4.9/5</span>
                </div>
                <span className="text-[10px] md:text-[9px] font-black text-slate-400 tracking-widest mt-1 uppercase">{t('hero_stat_rating')}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl rotate-2 border border-slate-200 dark:border-slate-800 transition-colors">
              <img 
                src="https://picsum.photos/seed/doctor_premium/800/1000" 
                alt="Healthcare Professional"
                className="w-full aspect-[4/5] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                  <span className="text-xs font-bold tracking-widest">{t('hero_card_trust')}</span>
                </div>
                <h3 className="text-3xl font-black italic">{t('hero_card_care')}</h3>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-100/50 dark:bg-primary-900/30 rounded-full blur-3xl z-0 transition-colors" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-teal-100/50 dark:bg-teal-900/30 rounded-full blur-3xl z-0 transition-colors" />
            
            <div className="absolute top-20 -left-12 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl z-20 border border-slate-100 dark:border-slate-700 -rotate-6 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 transition-colors">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest text-slate-400">{t('hero_card_live')}</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white transition-colors">{t('hero_card_status')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
