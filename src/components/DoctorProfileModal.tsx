import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Stethoscope, Clock, Image as ImageIcon, Loader2, Save, X, Activity, AlertCircle, Upload, User } from 'lucide-react';

interface DoctorProfileModalProps {
  onClose: () => void;
}

export function DoctorProfileModal({ onClose }: DoctorProfileModalProps) {
  const { user } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

    try {
      const docRef = doc(db, 'doctors', user.uid);
      await updateDoc(docRef, {
        specialty,
        availability,
        imageUrl
      });
      onClose();
    } catch (err: any) {
      console.error('Error updating doctor profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
          <p className="text-slate-500 mt-4 text-sm font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xl">
      <div 
        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <div className="flex items-center space-x-2 text-primary-600 mb-1">
                <Stethoscope className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">HCP Terminal</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                Profile <span className="text-primary-600">Config</span>
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-3 text-slate-400 hover:text-slate-900 transition-colors rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center">
              <AlertCircle className="w-4 h-4 mr-3 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Clinical Specialty</label>
              <div className="relative group">
                <Activity className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g. Neuro-Cardiology"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none focus:border-primary-500 focus:bg-white transition-all font-bold text-sm text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Connectivity Status</label>
              <div className="grid grid-cols-3 gap-3">
                {(['available', 'busy', 'offline'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setAvailability(status)}
                    className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                      availability === status
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20'
                        : 'bg-slate-50 border-slate-50 text-slate-400 hover:bg-white hover:border-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Profile Identification</label>
              
              <div className="flex items-center space-x-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-white border-2 border-slate-200 overflow-hidden shadow-sm flex items-center justify-center">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="w-8 h-8 text-slate-300" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 transition-all active:scale-95"
                    title="Upload Photo"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Upload Portrait</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                    Clinical-grade portrait recommended for patient trust. Max 1MB.
                  </p>
                  
                  <div className="mt-4 relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                    <input
                      type="url"
                      value={imageUrl.startsWith('data:') ? '' : imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="OR ENTER CDN URL"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-primary-500 transition-all font-bold text-[9px] text-slate-900 placeholder:text-slate-200 uppercase tracking-widest"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-5 rounded-[2rem] transition-all shadow-2xl shadow-primary-500/30 flex items-center justify-center gap-3 disabled:opacity-70 mt-4 active:scale-95 uppercase text-xs tracking-[0.2em]"
            >
              {saving ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Apply Update
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
