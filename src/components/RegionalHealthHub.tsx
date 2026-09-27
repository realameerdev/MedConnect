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

// Types for components
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
  const [estimatedCosts, setEstimatedCosts] = useState<{illness: string, range: string}[]>([]);

  // 1. Drug Search Logic
  const filteredDrugs = drugSearch 
    ? MOCK_DRUGS.filter(d => d.name.toLowerCase().includes(drugSearch.toLowerCase()))
    : [];

  // 2. Fake Drug Logic
  const handleVerifyNafdac = () => {
    setVerifyStatus('loading');
    setTimeout(() => {
      // Logic: Mock verification
      if (nafdacNum.length === 8 && nafdacNum.startsWith('A')) {
        setVerifyStatus('valid');
      } else {
        setVerifyStatus('invalid');
      }
    }, 1500);
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
        location: 'Lagos, Nigeria', // Mock location
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
    const q = query(collection(db, 'blood_donors'), where('bloodGroup', '==', bloodGroup));
    const snap = await getDocs(q);
    setNearbyDonors(snap.docs.map(doc => doc.data()));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 font-bold tracking-widest text-[10px] uppercase">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('dashboard')}
        </button>

        {!activeSection ? (
          <div className="space-y-12">
            <header className="text-center md:text-left">
              <div className="inline-flex items-center space-x-2 bg-primary-500/10 dark:bg-primary-500/5 px-4 py-2 rounded-full border border-primary-500/20 text-primary-600 dark:text-primary-400 text-[10px] font-black tracking-[0.2em] mb-6 shadow-sm uppercase">
                <Globe className="w-3.5 h-3.5" />
                <span>{t('hub_portal_subtitle')}</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black font-display text-slate-900 dark:text-white tracking-tighter italic leading-none mb-6">
                {t('hub_title')}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
                {t('hub_desc')}
              </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[
                { id: 'drugs', icon: Pill, title: t('drug_checker'), color: 'bg-blue-500' },
                { id: 'fake-drug', icon: ShieldCheck, title: t('fake_drug'), color: 'bg-red-500' },
                { id: 'blood', icon: Droplets, title: t('blood_finder'), color: 'bg-rose-600' },
                { id: 'maternal', icon: Baby, title: t('maternal_care'), color: 'bg-purple-500' },
                { id: 'emergency-guide', icon: Activity, title: t('first_aid'), color: 'bg-emerald-500' },
                { id: 'cost', icon: Coins, title: t('cost_estimator'), color: 'bg-amber-500' },
                { id: 'lang', icon: Globe, title: t('select_lang'), color: 'bg-slate-800' },
              ].map((tool) => (
                <motion.button
                  key={tool.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(tool.id as HubSection)}
                  className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center group hover:shadow-2xl hover:shadow-primary-500/5 transition-all h-64 md:h-72"
                >
                  <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-${tool.id === 'blood' ? 'rose' : 'primary'}-500/20`}>
                    <tool.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{tool.title}</h3>
                  <div className="mt-6 flex items-center text-[9px] font-black text-slate-400 group-hover:text-primary-500 transition-colors uppercase tracking-widest">
                    {t('hub_launch_tool')} <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
            <button onClick={() => setActiveSection(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 bg-slate-100 dark:bg-slate-800 rounded-full transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* 1. Drug Price Checker Section */}
            {activeSection === 'drugs' && (
              <div className="max-w-3xl">
                <h2 className="text-3xl font-black italic text-slate-900 dark:text-white mb-8">{t('drug_checker')}</h2>
                <div className="relative mb-12">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder={t('drug_search_placeholder')}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl py-6 pl-16 pr-8 text-lg font-bold focus:outline-none focus:border-primary-500 transition-all dark:text-white"
                    value={drugSearch}
                    onChange={(e) => setDrugSearch(e.target.value)}
                  />
                </div>
                <div className="space-y-4">
                  {filteredDrugs.map((drug, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white">{drug.name}</h4>
                        <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-[10px] font-black">{drug.price}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary-500" /> {drug.pharmacies[0]}</div>
                        <div className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-500" /> Stock: {drug.stock}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Fake Drug Detector */}
            {activeSection === 'fake-drug' && (
              <div className="max-w-2xl mx-auto text-center py-12">
                <ShieldCheck className="w-20 h-20 text-red-500 mx-auto mb-8" />
                <h2 className="text-4xl font-black italic text-slate-900 dark:text-white mb-4">{t('fake_drug')}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-12">{t('nafdac_authenticity_msg')}</p>
                <div className="space-y-6">
                  <input 
                    type="text" 
                    placeholder={t('nafdac_placeholder')}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-5 px-8 text-center text-2xl font-black uppercase tracking-widest focus:outline-none focus:border-red-500 transition-all dark:text-white"
                    value={nafdacNum}
                    onChange={(e) => setNafdacNum(e.target.value)}
                  />
                  <button 
                    disabled={verifyStatus === 'loading' || !nafdacNum}
                    onClick={handleVerifyNafdac}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-2xl text-sm tracking-widest shadow-xl shadow-red-600/20 active:scale-95 transition-all disabled:opacity-50 uppercase"
                  >
                    {verifyStatus === 'loading' ? t('loading') : t('verify')}
                  </button>
                </div>
                <AnimatePresence>
                  {verifyStatus !== 'idle' && verifyStatus !== 'loading' && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`mt-8 p-8 rounded-3xl border-2 ${verifyStatus === 'valid' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                      {verifyStatus === 'valid' ? (
                        <>
                          <CheckCircle2 className="w-12 h-12 mx-auto mb-4" />
                          <h3 className="text-2xl font-black tracking-tight mb-2">Original Drug Verified</h3>
                          <p className="font-medium opacity-80 uppercase tracking-widest text-xs">Certified by NAFDAC Standards</p>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                          <h3 className="text-2xl font-black tracking-tight mb-2">Suspicious Medicine</h3>
                          <p className="font-medium opacity-80 uppercase tracking-widest text-xs tracking-tighter">This code is not in our verified registry. Do not consume.</p>
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                  <div>
                    <h2 className="text-3xl font-black italic text-slate-900 dark:text-white">{t('blood_finder')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{t('blood_finder_desc')}</p>
                  </div>
                  <button onClick={() => setRegistrationMode(!registrationMode)} className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-black text-xs tracking-widest transition-all shadow-xl shadow-rose-600/20 uppercase">
                    {registrationMode ? t('back') : t('register_donor')}
                  </button>
                </div>

                {registrationMode ? (
                  <div className="max-w-xl bg-slate-50 dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 mx-auto">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">{t('blood_register_lifesaver')}</h3>
                    <div className="space-y-6">
                      <select 
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-4 font-bold dark:text-white outline-none focus:border-rose-500"
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                      >
                        <option value="">{t('blood_select_group')}</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                          <option key={group} value={group}>{group}</option>
                        ))}
                      </select>
                      <button onClick={handleRegisterDonor} className="w-full bg-rose-600 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all uppercase">{t('blood_submit_registration')}</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    <div className="flex flex-wrap gap-4">
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                        <button 
                          key={group} 
                          onClick={() => setBloodGroup(group)}
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all ${bloodGroup === group ? 'bg-rose-600 border-rose-500 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-rose-200'}`}
                        >
                          {group}
                        </button>
                      ))}
                      <button onClick={searchDonors} className="ml-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase">{t('blood_search_donors')}</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {nearbyDonors.map((donor, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-rose-200 transition-all shadow-sm">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-600 font-black text-xs">{donor.bloodGroup}</div>
                            <div>
                              <h4 className="font-black text-slate-900 dark:text-white leading-tight">{donor.name}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{donor.location}</p>
                            </div>
                          </div>
                          <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-black text-slate-500 dark:text-slate-400 tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-colors">Emergency Contact</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Maternal & Child Care */}
            {activeSection === 'maternal' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-black italic text-slate-900 dark:text-white mb-8">{t('maternal_care')}</h2>
                  <div className="bg-purple-50 dark:bg-purple-900/10 p-8 rounded-[2.5rem] border border-purple-100 dark:border-purple-800/20 mb-12">
                    <h3 className="text-xl font-black text-purple-900 dark:text-purple-400 mb-6 flex items-center">
                      <Baby className="w-5 h-5 mr-3" />
                      Pregnancy Tracker
                    </h3>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-purple-600 dark:text-purple-500 uppercase tracking-widest">Current Week: {pregnancyWeek}</label>
                      <input 
                        type="range" min="1" max="42" 
                        value={pregnancyWeek} 
                        onChange={(e) => setPregnancyWeek(parseInt(e.target.value))}
                        className="w-full h-2 bg-purple-200 dark:bg-purple-800 appearance-none rounded-full accent-purple-600"
                      />
                      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl mt-6 border border-purple-100 dark:border-purple-800">
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Week {pregnancyWeek} Insight</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">"The baby is now the size of a {pregnancyWeek < 12 ? 'lime' : pregnancyWeek < 24 ? 'banana' : 'watermelon'}. Focus on iron-rich foods today."</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{t('immunization')}</h3>
                  <div className="space-y-3">
                    {['BCG & Oral Polio (Birth)', 'DTP-HepB-Hib (6 Weeks)', 'Rotavirus (6 Weeks)', 'Pneumococcal (10 Weeks)'].map((vacc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                            {i === 0 ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                          </div>
                          <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{vacc}</span>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-1 rounded-md ${i === 0 ? 'text-emerald-500 uppercase' : 'text-slate-400 uppercase tracking-widest'}`}>
                          {i === 0 ? 'Completed' : 'Upcoming'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-[10px] tracking-widest shadow-lg">View Full History</button>
                </div>
              </div>
            )}

            {/* 5. First Aid Emergency Guide */}
            {activeSection === 'emergency-guide' && (
              <div>
                <h2 className="text-3xl font-black italic text-slate-900 dark:text-white mb-12">{t('first_aid')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {FIRST_AID_STEPS.map((guide) => (
                    <div key={guide.id} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-primary-500/30 transition-all">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter mb-6">{guide.title}</h3>
                      <div className="space-y-4">
                        {guide.steps.map((step, i) => (
                          <div key={i} className="flex gap-4">
                            <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-black">{i + 1}</span>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Low data mode toggle notice */}
                <div className="mt-12 text-center text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase opacity-60">
                  {t('first_aid_low_data')}
                </div>
              </div>
            )}

            {/* 6. Treatment Cost Estimator */}
            {activeSection === 'cost' && (
              <div className="max-w-2xl mx-auto text-center py-8">
                <Coins className="w-16 h-16 text-amber-500 mx-auto mb-6" />
                <h2 className="text-3xl font-black italic text-slate-900 dark:text-white mb-4">{t('cost_estimator')}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-12">{t('cost_estimator_desc')}</p>
                <div className="space-y-4">
                  {[
                    { illness: t('cost_malaria'), range: '₦4,500 - ₦7,200', components: t('cost_malaria_comp') },
                    { illness: t('cost_antenatal'), range: '₦25,000 - ₦65,000', components: t('cost_antenatal_comp') },
                    { illness: t('cost_diagnostic'), range: '₦12,000 - ₦22,000', components: t('cost_diagnostic_comp') },
                    { illness: t('cost_gp'), range: '₦5,000 - ₦15,000', components: t('cost_gp_comp') },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:scale-[1.01] transition-all">
                      <div className="text-left">
                        <h4 className="font-black text-slate-900 dark:text-white tracking-tight leading-tight">{item.illness}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.components}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-primary-600 italic leading-none">{item.range.split('-')[1]}</span>
                        <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase text-slate-500/40">Upper estimate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Local Language Picker Section */}
            {activeSection === 'lang' && (
              <div className="max-w-xl mx-auto text-center py-12">
                <Globe className="w-16 h-16 text-slate-900 dark:text-white mx-auto mb-8" />
                <h2 className="text-3xl font-black italic text-slate-900 dark:text-white mb-12">{t('select_lang')}</h2>
                <div className="grid grid-cols-2 gap-4">
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
                      className={`py-5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all ${language === lang.code ? 'bg-primary-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
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
