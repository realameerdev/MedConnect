import React from 'react';
import { motion } from 'motion/react';
import { Home, MessageSquare, User, Activity, Globe, Calendar, Clock, Brain, Stethoscope } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: any;
  onAuthOpen: (mode: 'signin' | 'signup') => void;
  onPatientProfileOpen: () => void;
}

export default function BottomNav({ 
  currentView, 
  onNavigate, 
  user, 
  onAuthOpen, 
  onPatientProfileOpen 
}: BottomNavProps) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', icon: Activity, label: 'Portal', protected: true },
    { id: 'chat', icon: Brain, label: 'AI Doc', protected: true },
    { id: 'appointments', icon: Clock, label: 'Schedule', protected: true },
    { id: 'regional-hub', icon: Globe, label: 'Hub', protected: true },
  ];

  if (!user) return null;

  return (
    <div className="md:hidden fixed bottom-3 left-0 right-0 z-50 px-3 pointer-events-none font-manrope">
      
      {/* 
        COMPACT FLOATING BOTTOM DOCK:
        Styled after the landing page curved dock aesthetic.
        Active tab expands into a sky-blue pill with label,
        while inactive tabs remain sleek, compact circular touch targets.
      */}
      <div className="pointer-events-auto relative max-w-[340px] xs:max-w-[360px] mx-auto rounded-full bg-white/95 backdrop-blur-2xl border border-sky-200/60 shadow-[0_12px_35px_rgba(14,165,233,0.18)] p-1.5 flex items-center justify-between gap-1">
        
        {/* Top Silk Edge Highlight */}
        <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/40 to-transparent pointer-events-none rounded-full" />

        {/* Dynamic Nav Items */}
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => {
                if (item.protected && !user) {
                  onAuthOpen('signin');
                } else {
                  onNavigate(item.id);
                }
              }}
              className={`flex items-center justify-center transition-all cursor-pointer select-none ${
                isActive 
                  ? 'bg-sky-500 text-white rounded-full py-1.5 px-3 shadow-xs font-bold text-xs gap-1.5' 
                  : 'p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-full'
              }`}
              aria-label={item.label}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              {isActive && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="whitespace-nowrap text-[11px] font-bold leading-none tracking-tight"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}

        {/* Profile / Account Trigger */}
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => onPatientProfileOpen()}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-full transition-all cursor-pointer flex items-center justify-center"
          title="Patient Profile"
          aria-label="Patient Profile"
        >
          <div className="w-6.5 h-6.5 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-3.5 h-3.5 text-slate-500" />
            )}
          </div>
        </motion.button>

      </div>
    </div>
  );
}
