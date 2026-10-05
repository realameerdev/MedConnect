import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';
import { User, Globe, Calendar, Loader2, Save, X, ShieldCheck, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { MedConnectLogo } from './MedConnectLogo';

interface PatientProfileModalProps {
  onClose: () => void;
}

export function PatientProfileModal({ onClose }: PatientProfileModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState<number>(0);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPatientData() {
      if (!user) return;
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setCountry(data.country || '');
          setAge(data.age || 0);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
      } finally {
        setLoading(false);
      }
    }
    loadPatientData();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError('');
    setSavedSuccess(false);

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        name: name.trim(),
        country: country.trim(),
        age: Number(age)
      });
      setSavedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm font-manrope">
        <div className="bg-white p-6 rounded-3xl shadow-xl flex items-center space-x-3">
          <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />
          <p className="text-slate-600 text-xs font-bold">Loading Profile...</p>
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
                <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                <span>Patient Profile</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Personal <span className="text-sky-500">Details</span>
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
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-sky-500 focus:bg-white transition-all font-semibold text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={age || ''}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-sky-500 focus:bg-white transition-all font-semibold text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">Country</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-sky-500 focus:bg-white transition-all font-semibold text-xs sm:text-sm text-slate-900 placeholder:text-slate-400"
                  />
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
                    <span>Save Changes</span>
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

export default PatientProfileModal;
