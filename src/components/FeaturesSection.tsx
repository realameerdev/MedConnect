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
  Heart
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  view: string;
  color: string;
}

const FEATURES: Feature[] = [
  {
    id: 'symptom-checker',
    title: 'AI Symptom Scanner',
    description: 'Advanced diagnostic logic to identify potential health risks in seconds using the Gemini clinical engine.',
    icon: Stethoscope,
    view: 'chat',
    color: 'bg-blue-500'
  },
  {
    id: 'telehealth',
    title: 'Specialist Network',
    description: '24/7 direct access to world-class medical specialists for secure video and chat consultations.',
    icon: CalendarCheck,
    view: 'doctors',
    color: 'bg-primary-600'
  },
  {
    id: 'vitals',
    title: 'Real-time Vitals Sync',
    description: 'Automated tracking of steps, hydration, and cardiovascular data via integrated biometric sensors.',
    icon: Vitals,
    view: 'dashboard',
    color: 'bg-green-500'
  },
  {
    id: 'chronicle',
    title: 'Clinical Gazette',
    description: 'Daily health intelligence feed aggregated from the world’s leading medical journals and research papers.',
    icon: Newspaper,
    view: 'blog',
    color: 'bg-slate-900'
  },
  {
    id: 'passport',
    title: 'Medical Passport',
    description: 'Encrypted, HIPAA-compliant storage for your lifelong medical history, prescriptions, and lab results.',
    icon: ShieldCheck,
    view: 'home', // Trigger profile modal
    color: 'bg-purple-600'
  },
  {
    id: 'emergency',
    title: 'Emergency Protocol',
    description: 'Immediate step-by-step guidance and high-priority contact triggers for critical medical situations.',
    icon: ShieldAlert,
    view: 'emergency',
    color: 'bg-red-500'
  },
  {
    id: 'management',
    title: 'Smart Care Logic',
    description: 'AI-managed follow-ups, medication reminders, and automated care pathway coordination.',
    icon: Activity,
    view: 'appointments',
    color: 'bg-teal-500'
  }
];

interface FeaturesSectionProps {
  onNavigate: (page: string) => void;
  onAuthOpen: (mode: 'signin' | 'signup') => void;
  onPatientProfileOpen: () => void;
}

export function FeaturesSection({ onNavigate, onAuthOpen, onPatientProfileOpen }: FeaturesSectionProps) {
  const { user } = useAuth();

  const handleFeatureClick = (view: string, id: string) => {
    if (!user) {
      onAuthOpen('signup');
      return;
    }

    if (id === 'passport') {
      onPatientProfileOpen();
    } else {
      onNavigate(view);
    }
  };

  return (
    <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900 relative overflow-hidden transition-colors">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-primary-100/30 dark:bg-primary-900/10 rounded-full blur-[80px] md:blur-[120px] z-0 transition-colors" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-20 px-2 sm:px-0">
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-300 text-[10px] font-black tracking-[0.2em] mb-6 shadow-sm transition-colors">
            <Lock className="w-3 h-3" />
            <span>Platform capabilities</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black font-display text-slate-900 dark:text-white tracking-tighter italic leading-[0.9] mb-6 transition-colors">
            Clinical-grade <br className="hidden sm:block" />
            <span className="text-primary-600 not-italic">Infrastructure</span>
          </h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto px-4 sm:px-0 transition-colors">
            MedConnect provides a suite of advanced healthcare tools designed for modern medicine. 
            Sign up to unlock the full potential of your clinical workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                type: "spring",
                damping: 20,
                stiffness: 100,
                delay: index * 0.1
              }}
              className={`group bg-white dark:bg-slate-800 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 dark:border-slate-700 hover:border-primary-100 dark:hover:border-primary-900 transition-all hover:shadow-2xl hover:shadow-primary-600/5 dark:hover:shadow-primary-500/10 flex flex-col justify-between h-full relative overflow-hidden ${
                index === FEATURES.length - 1 ? 'lg:col-span-2 xl:col-span-1 bg-slate-900 dark:bg-slate-950 border-slate-800 dark:border-slate-800' : ''
              }`}
            >
              <div>
                <div className={`w-12 h-12 md:w-14 md:h-14 ${index === FEATURES.length - 1 ? 'bg-white/10 dark:bg-white/5' : 'bg-slate-50 dark:bg-slate-900'} rounded-2xl flex items-center justify-center mb-6 md:mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500`}>
                  <feature.icon className={`w-6 h-6 md:w-7 md:h-7 ${index === FEATURES.length - 1 ? 'text-white' : 'text-slate-900 dark:text-white'}`} />
                </div>
                
                <h3 className={`text-lg md:text-xl font-black tracking-tight mb-3 md:mb-4 leading-tight ${index === FEATURES.length - 1 ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {feature.title}
                </h3>
                
                <p className={`text-xs md:text-sm font-medium leading-relaxed mb-6 md:mb-8 ${index === FEATURES.length - 1 ? 'text-slate-400 dark:text-slate-500' : 'text-slate-500 dark:text-slate-400'}`}>
                  {feature.description}
                </p>
              </div>

              <div className="pt-2 md:pt-4 mt-auto">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFeatureClick(feature.view, feature.id)}
                  aria-label={`Launch ${feature.title}`}
                  className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn cursor-pointer ${
                    index === FEATURES.length - 1 
                      ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-xl shadow-primary-600/20' 
                      : 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-white/5'
                  }`}
                >
                  {!user && feature.id !== 'emergency' ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      Login to access
                    </>
                  ) : (
                    <>
                      Launch feature
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </div>

              {/* Decorative Subtle Icon */}
              <div className="absolute -bottom-6 -right-6 opacity-[0.03] dark:opacity-[0.02] group-hover:opacity-10 dark:group-hover:opacity-[0.05] transition-opacity">
                <feature.icon className={`w-24 h-24 md:w-32 md:h-32 ${index === FEATURES.length - 1 ? 'text-white' : 'text-slate-900 dark:text-white'}`} />
              </div>
            </motion.div>
          ))}
          
          {/* Final Call to Action Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group bg-primary-600 dark:bg-primary-700 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 border border-primary-500 dark:border-primary-600 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl shadow-primary-600/20 py-12 md:py-8 transition-colors"
          >
            <div className="relative z-10 w-full">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-5 md:mb-6 mx-auto border border-white/30">
                <ShieldCheck className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-3xl md:text-2xl font-black text-white italic tracking-tighter mb-3 md:mb-4 leading-none">
                Start your <br className="hidden md:block" /> journey
              </h3>
              <p className="text-white/80 text-[10px] md:text-xs font-bold tracking-widest mb-6 md:mb-8 uppercase">
                Join 12,000+ patients today
              </p>
              <button 
                onClick={() => user ? onNavigate('dashboard') : onAuthOpen('signup')}
                className="w-full sm:w-auto bg-white text-primary-600 dark:text-primary-700 px-8 py-4 rounded-xl text-[10px] md:text-xs font-black tracking-[0.2em] hover:bg-slate-50 transition-all shadow-xl uppercase active:scale-95"
              >
                {user ? 'View dashboard' : 'Open passport'}
              </button>
            </div>
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4 pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <Heart key={i} className="w-8 h-8 text-white" />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
