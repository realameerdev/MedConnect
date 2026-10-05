import React, { useState } from 'react';
import { Shield, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import FooterInfoPanel, { FooterContentType } from './FooterInfoPanel';
import { MedConnectLogo } from './MedConnectLogo';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [activePanel, setActivePanel] = useState<FooterContentType | null>(null);

  const quickLinks: { label: string; type: FooterContentType }[] = [
    { label: t('footer_how_it_works'), type: 'how-it-works' },
    { label: t('footer_medical_network'), type: 'medical-network' },
    { label: t('footer_patient_portal'), type: 'patient-portal' },
    { label: t('footer_safety'), type: 'safety-protocols' },
    { label: t('footer_terms'), type: 'terms' },
    { label: t('footer_privacy'), type: 'privacy' },
    { label: t('footer_compliance'), type: 'compliance' },
  ];

  return (
    <>
      <footer className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 relative overflow-hidden font-manrope border-t border-slate-100 dark:border-slate-800/80 transition-colors w-full">
        
        {/* Clean Static Border Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-500/20 dark:via-sky-400/20 to-transparent pointer-events-none" />

        {/* Essential Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-8 sm:pb-10 relative z-10">
          
          {/* Main Essential Info Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 pb-8 sm:pb-10 border-b border-slate-100 dark:border-slate-800/80 text-left">
            
            {/* Brand Section: Logo + Name + 1-Line Description */}
            <div className="space-y-2 max-w-md">
              <div className="flex items-center space-x-2.5">
                <div className="text-slate-900 dark:text-white">
                  <MedConnectLogo size={28} variant="icon" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center leading-none">
                  <span>Med</span>
                  <span className="text-sky-500 font-extrabold ml-0.5">Connect</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 ml-1">
                  · Healthcare
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
                AI-powered symptom assessment, vital synchrony, and verified specialist care.
              </p>
            </div>

            {/* Essential Links */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm font-semibold">
              {quickLinks.map((link) => (
                <button
                  key={link.type}
                  onClick={() => setActivePanel(link.type)}
                  className="text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer py-1 text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>

          </div>

          {/* Minimal Bottom Bar: Copyright & Verified Trust Badges */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left text-xs text-slate-500 dark:text-slate-400">
            
            {/* Copyright */}
            <p>
              © {currentYear} MedConnect. All rights reserved.
            </p>

            {/* Quiet Essential Trust Badges */}
            <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>HIPAA Verified</span>
              </span>

              <span className="text-slate-300 dark:text-slate-700">·</span>

              <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <Shield className="w-3.5 h-3.5 text-sky-500" />
                <span>ISO 27001</span>
              </span>

              <span className="text-slate-300 dark:text-slate-700">·</span>

              <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>256-Bit SSL</span>
              </span>
            </div>

          </div>

        </div>
      </footer>

      {/* Interactive Detail Modal Panel */}
      <FooterInfoPanel 
        type={activePanel} 
        onClose={() => setActivePanel(null)} 
      />
    </>
  );
}
