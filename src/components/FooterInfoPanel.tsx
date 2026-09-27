import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Activity, Shield, Users, Clock, Globe, Lock, Info, CheckCircle2, Sparkles, FileText, Award, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

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

const contentData: Record<FooterContentType, { title: string; subtitle: string; icon: any; content: (zoom: number) => React.ReactNode }> = {
  'how-it-works': {
    title: "How It Works",
    subtitle: "Built for Clinical Scale & Precision",
    icon: Activity,
    content: (zoom) => (
      <div className="space-y-8 md:space-y-12" style={{ fontSize: `${zoom * 100}%` }}>
        <section className="space-y-4 md:space-y-6">
          <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase italic tracking-tighter">Architectural Overview</h3>
          <p className="text-slate-300 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
            MedConnect is built upon a resilient distributed lattice of clinical intelligence. Our engineering philosophy prioritizes three core pillars: Deterministic Security, Low-Latency Synchronicity, and Human-Centric AI Augmentation. By bridging the gap between legacy medical infrastructure and bleeding-edge cloud technologies, we've created a nervous system for modern healthcare that scales across borders and jurisdictions.
          </p>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            The platform's underlying stack utilizes an event-driven micro-frontend architecture, ensuring that patient data flows as a synchronous stream rather than disconnected fragments. We leverage advanced vector-based indexing for symptom checking and military-grade encryption for all peer-to-peer clinical consultations. Every component of MedConnect, from the biometric sync engine to the real-time doctor directory, is hardened against both technical failure and unauthorized access, maintaining an uptime of 99.99% for critical triage services.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[
            { step: "01", title: "Distributed Identity", desc: "Our platform begins with absolute identity integrity. We utilize multi-factor biometric validation synced across decentralized identity providers. This ensures that a patient's medical history is only accessible through their own biological and digital signature, eliminating the risk of record spoofing or institutional data leaks." },
            { step: "02", title: "Intelligent Triage", desc: "The MedConnect Neural Engine analyzes over 12,000 symptom vectors in under 1.2ms. This isn't just a search; it's a semantic understanding of patient discomfort. The system cross-references real-time data with global medical journals to suggest the most accurate clinical path before a human specialist even enters the loop." },
            { step: "03", title: "Encrypted Synapse", desc: "Clinical consultations occur within an 'Encrypted Synapse'—a high-bandwidth, end-to-end encrypted video and data tunnel. This allows specialists to view live vitals directly on their HUD while conversing with patients, facilitating immediate diagnostic decisions without the typical data lag found in legacy telehealth tools." },
            { step: "04", title: "Recursive Monitoring", desc: "Care is managed through recursive monitoring loops. Our automated agents track recovery progress and vital sign trends, triggering immediate human escalation if a patient's recovery trajectory deviates from expected clinical benchmarks." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-start space-y-3 bg-white/5 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-white/5 hover:bg-white/10 transition-colors">
              <span className="text-4xl md:text-5xl font-display font-black text-primary-500 italic leading-none">{item.step}</span>
              <div>
                <h4 className="text-base md:text-lg font-black text-white uppercase tracking-widest mb-2 md:mb-3">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="p-6 md:p-10 bg-primary-600/5 border border-primary-500/20 rounded-3xl md:rounded-[3rem] space-y-4 md:space-y-6">
          <h4 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tight">The Technical Build</h4>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            MedConnect's frontend is a high-performance React application optimized for frame-perfect responsiveness, ensuring clinicians can interact with medical data without visual stutter or input lag. The backend is a serverless, horizontally-scaling ecosystem that handles millions of concurrent biometric streams. Our 'Medical Intelligence Pulse' is a direct representation of this data lattice, showing real-time clinical connections. 
          </p>
        </section>
      </div>
    )
  },
  'medical-network': {
    title: "Medical Network",
    subtitle: "A Global Lattice of Professional Expertise",
    icon: Globe,
    content: (zoom) => (
      <div className="space-y-8 md:space-y-12" style={{ fontSize: `${zoom * 100}%` }}>
        <section className="space-y-4 md:space-y-6">
          <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase italic tracking-tighter">About Our Network</h3>
          <p className="text-slate-300 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
            The MedConnect Specialist Lattice is not merely a directory; it is a meticulously curated high-performance network of the world's leading medical professionals. By aggregating specialists across 40+ jurisdictions, we provide a borderless medical expertise tier that was previously inaccessible to the general public.
          </p>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            We utilize a proprietary 'Clinical Quality Index' (CQI) to monitor and rank provider performance. This index incorporates peer reviews, patient recovery rates, and adherence to the latest international clinical guidelines. This ensures that every specialist within our lattice isn't just board-certified, but is actively contributing to the cutting edge of their respective medical field.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <div className="p-6 md:p-10 bg-primary-600/10 border border-primary-500/20 rounded-3xl md:rounded-[3.5rem] relative overflow-hidden group">
            <Users className="w-12 h-12 md:w-20 md:h-20 text-primary-500 mb-6 md:mb-8 opacity-40 group-hover:scale-110 transition-transform duration-500" />
            <h4 className="text-2xl md:text-3xl font-display font-black text-white uppercase italic tracking-tighter mb-4 md:mb-6">Credentialing Standards</h4>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed">
              Acceptance into the MedConnect lattice requires a rigorous 12-point verification process. This includes primary source verification of all medical degrees, active licensure status, and a clear history of malpractice-free practice. We only accept the top 3% of applicants worldwide.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="p-8 md:p-10 bg-white/5 border border-white/5 rounded-3xl md:rounded-[2.5rem] text-center">
              <p className="text-4xl md:text-6xl font-display font-black text-white mb-2 md:mb-3 italic">1,200+</p>
              <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Board-Certified Specialists</p>
            </div>
            <div className="p-8 md:p-10 bg-white/5 border border-white/5 rounded-3xl md:rounded-[2.5rem] text-center">
              <p className="text-4xl md:text-6xl font-display font-black text-white mb-2 md:mb-3 italic">24/7</p>
              <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">Critical Triage Availability</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  'patient-portal': {
    title: "Patient Portal",
    subtitle: "The Command Center for Personal Health",
    icon: Activity,
    content: (zoom) => (
      <div className="space-y-8 md:space-y-12" style={{ fontSize: `${zoom * 100}%` }}>
        <section className="space-y-4 md:space-y-6">
          <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase italic tracking-tighter">Portal Interface</h3>
          <p className="text-slate-300 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
            The MedConnect Patient Portal is a revolutionary unified health dashboard. It serves as your personal command center, aggregating every medical data point—from real-time biometric streams to historical lab results—into a single, high-fidelity HUD.
          </p>
        </section>
        
        <div className="relative group rounded-3xl md:rounded-[3.5rem] overflow-hidden border border-white/20 shadow-2xl bg-black">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            src="https://picsum.photos/seed/med-dashboard-v3/1600/1200" 
            alt="Patient Portal Prototype" 
            className="w-full aspect-video md:aspect-[4/3] object-cover opacity-80 group-hover:opacity-100 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex items-end p-6 md:p-12">
            <div className="space-y-3 md:space-y-6">
              <div className="inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-xl">
                <Sparkles className="w-3 h-3 md:w-5 md:h-5 mr-1" />
                <span>Next-Gen Prototype</span>
              </div>
              <h4 className="text-white font-black text-xl md:text-4xl uppercase italic tracking-tighter leading-none">The Future of <br /> Health Ownership.</h4>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            The interface features a specialized 'Medical Action Bar' for instant access to AI consultations. The central telemetry view provides a vertical snapshot of your clinical state, including vitals synced directly from your worn medical devices.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
             {[
               { label: "Biometric Sync", value: "Real-time 1ms", desc: "Proprietary zero-lag lattice sync" },
               { label: "Encrypted Hub", value: "AES-256 Bit", desc: "Military grade patient data vault" },
               { label: "Lab Triage", value: "AI Diagnosis", desc: "Instant automated results analysis" }
             ].map((stat, i) => (
               <div key={i} className="p-6 md:p-8 bg-white/5 border border-white/5 rounded-2xl md:rounded-3xl">
                  <p className="text-[9px] font-black text-primary-500 uppercase tracking-widest mb-3 md:mb-4">{stat.label}</p>
                  <p className="text-lg md:text-xl font-bold text-white uppercase tracking-tight mb-1 md:mb-2">{stat.value}</p>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">{stat.desc}</p>
               </div>
             ))}
          </div>
        </section>

        <section className="p-6 md:p-10 bg-slate-800/50 border border-white/10 rounded-3xl md:rounded-[2.5rem] space-y-3 md:space-y-4">
          <h5 className="text-white font-black uppercase text-[10px] tracking-widest">Ownership & Portability</h5>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            MedConnect believes in radical data portability. Every record found within this portal can be instantly exported as an ISO-validated clinical file for use at any hospital worldwide.
          </p>
        </section>
      </div>
    )
  },
  'safety-protocols': {
    title: "Safety Protocols",
    subtitle: "A Zero-Trust Clinical Safeguard System",
    icon: Shield,
    content: (zoom) => (
      <div className="space-y-8 md:space-y-12" style={{ fontSize: `${zoom * 100}%` }}>
        <section className="space-y-4 md:space-y-6">
          <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase italic tracking-tighter">Safety Governance</h3>
          <p className="text-slate-300 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
            Patient safety is the non-negotiable baseline of our operations. We implement a multi-layered safety lattice that monitors every clinical interaction within the ecosystem.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[
             { title: "Clinical Peer-Oversite", desc: "Every AI-generated diagnostic suggestion is subject to real-time oversight. Suggestions are locked until a board-certified human specialist validates the path." },
             { title: "Quantum-Hardened Encryption", desc: "AES-256 end-to-end encryption for all sessions. Data pipelines are hardened against state-level interference, keeping your intimacy secure." },
             { title: "Emergency Triage Routing", desc: "Our engine monitors vital sign feeds. Critical crossings trigger an 'Instant Escalation' protocol, alerting local emergency services with full context." },
             { title: "Biometric Identity Vault", desc: "Legacy passwords are insufficient. We require multi-layered biometric identity verification, including facial recognition and hardware keys." }
          ].map((item, i) => (
            <div key={i} className="p-6 md:p-8 bg-white/5 rounded-3xl md:rounded-[2.5rem] border border-white/5 hover:border-primary-500/30 hover:bg-white/10 transition-all">
              <h4 className="text-[10px] md:text-sm font-black text-white uppercase tracking-widest mb-3 md:mb-4 flex items-center">
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary-500 mr-2 md:mr-3" />
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        <section className="p-6 md:p-10 bg-primary-600/5 rounded-3xl md:rounded-[2.5rem] border border-primary-500/20">
          <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed text-center italic">
            "Institutional safety is not a feature; it is the environment in which MedConnect exists." — MedConnect Safety Division.
          </p>
        </section>
      </div>
    )
  },
  'terms': {
    title: "Terms of Use",
    subtitle: "Institutional Clinical Agreement v4.2",
    icon: FileText,
    content: (zoom) => (
      <div className="space-y-8 md:space-y-12" style={{ fontSize: `${zoom * 100}%` }}>
        <section className="space-y-4 md:space-y-6">
          <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase italic tracking-tighter">Legal Terms</h3>
          <div className="p-6 md:p-10 bg-white/5 rounded-3xl md:rounded-[2.5rem] border border-white/10">
            <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-4">Executive Summary</p>
            <p className="text-base md:text-lg font-medium lg:leading-relaxed text-slate-300">By engaging with MedConnect, you enter a legally binding institutional service agreement. This specifies clinical responsibilities and data integrity obligations. Read these terms in full to understand our scope of digital medical care.</p>
          </div>
        </section>
        
        <div className="space-y-8 md:space-y-12">
          <section className="space-y-3 md:space-y-4">
            <h4 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tight">1. Access Protocols</h4>
            <p className="text-xs sm:text-sm">Access is restricted to validated account holders. You agree to provide accurate clinical data. Misrepresentation or hardware-spoofing results in institutional exclusion.</p>
          </section>
          
          <section className="space-y-3 md:space-y-4">
            <h4 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tight">2. Scope of Service</h4>
            <p className="text-xs sm:text-sm">MedConnect provides diagnostic augmentation and peer connections. We do not replace local emergency services. In acute emergencies, move to physical medical intervention immediately.</p>
          </section>

          <section className="space-y-3 md:space-y-4">
            <h4 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tight">3. Data Ownership</h4>
            <p className="text-xs sm:text-sm">Users retain ownership of medical data but grant MedConnect a processing license. Users agree not to reverse-engineer diagnostic algorithms or commit insurance fraud.</p>
          </section>

          <section className="space-y-3 md:space-y-4">
            <h4 className="text-lg md:text-xl font-black text-white uppercase italic tracking-tight">4. Liability</h4>
            <p className="text-xs sm:text-sm">Ultimate clinical responsibility rests with the human specialist. Liability is limited to data pipeline functionality and specialist vetting. Telehealth risks are acknowledged by usage.</p>
          </section>
        </div>
      </div>
    )
  },
  'privacy': {
    title: "Privacy Policy",
    subtitle: "Global Patient Data Directive",
    icon: Lock,
    content: (zoom) => (
      <div className="space-y-8 md:space-y-12" style={{ fontSize: `${zoom * 100}%` }}>
        <section className="space-y-4 md:space-y-6">
          <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase italic tracking-tighter">Privacy Directive</h3>
          <div className="p-6 md:p-10 bg-primary-600/10 rounded-3xl md:rounded-[2.5rem] border border-primary-500/20">
            <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-4">Patient-Center Privacy Model</p>
            <p className="text-lg md:text-xl font-bold text-white leading-tight">MedConnect operates under a 'Data Courier' philosophy. We do not own your health story; we provide the high-security infrastructure to tell it.</p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 md:gap-12">
          <section className="space-y-3 md:space-y-4">
            <h4 className="text-base md:text-lg font-black text-white uppercase tracking-widest">A. Data Collection</h4>
            <p className="text-xs sm:text-sm">We collect clinical history and real-time biometric vitals solely to facilitate diagnosis. We do not track cross-site behavior or build advertising profiles. Data remains in a clinical silo.</p>
          </section>
          <section className="space-y-3 md:space-y-4">
            <h4 className="text-base md:text-lg font-black text-white uppercase tracking-widest">B. Firewall Protocols</h4>
            <p className="text-xs sm:text-sm">Strict 'No-Share' firewall. Data is not sold or rented to insurers or marketers. Research data is fully anonymized and sharded, preventing re-identification.</p>
          </section>
          <section className="space-y-3 md:space-y-4">
            <h4 className="text-base md:text-lg font-black text-white uppercase tracking-widest">C. Right to Erasure</h4>
            <p className="text-xs sm:text-sm">Compliance with UK-GDPR standards allows a full lattice-purge of your record. Encrypted backups may exist for statutory periods before permanent destruction.</p>
          </section>
        </div>
      </div>
    )
  },
  'ethics': {
    title: "Data Ethics",
    subtitle: "The Techno-Hippocratic Alignment",
    icon: Info,
    content: (zoom) => (
      <div className="space-y-8 md:space-y-12" style={{ fontSize: `${zoom * 100}%` }}>
        <section className="space-y-4 md:space-y-6">
          <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase italic tracking-tighter">Usage Ethics</h3>
          <p className="text-slate-300 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
            MedConnect operates under a framework of Data Ethics. We believe technology should amplify medical care, never replace the human clinical touch or biological agency.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="p-6 md:p-10 bg-white/5 rounded-3xl md:rounded-[3rem] border border-white/5 hover:bg-white/10 transition-all space-y-4 md:space-y-6">
            <h4 className="text-[10px] md:text-xs font-black text-primary-400 uppercase tracking-widest mb-3 md:mb-6">Algorithmic Neutrality</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">We perform monthly 'Bias Stress Checks' on our AI triage modules. This ensures absolute neutrality across all demographic and geographic vectors.</p>
          </div>
          <div className="p-6 md:p-10 bg-white/5 rounded-3xl md:rounded-[3rem] border border-white/5 hover:bg-white/10 transition-all space-y-4 md:space-y-6">
            <h4 className="text-[10px] md:text-xs font-black text-primary-400 uppercase tracking-widest mb-3 md:mb-6">Radical Transparency</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">Every patient is notified via their HUD when synthetic intelligence is contributing to a diagnosis. We provide a full 'Diagnostic Trace'.</p>
          </div>
        </div>

        <section className="space-y-6 text-center max-w-xl mx-auto">
          <p className="text-[10px] md:text-sm text-slate-500 italic">"Technology without morality is a clinical failure." — The MedConnect Ethics Committee.</p>
        </section>
      </div>
    )
  },
  'compliance': {
    title: "Compliance Core",
    subtitle: "International Regulatory Synchronization",
    icon: Award,
    content: (zoom) => (
      <div className="space-y-8 md:space-y-12" style={{ fontSize: `${zoom * 100}%` }}>
        <section className="space-y-4 md:space-y-6">
          <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase italic tracking-tighter">Our Compliances</h3>
          <p className="text-slate-300 text-base sm:text-lg md:text-xl font-medium leading-relaxed">
            MedConnect maintains continuous synchronicity with global medical regulations. Compliance is a live biometric of our clinical health.
          </p>
        </section>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
           {[
             { label: "UK-GDPR", status: "Verified", cert: "Data Protection", desc: "Absolute compliance with the most stringent protection laws." },
             { label: "NHS-DTAC", status: "Compliant", cert: "Triage Standards", desc: "Meets clinical safety standards for integrated digital tools." },
             { label: "ISO-27001", status: "Standard", cert: "Ops Security", desc: "Gold-standard certification for information security management." },
             { label: "Cyber Ess.", status: "Plus", cert: "Hardening", desc: "Validated protection against complex cyber-territorian attacks." }
           ].map((cert, i) => (
             <div key={i} className="p-4 md:p-8 bg-white/5 rounded-3xl md:rounded-[2.5rem] border border-white/5 flex flex-col justify-between aspect-square group hover:bg-primary-600/5 hover:border-primary-500/20 transition-all">
               <Award className="w-5 h-5 md:w-8 md:h-8 text-primary-500 mb-2 md:mb-4 group-hover:scale-110 transition-transform" />
               <div>
                  <p className="text-white font-black uppercase text-xs sm:text-sm md:text-base tracking-tighter mb-1 leading-none">{cert.label}</p>
                  <p className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 md:mb-4 leading-none">{cert.cert}</p>
                  <div className="hidden sm:block mb-4">
                    <p className="text-[8px] text-slate-400 font-medium leading-relaxed">{cert.desc}</p>
                  </div>
                  <div className="flex items-center space-x-1 md:space-x-2">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[7px] md:text-[8px] font-mono text-green-500 uppercase tracking-widest">{cert.status}</p>
                  </div>
               </div>
             </div>
           ))}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center md:justify-end p-0 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            aria-hidden="true"
          />
          
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 35, stiffness: 250 }}
            className="relative w-full max-w-4xl h-full bg-slate-900 border-l border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden rounded-none sm:rounded-l-[3rem] md:rounded-l-[4rem]"
          >
            {/* Header */}
            <div className="p-6 sm:p-12 md:p-16 pb-8 pt-10 md:pt-16 flex justify-between items-start relative">
              <div className="max-w-[70%] sm:max-w-xl">
                <motion.div 
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="w-12 h-12 md:w-20 md:h-20 bg-primary-600/20 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center mb-6 md:mb-10 border border-primary-500/20 shadow-2xl shadow-primary-600/10"
                >
                  <data.icon className="w-6 h-6 md:w-10 md:h-10 text-primary-500" />
                </motion.div>
                <p className="text-[9px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] md:tracking-[0.5em] mb-3 md:mb-4">{data.subtitle}</p>
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-display font-black text-white uppercase italic tracking-tighter leading-[0.9] md:leading-tight">
                  {data.title.split(' ').map((word, idx) => (
                    <span key={idx} className={idx % 2 === 1 ? 'text-primary-600 not-italic' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all group border border-white/5 shadow-xl shrink-0"
              >
                <X className="w-5 h-5 md:w-8 md:h-8 transition-transform group-hover:rotate-90" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-12 md:p-16 pt-0 custom-scrollbar scroll-smooth">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="origin-top"
              >
                {data.content(1)}
              </motion.div>
            </div>

            {/* Footer */}
            <div className="p-6 sm:p-12 md:p-16 pt-8 pb-12 md:pb-16 border-t border-white/5 bg-slate-900/90 backdrop-blur-2xl pb-safe">
               <button 
                 onClick={onClose}
                 className="w-full h-16 md:h-20 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl md:rounded-[2rem] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs flex items-center justify-center group shadow-2xl transition-all active:scale-95"
               >
                 <span>Acknowledge Gateway</span>
                 <ChevronRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-2" />
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
