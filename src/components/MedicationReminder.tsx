import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Pill, Plus, Trash2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
}

export const MedicationReminder: React.FC = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('09:00');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'users', user.uid, 'medications'));
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const meds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Medication));
        setMedications(meds);
      },
      (error) => {
        console.warn('Medications listener warning:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      medications.forEach(med => {
        if (med.time === currentTime) {
          if (Notification.permission === 'granted') {
            new Notification('Medication Reminder', {
              body: `Time to take ${med.name} (${med.dosage})`,
            });
          }
        }
      });
    };

    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [medications]);

  const addMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim() || !dosage.trim() || !time) return;
    if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
      try {
        await Notification.requestPermission();
      } catch (err) {
        console.warn('Notification permission error:', err);
      }
    }
    await addDoc(collection(db, 'users', user.uid, 'medications'), { 
      name: name.trim(), 
      dosage: dosage.trim(), 
      time, 
      userId: user.uid 
    });
    setName('');
    setDosage('');
    setIsAdding(false);
  };

  const deleteMedication = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'medications', id));
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-[0_15px_40px_rgba(14,165,233,0.06)] text-left flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-sky-500 flex items-center justify-center shadow-xs">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Prescription Schedules
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Browser alert notifications on dosage schedule
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs transition-colors cursor-pointer border border-sky-200/60"
          >
            <Plus className="w-3.5 h-3.5 text-sky-500" />
            <span>{isAdding ? 'Close' : 'Add Medication'}</span>
          </button>
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={addMedication}
              className="p-4 bg-sky-50/60 border border-sky-100 rounded-2xl mb-6 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input 
                  type="text"
                  placeholder="Medicine Name (e.g. Amoxicillin)" 
                  required
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500" 
                />
                <input 
                  type="text"
                  placeholder="Dosage (e.g. 500mg, 1 tablet)" 
                  required
                  value={dosage} 
                  onChange={e => setDosage(e.target.value)} 
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500" 
                />
                <input 
                  type="time" 
                  required
                  value={time} 
                  onChange={e => setTime(e.target.value)} 
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500" 
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Schedule
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Medication List */}
        <div className="space-y-2.5">
          {medications.length === 0 ? (
            <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-2xl">
              <Pill className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No active medication reminders</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Medication" above to set daily dosage alerts.</p>
            </div>
          ) : (
            medications.map(med => (
              <div 
                key={med.id} 
                className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-sky-50/40 rounded-2xl border border-slate-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-sky-500 shadow-2xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">{med.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{med.dosage} · Scheduled for {med.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Active</span>
                  </span>
                  <button 
                    onClick={() => deleteMedication(med.id)} 
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer rounded-lg hover:bg-white"
                    title="Remove reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Daily Auto-Sync Enabled</span>
        <span className="font-semibold text-slate-600">{medications.length} Prescriptions Logged</span>
      </div>
    </div>
  );
};

export default MedicationReminder;
