import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Plus, Trash2 } from 'lucide-react';

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

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'users', user.uid, 'medications'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Medication));
      setMedications(meds);
    });

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

  const addMedication = async () => {
    if (!user || !name || !dosage || !time) return;
    if (Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
    await addDoc(collection(db, 'users', user.uid, 'medications'), { name, dosage, time, userId: user.uid });
    setName('');
    setDosage('');
  };

  const deleteMedication = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'medications', id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5 text-emerald-600" />
        Medication Reminders
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="p-2 border rounded text-sm" />
          <input placeholder="Dosage" value={dosage} onChange={e => setDosage(e.target.value)} className="p-2 border rounded text-sm" />
          <input type="time" value={time} onChange={e => setTime(e.target.value)} className="p-2 border rounded text-sm" />
        </div>
        <button onClick={addMedication} className="w-full bg-emerald-600 text-white py-2 rounded font-medium text-sm flex items-center justify-center gap-2 hover:bg-emerald-700">
          <Plus className="w-4 h-4" /> Add Reminder
        </button>
        <div className="space-y-2 mt-4">
          {medications.map(med => (
            <div key={med.id} className="flex justify-between items-center p-3 bg-slate-50 rounded text-sm">
              <div>
                <p className="font-medium">{med.name}</p>
                <p className="text-slate-500">{med.dosage} · {med.time}</p>
              </div>
              <button onClick={() => deleteMedication(med.id)} className="text-rose-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
