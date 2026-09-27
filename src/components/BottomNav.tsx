import React from 'react';
import { motion } from 'motion/react';
import { Home, Search, MessageSquare, User, Activity, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: any;
  onAuthOpen: (mode: 'signin' | 'signup') => void;
  onPatientProfileOpen: () => void;
}

export default function BottomNav({ currentView, onNavigate, user, onAuthOpen, onPatientProfileOpen }: BottomNavProps) {
  const { t } = useLanguage();
  const navItems = [
    { id: 'home', icon: Home, label: t('nav_home') },
    { id: 'dashboard', icon: Activity, label: t('nav_portal'), protected: true },
    { id: 'regional-hub', icon: Globe, label: t('nav_regional'), protected: true },
    { id: 'chat', icon: MessageSquare, label: t('nav_consult'), protected: true },
  ];

  if (!user) return null;

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe pt-2"
    >
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/50 rounded-[2.5rem] shadow-2xl shadow-slate-900/10 flex items-center justify-around p-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (item.protected && !user) {
                  onAuthOpen('signin');
                } else {
                  onNavigate(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-3xl transition-all relative ${
                isActive ? 'text-primary-600' : 'text-slate-400'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'fill-primary-600/10' : ''}`} />
              <span className="text-[8px] font-black tracking-widest mt-1.5">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -top-1 w-1 h-1 bg-primary-600 rounded-full"
                />
              )}
            </motion.button>
          );
        })}
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => user ? onPatientProfileOpen() : onAuthOpen('signin')}
          className="flex flex-col items-center justify-center w-16 h-16 rounded-3xl text-slate-400"
        >
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center overflow-hidden transition-colors ${user ? 'border-primary-500 bg-primary-50' : 'border-slate-200 bg-slate-100'}`}>
            <User className={`w-4 h-4 ${user ? 'text-primary-600' : 'text-slate-400'}`} />
          </div>
          <span className="text-[8px] font-black tracking-widest mt-1.5 uppercase">{user ? t('nav_passport') : t('signin')}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
