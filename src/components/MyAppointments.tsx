import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, User, ArrowLeft, CheckCircle2, AlertCircle, Activity, ChevronRight, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export function MyAppointments({ onBack }: { onBack: () => void }) {
  const { user, userRole } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    if (!user) return;

    const path = 'appointments';
    const field = userRole === 'doctor' ? 'doctorId' : 'patientId';
    
    const q = query(
      collection(db, path),
      where(field, '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      setAppointments(fetched);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching appointments:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, userRole]);

  const handleCancelAppointment = async () => {
    if (!cancellingId) return;
    
    setIsCancelling(true);
    setCancelError('');
    
    try {
      const appointmentRef = doc(db, 'appointments', cancellingId);
      await updateDoc(appointmentRef, {
        status: 'cancelled'
      });
      setCancellingId(null);
    } catch (error: any) {
      console.error(error);
      setCancelError(error.message || 'Failed to cancel appointment.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
        <Activity className="w-12 h-12 text-primary-600 animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Timeline...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      {/* Cancellation Modal */}
      <AnimatePresence>
        {cancellingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isCancelling && setCancellingId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100"
            >
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                 </div>
                 <button 
                   onClick={() => !isCancelling && setCancellingId(null)}
                   className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                 >
                   <X className="w-4 h-4" />
                 </button>
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Cancel Appointment</h3>
              <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                Are you sure you want to cancel this clinical session? This action cannot be reversed and a new booking will be required.
              </p>
              
              {cancelError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-600 italic">
                   {cancelError}
                </div>
              )}
              
              <div className="flex gap-4">
                <button
                  onClick={() => setCancellingId(null)}
                  disabled={isCancelling}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  Return
                </button>
                <button
                  onClick={handleCancelAppointment}
                  disabled={isCancelling}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg shadow-red-500/20 active:scale-95 disabled:opacity-50"
                >
                  {isCancelling ? 'Revoking...' : 'Confirm Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl">
          <button 
            onClick={onBack}
            className="flex items-center text-slate-400 hover:text-slate-900 mb-8 transition-colors group text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Selection
          </button>
          <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-slate-200">
            <span>{userRole === 'doctor' ? 'Clinical Schedule' : 'Patient Passport'}</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.8] mb-6">
            Your <br />
            <span className="text-primary-600">Appointments.</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Manage your digital consultations and track your healthcare journey.
          </p>
        </div>
        
        <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-6">
           <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
              <p className="text-xl font-black text-slate-900">{appointments.length}</p>
           </div>
           <div className="w-px h-8 bg-slate-100" />
           <div className="text-center">
              <p className="text-[9px] font-black text-green-400 uppercase tracking-widest mb-1">Active</p>
              <p className="text-xl font-black text-slate-900">{appointments.filter(a => a.status === 'scheduled').length}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
         <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
               <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                     <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Health Passport</span>
               </div>
               <div className="space-y-4">
                  <div>
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Holder</p>
                     <p className="text-lg font-black uppercase tracking-tight truncate">{user?.displayName || 'Auth User'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Region</p>
                        <p className="text-sm font-black uppercase">{user?.photoURL?.includes('http') ? 'Global' : 'Verified'}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-sm font-black text-green-500 uppercase">Clear</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                  <Activity className="w-3.5 h-3.5 mr-2" />
                  Vitals Integrity
               </h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-end">
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Consult Intensity</p>
                     <p className="text-sm font-black text-slate-900">Normal</p>
                  </div>
                  <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                     <div className="h-full bg-primary-500 w-[65%]" />
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-3 space-y-6">
        <AnimatePresence mode="popLayout">
          {appointments.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Clear Schedule</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Safe travels. No upcoming consultations found.</p>
            </motion.div>
          ) : (
            appointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring",
                  damping: 25,
                  stiffness: 150,
                  delay: index * 0.1 
                }}
                className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 hover:shadow-2xl hover:shadow-slate-900/5 transition-all flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="w-full md:w-32 flex flex-col items-center justify-center py-4 bg-slate-50 rounded-3xl border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-primary-400">{appointment.time}</p>
                   <p className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{appointment.date.split('-')[2]}</p>
                   <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">{new Date(appointment.date).toLocaleString('default', { month: 'short' })}</p>
                </div>

                 <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      appointment.status === 'cancelled' 
                        ? 'bg-red-50 text-red-600 border-red-100'
                        : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                       {appointment.status !== 'cancelled' && <CheckCircle2 className="w-3 h-3 mr-1.5" />}
                       {appointment.status === 'cancelled' && <AlertCircle className="w-3 h-3 mr-1.5" />}
                       {appointment.status}
                    </span>
                    <span className="text-[11px] font-black text-primary-600 uppercase tracking-widest md:ml-2">
                       {appointment.specialty}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
                    {userRole === 'doctor' ? appointment.patientName : appointment.doctorName}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium line-clamp-2 italic">
                    "{appointment.reason}"
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                   <motion.button 
                     whileTap={{ scale: 0.95 }}
                     disabled={appointment.status === 'cancelled'}
                     className={`flex-1 md:flex-none px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center cursor-pointer ${
                       appointment.status === 'cancelled' 
                        ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                     }`}
                   >
                      Join Session <ChevronRight className="w-4 h-4 ml-2" />
                   </motion.button>
                   {appointment.status !== 'cancelled' && (
                     <motion.button 
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setCancellingId(appointment.id)}
                       title="Cancel Appointment"
                       className="p-4 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl border border-slate-100 transition-all cursor-pointer"
                     >
                        <AlertCircle className="w-5 h-5" />
                     </motion.button>
                   )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>

      <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center space-x-10">
            <div className="text-center md:text-left">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Consultation ID</p>
               <p className="text-sm font-black text-slate-900">MED-X-998{user?.uid.slice(-4)}</p>
            </div>
            <div className="text-center md:text-left">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Network Status</p>
               <div className="flex items-center text-green-500">
                  <Activity className="w-4 h-4 mr-2" />
                  <span className="text-sm font-black uppercase tracking-tighter">Verified</span>
               </div>
            </div>
         </div>
         <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest max-w-xs text-center md:text-right">
            Clinical appointments are scheduled in UTC. Please verify your local time alignment.
         </p>
      </div>
    </div>
  );
}
