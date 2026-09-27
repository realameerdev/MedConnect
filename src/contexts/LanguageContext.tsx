import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'pidgin' | 'yo' | 'ha' | 'ig';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Hub
    hub_title: 'Regional Health Hub',
    hub_desc: 'Specialized tools for the African healthcare landscape.',
    drug_checker: 'Drug Price & Availability',
    fake_drug: 'Fake Drug Detector',
    blood_finder: 'Blood Donor Finder',
    maternal_care: 'Maternal & Child Care',
    first_aid: 'First Aid Guide',
    cost_estimator: 'Treatment Cost Estimator',
    select_lang: 'Select Language',
    dashboard: 'Dashboard',
    emergency: 'Emergency',
    drug_search_placeholder: 'Search drug name (e.g. Paracetamol)',
    nafdac_placeholder: 'Enter NAFDAC Number',
    verify: 'Verify',
    blood_group: 'Blood Group',
    register_donor: 'Register as Donor',
    pregnancy_week: 'Pregnancy Week',
    immunization: 'Immunization Schedule',
    estimate_cost: 'Estimate Cost',
    
    // Navbar
    nav_insights: 'Insights',
    nav_doctors: 'Doctors',
    nav_regional_hub: 'Regional Hub',
    nav_emergencies: 'Emergencies',
    nav_consult_ai: 'AI Assistant',
    nav_login: 'Log in',
    nav_signup: 'Sign up',
    nav_join: 'Join',
    nav_signout: 'Sign Out',
    
    // Hero
    hero_badge: 'Modern digital healthcare',
    hero_title_healing: 'Healing',
    hero_title_limits: 'Without limits',
    hero_desc: 'Experience clinical-grade healthcare from your screen. Connect with top specialists in minutes, not weeks. AI-powered monitoring included.',
    hero_btn_signin: 'Sign In',
    hero_btn_insights: 'Insights',
    hero_stat_patients: 'Patients',
    hero_stat_doctors: 'Doctors',
    hero_stat_secure: 'Secure',
    hero_stat_rating: 'Rating',
    
    // Dashboard
    dash_welcome: 'Welcome back',
    dash_health_overview: 'Health Overview',
    dash_actions: 'Quick Actions',
    dash_appointments: 'Appointments',
    dash_active_consult: 'Consult Doctor',
    dash_book_visit: 'Book Visit',
    dash_symptom_checker: 'Symptom Checker',
    dash_daily_pulse: 'Daily Pulse',
    dash_instant_diag: 'Instant Diagnostics',
    dash_authorized_suite: 'Authorized clinical suite',
    dash_diag_desc: 'Access clinical-grade diagnostics, practitioner network, and medical records in one synchronized environment.',
    dash_specialists: 'Specialists',
    dash_schedule: 'Schedule',
    dash_medical_portal: 'Medical portal',
    dash_last_sync: 'Last sync',
    dash_health_insights: 'Health Insights',
    dash_insights_desc: 'Track your daily vitals and wellness targets for a preventive approach to healthcare.',
    dash_wellness_score: 'Wellness score',
    dash_vitals_history: 'Vitals history',
    dash_view_expanded: 'View expanded records',
    dash_hipaa: 'HIPAA compliant protocol',
    dash_iso: 'ISO 27001 certified',
    
    // Hub specific
    hub_portal_subtitle: 'African Regional Portal',
    hub_launch_tool: 'Launch Tool',
    blood_finder_desc: 'Connecting donors with those in urgent need across locations.',
    blood_register_lifesaver: 'Become a Life-Saver',
    blood_select_group: 'Select Blood Group',
    blood_submit_registration: 'Submit Registration',
    blood_search_donors: 'Search Donors',
    nafdac_authenticity_msg: 'Enter the NAFDAC verification code found on the drug packaging to verify authenticity.',
    first_aid_low_data: 'Tool running in low-data offline mode',
    cost_estimator_desc: 'Get estimated costs for common medical services based on current market averages across major African hubs.',
    
    // Doctor Directory
    doc_verified: 'Verified Professionals',
    doc_meet: 'Meet Your',
    doc_specialists: 'Specialists.',
    doc_desc: 'Our board-certified experts are ready to provide clinical-grade guidance and care.',
    doc_available: 'Available Now',
    doc_total: 'Total Doctors',
    doc_search_ph: 'Search doctors...',
    doc_quick_search: 'Quick Search',
    doc_consult_now: 'Consult Now',
    doc_book_visit: 'Book Visit',
    doc_not_found: 'No Specialists Found',
    doc_not_found_desc: 'Try adjusting your filters or search terms',
    
    // Footer
    footer_desc: 'Architecting the future of clinical infrastructure. We bridge the gap between global medical intelligence and personal patient care.',
    footer_nav: 'Navigation',
    footer_legal: 'Legal core',
    footer_support: 'Live support',
    footer_support_desc: 'Need clinical assistance? Our emergency triage team is available 24/7 for account and usage guidance.',
    footer_ticket: 'Support ticket',
    footer_rights: 'All rights reserved',
    footer_healthy: 'Network healthy',
    footer_how_it_works: 'How It Works',
    footer_medical_network: 'Medical Network',
    footer_patient_portal: 'Patient Portal',
    footer_safety: 'Safety Protocols',
    footer_terms: 'Terms of Use',
    footer_privacy: 'Privacy Policy',
    footer_ethics: 'Data Ethics',
    footer_compliance: 'Compliance',
    
    // Nav Labels
    nav_home: 'Home',
    nav_portal: 'Portal',
    nav_regional: 'Regional',
    nav_consult: 'Consult',
    nav_passport: 'Passport',
    
    // Auth Modal
    auth_intro_h: 'The future of',
    auth_intro_s: 'Clinical connectivity',
    auth_intro_p: 'Access your global health passport, consult with elite specialists, and synchronize your vitals in real-time.',
    auth_trusted: 'Trusted by 12,000+ patients',
    auth_gateway: 'Institutional Gateway',
    auth_secure: 'Secure portal',
    auth_access: 'Access',
    auth_registration: 'Registration',
    auth_creds_p: 'Please enter your institutional credentials to authenticate.',
    auth_fullname: 'Full name',
    auth_country: 'Country',
    auth_age: 'Age',
    auth_patient: 'Patient',
    auth_doctor: 'Doctor',
    auth_email_id: 'Email identifier',
    auth_passcode: 'Security passcode',
    auth_grant: 'Grant access',
    auth_finalize: 'Finalize registration',
    auth_or_connect: 'Or connect via',
    auth_google_si: 'Sign in with Google',
    auth_google_su: 'Sign up with Google',
    auth_no_account: "Don't have an account?",
    auth_have_account: "Already have an account?",
    auth_register_today: 'Register today',
    auth_signin_instead: 'Sign in instead',
    auth_cancel: 'Cancel operation',
    auth_age_error: 'Access denied. You must be at least 18 years old to use MedConnect.',
    
    // Notifications
    not_center_h: 'Center of',
    not_center_s: 'Operations.',
    not_desc: 'Real-time intelligence and system alerts regarding your clinical journey.',
    not_empty: 'Scanning for new transmissions... No alerts detected.',
    not_new: 'New Transmission',
    not_secure: 'Secure End-to-End Encrypted Notification System',

    // Regional Hub Data
    drug_name_p: 'Paracetamol',
    drug_name_m: 'Artemether-Lumefantrine',
    drug_name_a: 'Augmentin 625mg',
    drug_stock_h: 'High',
    drug_stock_l: 'Limited',
    drug_stock_lo: 'Low',
    
    fa_burns_title: 'Burns',
    fa_burns_1: 'Cool the burn with cool (not cold) running water for 20 mins.',
    fa_burns_2: 'Remove clothing/jewelry unless stuck.',
    fa_burns_3: 'Cover with cling wrap or clean cloth.',
    fa_burns_4: 'Seek medical help if severe.',
    
    fa_bleeding_title: 'Bleeding',
    fa_bleeding_1: 'Apply direct pressure to the wound.',
    fa_bleeding_2: 'Elevate the limb if possible.',
    fa_bleeding_3: 'Keep pressure until help arrives.',
    fa_bleeding_4: 'Do not remove blood-soaked bandages.',
    
    fa_snake_title: 'Snake Bite',
    fa_snake_1: 'Keep the person calm and still.',
    fa_snake_2: 'Immobilize the bitten limb.',
    fa_snake_3: 'Keep the bite area below the heart level.',
    fa_snake_4: 'Call emergency services immediately.',
    fa_snake_5: 'Do NOT cut or suck the wound.',
    
    fa_fainting_title: 'Fainting',
    fa_fainting_1: 'Lay the person on their back.',
    fa_fainting_2: 'Elevate their legs (about 12 inches).',
    fa_fainting_3: 'Loosen tight clothing.',
    fa_fainting_4: 'Check for breathing.',
    fa_fainting_5: 'Stay with them until they regain consciousness.',
    
    // Dashboard Goal
    dash_of: 'of',
    dash_m_goal: 'm goal',

    // Cost Estimator
    cost_malaria: 'Malaria Treatment (Oral)',
    cost_antenatal: 'Antenatal Registration',
    cost_diagnostic: 'Diagnostic Full Panel',
    cost_gp: 'Standard GP Consultation',
    cost_malaria_comp: 'Doctor + Test + Drug',
    cost_antenatal_comp: 'Hospital Fee + Initial Screen',
    cost_diagnostic_comp: 'Labs only',
    cost_gp_comp: 'Telehealth/Physical',

    // Hero Cards
    hero_card_trust: 'Clinical trust',
    hero_card_care: 'Dedicated care',
    hero_card_live: 'Live video',
    hero_card_status: 'Consulting now',

    // Metrics
    v_blood_pressure: 'Blood pressure',
    v_cardio: 'Cardio vitals',
    v_systolic: 'Systolic',
    v_diastolic: 'Diastolic',
    v_steps: 'Steps',
    v_activity: 'Activity',
    v_movement: 'Movement',
    v_hydration: 'Hydration',
    v_water_intake: 'Water intake',
    v_fitness_log: 'Fitness log',
    v_daily_training: 'Daily training integration',
    v_log_glass: 'Log glass',
    v_start_tracking: 'Start auto tracking',
    v_tracking_on: 'Auto tracking ON',
    
    // Footer & Common
    back: 'Back',
    home: 'Home',
    explore: 'Explore',
    profile: 'Profile',
    loading: 'Loading...',
    save: 'Save Changes',
    cancel: 'Cancel',
  },
  pidgin: {
    // Hub
    hub_title: 'Health Tools for Here',
    hub_desc: 'Beta beta tools for our people health.',
    drug_checker: 'Drug Price & how e take dey',
    fake_drug: 'Check if medicine na original',
    blood_finder: 'Find person wey go give blood',
    maternal_care: 'Mama and Pikin Care',
    first_aid: 'Quick help for emergency',
    cost_estimator: 'Check how much treatment go cost',
    select_lang: 'Choose Language',
    dashboard: 'Your Page',
    emergency: 'Emergency help',
    drug_search_placeholder: 'Search for medicine',
    nafdac_placeholder: 'Enter NAFDAC number',
    verify: 'Check am',
    blood_group: 'Blood type',
    register_donor: 'Registry to give blood',
    pregnancy_week: 'Week of Belle',
    immunization: 'Time for pikin injection',
    estimate_cost: 'Check the price',
    
    // Navbar
    nav_insights: 'Gist',
    nav_doctors: 'Doctors',
    nav_regional_hub: 'Local Tools',
    nav_emergencies: 'Emergency',
    nav_consult_ai: 'AI Help',
    nav_login: 'Log in',
    nav_signup: 'Join us',
    nav_join: 'Join',
    nav_signout: 'Commot',
    
    // Hero
    hero_badge: 'Better health with phone',
    hero_title_healing: 'Healing',
    hero_title_limits: 'No borders at all',
    hero_desc: 'Better doctor care for your house. Connect with big doctors sharply. AI monitor sef follow.',
    hero_btn_signin: 'Enter',
    hero_btn_insights: 'Gist',
    hero_stat_patients: 'Patients',
    hero_stat_doctors: 'Doctors',
    hero_stat_secure: 'Secure',
    hero_stat_rating: 'Ratings',
    
    // Dashboard
    dash_welcome: 'Amediao',
    dash_health_overview: 'How you body dey',
    dash_actions: 'Quick tins',
    dash_appointments: 'Meetings',
    dash_active_consult: 'Talk to Doctor',
    dash_book_visit: 'Book Meeting',
    dash_symptom_checker: 'Check Sickness',
    dash_daily_pulse: 'Daily Health',
    
    // Footer & Common
    back: 'Go back',
    home: 'House',
    explore: 'Search',
    profile: 'Your Info',
    loading: 'Wait small...',
    save: 'Save am',
    cancel: 'No do again',
    auth_age_error: 'You never reach 18 years yet. MedConnect na for adult dem.',
  },
  yo: {
    // Hub
    hub_title: 'Ibùdó Ìlera Agbègbè',
    hub_desc: 'Awọn irinṣẹ pataki fun ilera wa.',
    drug_checker: 'Iye ati Wiwa Ogun',
    fake_drug: 'Oluyẹwo Ogun Ayederu',
    blood_finder: 'Olùṣàwárí Olùfúnni Ní Ẹ̀jẹ̀',
    maternal_care: 'Ìtọ́jú Ìyá àti Ọmọ',
    first_aid: 'Ìrànlọ́wọ́ Àkọ́kọ́',
    cost_estimator: 'Olùṣírò Owó Ìtọ́jú',
    select_lang: 'Yan Èdè',
    dashboard: 'Ojú-ewé rẹ',
    emergency: 'Ìrànlọ́wọ́ pàjáwìrì',
    drug_search_placeholder: 'Wá orúkọ ogun',
    nafdac_placeholder: 'Tẹ nọmba NAFDAC',
    verify: 'Yẹ ẹ wò',
    blood_group: 'Irúfẹ́ ẹ̀jẹ̀',
    register_donor: 'Forukọsilẹ lati fẹjẹ silẹ',
    pregnancy_week: 'Ọsẹ Oyún',
    immunization: 'Ètò Àjẹsára',
    estimate_cost: 'Yẹ iye owó wò',
    
    // Navbar
    nav_insights: 'Ìfunni',
    nav_doctors: 'Àwọn Dókítà',
    nav_regional_hub: 'Ibùdó Agbègbè',
    nav_emergencies: 'Pàjáwìrì',
    nav_consult_ai: 'AI Alákòóso',
    nav_login: 'Wọlé',
    nav_signup: 'Forukọsilẹ',
    nav_join: 'Darapọ',
    nav_signout: 'Jade',
    
    // Hero
    hero_badge: 'Ìlera ayélujára òde-òní',
    hero_title_healing: 'Ìwòsàn',
    hero_title_limits: 'Láìní ààlà',
    hero_desc: 'Ìrírí ìtọ́jú ìlera láti ojú ayélujára. Sopọ mọ́ àwọn dókítà pàtàkì ní ìṣẹ́jú díẹ̀.',
    hero_btn_signin: 'Wọlé',
    hero_btn_insights: 'Ìfunni',
    hero_stat_patients: 'Àwọn Aláìsàn',
    hero_stat_doctors: 'Àwọn Dókítà',
    hero_stat_secure: 'Aabo',
    hero_stat_rating: 'Ìwọ̀n',
    
    // Dashboard
    dash_welcome: 'Kúùbọ̀',
    dash_health_overview: 'Akopọ Ìlera',
    dash_actions: 'Awọn Igbese Kánmọ́',
    dash_appointments: 'Awọn Ipade',
    dash_active_consult: 'Bá Dókítà Sọ̀rọ̀',
    dash_book_visit: 'Ṣe Ìpàdé',
    dash_symptom_checker: 'Oluyẹwo Àmì Àìsàn',
    dash_daily_pulse: 'Ilera Ojoojumọ',
    
    // Footer & Common
    back: 'Padà',
    home: 'Ilé',
    explore: 'Kiri',
    profile: 'Àkọọlẹ Mi',
    loading: 'N ṣiṣẹ...',
    save: 'Pamọ́',
    cancel: 'Fagilé',
    auth_age_error: 'A kò gba ẹ láàyè. O gbọ́dọ̀ pé ọmọ ọdún méjìdín lógún (18) ó kéré tán.',
  },
  ha: {
    // Hub
    hub_title: 'Cibiyar Lafiya ta Yanki',
    hub_desc: 'Kayan aiki na musamman don lafiyar mu.',
    drug_checker: 'Farashin Magani da Samuwar sa',
    fake_drug: 'Gano Maganin Bogi',
    blood_finder: 'Neman Masu Ba da Jini',
    maternal_care: 'Kula da Uwa da Yara',
    first_aid: 'Taimakon Gaggawa',
    cost_estimator: 'Kimanin Kudin Magani',
    select_lang: 'Zaɓi Harshe',
    dashboard: 'Shafinka',
    emergency: 'Taimakon gaggawa',
    drug_search_placeholder: 'Nemi sunan magani',
    nafdac_placeholder: 'Saka lambar NAFDAC',
    verify: 'Tabbatar',
    blood_group: 'Rukunin jini',
    register_donor: 'Yi rajista don ba da jini',
    pregnancy_week: 'Makon Ciki',
    immunization: 'Tsarin Rigakafi',
    estimate_cost: 'Duba kudin',
    
    // Navbar
    nav_insights: 'Bayani',
    nav_doctors: 'Likitoci',
    nav_regional_hub: 'Cibiyar Yanki',
    nav_emergencies: 'Gaggawa',
    nav_consult_ai: 'AI Mataimaki',
    nav_login: 'Shiga',
    nav_signup: 'Yi Rajista',
    nav_join: 'Kasance tare da mu',
    nav_signout: 'Fita',
    
    // Hero
    hero_badge: 'Lafiyar zamani ta dijital',
    hero_title_healing: 'Warkarwa',
    hero_title_limits: 'Babu iyaka',
    hero_desc: 'Samun kulawar lafiya daga allonku. Haɗu da manyan likitoci a cikin mintuna kaɗan.',
    hero_btn_signin: 'Shiga',
    hero_btn_insights: 'Bayani',
    hero_stat_patients: 'Marasa lafiya',
    hero_stat_doctors: 'Likitoci',
    hero_stat_secure: 'Amintacce',
    hero_stat_rating: 'Girman daraja',
    
    // Dashboard
    dash_welcome: 'Barka da dawowa',
    dash_health_overview: 'Duban Lafiya',
    dash_actions: 'Ayyukan Gaggawa',
    dash_appointments: 'Alƙawura',
    dash_active_consult: 'Tuntuɓi Likita',
    dash_book_visit: 'Nemi Alƙawari',
    dash_symptom_checker: 'Duba Alamun Sanyi',
    dash_daily_pulse: 'Lafiyar Kullum',
    
    // Footer & Common
    back: 'Baya',
    home: 'Gida',
    explore: 'Bincika',
    profile: 'Profile',
    loading: 'Ana lodi...',
    save: 'Ajiye',
    cancel: 'Soke',
    auth_age_error: 'An hana izini. Dole ne ka kasance aƙalla shekaru 18 don amfani da MedConnect.',
  },
  ig: {
    // Hub
    hub_title: 'Ebe Nlekọta Ahụike mpaghara',
    hub_desc: 'Ngwa ọrụ pụrụ iche maka ahụike anyị.',
    drug_checker: 'Ọnụ ego na ọtụtụ ọgwụ',
    fake_drug: 'Ihe nchọpụta ọgwụ adịgboroja',
    blood_finder: 'Onye nchọpụta ndị na-enye ọbara',
    maternal_care: 'Nlekọta nne na nwa',
    first_aid: 'Enyemaka mbụ',
    cost_estimator: 'Onye na-atụ anya ụgwọ ọgwụgwọ',
    select_lang: 'Họrọ Asụsụ',
    dashboard: 'Peeji gị',
    emergency: 'Enyemaka mberede',
    drug_search_placeholder: 'Chọọ aha ọgwụ',
    nafdac_placeholder: 'Tinye nọmba NAFDAC',
    verify: 'Nyochaa',
    blood_group: 'Ụdị ọbara',
    register_donor: 'Debanye aha inye ọbara',
    pregnancy_week: 'Izu ime',
    immunization: 'Usoro ịgba ọgwụ mgbochi',
    estimate_cost: 'Lelee ego',
    
    // Navbar
    nav_insights: 'Aghọta',
    nav_doctors: 'Ndị dọkịta',
    nav_regional_hub: 'Ebe mpaghara',
    nav_emergencies: 'Ihe mberede',
    nav_consult_ai: 'AI Onye enyemaka',
    nav_login: 'Banye',
    nav_signup: 'Debanye aha',
    nav_join: 'Soro anyị',
    nav_signout: 'Puo',
    
    // Hero
    hero_badge: 'Ahụike dijitalụ ọgbara ọhụrụ',
    hero_title_healing: 'Ọgwụgwọ',
    hero_title_limits: 'Enweghị oke',
    hero_desc: 'Nweta nlekọta ahụike site na ihuenyo gị. Soro ndị dọkịta ama ama kparịta ụka n\'ime nkeji ole na ole.',
    hero_btn_signin: 'Banye',
    hero_btn_insights: 'Aghọta',
    hero_stat_patients: 'Ndị ọrịa',
    hero_stat_doctors: 'Ndị dọkịta',
    hero_stat_secure: 'Nchekwa',
    hero_stat_rating: 'Ọkwa',
    
    // Dashboard
    dash_welcome: 'Nnọọ',
    dash_health_overview: 'Nnyocha Ahụike',
    dash_actions: 'Ngwa ngwa',
    dash_appointments: 'Oge nzukọ',
    dash_active_consult: 'Gwa Dọkịta okwu',
    dash_book_visit: 'Dee oge nzukọ',
    dash_symptom_checker: 'Ihe nlele mgbaàmà',
    dash_daily_pulse: 'Ahụike kwa ụbọchị',
    
    // Footer & Common
    back: 'Laghachi',
    home: 'Ụlọ',
    explore: 'Chọpụta',
    profile: 'Profile gị',
    loading: 'Loading...',
    save: 'Chekwaa',
    cancel: 'Kagbuo',
    auth_age_error: 'Anaghị ekwe gị banye. Ị ga-akarịrị afọ iri na asatọ (18) iji jiri MedConnect.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('app-language') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
