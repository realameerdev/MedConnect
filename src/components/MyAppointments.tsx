import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  ChevronRight, 
  ShieldCheck, 
  X,
  Stethoscope,
  Video,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MedConnectLogo } from './MedConnectLogo';

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
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-4 font-manrope">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-sky-500 border-t-transparent"></div>
        <p className="text-slate-400 font-bold tracking-wider text-xs uppercase">Syncing Appointments...</p>
      </div>
    );
  }

  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled');

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/40 via-white to-sky-50/30 font-manrope text-slate-900 pb-20">
      
      {/* Cancellation Modal */}
      <AnimatePresence>
        {cancellingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isCancelling && setCancellingId(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative bg-white rounded-[2rem] p-7 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 text-left z-10"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 text-rose-500">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <button 
                  onClick={() => !isCancelling && setCancellingId(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">Cancel Consultation?</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mb-6">
                Are you sure you want to cancel this scheduled consultation? This action cannot be reversed and will require booking a new slot.
              </p>
              
              {cancelError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600">
                  {cancelError}
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => setCancellingId(null)}
                  disabled={isCancelling}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-colors cursor-pointer"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelAppointment}
                  disabled={isCancelling}
                  className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-rose-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Top Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 hover:border-sky-300 text-slate-700 hover:text-sky-600 font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95 self-start"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold self-start sm:self-auto">
            <Activity className="w-3.5 h-3.5 text-sky-500" />
            <span>{userRole === 'doctor' ? 'Practitioner Schedule' : 'Patient Consultations'}</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-[2.5rem] p-7 sm:p-10 bg-white/85 backdrop-blur-2xl border border-sky-100 shadow-[0_20px_50px_rgba(14,165,233,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left overflow-hidden">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-100 bg-sky-50/70 text-sky-600 text-xs font-semibold mb-3">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>Real-Time Clinical Queue</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              My <span className="text-sky-500">Appointments</span>
            </h1>

            <p className="text-slate-500 text-xs sm:text-sm font-normal mt-2 leading-relaxed">
              Manage your upcoming digital video consultations, clinic visits, and medical history.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/60 shrink-0">
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</p>
              <p className="text-xl font-extrabold text-slate-900">{appointments.length}</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Active</p>
              <p className="text-xl font-extrabold text-emerald-600">{scheduledAppointments.length}</p>
            </div>
          </div>
        </div>

        {/* Appointment List */}
        <div className="space-y-4 text-left">
          <AnimatePresence mode="popLayout">
            {appointments.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 px-6 bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 shadow-sm"
              >
                <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-sky-500 border border-sky-100">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-1">No Scheduled Consultations</h3>
                <p className="text-xs sm:text-sm text-slate-400 font-normal max-w-sm mx-auto">
                  You currently have no active appointments. Connect with our verified doctor network to book a session.
                </p>
              </motion.div>
            ) : (
              appointments.map((appointment) => {
                const isCancelled = appointment.status === 'cancelled';
                const isCompleted = appointment.status === 'completed';

                return (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 sm:p-7 border border-slate-100 shadow-[0_10px_30px_rgba(14,165,233,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-sky-200 transition-all"
                  >
                    {/* Left Date / Time Badge */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 flex flex-col items-center justify-center text-sky-600 shrink-0">
                        <span className="text-xs font-bold uppercase">{new Date(appointment.date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-2xl font-extrabold leading-none">{appointment.date.split('-')[2] || '01'}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            isCancelled 
                              ? 'bg-rose-50 text-rose-600 border-rose-100'
                              : isCompleted
                              ? 'bg-slate-100 text-slate-600 border-slate-200'
                              : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                            {!isCancelled && <CheckCircle2 className="w-3 h-3" />}
                            {isCancelled && <AlertCircle className="w-3 h-3" />}
                            <span className="capitalize">{appointment.status}</span>
                          </span>

                          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                            {appointment.specialty || 'General Consultation'}
                          </span>
                        </div>

                        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                          {userRole === 'doctor' ? appointment.patientName : appointment.doctorName}
                        </h3>

                        <p className="text-xs text-slate-500 font-medium flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{appointment.time}</span>
                          </span>
                          {appointment.reason && (
                            <span className="text-slate-400 truncate max-w-xs">
                              · {appointment.reason}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex items-center gap-2.5 self-end md:self-center">
                      <button 
                        disabled={isCancelled}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isCancelled 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-sky-500 hover:bg-sky-600 text-white shadow-xs active:scale-95'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Video Session</span>
                      </button>

                      {!isCancelled && (
                        <button 
                          onClick={() => setCancellingId(appointment.id)}
                          className="p-2.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Cancel Booking"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Verification Footer */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>End-to-End Encrypted Telehealth Gateway</span>
          </div>
          <span>UTC Synchronized</span>
        </div>

      </div>
    </div>
  );
}

export default MyAppointments;
