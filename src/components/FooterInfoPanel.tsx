import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Activity, 
  Shield, 
  Users, 
  Clock, 
  Globe, 
  Lock, 
  Info, 
  CheckCircle2, 
  FileText, 
  Award, 
  Brain, 
  HeartPulse, 
  Stethoscope, 
  Zap, 
  ShieldCheck,
  Check
} from 'lucide-react';

export type FooterContentType = 
  | 'how-it-works' 
  | 'medical-network' 
  | 'patient-portal' 
  | 'safety-protocols' 
  | 'terms' 
  | 'privacy' 
  | 'ethics' 
  | 'compliance';

interface InfoPanelProps {
  type: FooterContentType | null;
  onClose: () => void;
}

interface ContentDefinition {
  title: string;
  subtitle: string;
  tag: string;
  icon: React.ElementType;
  renderContent: () => React.ReactNode;
}

const contentData: Record<FooterContentType, ContentDefinition> = {
  'how-it-works': {
    title: "How MedConnect Works",
    subtitle: "Clinical intelligence architecture built for rapid triage & verified care",
    tag: "Platform Architecture",
    icon: Activity,
    renderContent: () => (
      <div className="space-y-6 sm:space-y-8 text-left font-manrope">
        {/* Overview Box */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-sky-50/70 border border-sky-100">
          <h4 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mb-2">
            Clinical Synchrony at Scale
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            MedConnect unifies artificial intelligence diagnostics with board-certified clinical oversight. Our four-step workflow ensures patients receive immediate assessment, live biometric tracking, and direct access to licensed practitioners worldwide.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {[
            {
              step: "01",
              title: "AI Symptom Triage",
              desc: "Natural language analysis cross-referenced with 12,000+ clinical evidence vectors in under 1.2 seconds.",
              icon: Brain,
              accent: "text-sky-500 bg-sky-50"
            },
            {
              step: "02",
              title: "Vital Telemetry Sync",
              desc: "Continuous synchronization of heart rate, blood pressure, and sleep biomarkers with instant physician alerts.",
              icon: HeartPulse,
              accent: "text-teal-600 bg-teal-50"
            },
            {
              step: "03",
              title: "Doctor Consultation",
              desc: "Direct encrypted video, audio, or chat consultations with licensed specialists across 40+ medical specialties.",
              icon: Stethoscope,
              accent: "text-blue-600 bg-blue-50"
            },
            {
              step: "04",
              title: "Prescription & Care",
              desc: "Integrated dosage reminders, digital health passport tokens, and automated emergency escalation routing.",
              icon: ShieldCheck,
              accent: "text-emerald-600 bg-emerald-50"
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50/80 border border-slate-100 hover:border-sky-200 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs ${item.accent}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">Step {item.step}</span>
                </div>
                <h5 className="text-sm font-extrabold text-slate-900 tracking-tight mb-1">{item.title}</h5>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Security Highlight */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">100% HIPAA & GDPR Compliant</p>
            <p className="text-[11px] text-slate-500 font-normal">All clinical interactions are sealed with AES 256-bit encryption end-to-end.</p>
          </div>
        </div>
      </div>
    )
  },

  'medical-network': {
    title: "Verified Specialist Network",
    subtitle: "A curated global lattice of board-certified practitioners across 40+ specialties",
    tag: "Doctor Directory & Credentials",
    icon: Stethoscope,
    renderContent: () => (
      <div className="space-y-6 sm:space-y-8 text-left font-manrope">
        {/* Network Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xl sm:text-2xl font-extrabold text-sky-500 tracking-tight">500+</p>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Specialists</p>
          </div>
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">40+</p>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Specialties</p>
          </div>
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 tracking-tight">Top 3%</p>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Acceptance</p>
          </div>
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">&lt; 2 min</p>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Average Wait</p>
          </div>
        </div>

        {/* Credentialing Standards Card */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-sky-50/70 border border-sky-100 space-y-3">
          <div className="flex items-center gap-2 text-sky-600">
            <ShieldCheck className="w-5 h-5 text-sky-500" />
            <h4 className="text-sm sm:text-base font-extrabold tracking-tight">Rigorous 12-Point Credentialing Protocol</h4>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every practitioner on MedConnect undergoes primary source medical license verification, board certifications review, malpractice screening, and ongoing peer evaluation through our Clinical Quality Index (CQI).
          </p>
        </div>

        {/* Specialty Pillars */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Clinical Disciplines</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { name: "Cardiology & Vascular", desc: "Arrhythmia detection, hypertension management" },
              { name: "Neurology & Cognitive", desc: "Migraine triage, cognitive assessment, sleep" },
              { name: "Internal Medicine", desc: "Complex diagnostics, metabolic health, preventative" },
              { name: "Pediatrics & Family Care", desc: "Childhood health, acute viral care, vaccinations" }
            ].map((spec, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-white border border-slate-100 flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-extrabold text-slate-900">{spec.name}</p>
                  <p className="text-[11px] text-slate-500">{spec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },

  'patient-portal': {
    title: "Patient Health Portal",
    subtitle: "Unified command center for your vitals, prescriptions, and encrypted health passport",
    tag: "Digital Health Passport",
    icon: Activity,
    renderContent: () => (
      <div className="space-y-6 sm:space-y-8 text-left font-manrope">
        {/* Main Banner */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/15">
          <h4 className="text-lg sm:text-xl font-extrabold tracking-tight mb-2">
            Your Health Records, Fully Owned By You
          </h4>
          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed font-normal">
            The MedConnect Portal aggregates real-time biometric streams, doctor consultation notes, prescription schedules, and verified lab results into a single sovereign dashboard.
          </p>
        </div>

        {/* Portal Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-500 mb-1">Live Telemetry</p>
            <p className="text-sm font-extrabold text-slate-900">Continuous Vitals</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">Steps, hydration, sleep, and blood pressure tracked synchronously.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1">Encrypted Vault</p>
            <p className="text-sm font-extrabold text-slate-900">AES 256-Bit Vault</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">Patient data is encrypted at rest and in transit with zero third-party sharing.</p>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-1">Portability</p>
            <p className="text-sm font-extrabold text-slate-900">Global Passport</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">Export ISO-standard clinical files readable by hospitals globally.</p>
          </div>
        </div>

        {/* Direct Action Notice */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-slate-700">Patient Portal is active in your clinical suite</span>
          </div>
        </div>
      </div>
    )
  },

  'safety-protocols': {
    title: "Clinical Safety Protocols",
    subtitle: "Zero-trust safeguards, AI validation safeguards, and instant emergency escalation",
    tag: "Patient Safety First",
    icon: Shield,
    renderContent: () => (
      <div className="space-y-6 sm:space-y-8 text-left font-manrope">
        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {[
            {
              title: "Human Physician Oversight",
              desc: "AI triage assessments provide diagnostic guidance but never replace human board-certified judgment."
            },
            {
              title: "Zero-Trust Encryption",
              desc: "All clinical consultations and vitals streams are protected with TLS 1.3 and military-grade AES-256 cipher."
            },
            {
              title: "24/7 Urgent Escalation",
              desc: "Sudden anomalies in blood pressure or heart rate trigger automated alerts and priority routing to emergency dispatch."
            },
            {
              title: "Biometric Identity Guard",
              desc: "Multi-factor authentication and hardware verification protect your medical history against unauthorized access."
            }
          ].map((item, i) => (
            <div key={i} className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50/80 border border-slate-100 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                <h5 className="text-sm font-extrabold text-slate-900 tracking-tight">{item.title}</h5>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Safety Quote Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/60 border border-sky-100 text-center">
          <p className="text-xs text-sky-800 font-medium italic">
            "Clinical safety is not a secondary feature; it is the non-negotiable foundation of everything we build at MedConnect."
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-sky-500 mt-1.5">— MedConnect Safety Board</p>
        </div>
      </div>
    )
  },

  'terms': {
    title: "Terms of Service",
    subtitle: "Clinical platform usage agreement & digital healthcare guidelines",
    tag: "Legal & Usage Terms",
    icon: FileText,
    renderContent: () => (
      <div className="space-y-5 sm:space-y-6 text-left font-manrope">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            By accessing or using the MedConnect platform, you agree to comply with our service standards, patient responsibilities, and medical consultation terms outlined below.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-1.5">
            <h5 className="text-xs sm:text-sm font-extrabold text-slate-900">1. Scope of Digital Care</h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              MedConnect provides AI-powered triage and remote telemedicine consultations. In severe or life-threatening emergencies, patients must immediately contact local physical emergency services (e.g., 911 / 999 / 112).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-1.5">
            <h5 className="text-xs sm:text-sm font-extrabold text-slate-900">2. Account Responsibility & Integrity</h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              You agree to provide accurate biometric and health information. You are responsible for safeguarding your login credentials and preventing unauthorized access to your health passport.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-1.5">
            <h5 className="text-xs sm:text-sm font-extrabold text-slate-900">3. Physician Professional Discretion</h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              Practitioners on MedConnect retain independent clinical discretion regarding treatments, prescriptions, and referrals based on verified telemedicine standards.
            </p>
          </div>
        </div>
      </div>
    )
  },

  'privacy': {
    title: "Privacy Directive",
    subtitle: "Zero advertising tracking, clinical data sovereignty, and strict confidential silos",
    tag: "Data Privacy & HIPAA",
    icon: Lock,
    renderContent: () => (
      <div className="space-y-5 sm:space-y-6 text-left font-manrope">
        {/* Core Privacy Promise */}
        <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-emerald-50/70 border border-emerald-100 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h4 className="text-sm sm:text-base font-extrabold tracking-tight">Zero Commercial Data Monetization</h4>
          </div>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
            MedConnect will never sell, rent, or trade your medical vitals, consultation records, or personal data to advertisers, insurance brokers, or external data brokers.
          </p>
        </div>

        {/* Privacy Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="text-xs font-extrabold text-slate-900">Isolated Silos</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">Your data resides in partitioned HIPAA-compliant vaults with hardware keys.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="text-xs font-extrabold text-slate-900">Right to Erasure</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">Request complete data purge at any time under GDPR & CCPA directives.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <p className="text-xs font-extrabold text-slate-900">Audit Trails</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">Every record access by a doctor is logged and visible in your patient log.</p>
          </div>
        </div>
      </div>
    )
  },

  'ethics': {
    title: "Clinical AI Ethics",
    subtitle: "Algorithmic neutrality, transparency, and patient empowerment",
    tag: "Data Ethics & AI Transparency",
    icon: Info,
    renderContent: () => (
      <div className="space-y-5 sm:space-y-6 text-left font-manrope">
        <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2">
          <h4 className="text-sm sm:text-base font-extrabold text-slate-900">The Techno-Hippocratic Oath</h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We believe technology must amplify medical empathy, eliminate geographic barriers to care, and never replace the core human relationship between patient and doctor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <p className="text-xs font-extrabold text-slate-900">Bias Stress Testing</p>
            <p className="text-xs text-slate-500 leading-relaxed">Monthly audits on triage algorithms ensure diagnostic neutrality across all demographics.</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <p className="text-xs font-extrabold text-slate-900">Explainable AI</p>
            <p className="text-xs text-slate-500 leading-relaxed">Patients always receive clear diagnostic trace explanations when AI aids assessment.</p>
          </div>
        </div>
      </div>
    )
  },

  'compliance': {
    title: "Compliance & Accreditations",
    subtitle: "Continuous synchronization with global healthcare regulations & ISO standards",
    tag: "Regulatory Standards",
    icon: Award,
    renderContent: () => (
      <div className="space-y-5 sm:space-y-6 text-left font-manrope">
        {/* Compliance Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "HIPAA Compliant", status: "Verified 2026", desc: "US Health Data Protection" },
            { label: "ISO 27001", status: "Certified", desc: "Information Security Standard" },
            { label: "UK-GDPR", status: "Audited", desc: "Strict Privacy Compliance" },
            { label: "NHS-DTAC", status: "Standard", desc: "Digital Health Tech Criteria" }
          ].map((item, i) => (
            <div key={i} className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <Award className="w-5 h-5 text-sky-500 mb-2" />
              <div>
                <p className="text-xs font-extrabold text-slate-900 leading-tight">{item.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">{item.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
          MedConnect conducts quarterly independent security penetration testing and clinical governance audits to ensure uninterrupted adherence to international medical standards.
        </div>
      </div>
    )
  }
};

export default function FooterInfoPanel({ type, onClose }: InfoPanelProps) {
  const data = type ? contentData[type] : null;

  return (
    <AnimatePresence>
      {type && data && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-6 md:p-8 font-manrope">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[88vh] bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-sky-100 shadow-[0_25px_70px_rgba(14,165,233,0.18)] flex flex-col overflow-hidden text-slate-900 z-10"
          >
            {/* Top Ambient Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-sky-400/15 via-sky-300/5 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Modal Header */}
            <div className="p-5 sm:p-7 sm:pb-5 border-b border-slate-100 flex items-start justify-between relative z-10 bg-white/90 backdrop-blur-md">
              <div className="max-w-[80%] text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-sky-100 bg-sky-50 text-sky-600 text-[11px] font-semibold mb-2">
                  <data.icon className="w-3.5 h-3.5 text-sky-500" />
                  <span>{data.tag}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {data.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1 leading-snug">
                  {data.subtitle}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95"
                title="Close"
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 relative z-10 custom-scrollbar">
              {data.renderContent()}
            </div>

            {/* Modal Footer Bar */}
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md relative z-10 flex items-center justify-between gap-3">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified MedConnect Protocol</span>
              </div>

              <button
                onClick={onClose}
                className="w-full sm:w-auto py-2.5 sm:py-3 px-6 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 ml-auto"
              >
                <span>Understood & Close</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
