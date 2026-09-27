import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';
import { 
  Activity, 
  Droplets, 
  Footprints, 
  Dumbbell, 
  Heart, 
  Calendar as CalendarIcon, 
  Plus, 
  ShieldCheck, 
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Trophy,
  Zap,
  Settings,
  Bell,
  X,
  Sparkles,
  AlertCircle,
  Home,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DailyStats {
  steps: number;
  stepsGoal: number;
  water: number;
  waterGoal: number; // glasses or ml
  exercise: number; // minutes
  exerciseGoal: number;
  bp_sys: number; // Systolic
  bp_dia: number; // Diastolic
  notifiedGoals?: string[];
}

const DEFAULT_STATS: DailyStats = {
  steps: 0,
  stepsGoal: 10000,
  water: 0,
  waterGoal: 8,
  exercise: 0,
  exerciseGoal: 30,
  bp_sys: 120,
  bp_dia: 80,
  notifiedGoals: []
};

import { useLanguage } from '../contexts/LanguageContext';

export function PatientDashboard({ 
  onBack, 
  onNotificationAdd,
  onActionClick
}: { 
  onBack: () => void; 
  onNotificationAdd?: (title: string, message: string, type?: 'success' | 'info' | 'alert') => void;
  onActionClick?: (action: string) => void;
}) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<DailyStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [editingGoal, setEditingGoal] = useState<'steps' | 'water' | 'exercise' | null>(null);
  const [localSteps, setLocalSteps] = useState<number | null>(null);
  const dateStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!user) return;

    const statsRef = doc(db, 'users', user.uid, 'daily_stats', dateStr);
    
    const unsubscribe = onSnapshot(statsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as DailyStats;
        setStats(prev => ({ ...prev, ...data }));
        if (localSteps === null) {
          setLocalSteps(data.steps);
        }
        const checkGoal = async (current: number, goal: number, type: string) => {
          if (current >= goal && (!data.notifiedGoals || !data.notifiedGoals.includes(type))) {
            triggerGoalNotification(type, goal);
          }
        };
        checkGoal(data.steps, data.stepsGoal, 'steps');
        checkGoal(data.water, data.waterGoal, 'water');
        checkGoal(data.exercise, data.exerciseGoal, 'exercise');
      } else {
        setDoc(statsRef, DEFAULT_STATS).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, statsRef.path);
        });
        setStats(DEFAULT_STATS);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, statsRef.path);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, dateStr]);

  useEffect(() => {
    if (localSteps === null || !user) return;
    const timeout = setTimeout(() => {
      if (localSteps !== stats.steps) {
        updateStat('steps', localSteps);
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [localSteps, user]);

  const triggerGoalNotification = async (type: string, value: number) => {
    if (!user) return;
    const title = "Goal Achieved! 🎉";
    const message = `Incredible work! You've successfully reached your ${type} goal of ${value} units today.`;
    if (onNotificationAdd) onNotificationAdd(title, message, 'success');
    const statsRef = doc(db, 'users', user.uid, 'daily_stats', dateStr);
    const notified = stats.notifiedGoals || [];
    if (!notified.includes(type)) {
      await setDoc(statsRef, { notifiedGoals: [...notified, type] }, { merge: true });
    }
    try {
      fetch('/api/notify-goal-reached', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName || 'Patient',
          goalType: type,
          value: value
        })
      });
    } catch (e) {
      console.error("Email notification failed", e);
    }
  };

  useEffect(() => {
    if (!isTracking || !user) return;
    let lastStepTime = 0;
    const threshold = 13.5;
    const cooldown = 350;
    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;
      const x = acc.x || 0;
      const y = acc.y || 0;
      const z = acc.z || 0;
      const magnitude = Math.sqrt(x*x + y*y + z*z);
      const now = Date.now();
      if (magnitude > threshold && now - lastStepTime > cooldown) {
        lastStepTime = now;
        setLocalSteps(prev => (prev || 0) + 1);
      }
    };
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') window.addEventListener('devicemotion', handleMotion);
        })
        .catch(console.error);
    } else {
      window.addEventListener('devicemotion', handleMotion);
    }
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isTracking, user]);

  const updateStat = async (key: keyof DailyStats, value: number) => {
    if (!user) return;
    const statsRef = doc(db, 'users', user.uid, 'daily_stats', dateStr);
    try {
      await setDoc(statsRef, { ...stats, [key]: value }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, statsRef.path);
    }
  };

  const incrementStat = (key: keyof DailyStats, amount: number) => {
    const currentValue = stats[key] as number;
    updateStat(key, currentValue + amount);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="text-slate-400 font-bold tracking-widest text-xs uppercase px-4 text-center">{t('loading')}</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12 space-y-8"
    >
      {/* Quick Launch Action Bar */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 mb-8">
        <div className="bg-primary-600 rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-primary-600/20">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10">
            <div className="w-full lg:w-auto text-left">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black tracking-widest mb-4 border border-white/20">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('dash_authorized_suite')}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tighter italic leading-none mb-4 break-words">
                {t('dash_instant_diag')}
              </h2>
              <p className="text-primary-100 font-medium opacity-90 text-[13px] sm:text-sm max-w-md">
                {t('dash_diag_desc')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto sm:grid-cols-3 lg:grid-cols-5 lg:shrink-0">
              {[
                { id: 'regional-hub', icon: Globe, label: t('nav_regional_hub'), color: 'bg-emerald-500/80 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 border border-emerald-400' },
                { id: 'chat', icon: Sparkles, label: t('nav_consult_ai'), color: 'bg-white/10 hover:bg-white/20 border border-white/10' },
                { id: 'doctors', icon: CalendarIcon, label: t('dash_specialists'), color: 'bg-white/10 hover:bg-white/20 border border-white/10' },
                { id: 'emergency', icon: AlertCircle, label: t('emergency'), color: 'bg-red-500/80 hover:bg-red-500 text-white shadow-xl shadow-red-500/30 border border-red-400' },
                { id: 'appointments', icon: Clock, label: t('dash_schedule'), color: 'bg-white/5 hover:bg-white/10 border border-white/10' }
              ].map((action) => (
                <button 
                  key={action.id}
                  onClick={() => onActionClick?.(action.id)}
                  className={`flex flex-col items-center justify-center aspect-square w-full rounded-2xl md:rounded-3xl transition-all active:scale-95 group p-2 ${action.color}`}
                >
                  <action.icon className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 transition-transform group-hover:scale-110" />
                  <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-center uppercase break-words px-1">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 p-20 opacity-10 -mr-20 -mt-20 pointer-events-none">
            <ShieldCheck className="w-80 h-80" />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-6 font-bold tracking-widest text-[10px] uppercase"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('dash_medical_portal')}
          </button>
          <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] mb-4 border border-slate-200 uppercase">
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>{t('dash_last_sync')}: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-display text-slate-900 tracking-tighter leading-[0.8] mb-4 italic">
            {t('dash_health_overview')} <br />
            <span className="text-primary-600 not-italic">{t('hero_stat_secure')}.</span>
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed max-w-xl">
            {t('dash_insights_desc')}
          </p>
        </div>
        
        <div className="flex flex-row items-center w-full md:w-auto space-x-2 bg-white p-2 md:p-3 border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 md:flex-none px-4 md:px-6 py-3 bg-primary-600 rounded-2xl text-center text-white shadow-lg shadow-primary-600/20"
          >
            <p className="text-[10px] font-black tracking-widest mb-1 opacity-70 uppercase whitespace-nowrap">{t('dash_wellness_score')}</p>
            <p className="text-xl md:text-2xl font-black font-mono tracking-tighter">88<span className="text-[10px] md:text-xs opacity-60">/100</span></p>
          </motion.div>
          <div className="flex-1 md:flex-none px-4 md:px-6 py-3 bg-slate-50 rounded-2xl text-center">
            <p className="text-[10px] font-black text-slate-400 tracking-widest mb-1 uppercase">Status</p>
            <p className="text-sm font-black text-green-500 uppercase tracking-tighter">Optimized</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 sm:mb-20">
        {/* Blood Pressure Card */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 shadow-xl shadow-slate-900/5 flex flex-col justify-between overflow-hidden relative group"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 -mr-10 -mt-10 group-hover:scale-110 transition-transform pointer-events-none">
            <Heart className="w-40 h-40 md:w-48 md:h-48 text-primary-600" />
          </div>
          <div className="relative z-10 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-[10px] sm:text-[11px] font-black text-slate-400 tracking-widest uppercase">{t('v_blood_pressure')}</h3>
                  <p className="text-lg sm:text-xl font-black text-slate-900">{t('v_cardio')}</p>
                </div>
              </div>
              <div className="bg-red-50 px-3 py-1.5 rounded-full text-[9px] font-black text-red-600 tracking-widest uppercase">Live tracking</div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between sm:space-x-12 mb-8 sm:mb-10 w-full gap-6 sm:gap-0 font-display">
              <div className="flex flex-col items-center sm:items-start text-center">
                <span className="text-5xl sm:text-6xl font-black font-mono text-slate-900 tracking-tighter leading-none">{stats.bp_sys}</span>
                <span className="text-[9px] font-bold text-slate-400 tracking-widest mt-2 uppercase">{t('v_systolic')} (mmHg)</span>
              </div>
              <div className="hidden sm:block text-4xl font-black text-slate-200">/</div>
              <div className="flex flex-col items-center sm:items-start text-center">
                <span className="text-5xl sm:text-6xl font-black font-mono text-slate-900 tracking-tighter leading-none">{stats.bp_dia}</span>
                <span className="text-[9px] font-bold text-slate-400 tracking-widest mt-2 uppercase">{t('v_diastolic')} (mmHg)</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 flex flex-col space-y-3">
              <span className="text-[10px] font-black text-slate-400 tracking-widest text-center sm:text-left">{t('save')} systolic</span>
              <div className="flex items-center justify-between gap-4">
                <button onClick={() => updateStat('bp_sys', stats.bp_sys - 1)} className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center active:bg-slate-100 active:scale-95 text-slate-400 font-bold text-lg transition-transform shadow-sm">-</button>
                <button onClick={() => updateStat('bp_sys', stats.bp_sys + 1)} className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center active:bg-slate-100 active:scale-95 text-slate-400 font-bold text-lg transition-transform shadow-sm">+</button>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 flex flex-col space-y-3">
              <span className="text-[10px] font-black text-slate-400 tracking-widest text-center sm:text-left">{t('save')} diastolic</span>
              <div className="flex items-center justify-between gap-4">
                <button onClick={() => updateStat('bp_dia', stats.bp_dia - 1)} className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center active:bg-slate-100 active:scale-95 text-slate-400 font-bold text-lg transition-transform shadow-sm">-</button>
                <button onClick={() => updateStat('bp_dia', stats.bp_dia + 1)} className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center active:bg-slate-100 active:scale-95 text-slate-400 font-bold text-lg transition-transform shadow-sm">+</button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Steps Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-900/5 flex flex-col justify-between transition-colors"
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shrink-0">
              <Footprints className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[10px] sm:text-[11px] font-black text-slate-400 tracking-widest uppercase">{t('v_activity')}</h3>
              <p className="text-lg sm:text-xl font-black text-slate-900">{t('v_movement')}</p>
            </div>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                <circle 
                  cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 * (1 - Math.min((localSteps ?? stats.steps) / stats.stepsGoal, 1))} 
                  className={`transition-all duration-1000 ease-out ${ (localSteps ?? stats.steps) >= stats.stepsGoal ? 'text-green-500' : 'text-primary-600'}`}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-2xl sm:text-3xl font-black tracking-tighter transition-colors ${(localSteps ?? stats.steps) >= stats.stepsGoal ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>
                  {(localSteps ?? stats.steps) >= 1000 ? `${((localSteps ?? stats.steps)/1000).toFixed(1)}k` : (localSteps ?? stats.steps)}
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 tracking-widest mt-1 uppercase">{t('v_steps')}</span>
              </div>
            </div>
            <div className="flex items-center w-full justify-center">
               {editingGoal === 'steps' ? (
                 <input 
                   type="number" 
                   autoFocus
                   className="w-24 bg-slate-50 border-2 border-primary-200 rounded-xl px-3 py-2 text-xs font-black text-center focus:outline-none focus:border-primary-500 transition-colors"
                   defaultValue={stats.stepsGoal}
                   onBlur={(e) => {
                     updateStat('stepsGoal', parseInt(e.target.value) || 10000);
                     setEditingGoal(null);
                   }}
                 />
               ) : (
                 <button onClick={() => setEditingGoal('steps')} className="flex items-center text-[10px] font-black text-slate-400 tracking-widest cursor-pointer hover:text-primary-600 transition-colors bg-slate-50 px-4 py-2 rounded-xl active:scale-95">
                   {t('save')}: {stats.stepsGoal.toLocaleString()}
                   <Settings className="w-3 h-3 ml-2 opacity-60" />
                 </button>
               )}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            <button 
              onClick={() => setIsTracking(!isTracking)}
              className={`w-full font-black py-4 sm:py-5 rounded-2xl text-[10px] tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2 ${
                isTracking ? 'bg-green-600 text-white shadow-xl shadow-green-500/20' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10'
              }`}
            >
              <Zap className={`w-4 h-4 ${isTracking ? 'animate-pulse' : ''}`} />
              {isTracking ? t('v_tracking_on') : t('v_start_tracking')}
            </button>
          </div>
        </motion.div>

        {/* Hydration Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-900/5 flex flex-col justify-between transition-colors"
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[10px] sm:text-[11px] font-black text-slate-400 tracking-widest uppercase">{t('v_hydration')}</h3>
              <p className="text-lg sm:text-xl font-black text-slate-900">{t('v_water_intake')}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-3 mb-8">
            {[...Array(Math.max(stats.waterGoal, 8))].map((_, i) => (
              <div 
                key={i} 
                className={`aspect-[3/4] rounded-xl border-2 transition-all duration-500 ${
                  i < stats.water ? 'bg-blue-500 border-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-slate-50 border-slate-100 opacity-60'
                } ${i >= stats.waterGoal ? 'hidden opacity-0' : 'block'}`}
              >
                {i < stats.water && (
                   <motion.div 
                     initial={{ scale: 0 }} 
                     animate={{ scale: 1 }} 
                     className="w-full h-full flex items-center justify-center"
                   >
                     <Droplets className="w-3 h-3 md:w-4 md:h-4 text-white fill-current" />
                   </motion.div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-8">
            {editingGoal === 'water' ? (
              <input 
                type="number" 
                autoFocus
                className="w-20 bg-slate-50 border-2 border-primary-200 rounded-xl px-2 py-1.5 text-xs font-black focus:outline-none focus:border-primary-500"
                defaultValue={stats.waterGoal}
                onBlur={(e) => {
                  updateStat('waterGoal', parseInt(e.target.value) || 8);
                  setEditingGoal(null);
                }}
              />
            ) : (
              <button onClick={() => setEditingGoal('water')} className="flex items-center text-[10px] font-black text-slate-400 tracking-widest cursor-pointer hover:text-blue-500 transition-colors bg-slate-50 px-3 py-1.5 rounded-xl active:scale-95">
                {stats.water} / {stats.waterGoal}
                <Settings className="w-3 h-3 ml-2 opacity-60" />
              </button>
            )}
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </div>

          <button 
            onClick={() => incrementStat('water', 1)}
            disabled={stats.water >= stats.waterGoal}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-4 sm:py-5 rounded-2xl text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 mt-auto"
          >
            <Plus className="w-4 h-4" />
            {t('v_log_glass')}
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Exercise Tracker */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 gap-6 sm:gap-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
                <Dumbbell className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">{t('v_fitness_log')}</h3>
                <p className="text-[9px] sm:text-[10px] font-black text-slate-500 tracking-[0.2em] mt-1 uppercase">{t('v_daily_training')}</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-4xl sm:text-5xl font-black text-white italic">{stats.exercise}<span className="text-xs sm:text-sm font-black text-white/40 tracking-widest ml-2">min</span></p>
              <button disabled className="text-[10px] font-black text-slate-500 tracking-widest mt-1 sm:mt-2 bg-white/5 px-2 py-1 flex items-center w-max rounded-lg uppercase">
                {t('dash_of')} {stats.exerciseGoal}m {t('dash_goal')}
              </button>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-4 bg-white/5 rounded-full mb-8 sm:mb-12 overflow-hidden border border-white/10 relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((stats.exercise / stats.exerciseGoal) * 100, 100)}%` }}
              className="h-full bg-gradient-to-r from-primary-600 to-primary-400 absolute left-0 top-0"
            />
          </div>
        </motion.div>

        {/* Health Records Summary */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-6 sm:p-8 md:p-10 flex flex-col shadow-xl shadow-slate-900/5 transition-colors">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <h4 className="text-[10px] font-black text-slate-400 tracking-[0.2em] flex items-center uppercase text-center w-full">
              <Activity className="w-4 h-4 mr-2" />
               {t('dash_vitals_history')}
            </h4>
          </div>
          <button className="mt-auto flex items-center justify-center text-[10px] sm:text-xs font-black text-primary-600 tracking-[0.2em] hover:text-primary-700 transition-colors group uppercase">
            {t('dash_view_expanded')}
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="mt-16 sm:mt-20 pt-8 sm:pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
         <div className="flex flex-col sm:flex-row items-center sm:space-x-10 space-y-4 sm:space-y-0 w-full sm:w-auto">
            <div className="flex items-center space-x-3">
               <ShieldCheck className="w-5 h-5 text-green-500" />
               <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{t('dash_hipaa')}</span>
            </div>
            <div className="flex items-center space-x-3">
               <Activity className="w-5 h-5 text-primary-500" />
               <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{t('dash_iso')}</span>
            </div>
         </div>
         <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
           <button 
             onClick={onBack}
             className="flex items-center justify-center font-black text-[10px] sm:text-xs text-white tracking-widest bg-slate-900 hover:bg-slate-800 transition-all rounded-xl px-4 py-2.5 shadow-md active:scale-95 w-full sm:w-auto group uppercase"
           >
             <Home className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
             {t('home')}
           </button>
           <p className="text-[9px] font-black text-slate-300 tracking-[0.3em]">Patient ID: {user?.uid.slice(0, 12)}</p>
         </div>
      </motion.div>
    </motion.div>
  );
}
