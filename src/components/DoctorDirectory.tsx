import React, { useEffect, useState } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Star, Clock, Video, Calendar as CalendarIcon, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export interface Doctor {
  uid: string;
  name: string;
  specialty: string;
  availability: 'available' | 'busy' | 'offline';
  rating: number;
  imageUrl: string;
}

const INITIAL_DOCTORS: Doctor[] = [
  {
    uid: 'dr_sarah_chen',
    name: 'Dr. Sarah Chen',
    specialty: 'General Practice',
    availability: 'available',
    rating: 4.9,
    imageUrl: 'https://picsum.photos/seed/doctor1/200/200'
  },
  {
    uid: 'dr_james_wilson',
    name: 'Dr. James Wilson',
    specialty: 'Cardiology',
    availability: 'busy',
    rating: 4.8,
    imageUrl: 'https://picsum.photos/seed/doctor2/200/200'
  },
  {
    uid: 'dr_elena_rodriguez',
    name: 'Dr. Elena Rodriguez',
    specialty: 'Pediatrics',
    availability: 'available',
    rating: 5.0,
    imageUrl: 'https://picsum.photos/seed/doctor3/200/200'
  },
  {
    uid: 'dr_michael_chang',
    name: 'Dr. Michael Chang',
    specialty: 'Neurology',
    availability: 'offline',
    rating: 4.7,
    imageUrl: 'https://picsum.photos/seed/doctor4/200/200'
  }
];

export function DoctorDirectory({ onSelectDoctor }: { onSelectDoctor: (doctor: Doctor, action: 'chat' | 'book') => void }) {
  const { t } = useLanguage();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');

  const specialties = ['All', ...new Set(doctors.map(d => d.specialty))];
  const availabilityOptions = ['All', 'available', 'busy', 'offline'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'All' || doctor.specialty === specialtyFilter;
    const matchesAvailability = availabilityFilter === 'All' || doctor.availability === availabilityFilter;
    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  const { user, userRole } = useAuth();

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        if (querySnapshot.empty) {
          setDoctors(INITIAL_DOCTORS);
          // Only attempt to seed if the current user is an admin 
          // to avoid "Missing or insufficient permissions" errors in the console
          if (user && userRole === 'admin') {
            for (const docData of INITIAL_DOCTORS) {
              setDoc(doc(db, 'doctors', docData.uid), docData).catch(() => {});
            }
          }
        } else {
          const fetchedDoctors = querySnapshot.docs.map(doc => doc.data() as Doctor);
          setDoctors(fetchedDoctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors(INITIAL_DOCTORS);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-slate-200">
            <span>{t('doc_verified')}</span>
          </div>
          <h2 className="text-5xl font-black font-display text-slate-900 tracking-tighter uppercase leading-[0.8] mb-6">
            {t('doc_meet')} <br />
            <span className="text-primary-600">{t('doc_specialists')}</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            {t('doc_desc')}
          </p>
        </div>
        
        <div className="flex items-center space-x-4 bg-white p-2 border border-slate-100 rounded-2xl shadow-sm">
          <div className="px-4 py-2 bg-slate-50 rounded-xl text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('doc_available')}</p>
            <p className="text-lg font-black text-slate-900">{doctors.filter(d => d.availability === 'available').length}</p>
          </div>
          <div className="px-4 py-2 bg-slate-50 rounded-xl text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('doc_total')}</p>
            <p className="text-lg font-black text-slate-900">{doctors.length}</p>
          </div>
        </div>
      </div>

      <div className="mb-12 flex flex-col lg:flex-row gap-4 md:gap-6">
        <div className="relative flex-1 group">
          <input
            type="text"
            placeholder={t('doc_search_ph')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-8 py-4 md:py-5 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary-500 transition-all font-bold uppercase text-[9px] md:text-[10px] tracking-widest shadow-lg shadow-slate-900/5 group-hover:border-slate-200"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center space-x-2 text-slate-300 hidden sm:flex">
            <span className="text-[10px] font-black uppercase tracking-tighter">{t('doc_quick_search')}</span>
            <Activity className="w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group flex-1 sm:flex-none">
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="appearance-none w-full bg-white border-2 border-slate-100 rounded-xl md:rounded-2xl px-6 py-4 md:py-5 pr-12 text-[10px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:border-primary-500 transition-all sm:min-w-[200px] shadow-lg shadow-slate-900/5 cursor-pointer group-hover:border-slate-200"
            >
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <Star className="w-4 h-4 fill-current fill-transparent" />
            </div>
          </div>

          <div className="relative group flex-1 sm:flex-none">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="appearance-none w-full bg-white border-2 border-slate-100 rounded-xl md:rounded-2xl px-6 py-4 md:py-5 pr-12 text-[10px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:border-primary-500 transition-all sm:min-w-[200px] shadow-lg shadow-slate-900/5 cursor-pointer group-hover:border-slate-200"
            >
              {availabilityOptions.map(o => <option key={o} value={o}>{o === 'All' ? t('nav_regional_hub') : o}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
          <Activity className="w-12 h-12 text-slate-200 mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{t('doc_not_found')}</h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{t('doc_not_found_desc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredDoctors.map((doctor, index) => (
          <motion.div 
            key={doctor.uid} 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: index * 0.05
            }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-primary-600 rounded-[2.5rem] translate-y-2 opacity-0 group-hover:opacity-10 transition-all duration-500 blur-2xl" />
            <div className="relative bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-slate-900/5 group">
              <div className="p-8">
                <div className="relative mb-8 flex justify-center">
                  <div className="relative">
                    <img 
                      src={doctor.imageUrl} 
                      alt={doctor.name} 
                      className="w-32 h-32 rounded-3xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border-4 border-slate-50 shadow-inner"
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute -bottom-2 -right-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${
                      doctor.availability === 'available' ? 'bg-green-500 text-white' :
                      doctor.availability === 'busy' ? 'bg-orange-500 text-white' :
                      'bg-slate-400 text-white'
                    }`}>
                      {doctor.availability}
                    </div>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black text-slate-900 mb-1 uppercase tracking-tight">{doctor.name}</h3>
                  <p className="text-primary-600 font-bold text-[10px] uppercase tracking-[0.15em]">{doctor.specialty}</p>
                  
                  <div className="flex items-center justify-center mt-4 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(doctor.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                    ))}
                    <span className="text-[10px] font-black text-slate-400 ml-2">{doctor.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <motion.button 
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onSelectDoctor(doctor, 'chat')}
                    className="flex items-center justify-center py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-slate-900/10"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {t('doc_consult_now')}
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onSelectDoctor(doctor, 'book')}
                    className="flex items-center justify-center py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-black text-xs uppercase tracking-widest transition-all border border-slate-200"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {t('doc_book_visit')}
                  </motion.button>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-center space-x-6">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Wait: 5m</span>
                </div>
                <div className="h-3 w-px bg-slate-200" />
                <div className="flex items-center space-x-1">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Online</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}
    </div>
  );
}
