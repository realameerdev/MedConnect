import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';
import { User, Globe, Calendar, Loader2, Save, X, ShieldCheck } from 'lucide-react';

interface PatientProfileModalProps {
  onClose: () => void;
}

export function PatientProfileModal({ onClose }: PatientProfileModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        name,
        country,
        age
      });
      onClose();
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
          <p className="text-slate-500 mt-4 text-[10px] font-black uppercase tracking-widest">Verifying Identity...</p>
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
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Patient Passport</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-tight">
                Personal <span className="text-primary-600">Info</span>
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
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none focus:border-primary-500 focus:bg-white transition-all font-bold text-sm text-slate-900 placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Age</label>
                <div className="relative group">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none focus:border-primary-500 focus:bg-white transition-all font-bold text-sm text-slate-900 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Country</label>
                <div className="relative group">
                  <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none focus:border-primary-500 focus:bg-white transition-all font-bold text-sm text-slate-900 placeholder:text-slate-300"
                  />
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
                  Commit Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
