import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';
import { MedConnectLogo } from './MedConnectLogo';
import { 
  Activity, 
  Droplets, 
  Footprints, 
  Dumbbell, 
  Heart, 
  Calendar as CalendarIcon, 
  Plus, 
  Minus,
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  TrendingUp, 
  Clock, 
  Zap, 
  Settings, 
  Bell, 
  Brain, 
  AlertCircle, 
  Home, 
  Globe,
  Stethoscope,
  Lock,
  CheckCircle2,
  SlidersHorizontal,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MedicationReminder } from './MedicationReminder';
import { MedicalIntelligencePulse } from './MedicalIntelligencePulse';
import { useLanguage } from '../contexts/LanguageContext';

interface DailyStats {
  steps: number;
  stepsGoal: number;
  water: number;
  waterGoal: number;
  exercise: number;
  exerciseGoal: number;
  bp_sys: number;
  bp_dia: number;
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

export function PatientDashboard({ 
  onBack, 
  onNotificationAdd,
  onActionClick 
}: { 
  onBack: () => void; 
  onNotificationAdd?: (title: string, message: string, type?: 'success' | 'info' | 'alert') => void;
  onActionClick?: (action: string) => void;
}) {
  const { user, userRole } = useAuth();
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
    const title = "Goal Achieved!";
    const message = `You've successfully reached your ${type} goal of ${value} units today.`;
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
      console.error("Email notification error", e);
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
    updateStat(key, Math.max(0, currentValue + amount));
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4 font-manrope">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-sky-500 border-t-transparent"></div>
        <p className="text-slate-400 font-bold tracking-wider text-xs uppercase">{t('loading') || 'Loading Clinical Portal...'}</p>
      </div>
    );
  }

  const currentSteps = localSteps ?? stats.steps;
  const stepsPercent = Math.min((currentSteps / stats.stepsGoal) * 100, 100);
  const waterPercent = Math.min((stats.water / stats.waterGoal) * 100, 100);
  const exercisePercent = Math.min((stats.exercise / stats.exerciseGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/40 via-white to-sky-50/30 font-manrope text-slate-900 pb-20 transition-colors">
      
      {/* Background Soft Sky Blue Ambient Light matching landing page */}
      <div 
        className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(56, 189, 248, 0.25) 0%, rgba(14, 165, 233, 0.08) 45%, transparent 70%)'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-8 z-10">
        
        {/* Top Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          
          {/* Left Breadcrumb & Patient Info */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 hover:border-sky-300 text-slate-700 hover:text-sky-600 font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Landing Page</span>
            </button>
            <span className="text-slate-300">/</span>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Clinical Portal Active</span>
            </div>
          </div>

          {/* Right Status Badge & Telemetry Time */}
          <div className="flex items-center gap-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-sky-100 shadow-xs text-slate-600 text-xs font-medium">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>Synced {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              <span className="capitalize">{userRole || 'Patient'} Account</span>
            </div>
          </div>

        </div>

        {/* 
          =======================================================
          HERO WELCOME BANNER 
          Matching Landing Page's 4-card / Hero stage aesthetic
          =======================================================
        */}
        <div className="relative rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-10 md:p-12 bg-white/85 backdrop-blur-2xl border border-sky-100/90 shadow-[0_20px_60px_rgba(14,165,233,0.08)] overflow-hidden">
          
          {/* Subtle top-right ambient gradient */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-sky-400/15 via-sky-300/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            
            {/* Left Headline & Patient Greeting */}
            <div className="max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-100 bg-sky-50/70 text-sky-600 text-xs font-semibold mb-3 sm:mb-4">
                <Activity className="w-3.5 h-3.5 text-sky-500" />
                <span>Authorized Clinical Suite</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Welcome back, <br className="hidden sm:inline" />
                <span className="text-sky-500">{user?.displayName || 'Patient'}</span>
              </h1>

              <p className="text-slate-500 text-xs sm:text-base font-normal mt-2.5 sm:mt-3.5 max-w-lg leading-relaxed">
                Your health passport, vital synchrony, and verified practitioner network in one synchronized clinical environment.
              </p>
            </div>

            {/* Right Health Score Card & Live Telemetry Tile */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-2.5 sm:gap-4 w-full sm:w-auto shrink-0">
              
              {/* Wellness Score Card */}
              <div className="p-4 sm:p-6 bg-gradient-to-br from-sky-500 to-sky-600 rounded-[1.75rem] sm:rounded-[2rem] text-white shadow-[0_12px_30px_rgba(14,165,233,0.25)] text-center w-full sm:w-auto sm:min-w-[150px]">
                <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-sky-100 mb-1">
                  Wellness Score
                </p>
                <div className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  88<span className="text-xs sm:text-sm font-semibold text-sky-200">/100</span>
                </div>
                <div className="inline-flex items-center gap-1 mt-1.5 sm:mt-2 px-2 py-0.5 rounded-full bg-white/20 text-[9px] sm:text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  <span>Optimal</span>
                </div>
              </div>

              {/* Triage & Status Tile */}
              <div className="p-4 sm:p-6 bg-white rounded-[1.75rem] sm:rounded-[2rem] border border-slate-200/80 shadow-xs text-center w-full sm:w-auto sm:min-w-[150px]">
                <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Network Sync
                </p>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  99.4%
                </div>
                <div className="inline-flex items-center gap-1 mt-1.5 sm:mt-2 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] sm:text-[10px] font-bold border border-emerald-100">
                  <span>Protected</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 
          =======================================================
          QUICK CLINICAL ACTION TILES (MATCHING LANDING CAPABILITIES)
          =======================================================
        */}
        <div>
          <div className="flex items-center justify-between mb-3.5 px-1">
            <h2 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Clinical Tools & Consultations
            </h2>
            <span className="text-xs font-semibold text-slate-400">Direct Access</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {[
              {
                id: 'chat',
                title: 'AI Doctor',
                subtitle: 'Symptom Triage',
                icon: Brain,
                bg: 'bg-white hover:bg-sky-50/50',
                border: 'border-slate-100 hover:border-sky-200',
                iconColor: 'text-sky-500 bg-sky-50',
                tag: 'Instant'
              },
              {
                id: 'doctors',
                title: 'Specialists',
                subtitle: 'Video & Clinic',
                icon: Stethoscope,
                bg: 'bg-white hover:bg-sky-50/50',
                border: 'border-slate-100 hover:border-sky-200',
                iconColor: 'text-blue-500 bg-blue-50',
                tag: '40+ Specs'
              },
              {
                id: 'appointments',
                title: 'Schedule',
                subtitle: 'My Bookings',
                icon: CalendarIcon,
                bg: 'bg-white hover:bg-sky-50/50',
                border: 'border-slate-100 hover:border-sky-200',
                iconColor: 'text-indigo-500 bg-indigo-50',
                tag: 'Live Sync'
              },
              {
                id: 'regional-hub',
                title: 'Health Hub',
                subtitle: 'Donors & Meds',
                icon: Globe,
                bg: 'bg-white hover:bg-emerald-50/50',
                border: 'border-slate-100 hover:border-emerald-200',
                iconColor: 'text-emerald-500 bg-emerald-50',
                tag: 'Verified'
              },
              {
                id: 'emergency',
                title: 'Emergency',
                subtitle: 'Urgent Dispatch',
                icon: AlertCircle,
                bg: 'bg-rose-500 hover:bg-rose-600 text-white',
                border: 'border-rose-400',
                iconColor: 'text-white bg-white/20',
                tag: '24/7 Care'
              },
            ].map((action, idx) => {
              const Icon = action.icon;
              const isEmergency = action.id === 'emergency';
              return (
                <button
                  key={action.id}
                  onClick={() => onActionClick?.(action.id)}
                  className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-[2rem] border transition-all text-left shadow-[0_10px_25px_rgba(14,165,233,0.04)] hover:shadow-md cursor-pointer active:scale-[0.98] flex flex-col justify-between group ${action.bg} ${action.border} ${
                    isEmergency ? 'col-span-2 sm:col-span-1' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs ${action.iconColor}`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isEmergency ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {action.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className={`font-extrabold text-xs sm:text-base tracking-tight leading-snug ${
                      isEmergency ? 'text-white' : 'text-slate-900'
                    }`}>
                      {action.title}
                    </h3>
                    <p className={`text-[11px] sm:text-xs font-normal mt-0.5 ${
                      isEmergency ? 'text-white/80' : 'text-slate-500'
                    }`}>
                      {action.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 
          =======================================================
          DAILY VITAL BIOMARKERS & HEALTH TRACKING GRID
          =======================================================
        */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Biomarkers & Daily Progress
            </h2>
            <span className="text-xs font-semibold text-slate-400">Live Telemetry</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            
            {/* 1. Cardio & Blood Pressure Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 sm:p-7 border border-slate-100 shadow-[0_15px_40px_rgba(14,165,233,0.06)] flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shadow-xs">
                    <Heart className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 border border-rose-100 text-rose-600">
                    Cardio Status
                  </span>
                </div>

                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Blood Pressure
                </p>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {stats.bp_sys}/{stats.bp_dia}
                  </span>
                  <span className="text-xs font-bold text-slate-400">mmHg</span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-slate-500 font-medium">Optimal Resting Rhythm</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Systolic</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateStat('bp_sys', stats.bp_sys - 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-slate-900">{stats.bp_sys}</span>
                    <button 
                      onClick={() => updateStat('bp_sys', stats.bp_sys + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Diastolic</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateStat('bp_dia', stats.bp_dia - 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-slate-900">{stats.bp_dia}</span>
                    <button 
                      onClick={() => updateStat('bp_dia', stats.bp_dia + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center cursor-pointer active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Step Activity Tracker Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 sm:p-7 border border-slate-100 shadow-[0_15px_40px_rgba(14,165,233,0.06)] flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-500 flex items-center justify-center shadow-xs">
                    <Footprints className="w-6 h-6" />
                  </div>
                  <button
                    onClick={() => setEditingGoal(editingGoal === 'steps' ? null : 'steps')}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    title="Edit Step Target"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Daily Movement
                </p>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {currentSteps.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ {stats.stepsGoal.toLocaleString()}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${stepsPercent}%` }}
                  />
                </div>

                {editingGoal === 'steps' && (
                  <div className="p-2.5 bg-slate-50 rounded-xl mb-3 flex items-center gap-2">
                    <input 
                      type="number" 
                      defaultValue={stats.stepsGoal}
                      onBlur={(e) => {
                        updateStat('stepsGoal', parseInt(e.target.value) || 10000);
                        setEditingGoal(null);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 outline-none focus:border-sky-500"
                      placeholder="Goal (e.g. 10000)"
                    />
                    <span className="text-[10px] text-slate-400 font-bold">steps</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => setIsTracking(!isTracking)}
                  className={`w-full py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isTracking 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs' 
                      : 'bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600'
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 ${isTracking ? 'animate-pulse text-white' : 'text-sky-500'}`} />
                  <span>{isTracking ? 'Live Pedometer Active' : 'Enable Motion Sensor'}</span>
                </button>
              </div>
            </div>

            {/* 3. Hydration Tracker Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 sm:p-7 border border-slate-100 shadow-[0_15px_40px_rgba(14,165,233,0.06)] flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shadow-xs">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <button
                    onClick={() => setEditingGoal(editingGoal === 'water' ? null : 'water')}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    title="Edit Water Goal"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Hydration Level
                </p>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {stats.water}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ {stats.waterGoal} Glasses</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${waterPercent}%` }}
                  />
                </div>

                {editingGoal === 'water' && (
                  <div className="p-2.5 bg-slate-50 rounded-xl mb-3 flex items-center gap-2">
                    <input 
                      type="number" 
                      defaultValue={stats.waterGoal}
                      onBlur={(e) => {
                        updateStat('waterGoal', parseInt(e.target.value) || 8);
                        setEditingGoal(null);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 outline-none focus:border-teal-500"
                      placeholder="Goal (glasses)"
                    />
                    <span className="text-[10px] text-slate-400 font-bold">glasses</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => incrementStat('water', 1)}
                  className="flex-1 py-2.5 px-4 rounded-full text-xs font-bold bg-teal-500 hover:bg-teal-600 text-white transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Glass</span>
                </button>
                <button
                  onClick={() => incrementStat('water', -1)}
                  disabled={stats.water <= 0}
                  className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Undo glass"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4. Exercise Tracker Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 sm:p-7 border border-slate-100 shadow-[0_15px_40px_rgba(14,165,233,0.06)] flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-500 flex items-center justify-center shadow-xs">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <button
                    onClick={() => setEditingGoal(editingGoal === 'exercise' ? null : 'exercise')}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    title="Edit Exercise Target"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Daily Exercise
                </p>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {stats.exercise}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ {stats.exerciseGoal} Mins</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${exercisePercent}%` }}
                  />
                </div>

                {editingGoal === 'exercise' && (
                  <div className="p-2.5 bg-slate-50 rounded-xl mb-3 flex items-center gap-2">
                    <input 
                      type="number" 
                      defaultValue={stats.exerciseGoal}
                      onBlur={(e) => {
                        updateStat('exerciseGoal', parseInt(e.target.value) || 30);
                        setEditingGoal(null);
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
                      placeholder="Goal (mins)"
                    />
                    <span className="text-[10px] text-slate-400 font-bold">mins</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => incrementStat('exercise', 10)}
                  className="flex-1 py-2.5 px-4 rounded-full text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+10 Mins</span>
                </button>
                <button
                  onClick={() => incrementStat('exercise', -10)}
                  disabled={stats.exercise <= 0}
                  className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Reduce minutes"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 
          =======================================================
          MEDICATION REMINDER MANAGEMENT SECTION
          =======================================================
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <MedicationReminder />
          </div>

          {/* Clinical Health Passport Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-7 border border-slate-100 shadow-[0_15px_40px_rgba(14,165,233,0.06)] flex flex-col justify-between text-left">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-500 flex items-center justify-center mb-6 shadow-xs">
                <MedConnectLogo size={28} variant="icon" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
                Digital Health Passport
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 font-normal">
                Encrypted biometric records synchronized across hospitals, verified specialists, and emergency care facilities globally.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold">Patient Token</span>
                  <span className="font-mono font-bold text-slate-800">{user?.uid.slice(0, 10)}...</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold">Encryption</span>
                  <span className="font-bold text-emerald-600">AES 256-Bit</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold">Jurisdiction</span>
                  <span className="font-bold text-slate-800">Global HIPAA / ISO</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100">
              <button
                onClick={() => onActionClick?.('chat')}
                className="w-full py-3 px-5 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Consult AI Diagnostics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 
          =======================================================
          CLINICAL INTELLIGENCE NETWORK TELEMETRY
          =======================================================
        */}
        <div className="pt-4">
          <MedicalIntelligencePulse />
        </div>

        {/* 
          =======================================================
          BOTTOM TRUST & GOVERNANCE BAR
          =======================================================
        */}
        <div className="pt-8 sm:pt-12 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-8 font-semibold">
            <span className="inline-flex items-center gap-1.5 text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>HIPAA Protocol Verified</span>
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              <span>ISO 27001 Certified</span>
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>256-Bit End-to-End SSL</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Exit to Home</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PatientDashboard;
