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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
      <div className="mb-12">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-8 font-bold uppercase tracking-widest text-[10px] cursor-pointer"
          aria-label={t('dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('dashboard')}
        </motion.button>
        
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.8] mb-4 italic">
          {t('not_center_h')} <br />
          <span className="text-primary-600">{t('not_center_s')}</span>
        </h2>
        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
          {t('not_desc')}
        </p>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 italic text-slate-400 font-medium capitalize">
            {t('not_empty')}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  type: "spring",
                  damping: 25,
                  stiffness: 150,
                  delay: index * 0.05 
                }}
                className={`p-6 bg-white rounded-3xl border ${notification.read ? 'border-slate-100 opacity-60' : 'border-primary-100 shadow-xl shadow-primary-600/5'} flex items-start space-x-5`}
              >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                notification.type === 'success' ? 'bg-green-50 text-green-600' :
                notification.type === 'alert' ? 'bg-red-50 text-red-600' :
                'bg-primary-50 text-primary-600'
              }`}>
                {notification.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> :
                 notification.type === 'alert' ? <AlertTriangle className="w-6 h-6" /> :
                 <Info className="w-6 h-6" />}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{notification.title}</h3>
                  <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock className="w-3 h-3 mr-1" />
                    {notification.time}
                  </div>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed">{notification.message}</p>
                {!notification.read && (
                  <div className="mt-4 flex items-center text-[8px] font-black text-primary-600 uppercase tracking-[0.2em]">
                    {t('not_new')}
                  </div>
                )}
              </div>
            </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="mt-20 pt-8 border-t border-slate-100">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] text-center italic">
          {t('not_secure')}
        </p>
      </div>
    </div>
  );
}
