import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  Globe, 
  Calendar, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  X, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Home, 
  Eye, 
  EyeOff, 
  Activity,
  HeartPulse,
  Stethoscope,
  Sparkles,
  Shield,
  KeyRound
} from 'lucide-react';
import { MedConnectLogo } from './MedConnectLogo';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

export function AuthModal({ onClose, onSuccess, initialMode = 'signin' }: AuthModalProps) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { 
    user, 
    userRole, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    sendPasswordReset, 
    completeProfile 
  } = useAuth();

  React.useEffect(() => {
    if (user && !userRole) {
      setMode('signup');
      if (user.displayName) setName(user.displayName);
      if (user.email) setEmail(user.email);
    }
  }, [user, userRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetSent(false);
    setLoading(true);

    try {
      if (mode === 'forgot') {
        if (!email.trim()) {
          throw new Error('Please enter your email address to receive password reset instructions.');
        }
        await sendPasswordReset(email.trim());
        setResetSent(true);
      } else if (mode === 'signin') {
        await signInWithEmail(email.trim(), password);
        if (onSuccess) onSuccess();
        else onClose();
      } else {
        if (!name.trim() || !country.trim() || !age.trim()) {
          throw new Error('All profile fields are required to complete registration.');
        }
        
        const ageNum = parseInt(age.trim());
        const isAdmin = email.toLowerCase() === 'abdulrofihabdullahhamzah@gmail.com'.toLowerCase();
        
        if (ageNum < 18 && !isAdmin) {
          throw new Error(t('auth_age_error') || 'You must be at least 18 years old to register on MedConnect.');
        }
        
        if (user) {
          await completeProfile(name.trim(), country.trim(), ageNum, role);
        } else {
          await signUpWithEmail(email.trim(), password, name.trim(), country.trim(), ageNum, role);
        }
        if (onSuccess) onSuccess();
        else onClose();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let errorMsg = err.message || 'An error occurred during authentication';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMsg = 'Invalid email or password. Please verify your credentials and try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'An account with this email already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password must be at least 6 characters with good complexity.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setResetSent(false);
    setLoading(true);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
      else onClose();
    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(err.message || 'An error occurred with Google Sign-In');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-gradient-to-b from-white via-sky-50/40 to-sky-100/70 font-manrope overflow-y-auto min-h-screen">
      
      {/* Background Soft Sky Blue Ambient Light matching landing page */}
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1100px] h-[700px] pointer-events-none opacity-70"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.3) 0%, rgba(14, 165, 233, 0.1) 45%, transparent 70%)'
        }}
      />

      {/* Top Floating Stationary Navigation Bar matching Navbar design */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="w-full mx-auto px-3 sm:px-6 pt-2.5 sm:pt-3 max-w-5xl">
          <div className="pointer-events-auto relative rounded-full bg-white/95 backdrop-blur-2xl shadow-[0_10px_30px_rgba(14,165,233,0.1)] border border-sky-200/50 py-2 px-3.5 sm:px-5 flex items-center justify-between">
            {/* Silky Luminous Edge Highlight */}
            <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/35 to-transparent pointer-events-none rounded-full" />

            {/* Logo */}
            <button 
              onClick={onClose}
              className="flex items-center space-x-2 group transition-all cursor-pointer"
              aria-label="MedConnect Home"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 text-slate-900">
                <MedConnectLogo size={26} variant="icon" />
              </div>
              <div className="flex items-center leading-none select-none">
                <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center">
                  <span>Med</span>
                  <span className="text-sky-500 font-black ml-0.5">Connect</span>
                </span>
              </div>
            </button>

            {/* Back to Home Button */}
            <button 
              onClick={onClose}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 font-bold text-xs transition-all cursor-pointer border border-slate-200/60"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Center Stage */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 pt-20 sm:pt-24 z-10">
        
        {/* Main Card matching Landing Page 4-card / Hero stage aesthetic */}
        <div className="w-full max-w-xl lg:max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white/90 backdrop-blur-2xl rounded-[2.5rem] sm:rounded-[3rem] border border-sky-100 shadow-[0_25px_70px_rgba(14,165,233,0.12)] overflow-hidden relative">
          
          {/* Subtle top-right ambient glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-bl from-sky-400/20 via-sky-300/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Left Clinical Overview Column (Visible on Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 xl:p-12 bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-600 text-white relative overflow-hidden">
            {/* Background ambient mesh */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_top_right,white_0%,transparent_70%)]" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Clinical Architecture Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold mb-8 shadow-sm">
                <Activity className="w-3.5 h-3.5" />
                <span>Clinical-Grade Architecture</span>
              </div>

              <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight mb-4 text-white">
                {mode === 'signup' ? (
                  <>
                    Begin Your <br />
                    <span className="text-sky-200">Health Journey</span>
                  </>
                ) : mode === 'forgot' ? (
                  <>
                    Account <br />
                    <span className="text-sky-200">Recovery</span>
                  </>
                ) : (
                  <>
                    Welcome Back <br />
                    <span className="text-sky-200">to MedConnect</span>
                  </>
                )}
              </h2>

              <p className="text-white/80 text-sm xl:text-base font-normal leading-relaxed mb-8">
                {mode === 'signup' 
                  ? 'Access continuous vital synchrony, AI diagnostic assessment, and verified specialist care worldwide.'
                  : mode === 'forgot'
                  ? 'Securely reset your credentials and restore instant access to your clinical records and health passport.'
                  : 'Synchronize your biometric records, track ongoing prescriptions, and connect with licensed physicians.'
                }
              </p>

              {/* Feature Highlights Grid matching Landing Page Features */}
              <div className="space-y-3.5 text-xs font-medium text-white/90">
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <HeartPulse className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">Real-Time Vital Synchrony</p>
                    <p className="text-[11px] text-white/70">Continuous rhythm & telemetry tracking</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-xs">Verified Specialist Network</p>
                    <p className="text-[11px] text-white/70">500+ licensed physicians in 40+ specialties</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Trust Stat Bar */}
            <div className="relative z-10 pt-8 mt-8 border-t border-white/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-extrabold text-white tracking-tight">12,000+</p>
                <p className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Active Patients</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-sky-200 tracking-tight">99.4%</p>
                <p className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Triage Accuracy</p>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 xl:p-12 flex flex-col justify-center text-left relative">
            
            {/* Close Button for Desktop */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 hidden sm:flex w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 items-center justify-center transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Mode Switcher Pill Tabs */}
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex p-1 bg-slate-100 rounded-full border border-slate-200/80 mb-4 sm:mb-6">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setError(''); setResetSent(false); }}
                  className={`py-1.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); setResetSent(false); }}
                  className={`py-1.5 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {mode === 'signin' ? (
                  <>Sign In to <span className="text-sky-500">MedConnect</span></>
                ) : mode === 'signup' ? (
                  <>Create Your <span className="text-sky-500">Account</span></>
                ) : (
                  <>Reset Your <span className="text-sky-500">Password</span></>
                )}
              </h1>
              
              <p className="text-slate-500 text-xs sm:text-sm font-normal mt-1.5">
                {mode === 'signin'
                  ? 'Enter your credentials to access your health portal.'
                  : mode === 'signup'
                  ? 'Join thousands of patients receiving everyday and critical care.'
                  : 'Enter your registered email address and we will send you a reset link.'}
              </p>
            </div>

            {/* Error Banner */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-700 text-xs font-semibold"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Reset Success Banner */}
            <AnimatePresence mode="wait">
              {resetSent && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800 text-xs font-medium"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-900 mb-0.5">Password Reset Link Sent!</p>
                    <p>We have dispatched password reset instructions to <strong>{email}</strong>. Please check your inbox and spam folder.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 
              ENTERPRISE-GRADE GOOGLE SIGN-IN BUTTON
              Matching modern tech industry authentication standard (Apple/Google/Stripe)
            */}
            {mode !== 'forgot' && (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm py-3 sm:py-3.5 px-5 rounded-full border border-slate-200/90 shadow-sm hover:shadow hover:border-slate-300 transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
                  aria-label="Continue with Google"
                >
                  {/* Official Google G Logo with exact standard geometry and branding colors */}
                  <div className="w-4.5 h-4.5 shrink-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200/80"></div>
                  </div>
                  <span className="relative px-4 bg-white text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Or with email
                  </span>
                </div>
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Sign Up Fields: Name, Country, Age, Role */}
              {mode === 'signup' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Full Name */}
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all outline-none"
                    />
                  </div>

                  {/* Country and Age side-by-side */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Country"
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all outline-none"
                      />
                    </div>

                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="number"
                        placeholder="Age (18+)"
                        required
                        min="1"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Role Selector: Patient vs Doctor */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Account Type
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/60">
                      <button
                        type="button"
                        onClick={() => setRole('patient')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          role === 'patient'
                            ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <HeartPulse className="w-3.5 h-3.5 text-sky-500" />
                        <span>Patient</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('doctor')}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          role === 'doctor'
                            ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Stethoscope className="w-3.5 h-3.5 text-sky-500" />
                        <span>Doctor</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Email Field */}
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={user ? true : false}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all outline-none disabled:opacity-60"
                />
              </div>

              {/* Password Field (only for Sign In & Sign Up) */}
              {mode !== 'forgot' && (
                <div className="space-y-1.5">
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3 pl-11 pr-11 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Forgot Password Link in Sign In mode */}
                  {mode === 'signin' && (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); setError(''); setResetSent(false); }}
                        className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Primary Submit Button matching Landing Page primary button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-6 rounded-full shadow-[0_10px_25px_rgba(14,165,233,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === 'signin' 
                        ? 'Sign In' 
                        : mode === 'signup' 
                        ? 'Enter Dashboard' 
                        : 'Send Password Reset Link'
                      }
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer switcher links */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                {mode === 'signin' ? (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('signup'); setError(''); setResetSent(false); }}
                      className="font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
                    >
                      Create Account
                    </button>
                  </span>
                ) : mode === 'signup' ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('signin'); setError(''); setResetSent(false); }}
                      className="font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    Remembered password?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('signin'); setError(''); setResetSent(false); }}
                      className="font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
                    >
                      Return to Sign In
                    </button>
                  </span>
                )}
              </div>

              {/* Verified Badges */}
              <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>HIPAA Verified</span>
                </span>
                <span>·</span>
                <span>256-Bit SSL</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AuthModal;
