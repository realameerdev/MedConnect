import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Shield, Globe, Award, HelpCircle, FileText, Lock, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import FooterInfoPanel, { FooterContentType } from './FooterInfoPanel';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [activePanel, setActivePanel] = useState<FooterContentType | null>(null);

  const navLinks: { label: string; type: FooterContentType }[] = [
    { label: t('footer_how_it_works'), type: 'how-it-works' },
    { label: t('footer_medical_network'), type: 'medical-network' },
    { label: t('footer_patient_portal'), type: 'patient-portal' },
    { label: t('footer_safety'), type: 'safety-protocols' }
  ];

  const legalLinks: { label: string; type: FooterContentType; icon: any }[] = [
    { label: t('footer_terms'), type: 'terms', icon: FileText },
    { label: t('footer_privacy'), type: 'privacy', icon: Lock },
    { label: t('footer_ethics'), type: 'ethics', icon: Shield },
    { label: t('footer_compliance'), type: 'compliance', icon: Award }
  ];

  return (
    <>
      <footer className="bg-slate-900 pt-20 md:pt-24 pb-28 md:pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Decorative pulse in footer bg */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-8">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xl font-display font-black tracking-tighter italic">MedConnect</span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              {t('footer_desc')}
            </p>

            <div className="flex items-center space-x-4">
               <a href="mailto:contact@medconnect.clinic" className="flex items-center space-x-3 group bg-white/5 hover:bg-white/10 transition-colors p-3 rounded-2xl border border-white/5">
                 <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                   <Mail className="w-5 h-5 text-primary-400 group-hover:text-white" />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-slate-500 tracking-widest leading-none mb-1 uppercase">Brand email</p>
                   <p className="text-xs font-bold text-white tracking-tight">contact@medconnect.clinic</p>
                 </div>
               </a>
            </div>
          </div>

          <div>
             <h4 className="text-[10px] font-black text-slate-500 tracking-[0.3em] mb-8 uppercase">{t('footer_nav')}</h4>
             <ul className="space-y-4">
               {navLinks.map((link) => (
                 <li key={link.type}>
                   <button 
                     onClick={() => setActivePanel(link.type)}
                     className="flex items-center text-white/70 hover:text-white transition-colors cursor-pointer w-full text-left"
                   >
                     <span className="text-[11px] font-black tracking-widest uppercase">{link.label}</span>
                   </button>
                 </li>
               ))}
             </ul>
          </div>

          <div>
             <h4 className="text-[10px] font-black text-slate-500 tracking-[0.3em] mb-8 uppercase">{t('footer_legal')}</h4>
             <ul className="space-y-4">
               {legalLinks.map((link) => (
                 <li key={link.type}>
                   <button 
                     onClick={() => setActivePanel(link.type)}
                     className="flex items-center text-white/70 hover:text-white transition-colors cursor-pointer w-full text-left"
                   >
                     <span className="text-[11px] font-black tracking-widest uppercase">{link.label}</span>
                   </button>
                 </li>
               ))}
             </ul>
          </div>

          <div className="bg-white/5 rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
             <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
             <HelpCircle className="w-10 h-10 text-primary-500 mb-6" />
             <h4 className="text-[10px] font-black text-white tracking-[0.3em] mb-3 uppercase">{t('footer_support')}</h4>
             <p className="text-[10px] font-bold text-slate-400 leading-relaxed mb-6 uppercase tracking-tight">{t('footer_support_desc')}</p>
             <button className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-[10px] font-black tracking-widest transition-all shadow-lg shadow-primary-600/20 uppercase">
               {t('footer_ticket')}
             </button>
          </div>
        </div>

        <div className="pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2 md:space-y-0">
            <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase">
              © Medconnect {currentYear} {t('footer_rights')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-8">
            <span className="inline-flex items-center text-[10px] font-black text-green-500 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
              {t('footer_healthy')}
            </span>
            <span className="text-[10px] font-black text-slate-500 tracking-[0.3em]">
              v2.1.0-Institutional
            </span>
          </div>
        </div>
      </div>
    </footer>

    <FooterInfoPanel 
      type={activePanel} 
      onClose={() => setActivePanel(null)} 
    />
    </>
  );
}
