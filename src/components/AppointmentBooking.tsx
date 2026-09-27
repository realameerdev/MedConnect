import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Doctor } from './DoctorDirectory';
import { Calendar, Clock, CheckCircle2, ArrowLeft, Video, Activity, ShieldCheck, User } from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';

export function AppointmentBooking({ doctor, onBack, onComplete }: { doctor: Doctor, onBack: () => void, onComplete: () => void }) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reason, setReason] = useState('');

  const today = startOfToday();
  const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(today, i + 1));
  
  const availableTimes = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'
  ];

  const handleBook = async () => {
    if (!user || !selectedDate || !selectedTime) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        patientId: user.uid,
        patientName: user.displayName || user.email,
        doctorId: doctor.uid,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        reason,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      });
      setIsSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    } catch (error) {
      console.error("Error booking appointment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100 italic">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">Confirmed.</h2>
        <p className="text-slate-500 text-lg mb-10 font-medium leading-relaxed uppercase tracking-widest text-xs">
          Your consultation with <span className="text-slate-900 font-black">{doctor.name}</span> is set for {selectedDate && format(selectedDate, 'MMMM d')} at {selectedTime}.
        </p>
        <button 
          onClick={onComplete}
          className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
        >
          To Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* Left Side: Summary & Doctor */}
        <div className="lg:w-1/3 w-full sticky top-32">
          <button 
            onClick={onBack}
            className="flex items-center text-slate-400 hover:text-slate-900 mb-10 transition-colors group text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Selection
          </button>
          
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-900/5 overflow-hidden">
             <div className="relative mb-10 group">
                <div className="absolute inset-0 bg-primary-600 rounded-[2rem] rotate-6 group-hover:rotate-0 transition-transform duration-500 opacity-10" />
                <img 
                  src={doctor.imageUrl} 
                  alt={doctor.name} 
                  className="relative z-10 w-full aspect-square rounded-[2.5rem] object-cover border-4 border-white shadow-xl"
                  referrerPolicy="no-referrer"
                />
             </div>
             
             <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">{doctor.name}</h2>
             <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-8">{doctor.specialty}</p>

             <div className="space-y-6 pt-8 border-t border-slate-50">
                <div className="flex items-center">
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mr-4">
                      <ShieldCheck className="w-5 h-5 text-slate-400" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical License</p>
                      <p className="text-xs font-bold text-slate-700">ACTIVE & VERIFIED</p>
                   </div>
                </div>
                <div className="flex items-center">
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mr-4">
                      <Video className="w-5 h-5 text-slate-400" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consult Mode</p>
                      <p className="text-xs font-bold text-slate-700">HD VIDEO & AUDIO</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Booking Form */}
        <div className="lg:w-2/3 w-full space-y-8">
           <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-900/5">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">01. Temporal Selection</h3>
                 <div className="h-px bg-slate-100 flex-1 ml-6" />
              </div>
              
              <div className="flex overflow-x-auto pb-6 gap-4 no-scrollbar">
                {availableDates.map((date) => {
                  const isSelected = selectedDate?.getTime() === date.getTime();
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`shrink-0 w-24 h-32 rounded-3xl flex flex-col items-center justify-center transition-all border-2 ${
                        isSelected 
                          ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-110 z-10' 
                          : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200 hover:bg-white'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-black tracking-widest mb-2 opacity-60">
                        {format(date, 'EEE')}
                      </span>
                      <span className="text-4xl font-black">
                        {format(date, 'd')}
                      </span>
                      <span className="text-[9px] uppercase font-bold tracking-tighter mt-1">
                        {format(date, 'MMM')}
                      </span>
                    </button>
                  );
                })}
              </div>
           </div>

           <div className={`bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-900/5 transition-all duration-500 ${!selectedDate ? 'opacity-30 pointer-events-none blur-sm' : 'opacity-100'}`}>
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">02. Slot Allocation</h3>
                 <div className="h-px bg-slate-100 flex-1 ml-6" />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {availableTimes.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                        isSelected
                          ? 'bg-primary-600 border-primary-600 text-white shadow-xl shadow-primary-500/20 active:scale-95'
                          : 'bg-slate-50 border-slate-50 text-slate-500 hover:border-slate-200 hover:bg-white'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
           </div>

           <div className={`bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-900/5 transition-all duration-500 ${!selectedTime ? 'opacity-30 pointer-events-none blur-sm' : 'opacity-100'}`}>
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">03. Clinical Intake</h3>
                 <div className="h-px bg-slate-100 flex-1 ml-6" />
              </div>
              
              <textarea 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for consultation..."
                rows={4}
                className="w-full bg-slate-50 border-2 border-slate-100 p-8 rounded-[2rem] font-bold text-sm outline-none focus:border-primary-600 focus:bg-white transition-all placeholder:text-slate-300 resize-none"
              />

              <div className="mt-12 pt-12 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="text-left w-full sm:w-auto">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Policy</p>
                   <p className="text-2xl font-black text-slate-900 uppercase italic">Complimentary</p>
                </div>
                
                <button
                  onClick={handleBook}
                  disabled={!selectedDate || !selectedTime || isSubmitting || !user || !reason}
                  className={`w-full sm:w-auto px-12 py-5 rounded-[2rem] text-[10px] font-black xl:text-xs uppercase tracking-widest transition-all flex items-center justify-center ${
                    !selectedDate || !selectedTime || !user || !reason
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xl shadow-slate-900/30 hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {isSubmitting ? (
                    <Activity className="w-5 h-5 animate-spin mr-3" />
                  ) : <Calendar className="w-5 h-5 mr-3" />}
                  {!user ? 'Auth Required' : 'Finalize appointment'}
                </button>
              </div>
              {!user && (
                 <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-[0.2em] animate-pulse">
                    Please log in to finalize booking
                 </p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
