import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Stethoscope, Clock, Image as ImageIcon, Loader2, Save, X, Activity, AlertCircle, Upload, User, Check, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface DoctorProfileModalProps {
  onClose: () => void;
}

export function DoctorProfileModal({ onClose }: DoctorProfileModalProps) {
  const { user } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [specialty, setSpecialty] = useState('');
  const [availability, setAvailability] = useState<'available' | 'busy' | 'offline'>('available');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDoctorData() {
      if (!user) return;
      try {
        const docRef = doc(db, 'doctors', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSpecialty(data.specialty || '');
          setAvailability(data.availability || 'available');
          setImageUrl(data.imageUrl || '');
        }
      } catch (err) {
        console.error('Error loading doctor data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }
    loadDoctorData();
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError('Image must be less than 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError('');
    setSavedSuccess(false);

    try {
      const docRef = doc(db, 'doctors', user.uid);
      await updateDoc(docRef, {
        specialty: specialty.trim(),
        availability,
        imageUrl: imageUrl.trim()
      });
      setSavedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Error updating doctor profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm font-manrope">
        <div className="bg-white p-6 rounded-3xl shadow-xl flex items-center space-x-3">
          <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />
          <p className="text-slate-600 text-xs font-bold">Loading Doctor Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm font-manrope">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-sky-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-7 sm:p-8 text-left">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-[11px] font-bold mb-2">
                <Stethoscope className="w-3.5 h-3.5 text-sky-500" />
                <span>Practitioner Terminal</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Doctor <span className="text-sky-500">Settings</span>
              </h2>
            </div>
            
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-semibold">
              {error}
            </div>
          )}

          {savedSuccess && (
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Practitioner profile updated!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Clinical Specialty</label>
              <div className="relative">
                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g. Cardiology, General Practice"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-sky-500 focus:bg-white transition-all font-semibold text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Availability Status</label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/60">
                {(['available', 'busy', 'offline'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setAvailability(status)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      availability === status
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 ml-1">Profile Photo</label>
              <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full bg-white border border-slate-200 overflow-hidden shadow-xs flex items-center justify-center">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-sky-600 transition-all cursor-pointer"
                    title="Upload Photo"
                  >
                    <Upload className="w-3 h-3" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800">Upload Doctor Portrait</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG under 1MB</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-full transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 disabled:opacity-70 active:scale-95 text-xs sm:text-sm cursor-pointer"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Doctor Profile</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </motion.div>
    </div>
  );
}

export default DoctorProfileModal;
