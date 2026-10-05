import React, { useState, useEffect, useRef } from 'react';
import { LogOut, User as UserIcon, Bell, ArrowRight, Brain, HeartPulse, Pill, BookOpen, Stethoscope, Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { MedConnectLogo } from './MedConnectLogo';
import { useLanguage, Language } from '../contexts/LanguageContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  onAuthOpen: (mode: 'signin' | 'signup') => void;
  onDoctorProfileOpen: () => void;
  onPatientProfileOpen: () => void;
  unreadNotifications?: number;
}

export function Navbar({ 
  onNavigate, 
  onAuthOpen, 
  onDoctorProfileOpen, 
  onPatientProfileOpen, 
  unreadNotifications = 0 
}: NavbarProps) {
  const { user, userRole, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setLangDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { name: 'Home', view: 'home', icon: HeartPulse },
    { name: 'AI Doctor', view: 'chat', icon: Brain },
    { name: 'Health Hub', view: 'regional-hub', icon: HeartPulse },
    { name: 'Med Plan', view: user ? 'dashboard' : 'med-plan', icon: Pill },
    { name: 'Library', view: 'blog', icon: BookOpen },
    { name: 'Specialists', view: 'doctors', icon: Stethoscope },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'pidgin', label: 'Pidgin' },
    { code: 'yo', label: 'Yorùbá' },
    { code: 'ha', label: 'Hausa' },
    { code: 'ig', label: 'Igbo' },
  ];

  const handleItemClick = (view: string) => {
    setMobileMenuOpen(false);
    if (view === 'med-plan' && !user) {
      onAuthOpen('signup');
      return;
    }
    onNavigate(view);
  };

  return (
    <>
      {/* 
        STATIONARY FLOATING NAVBAR WRAPPER:
        Permanently pinned at top of viewport so it stays stagnant and never disappears.
        Compact, mature max width (max-w-5xl) rather than spanning 1280px.
      */}
      <header className="fixed top-0 left-0 right-0 z-50 font-manrope pointer-events-none">
        
        {/* Outer Container with Matured, Short Width */}
        <div className="w-full mx-auto px-2 sm:px-4 pt-2 sm:pt-3 max-w-4xl lg:max-w-5xl">
          
          {/* 
            COMPACT & MATURE FLOATING DOCK:
            Short in height and width, rounded curved corners, silky satin border,
            contains all sections cleanly without taking excessive viewport space.
          */}
          <nav className="pointer-events-auto relative rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-[0_10px_30px_rgba(14,165,233,0.1)] border border-sky-200/50 dark:border-sky-500/20 py-1.5 sm:py-2 px-2.5 sm:px-5">
            {/* Silky Luminous Edge Highlight */}
            <div className="absolute top-0 left-4 right-4 sm:left-6 sm:right-6 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/35 to-transparent pointer-events-none rounded-full" />

            <div className="flex items-center justify-between gap-1.5 sm:gap-3">
              
              {/* Left: Brand Identity (Compact & Mature) */}
              <div className="flex items-center shrink-0 min-w-0">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate('home')}
                  className="flex items-center space-x-1.5 sm:space-x-2 group transition-all shrink-0 cursor-pointer"
                  aria-label="MedConnect Home"
                >
                  <div className="w-6.5 h-6.5 sm:w-8 sm:h-8 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 text-slate-900 dark:text-white">
                    <MedConnectLogo size={24} variant="icon" />
                  </div>
                  <div className="flex items-center leading-none select-none">
                    <span className="text-sm sm:text-lg font-black text-slate-900 dark:text-white tracking-tight shrink-0 flex items-center">
                      <span>Med</span>
                      <span className="text-sky-500 font-black ml-0.5">Connect</span>
                    </span>
                  </div>
                </motion.button>
              </div>

              {/* Center: Desktop Navigation with Compact Silky Indicator */}
              <div 
                className="hidden md:flex items-center space-x-0.5 p-0.5 bg-slate-100/70 dark:bg-slate-800/70 rounded-full border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md relative"
                onMouseLeave={() => setHoveredNav(null)}
              >
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleItemClick(item.view)}
                    onMouseEnter={() => setHoveredNav(item.name)}
                    className="relative px-2.5 lg:px-3 py-1 rounded-full text-[11px] lg:text-xs font-semibold transition-colors cursor-pointer text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white z-10 whitespace-nowrap"
                  >
                    {hoveredNav === item.name && (
                      <motion.div
                        layoutId="silkNavHighlight"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 32,
                        }}
                        className="absolute inset-0 bg-white dark:bg-slate-700/90 rounded-full shadow-2xs border border-sky-200/50 dark:border-sky-500/25 -z-10"
                      />
                    )}
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>

              {/* Right: Compact Controls & Actions */}
              <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
                
                {/* Desktop Language Dropdown */}
                <div className="hidden sm:flex items-center space-x-1">
                  <div ref={langRef} className="relative">
                    <button
                      onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                      className="flex items-center space-x-1 px-2 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-[10px] font-bold text-slate-700 dark:text-slate-200 transition-all border border-slate-200/50 dark:border-slate-700/50 cursor-pointer"
                      title="Select Language"
                      aria-label="Select Language"
                      aria-expanded={langDropdownOpen}
                    >
                      <Globe className="w-3 h-3 text-sky-500" />
                      <span className="uppercase text-[10px]">{language}</span>
                      <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
                    </button>

                    <AnimatePresence>
                      {langDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-1.5 w-32 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-1 z-50 text-left"
                        >
                          {languages.map((l) => (
                            <button
                              key={l.code}
                              onClick={() => {
                                setLanguage(l.code);
                                setLangDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-colors cursor-pointer ${
                                language === l.code
                                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                              }`}
                            >
                              <span>{l.label}</span>
                              {language === l.code && <Check className="w-3 h-3 text-sky-500" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Authenticated User Actions */}
                {user ? (
                  <div className="flex items-center space-x-1 sm:space-x-1.5">
                    {/* Notification Bell */}
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onNavigate('notifications')}
                      aria-label={`View notifications, ${unreadNotifications} unread`}
                      className="relative p-1.5 text-slate-500 dark:text-slate-400 hover:text-sky-500 transition-colors cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Bell className="w-4 h-4" />
                      {unreadNotifications > 0 && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                      )}
                    </motion.button>

                    {/* Dashboard Avatar Pill (Compact & Mature) */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onNavigate('dashboard')}
                      className="flex items-center space-x-1.5 py-0.5 pl-2 pr-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full border border-slate-200/50 dark:border-slate-700/50 transition-all cursor-pointer"
                      title="Open Patient Portal"
                    >
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 hidden sm:inline uppercase tracking-wider">
                        Portal
                      </span>
                      <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <UserIcon className="w-3 h-3 text-slate-400" />
                        )}
                      </div>
                    </motion.button>

                    {/* Desktop Logout Button */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={logout}
                      className="hidden md:flex p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer rounded-full"
                      aria-label="Sign out"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </motion.button>
                  </div>
                ) : (
                  /* Unauthenticated Actions (Fully Responsive & Proportional) */
                  <div className="flex items-center space-x-1 sm:space-x-1.5">
                    <button
                      onClick={() => onAuthOpen('signin')}
                      className="hidden sm:inline-flex text-slate-700 dark:text-slate-300 font-bold text-xs px-2.5 py-1.5 hover:text-sky-500 transition-colors cursor-pointer rounded-full"
                    >
                      Sign In
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onAuthOpen('signup')}
                      className="bg-sky-500 hover:bg-sky-600 text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1.5 rounded-full shadow-[0_4px_14px_rgba(14,165,233,0.3)] flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span className="hidden sm:inline">Enter </span>
                      <span>Dashboard</span>
                      <ArrowRight className="w-3 h-3 shrink-0" />
                    </motion.button>
                  </div>
                )}

                {/* Mobile Menu Hamburger (Compact) */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-1.5 text-slate-700 dark:text-slate-200 md:hidden rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                  aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={mobileMenuOpen}
                >
                  <div className="w-4 h-4 flex flex-col justify-center items-center gap-1">
                    <motion.span 
                      animate={mobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                      className="w-3.5 h-0.5 bg-current rounded-full transition-transform" 
                    />
                    <motion.span 
                      animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                      className="w-3.5 h-0.5 bg-current rounded-full transition-opacity" 
                    />
                    <motion.span 
                      animate={mobileMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                      className="w-3.5 h-0.5 bg-current rounded-full transition-transform" 
                    />
                  </div>
                </motion.button>

              </div>

            </div>
          </nav>

          {/* 
            MOBILE SILK DRAWER ACCORDION (SHORT, MATURE & COMPACT):
            Clean 2-column grid layout so the entire mobile card is short,
            compact, and easy to navigate without taking over the full screen!
          */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto md:hidden mt-1.5 rounded-3xl border border-sky-200/50 dark:border-sky-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl p-3.5 shadow-xl shadow-sky-500/10 space-y-3"
                role="dialog"
                aria-label="Mobile Navigation"
              >
                {/* Compact Top Bar: Language */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                    <Globe className="w-3.5 h-3.5 text-sky-500 shrink-0 mr-1" />
                    <div className="flex gap-1">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => setLanguage(l.code)}
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                            language === l.code 
                              ? 'bg-sky-500 text-white shadow-2xs' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2-Column Responsive Grid of All Sections (Short & Compact) */}
                <div className="grid grid-cols-2 gap-1.5">
                  {navItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={item.name}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        onClick={() => handleItemClick(item.view)}
                        className="flex items-center gap-2 p-2 rounded-2xl text-left bg-slate-50/80 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-slate-800 active:scale-98 transition-all cursor-pointer border border-slate-100/80 dark:border-slate-700/50"
                      >
                        <div className="w-7 h-7 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-sky-500 shrink-0 shadow-2xs">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {item.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Compact User / Auth Row */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  {user ? (
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => { setMobileMenuOpen(false); onNavigate('dashboard'); }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
                      >
                        <UserIcon className="w-3.5 h-3.5" />
                        <span>Open Portal</span>
                      </button>

                      <button
                        onClick={() => { setMobileMenuOpen(false); logout(); }}
                        className="p-2 text-rose-500 bg-rose-50 dark:bg-rose-950/40 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer"
                        title="Sign Out"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => { setMobileMenuOpen(false); onAuthOpen('signin'); }}
                        className="py-2 text-center text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        Sign In
                      </button>
                      
                      <button
                        onClick={() => { setMobileMenuOpen(false); onAuthOpen('signup'); }}
                        className="py-2 text-center text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Enter Dashboard</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </header>

      {/* Sleek, Compact Spacer */}
      <div className="h-14 sm:h-16" aria-hidden="true" />
    </>
  );
}

export default Navbar;
