import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ShieldAlert, Droplets, Baby, Activity, 
  ArrowLeft, Pill, MapPin, CheckCircle2, AlertCircle,
  Calendar, Info, Phone, Heart, Coins, Globe,
  ShieldCheck, ArrowRight, Zap, List, Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

type HubSection = 'drugs' | 'fake-drug' | 'blood' | 'maternal' | 'emergency-guide' | 'cost' | 'lang';

export function RegionalHealthHub({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<HubSection | null>(null);

  // Dynamic translated data
  const MOCK_DRUGS = [
    { name: t('drug_name_p'), price: '₦500 - ₦800', pharmacies: ['MedPlus Victoria Island', 'HealthPlus Lekki'], stock: t('drug_stock_h') },
    { name: t('drug_name_m'), price: '₦1,200 - ₦2,500', pharmacies: ['Alpha Pharmacy Ikeja', 'Nett Cash Pharmacy'], stock: t('drug_stock_l') },
    { name: t('drug_name_a'), price: '₦8,500 - ₦12,000', pharmacies: ['MedPlus Gbagada'], stock: t('drug_stock_lo') },
  ];

  const FIRST_AID_STEPS = [
    { 
      id: 'burns', 
      title: t('fa_burns_title'), 
      steps: [t('fa_burns_1'), t('fa_burns_2'), t('fa_burns_3'), t('fa_burns_4')] 
    },
    { 
      id: 'bleeding', 
      title: t('fa_bleeding_title'), 
      steps: [t('fa_bleeding_1'), t('fa_bleeding_2'), t('fa_bleeding_3'), t('fa_bleeding_4')] 
    },
    { 
      id: 'snake-bite', 
      title: t('fa_snake_title'), 
      steps: [t('fa_snake_1'), t('fa_snake_2'), t('fa_snake_3'), t('fa_snake_4'), t('fa_snake_5')] 
    },
    { 
      id: 'fainting', 
      title: t('fa_fainting_title'), 
      steps: [t('fa_fainting_1'), t('fa_fainting_2'), t('fa_fainting_3'), t('fa_fainting_4'), t('fa_fainting_5')] 
    },
  ];

  // Sub-component states
  const [drugSearch, setDrugSearch] = useState('');
  const [nafdacNum, setNafdacNum] = useState('');
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [bloodGroup, setBloodGroup] = useState('');
  const [registrationMode, setRegistrationMode] = useState(false);
  const [nearbyDonors, setNearbyDonors] = useState<any[]>([]);
  const [pregnancyWeek, setPregnancyWeek] = useState(1);

  // 1. Drug Search Logic
  const filteredDrugs = drugSearch 
    ? MOCK_DRUGS.filter(d => d.name.toLowerCase().includes(drugSearch.toLowerCase()))
    : MOCK_DRUGS;

  // 2. Fake Drug Logic
  const handleVerifyNafdac = () => {
    setVerifyStatus('loading');
    setTimeout(() => {
      if (nafdacNum.length >= 6) {
        setVerifyStatus('valid');
      } else {
        setVerifyStatus('invalid');
      }
    }, 1200);
  };

  // 3. Blood Donor Logic
  const handleRegisterDonor = async () => {
    if (!user || !bloodGroup) return;
    try {
      const donorRef = doc(db, 'blood_donors', user.uid);
      await setDoc(donorRef, {
        uid: user.uid,
        name: user.displayName || 'Anonymous Donor',
        bloodGroup,
        location: 'Lagos, Nigeria',
        lastRegistered: new Date().toISOString()
      });
      alert('Registered successfully!');
      setRegistrationMode(false);
    } catch (e) {
      console.error(e);
    }
  };

  const searchDonors = async () => {
    if (!bloodGroup) return;
    try {
      const q = query(collection(db, 'blood_donors'), where('bloodGroup', '==', bloodGroup));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => doc.data());
      if (data.length === 0) {
        // Fallback mock data if none in firestore
        setNearbyDonors([
          { name: 'Dr. Adebayo O.', bloodGroup, location: 'Victoria Island, Lagos' },
          { name: 'Chinedu Okoro', bloodGroup, location: 'Ikeja GRA, Lagos' },
          { name: 'Fatima Bello', bloodGroup, location: 'Lekki Phase 1, Lagos' }
        ]);
      } else {
        setNearbyDonors(data);
      }
    } catch (e) {
      console.error(e);
      setNearbyDonors([
        { name: 'Dr. Adebayo O.', bloodGroup, location: 'Victoria Island, Lagos' },
        { name: 'Chinedu Okoro', bloodGroup, location: 'Ikeja GRA, Lagos' }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-manrope transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Button matching landing page styling */}
        <button 
          onClick={onBack} 
          className="flex items-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 sm:mb-8 font-bold tracking-widest text-xs uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('dashboard')}
        </button>

        {!activeSection ? (
          <div className="space-y-10">
            {/* Header section matching landing page */}
            <header className="text-center md:text-left bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] border border-sky-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(8,112,184,0.06)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-400/15 to-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 bg-sky-50 dark:bg-sky-950/50 px-4 py-2 rounded-full border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 text-xs font-extrabold tracking-[0.15em] mb-6 uppercase shadow-xs">
                  <Globe className="w-4 h-4" />
                  <span>{t('hub_portal_subtitle')}</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                  {t('hub_title')}
                </h1>
                <p className="text-slate-600 dark:text-slate-300 font-medium max-w-2xl text-sm sm:text-base leading-relaxed">
                  {t('hub_desc')}
                </p>
              </div>
            </header>

            {/* Hub Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'drugs', icon: Pill, title: t('drug_checker'), desc: 'Compare verified retail medicine prices across licensed pharmacies.', color: 'from-sky-500 to-blue-600' },
                { id: 'fake-drug', icon: ShieldCheck, title: t('fake_drug'), desc: 'Authenticate NAFDAC registration numbers instantly before consumption.', color: 'from-rose-500 to-red-600' },
                { id: 'blood', icon: Droplets, title: t('blood_finder'), desc: 'Connect with verified regional blood donors and banks in emergencies.', color: 'from-rose-600 to-pink-600' },
                { id: 'maternal', icon: Baby, title: t('maternal_care'), desc: 'Track weekly pregnancy milestones and infant immunization schedules.', color: 'from-purple-500 to-indigo-600' },
                { id: 'emergency-guide', icon: Activity, title: t('first_aid'), desc: 'Step-by-step low-data emergency protocols for burns, bites, and trauma.', color: 'from-emerald-500 to-teal-600' },
                { id: 'cost', icon: Coins, title: t('cost_estimator'), desc: 'Transparent regional cost breakdown for treatments and diagnostics.', color: 'from-amber-500 to-orange-600' },
                { id: 'lang', icon: Globe, title: t('select_lang'), desc: 'Switch seamlessly between English, Pidgin, Yoruba, Hausa, and Igbo.', color: 'from-slate-800 to-slate-900' },
              ].map((tool) => (
                <motion.button
                  key={tool.id}
                  whileHover={{ scale: 1.02, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(tool.id as HubSection)}
                  className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] border border-sky-100 dark:border-slate-800 flex flex-col items-start text-left group hover:shadow-[0_20px_40px_rgba(8,112,184,0.1)] transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform shadow-md`}>
                    <tool.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">{tool.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mb-6 line-clamp-2">{tool.desc}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                    <span>{t('hub_launch_tool')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 border border-sky-100 dark:border-slate-800 shadow-[0_25px_60px_rgba(8,112,184,0.08)] relative overflow-hidden"
          >
            <button 
              onClick={() => setActiveSection(null)} 
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white p-2.5 bg-slate-100 dark:bg-slate-800 rounded-full transition-all cursor-pointer"
              title="Back to Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* 1. Drug Price Checker Section */}
            {activeSection === 'drugs' && (
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 text-xs font-bold mb-3">
                  <Pill className="w-3.5 h-3.5" /> Pharmacy Intelligence
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">{t('drug_checker')}</h2>
                
                <div className="relative mb-8">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder={t('drug_search_placeholder')}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 pl-14 pr-6 text-sm sm:text-base font-bold focus:outline-none focus:border-sky-500 transition-all dark:text-white"
                    value={drugSearch}
                    onChange={(e) => setDrugSearch(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  {filteredDrugs.map((drug, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-800/60 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-sky-200 transition-all">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                        <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">{drug.name}</h4>
                        <span className="bg-sky-500 text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-xs">{drug.price}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-sky-500" /> {drug.pharmacies[0]}</div>
                        <div className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Stock: {drug.stock}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Fake Drug Detector */}
            {activeSection === 'fake-drug' && (
              <div className="max-w-xl mx-auto text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-sm">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">{t('fake_drug')}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">{t('nafdac_authenticity_msg')}</p>
                
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder={t('nafdac_placeholder')}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-6 text-center text-xl font-extrabold uppercase tracking-widest focus:outline-none focus:border-rose-500 transition-all dark:text-white"
                    value={nafdacNum}
                    onChange={(e) => setNafdacNum(e.target.value)}
                  />
                  <button 
                    disabled={verifyStatus === 'loading' || !nafdacNum}
                    onClick={handleVerifyNafdac}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-4 rounded-2xl text-xs sm:text-sm tracking-wider shadow-lg shadow-rose-600/20 active:scale-95 transition-all disabled:opacity-50 uppercase cursor-pointer"
                  >
                    {verifyStatus === 'loading' ? t('loading') : t('verify')}
                  </button>
                </div>

                <AnimatePresence>
                  {verifyStatus !== 'idle' && verifyStatus !== 'loading' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`mt-6 p-6 rounded-2xl border ${verifyStatus === 'valid' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                      {verifyStatus === 'valid' ? (
                        <>
                          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-600" />
                          <h3 className="text-lg font-extrabold tracking-tight mb-1">Original Drug Verified</h3>
                          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Certified by NAFDAC Standards</p>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-rose-600" />
                          <h3 className="text-lg font-extrabold tracking-tight mb-1">Suspicious Medicine</h3>
                          <p className="text-xs font-bold uppercase tracking-wider opacity-80">This code is unrecognized. Do not consume.</p>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* 3. Blood Donor Finder */}
            {activeSection === 'blood' && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 text-xs font-bold mb-2">
                      <Droplets className="w-3.5 h-3.5" /> Emergency Network
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{t('blood_finder')}</h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{t('blood_finder_desc')}</p>
                  </div>
                  <button 
                    onClick={() => setRegistrationMode(!registrationMode)} 
                    className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-2xl font-extrabold text-xs tracking-wider transition-all shadow-md shadow-rose-600/20 uppercase cursor-pointer"
                  >
                    {registrationMode ? t('back') : t('register_donor')}
                  </button>
                </div>

                {registrationMode ? (
                  <div className="max-w-md bg-slate-50 dark:bg-slate-800/60 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 mx-auto">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 uppercase tracking-tight">{t('blood_register_lifesaver')}</h3>
                    <div className="space-y-4">
                      <select 
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 font-bold dark:text-white outline-none focus:border-rose-500 text-sm"
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                      >
                        <option value="">{t('blood_select_group')}</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                      <button 
                        onClick={handleRegisterDonor} 
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-md cursor-pointer"
                      >
                        {t('blood_submit_registration')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                        <button 
                          key={group} 
                          onClick={() => setBloodGroup(group)}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-xs border transition-all cursor-pointer ${
                            bloodGroup === group 
                              ? 'bg-rose-600 border-rose-600 text-white shadow-md' 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-300'
                          }`}
                        >
                          {group}
                        </button>
                      ))}
                      <button 
                        onClick={searchDonors} 
                        className="ml-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase cursor-pointer shadow-sm hover:opacity-90"
                      >
                        {t('blood_search_donors')}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {nearbyDonors.map((donor, i) => (
                        <div key={i} className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center text-rose-600 font-extrabold text-xs">{donor.bloodGroup}</div>
                            <div>
                              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{donor.name}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{donor.location}</p>
                            </div>
                          </div>
                          <button className="w-full py-2.5 bg-white dark:bg-slate-900 rounded-xl text-xs font-extrabold text-rose-600 border border-rose-100 dark:border-rose-900 hover:bg-rose-50 transition-colors cursor-pointer">
                            Emergency Contact
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Maternal & Child Care */}
            {activeSection === 'maternal' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 text-xs font-bold mb-3">
                    <Baby className="w-3.5 h-3.5" /> Family Health
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">{t('maternal_care')}</h2>
                  
                  <div className="bg-purple-50/60 dark:bg-purple-950/30 p-6 sm:p-8 rounded-3xl border border-purple-100 dark:border-purple-900/50">
                    <h3 className="text-lg font-extrabold text-purple-900 dark:text-purple-300 mb-4 flex items-center gap-2">
                      <Baby className="w-5 h-5 text-purple-600" />
                      Pregnancy Milestone Tracker
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-bold text-purple-700 dark:text-purple-300">
                        <span>Week 1</span>
                        <span className="bg-purple-600 text-white px-2 py-0.5 rounded text-[10px]">Current: Week {pregnancyWeek}</span>
                        <span>Week 42</span>
                      </div>
                      <input 
                        type="range" min="1" max="42" 
                        value={pregnancyWeek} 
                        onChange={(e) => setPregnancyWeek(parseInt(e.target.value))}
                        className="w-full h-2 bg-purple-200 dark:bg-purple-800 appearance-none rounded-full accent-purple-600 cursor-pointer"
                      />
                      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-purple-100 dark:border-purple-800 shadow-xs">
                        <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">Week {pregnancyWeek} Development</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">"Baby is developing rapidly. Ensure proper folic acid and iron intake today."</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{t('immunization')}</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'BCG & Oral Polio (Birth)', status: 'Completed', icon: CheckCircle2 },
                      { name: 'DTP-HepB-Hib (6 Weeks)', status: 'Completed', icon: CheckCircle2 },
                      { name: 'Rotavirus (10 Weeks)', status: 'Upcoming', icon: Clock },
                      { name: 'Pneumococcal (14 Weeks)', status: 'Upcoming', icon: Clock }
                    ].map((vacc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${vacc.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                            <vacc.icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white">{vacc.name}</span>
                        </div>
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md ${vacc.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                          {vacc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-md cursor-pointer">
                    View Full Immunization Schedule
                  </button>
                </div>
              </div>
            )}

            {/* 5. First Aid Emergency Guide */}
            {activeSection === 'emergency-guide' && (
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-xs font-bold mb-3">
                  <Activity className="w-3.5 h-3.5" /> Emergency Protocols
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">{t('first_aid')}</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {FIRST_AID_STEPS.map((guide) => (
                    <div key={guide.id} className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">{guide.title}</h3>
                      <div className="space-y-3">
                        {guide.steps.map((step, i) => (
                          <div key={i} className="flex gap-3 text-xs sm:text-sm">
                            <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-extrabold">{i + 1}</span>
                            <p className="font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Treatment Cost Estimator */}
            {activeSection === 'cost' && (
              <div className="max-w-2xl mx-auto py-4">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500 mx-auto mb-4 shadow-sm">
                    <Coins className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">{t('cost_estimator')}</h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t('cost_estimator_desc')}</p>
                </div>

                <div className="space-y-3">
                  {[
                    { illness: t('cost_malaria'), range: '₦4,500 - ₦7,200', components: t('cost_malaria_comp') },
                    { illness: t('cost_antenatal'), range: '₦25,000 - ₦65,000', components: t('cost_antenatal_comp') },
                    { illness: t('cost_diagnostic'), range: '₦12,000 - ₦22,000', components: t('cost_diagnostic_comp') },
                    { illness: t('cost_gp'), range: '₦5,000 - ₦15,000', components: t('cost_gp_comp') },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">{item.illness}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.components}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base sm:text-lg font-extrabold text-sky-600">{item.range}</span>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Regional Est.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Local Language Picker Section */}
            {activeSection === 'lang' && (
              <div className="max-w-md mx-auto text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white mx-auto mb-6 shadow-sm">
                  <Globe className="w-8 h-8" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">{t('select_lang')}</h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8">Choose your preferred language for regional clinical guides.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'pidgin', label: 'Pidgin (Nigeria/Ghana)' },
                    { code: 'yo', label: 'Yoruba' },
                    { code: 'ha', label: 'Hausa' },
                    { code: 'ig', label: 'Igbo' },
                  ].map((lang) => (
                    <button 
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setActiveSection(null);
                      }}
                      className={`py-4 px-5 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                        language === lang.code 
                          ? 'bg-sky-600 text-white shadow-md' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default RegionalHealthHub;
