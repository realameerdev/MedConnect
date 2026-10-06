import React from 'react';
import { 
  Activity, 
  Stethoscope, 
  Activity as Vitals, 
  Newspaper, 
  ShieldCheck, 
  AlertCircle, 
  CalendarCheck,
  Lock,
  ArrowRight,
  ShieldAlert,
  Dumbbell,
  Droplets,
  Heart,
  Brain
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { MedConnectLogo } from './MedConnectLogo';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  view: string;
}

const FEATURES: Feature[] = [
  {
    id: 'ai-doc',
    title: 'AI Symptom Checker',
    description: 'Describe symptoms naturally to receive immediate triage, clinical recommendations, and risk assessment.',
    icon: Brain,
    view: 'chat',
  },
  {
    id: 'doctors',
    title: 'Licensed Doctor Network',
    description: 'Connect with verified healthcare professionals for video consultations and personalized treatment plans.',
    icon: Stethoscope,
    view: 'doctors',
  },
  {
    id: 'vitals',
    title: 'Vital Biomarker Sync',
    description: 'Track daily biometric readings, heart rhythm, sleep patterns, and vital trends in one unified dashboard.',
    icon: Vitals,
    view: 'dashboard',
  },
  {
    id: 'reminders',
    title: 'Medication Management',
    description: 'Set dosage alerts, track prescription schedules, and receive browser notifications on schedule.',
    icon: CalendarCheck,
    view: 'dashboard',
  },
  {
    id: 'regional',
    title: 'Regional Health Hub',
    description: 'Access localized emergency contacts, blood donor matching, and verified medication validation.',
    icon: ShieldAlert,
    view: 'regional-hub',
  },
  {
    id: 'blog',
    title: 'Clinical Knowledge Library',
    description: 'Peer-reviewed medical insights, healthy longevity research, and healthcare intelligence updated daily.',
    icon: Newspaper,
    view: 'blog',
  },
  {
    id: 'emergency',
    title: 'Emergency Guidance',
    description: 'One-touch emergency dispatch assistance, nearby hospital locator with GPS routing, and first-aid protocols.',
    icon: AlertCircle,
    view: 'emergency',
  },
];

interface FeaturesSectionProps {
  onNavigate: (view: string) => void;
  onAuthOpen: (mode: 'signin' | 'signup') => void;
  onPatientProfileOpen?: () => void;
}

export function FeaturesSection({ onNavigate, onAuthOpen, onPatientProfileOpen }: FeaturesSectionProps) {
  const { user } = useAuth();

  const handleFeatureClick = (view: string, featureId: string) => {
    if (featureId === 'emergency') {
      onNavigate('emergency');
      return;
    }
    if (!user) {
      onAuthOpen('signin');
      return;
    }
    onNavigate(view);
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-sky-50/30 via-white to-sky-50/20 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 relative overflow-hidden overflow-x-clip max-w-full font-manrope transition-colors">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[500px] bg-sky-200/20 dark:bg-sky-900/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center space-x-2 bg-sky-50 dark:bg-sky-950/50 px-4 py-1.5 rounded-full border border-sky-100 dark:border-sky-900 text-sky-600 dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Lock className="w-3.5 h-3.5" />
            <span>Platform Capabilities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
            Clinical-Grade <br className="hidden sm:inline" />
            <span className="text-sky-500">Healthcare Infrastructure</span>
          </h2>

          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-normal max-w-2xl mx-auto leading-relaxed">
            MedConnect delivers a full spectrum of digital health tools engineered with medical precision, military-grade security, and intuitive design.
          </p>
        </div>

        {/* Feature Cards Grid - 3 spacious columns on desktop with generous gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-8 xl:gap-10">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.25rem] p-6 sm:p-8 border border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-800 shadow-[0_20px_50px_rgba(14,165,233,0.06)] hover:shadow-[0_25px_60px_rgba(14,165,233,0.12)] transition-all flex flex-col justify-between text-left relative overflow-hidden"
            >
              <div>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-50 dark:bg-slate-800 border border-sky-100 dark:border-slate-700 flex items-center justify-center mb-6 text-sky-500 group-hover:scale-105 transition-transform shadow-2xs">
                  <feature.icon className="w-6 h-6 text-sky-500" />
                </div>
                
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight mb-2.5 text-slate-900 dark:text-white leading-tight">
                  {feature.title}
                </h3>
                
                <p className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => handleFeatureClick(feature.view, feature.id)}
                  className="w-full py-3 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-sky-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-300 active:scale-[0.98]"
                >
                  {!user && feature.id !== 'emergency' ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign In to Access</span>
                    </>
                  ) : (
                    <>
                      <span>Launch Feature</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
          
          {/* Final Call to Action Card in Reference Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="group bg-gradient-to-tr from-sky-500 via-sky-600 to-indigo-600 rounded-[2rem] p-7 border border-sky-400 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl shadow-sky-500/30 text-white"
          >
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-5 border border-white/30 shadow-md">
                <MedConnectLogo size={36} variant="icon" />
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2 leading-tight">
                Start Your Health Journey
              </h3>
              <p className="text-white/80 text-xs font-medium mb-6">
                Join 12,000+ patients with 24/7 care.
              </p>
              <button 
                onClick={() => user ? onNavigate('dashboard') : onAuthOpen('signup')}
                className="w-full bg-white hover:bg-slate-50 text-sky-600 font-bold py-3 px-6 rounded-full text-xs shadow-lg uppercase tracking-wider transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
