import React, { useState } from 'react';
import { LogOut, User as UserIcon, UserPlus, ShieldCheck, User, Sparkles, Newspaper, Bell, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';

import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  onAuthOpen: (mode: 'signin' | 'signup') => void;
  onDoctorProfileOpen: () => void;
  onPatientProfileOpen: () => void;
  unreadNotifications?: number;
}

export function Navbar({ onNavigate, onAuthOpen, onDoctorProfileOpen, onPatientProfileOpen, unreadNotifications = 0 }: NavbarProps) {
  const { user, userRole, logout } = useAuth();
  const { t } = useLanguage();

  const navigation = [
    { name: t('nav_insights'), view: 'blog', icon: Newspaper },
    { name: t('nav_doctors'), view: 'doctors' },
    { name: t('nav_regional_hub'), view: 'regional-hub', icon: Globe },
    { name: t('nav_emergencies'), view: 'emergency' },
    { name: t('nav_consult_ai'), view: 'chat', icon: Sparkles },
  ];

  return (
    <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800 shadow-sm shadow-slate-900/5 transition-colors" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center shrink-0">
            <motion.button 
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 md:space-x-4 group transition-all mr-2 sm:mr-12 lg:mr-24 shrink-0"
              aria-label="MedConnect Home"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 bg-primary-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20 group-hover:scale-105 transition-transform shrink-0">
                <ShieldCheck className="w-4.5 h-4.5 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-sm md:text-lg font-black text-slate-900 dark:text-white tracking-tighter shrink-0 italic">Med<span className="not-italic text-primary-600">Connect</span></span>
            </motion.button>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
            <LanguageToggle />
            <ThemeToggle />
            
            {user && (
              <>
                <div className="h-6 w-px bg-slate-200 mx-2 md:mx-4 hidden sm:block"></div>
                <motion.button 
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onNavigate('notifications')}
                  aria-label={`View notifications, ${unreadNotifications} unread`}
                  className="relative p-2 text-slate-400 hover:text-primary-600 transition-colors group cursor-pointer"
                >
                  <Bell className="w-5 md:w-6 h-5 md:h-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                  )}
                </motion.button>
              </>
            )}

            {user ? (
               <div className="flex items-center space-x-2 md:space-x-4 ml-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onNavigate('dashboard')}
                    className="flex items-center space-x-2 p-1 pl-2 sm:pl-3 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-100 transition-all cursor-pointer"
                  >
                    <span className="text-[10px] font-black tracking-widest text-slate-500 hidden sm:inline">{userRole}</span>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="P" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <UserIcon className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    aria-label={t('nav_signout')}
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
               </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4 pl-2">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onAuthOpen('signin')}
                  className="text-slate-600 font-bold text-[10px] tracking-widest px-4 py-2.5 hover:bg-slate-100 rounded-2xl transition-all cursor-pointer hidden sm:block"
                >
                  {t('nav_login')}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onAuthOpen('signup')}
                  className="bg-primary-600 text-white px-5 sm:px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest shadow-lg shadow-primary-600/10 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('nav_signup')}</span>
                  <span className="sm:hidden text-[8px]">{t('nav_join')}</span>
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
