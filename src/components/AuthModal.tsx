import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Lock, User as UserIcon, Globe, Calendar, Loader2, AlertCircle, X, ShieldCheck, ArrowLeft, Home, Eye, EyeOff, Activity } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup';
}

export function AuthModal({ onClose, onSuccess, initialMode = 'signin' }: AuthModalProps) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { user, userRole, signInWithEmail, signUpWithEmail, signInWithGoogle, completeProfile } = useAuth();

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
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        if (!name || !country || !age) {
          throw new Error('All fields are required');
        }
        
        const ageNum = parseInt(age.trim());
        const isAdmin = email.toLowerCase() === 'abdulrofihabdullahhamzah@gmail.com'.toLowerCase();
        
        if (ageNum < 18 && !isAdmin) {
          throw new Error(t('auth_age_error'));
        }
        
        if (user) {
          await completeProfile(name, country, parseInt(age), role);
        } else {
          await signUpWithEmail(email, password, name, country, parseInt(age), role);
        }
      }
      if (onSuccess) onSuccess();
      else onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
      else onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred with Google Sign-In');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-50 overflow-y-auto">
      {/* Global Back to Home */}
      <button 
        onClick={onClose}
        className="fixed top-8 left-8 z-[70] flex items-center space-x-3 text-slate-400 hover:text-slate-900 transition-all group"
      >
        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:shadow-md group-hover:border-slate-200 transition-all">
          <Home className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">{t('home')}</span>
      </button>

      {/* Immersive background elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 -left-1/4 w-[800px] h-[800px] bg-primary-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 z-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.1)] border border-white/20 overflow-hidden">
          
          {/* Brand/Visual Pane - Hidden on Mobile */}
          <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-900 relative overflow-hidden">
             <div className="absolute inset-0 opacity-20 pointer-events-none" 
                  style={{ background: 'linear-gradient(90deg, transparent 49%, white 50%, transparent 51%) 0 0 / 60px 60px, linear-gradient(0deg, transparent 49%, white 50%, transparent 51%) 0 0 / 60px 60px' }} 
             />
             
             <div className="relative z-10">
                <div className="flex items-center space-x-3 text-white mb-20">
                   <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/20">
                      <Activity className="w-7 h-7" />
                   </div>
                   <span className="text-2xl font-display font-black tracking-tighter italic">MedConnect</span>
                </div>

                <div className="space-y-8">
                   <h1 className="text-5xl font-black text-white italic tracking-tighter leading-[0.9]">
                     {t('auth_intro_h')} <br />
                     <span className="text-primary-500 not-italic">{t('auth_intro_s')}</span>
                   </h1>
                   <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                     {t('auth_intro_p')}
                   </p>
                </div>
             </div>

             <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="flex -space-x-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                        <img 
                          src={`https://picsum.photos/seed/doctor${i}/100/100`} 
                          alt="Specialist"
                          className="w-full h-full object-cover grayscale opacity-50"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-slate-500 tracking-widest uppercase">{t('auth_trusted')}</p>
                </div>
                
                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                   <p className="text-[10px] font-black text-slate-600 tracking-widest">v2.1.0 {t('auth_gateway')}</p>
                   <ShieldCheck className="w-5 h-5 text-primary-500/50" />
                </div>
             </div>
          </div>

          {/* Form Pane */}
          <div className="p-8 md:p-16 relative bg-white overflow-y-auto flex flex-col justify-center min-h-[600px]">
            {/* Desktop Back Button */}
            <button 
               onClick={onClose}
               className="absolute top-8 right-8 hidden sm:flex items-center space-x-2 text-slate-300 hover:text-slate-900 transition-all group"
            >
               <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {t('back')}
               </span>
               <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-all">
                  <X className="w-5 h-5" />
               </div>
            </button>

            <div className="flex justify-between items-center mb-12 sm:hidden">
                <div className="flex items-center space-x-2 text-slate-900">
                   <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                   </div>
                   <span className="text-lg font-display font-black tracking-tighter italic">MedConnect</span>
                </div>
                <button 
                   onClick={onClose}
                   className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"
                >
                   <X className="w-5 h-5" />
                </button>
            </div>

            <div className="mb-10 text-left">
               <motion.div
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="inline-flex items-center px-3 py-1 bg-primary-50 rounded-full text-primary-600 text-[10px] font-black tracking-widest mb-6"
               >
                 <Lock className="w-3 h-3 mr-2" />
                 {t('auth_secure')}
               </motion.div>
               <h2 className="text-4xl font-black font-display text-slate-900 tracking-tighter leading-none italic mb-4">
                 {mode === 'signin' ? t('auth_access') : t('auth_registration')}
               </h2>
               <p className="text-sm font-medium text-slate-400">{t('auth_creds_p')}</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center text-red-600 text-xs font-bold italic"
                >
                  <AlertCircle className="w-4 h-4 mr-3 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {mode === 'signup' && (
                    <div className="space-y-5">
                      <div className="relative group">
                        <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                        <input
                          type="text"
                          placeholder={t('auth_fullname')}
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-primary-600 focus:bg-white transition-all font-bold text-sm tracking-tight placeholder:text-slate-300 uppercase"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                          <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                          <input
                            type="text"
                            placeholder={t('auth_country')}
                            required
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-primary-600 focus:bg-white transition-all font-bold text-sm tracking-tight placeholder:text-slate-300 uppercase"
                          />
                        </div>
                        <div className="relative group">
                          <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                          <input
                            type="number"
                            placeholder={t('auth_age')}
                            required
                            min="1"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-primary-600 focus:bg-white transition-all font-bold text-sm tracking-tight placeholder:text-slate-300 uppercase"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                        {(['patient', 'doctor'] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${
                              role === r 
                                ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            {r === 'patient' ? t('auth_patient') : t('auth_doctor')}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div className="relative group">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                      <input
                        type="email"
                        placeholder={t('auth_email_id')}
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={user ? true : false}
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-primary-600 focus:bg-white transition-all font-bold text-sm tracking-tight placeholder:text-slate-300 disabled:opacity-50 uppercase"
                      />
                    </div>

                    <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder={t('auth_passcode')}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-14 pr-14 outline-none focus:border-primary-600 focus:bg-white transition-all font-bold text-sm tracking-tight placeholder:text-slate-300 uppercase"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center text-[10px] tracking-widest disabled:opacity-70 active:scale-95 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center uppercase tracking-widest text-[10px]">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : mode === 'signin' ? (
                    <>{t('auth_grant')} <ArrowLeft className="w-4 h-4 ml-3 rotate-180" /></>
                  ) : (
                    <>{t('auth_finalize')} <ArrowLeft className="w-4 h-4 ml-3 rotate-180" /></>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-8">
               <div className="relative mb-8">
                 <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-slate-100"></div>
                 </div>
                 <div className="relative flex justify-center text-xs">
                   <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-widest text-[9px]">{t('auth_or_connect')}</span>
                 </div>
               </div>

               <motion.button
                 whileHover={{ scale: 1.01, y: -2 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleGoogleSignIn}
                 disabled={loading}
                 type="button"
                 className="w-full flex items-center justify-center space-x-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 py-4 px-8 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 group uppercase tracking-widest"
               >
                 <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                   </svg>
                 </div>
                 <span className="text-sm font-bold text-slate-700">
                   {mode === 'signin' ? t('auth_google_si') : t('auth_google_su')}
                 </span>
               </motion.button>

               <div className="mt-8 text-center flex flex-col sm:flex-row items-center justify-center gap-2">
                 <p className="text-slate-400 text-sm font-medium uppercase tracking-tight">
                   {mode === 'signin' ? t('auth_no_account') : t('auth_have_account')}
                 </p>
                 <button
                   type="button"
                   onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                   className="text-sm font-black text-primary-600 hover:text-primary-700 tracking-tight transition-colors uppercase"
                 >
                   {mode === 'signin' ? t('auth_register_today') : t('auth_signin_instead')}
                 </button>
               </div>
            </div>

            <button 
              onClick={onClose}
              className="mt-12 text-[10px] font-black text-slate-300 hover:text-slate-900 transition-colors tracking-widest uppercase flex items-center justify-center space-x-2 w-full sm:hidden"
            >
               <span>{t('auth_cancel')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
