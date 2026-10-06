import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Bell, ArrowLeft, CheckCircle2, Info, AlertTriangle, Clock } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: 'success' | 'info' | 'alert';
}

interface NotificationsViewProps {
  notifications: Notification[];
  onBack: () => void;
}

export function NotificationsView({ notifications, onBack }: NotificationsViewProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-20 font-manrope">
      
      {/* Header section matching landing page */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-[2.5rem] border border-sky-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(8,112,184,0.06)] relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-sky-400/10 to-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="flex items-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 font-extrabold uppercase tracking-widest text-xs cursor-pointer"
            aria-label={t('dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('dashboard')}
          </motion.button>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 text-xs font-extrabold mb-4 uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5" /> Clinical Alerts
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            {t('not_center_h')} <span className="text-sky-500">{t('not_center_s')}</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
            {t('not_desc')}
          </p>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-sky-100 dark:border-slate-800 text-slate-400 font-medium p-6 shadow-xs">
            <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
            <p className="text-sm sm:text-base font-extrabold text-slate-700 dark:text-slate-300">{t('not_empty')}</p>
            <p className="text-xs text-slate-400 mt-1">You're all caught up with your health updates.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  type: "spring",
                  damping: 25,
                  stiffness: 150,
                  delay: index * 0.05 
                }}
                className={`p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-[2rem] border transition-all flex flex-col sm:flex-row items-start gap-4 sm:gap-5 ${
                  notification.read 
                    ? 'border-slate-100 dark:border-slate-800 opacity-70' 
                    : 'border-sky-200 dark:border-sky-800 shadow-[0_15px_30px_rgba(8,112,184,0.06)]'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                  notification.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600' :
                  notification.type === 'alert' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600' :
                  'bg-sky-50 dark:bg-sky-950/60 text-sky-600'
                }`}>
                  {notification.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> :
                   notification.type === 'alert' ? <AlertTriangle className="w-6 h-6" /> :
                   <Info className="w-6 h-6" />}
                </div>
                
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 mb-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">{notification.title}</h3>
                    <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <Clock className="w-3 h-3 mr-1" />
                      {notification.time}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{notification.message}</p>
                  
                  {!notification.read && (
                    <div className="mt-3 flex items-center text-[10px] font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
                      <span className="w-2 h-2 rounded-full bg-sky-500 mr-1.5 animate-pulse" />
                      {t('not_new')}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="mt-16 pt-6 border-t border-slate-200 dark:border-slate-800">
        <p className="text-[10px] font-extrabold text-slate-400 tracking-[0.25em] text-center uppercase">
          {t('not_secure')}
        </p>
      </div>

    </div>
  );
}

export default NotificationsView;
