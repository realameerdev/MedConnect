import React, { useEffect, useState } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronDown, Clock, Video, Calendar as CalendarIcon, Activity, Stethoscope, Search, Star } from 'lucide-react';
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
  const { user, userRole } = useAuth();
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

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        if (querySnapshot.empty) {
          setDoctors(INITIAL_DOCTORS);
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
  }, [user, userRole]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4 font-manrope">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 font-manrope">
      
      {/* Header Banner matching landing page style */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 lg:p-12 rounded-[2.5rem] border border-sky-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(8,112,184,0.06)] relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-400/15 to-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 text-xs font-extrabold mb-4 uppercase tracking-wider">
              <Stethoscope className="w-4 h-4" /> {t('doc_verified')}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              {t('doc_meet')} <span className="text-sky-500">{t('doc_specialists')}</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              {t('doc_desc')}
            </p>
          </div>
          
          <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-sky-100 dark:border-slate-700 shrink-0 shadow-xs">
            <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl text-center shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('doc_available')}</p>
              <p className="text-xl font-extrabold text-emerald-600">{doctors.filter(d => d.availability === 'available').length}</p>
            </div>
            <div className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl text-center shadow-2xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('doc_total')}</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{doctors.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-10 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={t('doc_search_ph')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl py-4 pl-14 pr-6 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-all font-bold text-xs sm:text-sm shadow-xs"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="appearance-none w-full bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl py-4 px-5 pr-12 text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-all sm:min-w-[180px] shadow-xs cursor-pointer"
            >
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <div className="relative flex-1 sm:flex-none">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="appearance-none w-full bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-2xl py-4 px-5 pr-12 text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-all sm:min-w-[180px] shadow-xs cursor-pointer"
            >
              {availabilityOptions.map(o => <option key={o} value={o}>{o === 'All' ? 'All Status' : o}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-sky-100 dark:border-slate-800 p-6">
          <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{t('doc_not_found')}</h3>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{t('doc_not_found_desc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDoctors.map((doctor, index) => (
            <motion.div 
              key={doctor.uid} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 120,
                delay: index * 0.05
              }}
              className="bg-white dark:bg-slate-900 rounded-[2.25rem] border border-sky-100 dark:border-slate-800 overflow-hidden shadow-[0_15px_40px_rgba(8,112,184,0.06)] hover:shadow-[0_20px_50px_rgba(8,112,184,0.12)] transition-all flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="relative mb-6 flex justify-center">
                  <div className="relative">
                    <img 
                      src={doctor.imageUrl} 
                      alt={doctor.name} 
                      className="w-28 h-28 rounded-2xl object-cover border-2 border-sky-100 dark:border-slate-700 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm ${
                      doctor.availability === 'available' ? 'bg-emerald-500 text-white' :
                      doctor.availability === 'busy' ? 'bg-amber-500 text-white' :
                      'bg-slate-400 text-white'
                    }`}>
                      {doctor.availability}
                    </div>
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">{doctor.name}</h3>
                  <p className="text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider mt-0.5">{doctor.specialty}</p>
                  
                  <div className="flex items-center justify-center gap-1 mt-2.5 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="text-slate-700 dark:text-slate-300">{doctor.rating} / 5.0</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <motion.button 
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onSelectDoctor(doctor, 'chat')}
                    className="flex items-center justify-center py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {t('doc_consult_now')}
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onSelectDoctor(doctor, 'book')}
                    className="flex items-center justify-center py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {t('doc_book_visit')}
                  </motion.button>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 border-t border-slate-100 dark:border-slate-800 flex justify-around text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-sky-500" /> Wait: 5m
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-500" /> Verified
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorDirectory;
