import React, { useState } from 'react';
import { ArrowRight, Phone, ChevronLeft, MoreVertical, Heart, Activity, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface HeroProps {
  onNavigate: (page: string) => void;
  onAuthOpen: (mode: 'signin' | 'signup') => void;
}

type OrganKey = 'brain' | 'thyroid' | 'stomach' | 'heart' | 'lungs' | 'kidneys' | 'liver';

interface OrganInfo {
  id: OrganKey;
  name: string;
  icon: string;
  vitals: string;
  commonSymptoms: string[];
}

export function Hero({ onNavigate, onAuthOpen }: HeroProps) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedOrgan, setSelectedOrgan] = useState<OrganKey>('heart');
  const [showOrganModal, setShowOrganModal] = useState(false);

  const handleDashboardClick = () => {
    if (user) {
      onNavigate('dashboard');
    } else {
      onAuthOpen('signup');
    }
  };

  const organs: Record<OrganKey, OrganInfo> = {
    heart: {
      id: 'heart',
      name: 'Heart',
      icon: '🫀',
      vitals: '72 BPM · Optimal Rhythm',
      commonSymptoms: ['Palpitations', 'Chest Tightness', 'Fatigue', 'Shortness of Breath'],
    },
    brain: {
      id: 'brain',
      name: 'Brain',
      icon: '🧠',
      vitals: 'Alpha Wave Synchrony',
      commonSymptoms: ['Migraine', 'Brain Fog', 'Dizziness', 'Sleep Disruption'],
    },
    thyroid: {
      id: 'thyroid',
      name: 'Thyroid',
      icon: '🦋',
      vitals: 'TSH Balanced',
      commonSymptoms: ['Temperature Sensitivity', 'Fatigue', 'Metabolic Changes'],
    },
    stomach: {
      id: 'stomach',
      name: 'Stomach',
      icon: '🫄',
      vitals: 'Digestive Motility Good',
      commonSymptoms: ['Acid Reflux', 'Bloating', 'Nausea', 'Abdominal Cramping'],
    },
    lungs: {
      id: 'lungs',
      name: 'Lungs',
      icon: '🫁',
      vitals: '99% SpO2 · Clear Airways',
      commonSymptoms: ['Persistent Cough', 'Wheezing', 'Shallow Breathing'],
    },
    kidneys: {
      id: 'kidneys',
      name: 'Kidneys',
      icon: '🫘',
      vitals: 'eGFR > 90 · Hydrated',
      commonSymptoms: ['Lower Flank Pain', 'Fluid Retention', 'Fatigue'],
    },
    liver: {
      id: 'liver',
      name: 'Liver',
      icon: '🥩',
      vitals: 'ALT/AST In-Range',
      commonSymptoms: ['Jaundice', 'Nausea', 'Upper Right Discomfort'],
    },
  };

  const handleOrganClick = (organ: OrganKey) => {
    setSelectedOrgan(organ);
    setShowOrganModal(true);
  };

  return (
    <div className="relative overflow-hidden overflow-x-clip max-w-full bg-gradient-to-b from-white via-sky-50/40 to-sky-100/70 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-900 pt-8 sm:pt-12 pb-0 font-manrope transition-colors">
      
      {/* Background Soft Sky Blue Radial Glow matching reference */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] md:h-[700px] pointer-events-none opacity-80 dark:opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 50% 90%, rgba(56, 189, 248, 0.45) 0%, rgba(14, 165, 233, 0.25) 35%, rgba(255, 255, 255, 0) 70%)'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        
        {/* Top Announcement Pill matching reference */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-sky-100 dark:border-sky-900/60 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md shadow-sm mb-6 sm:mb-8"
        >
          <span className="text-sky-500 font-bold text-xs">
            New
          </span>
          <span className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium">
            AI-Powered Health Companion
          </span>
        </motion.div>

        {/* Main Headline matching reference */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="text-sky-500 font-bold">AI Health Powered</span>{' '}
            <span className="text-slate-500 dark:text-slate-400 font-medium">by MedConnect</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 sm:mt-2 leading-[1.08]">
            Understand <span className="font-extrabold text-slate-900 dark:text-white">Symptoms</span>
          </h1>
        </motion.div>

        {/* Subtitle matching reference */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-sm sm:text-base md:text-lg font-normal leading-relaxed mt-5 sm:mt-6 px-2"
        >
          Get personalized health insights with AI-powered symptom assessment, vital tracking, medication management, and smart guidance.
        </motion.p>

        {/* Action Buttons matching reference */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mt-7 sm:mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDashboardClick}
            className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-[0_12px_28px_rgba(14,165,233,0.45)] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Enter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('chat')}
            className="w-full sm:w-auto bg-white/90 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Try AI Doctor</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </motion.button>
        </motion.div>

        {/* 
          =======================================================
          THE REFERENCE VISUAL STAGE:
          Left Floating Vitals Card + Center Smartphone + Right Floating Emergency Card
          =======================================================
        */}
        <div className="relative mt-12 sm:mt-16 md:mt-20 lg:mt-24 flex items-end justify-center w-full max-w-7xl mx-auto min-h-[500px] md:min-h-[580px] lg:min-h-[660px] px-2 sm:px-4">
          
          {/* LEFT FLOATING GLASS CARD: Vitals (Heart Rate + Sleep) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden md:flex absolute left-2 lg:left-6 xl:left-10 bottom-24 lg:bottom-32 xl:bottom-36 z-20 backdrop-blur-2xl bg-white/85 dark:bg-slate-900/85 border border-white/95 dark:border-slate-800 shadow-[0_20px_50px_rgba(14,165,233,0.12)] rounded-[2rem] p-4.5 lg:p-6 items-center gap-5 lg:gap-6 text-left"
          >
            {/* Metric 1: Heart Rate */}
            <div className="flex items-center gap-3.5 lg:gap-4">
              <div>
                <p className="text-[10px] lg:text-[11px] font-bold uppercase tracking-wider text-slate-400">Heart Rate</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">72</span>
                  <span className="text-[10px] lg:text-[11px] font-bold text-slate-400 uppercase">BMP</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Goal: 60-100 BMP</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">Optimal</span>
                </div>
              </div>

              {/* 3D Anatomical Heart Vector */}
              <div className="w-11 h-11 lg:w-14 lg:h-14 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  <defs>
                    <linearGradient id="heartAorta" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                    <linearGradient id="heartMuscle" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#dc2626" />
                      <stop offset="100%" stopColor="#991b1b" />
                    </linearGradient>
                  </defs>
                  {/* Superior Vena Cava / Aorta Arches */}
                  <path d="M 42 16 C 42 10, 56 10, 58 18 L 58 32 L 42 32 Z" fill="url(#heartAorta)" />
                  <path d="M 52 14 C 52 8, 68 8, 70 20 L 70 34 L 54 34 Z" fill="url(#heartMuscle)" />
                  {/* Left & Right Atrium/Ventricle anatomical contours */}
                  <path d="M 30 36 C 18 36, 16 52, 24 68 C 32 82, 48 94, 52 96 C 56 94, 76 82, 82 66 C 88 50, 80 36, 68 36 C 60 36, 54 42, 50 46 C 46 42, 40 36, 30 36 Z" fill="url(#heartMuscle)" />
                  {/* Coronary artery highlights */}
                  <path d="M 48 42 Q 54 58 46 76" stroke="#fca5a5" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
                  <path d="M 46 54 Q 60 62 66 70" stroke="#fca5a5" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
                </svg>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="w-px h-12 lg:h-14 bg-slate-200/80 dark:bg-slate-700/80" />

            {/* Metric 2: Sleep */}
            <div className="flex items-center gap-3.5 lg:gap-4">
              <div>
                <p className="text-[10px] lg:text-[11px] font-bold uppercase tracking-wider text-slate-400">Sleep</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">7h 45m</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Goal: 7-9 hrs</span>
                  <span className="text-[10px] font-bold text-sky-500 bg-sky-50 dark:bg-sky-950/50 px-1.5 py-0.5 rounded">Normal</span>
                </div>
              </div>

              {/* 3D Sleeping Character Illustration */}
              <div className="w-11 h-11 lg:w-14 lg:h-14 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                  <defs>
                    <linearGradient id="sleepCap" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                    <linearGradient id="faceGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  {/* Sleeping Head */}
                  <circle cx="50" cy="56" r="30" fill="url(#faceGrad)" />
                  {/* Nightcap / Beanie */}
                  <path d="M 22 48 Q 50 20 78 48 Q 92 28 88 18 Q 84 10 74 14 Q 50 14 22 48 Z" fill="url(#sleepCap)" />
                  <circle cx="88" cy="18" r="6" fill="#ffffff" />
                  {/* Closed Sleeping Eyes */}
                  <path d="M 38 56 Q 44 62 48 56" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  <path d="M 56 56 Q 62 62 66 56" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  {/* Soft Rosy Cheeks */}
                  <circle cx="34" cy="64" r="4" fill="#f87171" opacity="0.6" />
                  <circle cx="68" cy="64" r="4" fill="#f87171" opacity="0.6" />
                  {/* Peaceful Sleep Smile */}
                  <path d="M 48 68 Q 52 72 56 68" stroke="#78350f" strokeWidth="2" fill="none" strokeLinecap="round" />
                  {/* Floating Zzz */}
                  <text x="76" y="38" fill="#38bdf8" fontSize="14" fontWeight="bold">z</text>
                  <text x="86" y="26" fill="#0284c7" fontSize="18" fontWeight="bold">Z</text>
                </svg>
              </div>
            </div>
          </motion.div>

          {/* RIGHT FLOATING GLASS CARD: Emergency Call */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden md:flex absolute right-2 lg:right-6 xl:right-10 bottom-32 lg:bottom-44 xl:bottom-48 z-20 backdrop-blur-2xl bg-white/85 dark:bg-slate-900/85 border border-white/95 dark:border-slate-800 shadow-[0_20px_50px_rgba(14,165,233,0.12)] rounded-full py-3 px-4.5 lg:py-4 lg:px-6 items-center gap-3.5 lg:gap-4 text-left"
          >
            {/* Cute 3D AI Robot Doctor Avatar */}
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-tr from-sky-400 via-sky-500 to-indigo-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-7 h-7 lg:w-8 lg:h-8">
                  {/* Robot Head */}
                  <rect x="22" y="24" width="56" height="48" rx="20" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="3" />
                  {/* Visor Screen */}
                  <rect x="28" y="34" width="44" height="26" rx="10" fill="#0f172a" />
                  {/* Visor Cyan Glowing Eyes */}
                  <circle cx="40" cy="46" r="4.5" fill="#38bdf8" />
                  <circle cx="60" cy="46" r="4.5" fill="#38bdf8" />
                  {/* Antennas */}
                  <path d="M 50 14 L 50 24" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="50" cy="12" r="3.5" fill="#38bdf8" />
                  {/* Cute Medical Cross on Robot Forehead */}
                  <path d="M 50 26 L 50 32 M 47 29 L 53 29" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Text details */}
            <div className="pr-1">
              <h4 className="text-xs lg:text-base font-bold text-slate-900 dark:text-white leading-tight">Emergency Call</h4>
              <p className="text-[10px] lg:text-xs text-slate-400 mt-0.5">Call now for urgent medical help</p>
            </div>

            {/* Call Action Button */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onNavigate('emergency')}
              className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white flex items-center justify-center shadow-md cursor-pointer transition-all shrink-0 ml-1"
              aria-label="Call Emergency Services"
            >
              <Phone className="w-3.5 h-3.5 lg:w-4 lg:h-4 fill-white" />
            </motion.button>
          </motion.div>

          {/* 
            CENTER SMARTPHONE MOCKUP 
            Rising up from the bottom with authentic hands & interactive organ screen 
          */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, type: "spring", damping: 20 }}
            className="relative z-10 w-[260px] xs:w-[290px] sm:w-[320px] md:w-[340px] lg:w-[370px] xl:w-[390px] mx-auto select-none"
          >
            {/* Realistic Hands holding phone from below and edges - hidden on ultra-compact <340px screens to prevent overlap */}
            <div className="hidden xs:block absolute inset-0 -bottom-16 pointer-events-none z-30">
              {/* Left Thumb / Palm Edge */}
              <div 
                className="absolute -left-6 sm:-left-9 bottom-12 sm:bottom-16 w-14 sm:w-20 h-40 sm:h-52 rounded-[2rem] bg-gradient-to-tr from-[#c89278] via-[#e5b299] to-[#f4cfbc] shadow-xl rotate-[14deg] opacity-95 border-r border-[#d49e85]"
                style={{
                  filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.25))'
                }}
              />
              {/* Right Fingers Wrapping Edge */}
              <div 
                className="absolute -right-5 sm:-right-8 bottom-16 sm:bottom-20 w-12 sm:w-18 h-44 sm:h-56 rounded-[2rem] bg-gradient-to-tl from-[#bf8970] via-[#e2ad95] to-[#f2cbba] shadow-xl -rotate-[12deg] opacity-95 border-l border-[#d49e85]"
                style={{
                  filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.25))'
                }}
              />
            </div>

            {/* iPhone Titanium Device Chassis */}
            <div className="relative rounded-[44px] md:rounded-[48px] p-2.5 sm:p-3 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 shadow-[0_30px_90px_rgba(0,0,0,0.35),0_10px_30px_rgba(14,165,233,0.3)] border-2 border-slate-600/80">
              
              {/* Screen Bezel */}
              <div className="relative rounded-[36px] md:rounded-[40px] overflow-hidden bg-gradient-to-b from-[#38bdf8] via-[#0ea5e9] to-[#0284c7] aspect-[9/18.5] flex flex-col text-white shadow-inner">
                
                {/* Dynamic Island / Status Bar */}
                <div className="pt-2.5 px-6 flex items-center justify-between z-20">
                  <span className="text-[11px] font-bold tracking-tight text-white/95">9:41</span>
                  
                  {/* Dynamic Island Pill */}
                  <div className="w-20 h-5 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0369a1]" />
                  </div>

                  {/* Cellular / Wifi / Battery */}
                  <div className="flex items-center gap-1.5 text-white/95 text-[10px]">
                    <span className="font-bold text-[9px]">5G</span>
                    <div className="w-4 h-2.5 border border-white rounded-sm p-0.5 flex items-center">
                      <div className="w-2.5 h-1.5 bg-white rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* Inside App Header: ← AI Doctor   📞 ⋮ */}
                <div className="px-4 pt-3 pb-2 flex items-center justify-between text-white z-20">
                  <button 
                    onClick={() => onNavigate('home')} 
                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <span className="text-sm font-bold tracking-wide">AI Doctor</span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => onNavigate('emergency')}
                      className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Emergency"
                    >
                      <Phone className="w-4 h-4 text-white fill-white" />
                    </button>
                    <button 
                      onClick={() => onNavigate('doctors')}
                      className="p-1 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Menu"
                    >
                      <MoreVertical className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* 
                  Interactive Anatomical Organ Selector 
                  Exact arched layout matching reference:
                  Row 1: Brain, Thyroid
                  Row 2: Stomach, Heart (Active white pill), Lungs
                  Row 3: Kidneys, Liver
                */}
                <div className="px-3 pt-2 z-20 space-y-2">
                  {/* Row 1 */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleOrganClick('brain')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer ${
                        selectedOrgan === 'brain'
                          ? 'bg-white text-slate-900 shadow-md scale-105'
                          : 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
                      }`}
                    >
                      <span className="text-xs">🧠</span>
                      <span>Brain</span>
                    </button>

                    <button
                      onClick={() => handleOrganClick('thyroid')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer ${
                        selectedOrgan === 'thyroid'
                          ? 'bg-white text-slate-900 shadow-md scale-105'
                          : 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
                      }`}
                    >
                      <span className="text-xs">🦋</span>
                      <span>Thyroid</span>
                    </button>
                  </div>

                  {/* Row 2 */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleOrganClick('stomach')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer ${
                        selectedOrgan === 'stomach'
                          ? 'bg-white text-slate-900 shadow-md scale-105'
                          : 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
                      }`}
                    >
                      <span className="text-xs">🫄</span>
                      <span>Stomach</span>
                    </button>

                    {/* Heart (Default Active Highlighted Pill in Reference) */}
                    <button
                      onClick={() => handleOrganClick('heart')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg ${
                        selectedOrgan === 'heart'
                          ? 'bg-white text-slate-900 scale-105'
                          : 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
                      }`}
                    >
                      <span className="text-red-500 text-sm">🫀</span>
                      <span>Heart</span>
                    </button>

                    <button
                      onClick={() => handleOrganClick('lungs')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer ${
                        selectedOrgan === 'lungs'
                          ? 'bg-white text-slate-900 shadow-md scale-105'
                          : 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
                      }`}
                    >
                      <span className="text-xs">🫁</span>
                      <span>Lungs</span>
                    </button>
                  </div>

                  {/* Row 3 */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleOrganClick('kidneys')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer ${
                        selectedOrgan === 'kidneys'
                          ? 'bg-white text-slate-900 shadow-md scale-105'
                          : 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
                      }`}
                    >
                      <span className="text-xs">🫘</span>
                      <span>Kidneys</span>
                    </button>

                    <button
                      onClick={() => handleOrganClick('liver')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer ${
                        selectedOrgan === 'liver'
                          ? 'bg-white text-slate-900 shadow-md scale-105'
                          : 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
                      }`}
                    >
                      <span className="text-xs">🥩</span>
                      <span>Liver</span>
                    </button>
                  </div>
                </div>

                {/* 
                  Center 3D Holographic Iridescent Energy Orb 
                  Exact swirling iridescent cyan, turquoise & magenta sphere from reference!
                */}
                <div className="relative flex-1 flex flex-col items-center justify-center my-4 overflow-hidden">
                  
                  {/* Concentric Ambient Light Pulse Rings */}
                  <div className="absolute w-44 h-44 rounded-full bg-cyan-300/20 blur-2xl animate-pulse" />
                  <div className="absolute w-60 h-60 rounded-full border border-white/15 animate-ping [animation-duration:4s]" />
                  <div className="absolute w-72 h-72 rounded-full border border-white/10" />

                  {/* The 3D Iridescent Holographic Orb Container */}
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    onClick={() => onNavigate('chat')}
                    className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full cursor-pointer flex items-center justify-center"
                    title="Click to check symptoms with AI Doctor"
                  >
                    {/* Glowing outer aura */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-300 to-pink-400 opacity-70 blur-md" />

                    {/* Sphere Surface with 3D Shader Highlights */}
                    <div 
                      className="relative w-full h-full rounded-full overflow-hidden shadow-[inset_-10px_-15px_30px_rgba(0,0,0,0.35),0_10px_35px_rgba(6,182,212,0.5)] border border-white/40"
                      style={{
                        background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(103, 232, 249, 0.8) 25%, rgba(14, 165, 233, 0.7) 45%, rgba(168, 85, 247, 0.8) 75%, rgba(15, 23, 42, 0.9) 100%)',
                      }}
                    >
                      {/* Internal fluid light swirls */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 opacity-80 mix-blend-screen"
                        style={{
                          background: 'conic-gradient(from 0deg at 50% 50%, #38bdf8 0deg, #ec4899 90deg, #a855f7 180deg, #06b6d4 270deg, #38bdf8 360deg)',
                          filter: 'blur(10px)',
                        }}
                      />

                      {/* Glossy Glass Spherical Specular Glare */}
                      <div 
                        className="absolute top-2 left-4 w-16 h-10 rounded-full bg-white/70 blur-[1px] rotate-[-25deg] pointer-events-none"
                      />
                      <div 
                        className="absolute bottom-3 right-5 w-8 h-4 rounded-full bg-cyan-200/50 blur-[2px] pointer-events-none"
                      />
                    </div>
                  </motion.div>

                  {/* Live diagnostic caption under orb inside phone */}
                  <motion.div 
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-3 text-center z-10"
                  >
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/80">
                      Tap Orb to Scan Symptoms
                    </p>
                    <p className="text-[11px] font-extrabold text-white mt-0.5">
                      {organs[selectedOrgan].name}: {organs[selectedOrgan].vitals}
                    </p>
                  </motion.div>
                </div>

                {/* Bottom Home Indicator Bar */}
                <div className="pb-2 pt-1 flex justify-center z-20">
                  <div className="w-28 h-1 bg-white/60 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Interactive Organ Symptom Modal Preview */}
      <AnimatePresence>
        {showOrganModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-left font-manrope"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{organs[selectedOrgan].icon}</span>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {organs[selectedOrgan].name} Health
                    </h3>
                    <p className="text-xs text-sky-500 font-semibold">{organs[selectedOrgan].vitals}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOrganModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 my-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Common Symptoms to Assess</h4>
                  <div className="flex flex-wrap gap-2">
                    {organs[selectedOrgan].commonSymptoms.map((symp) => (
                      <span 
                        key={symp} 
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-900"
                      >
                        {symp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>MedConnect Clinical Triage Ready</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Our AI assistant cross-references 12,000+ clinical protocols with your personal vital history.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowOrganModal(false); onNavigate('chat'); }}
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start AI Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setShowOrganModal(false); onNavigate('doctors'); }}
                  className="px-5 py-3 rounded-full text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Find Specialists
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Subtle Bottom Fade to Next Content Section */}
      <div className="w-full h-12 bg-gradient-to-b from-transparent to-white dark:to-slate-900 pointer-events-none" />
    </div>
  );
}

export default Hero;
