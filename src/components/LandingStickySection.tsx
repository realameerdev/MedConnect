import React from 'react';
import { motion } from 'motion/react';
import { Brain, Shield, HeartPulse, Clock, ArrowRight, Activity, Stethoscope, Smartphone, Award } from 'lucide-react';

export default function LandingStickySection() {
  const cards = [
    {
      title: "AI-Powered Symptom Assessment",
      subtitle: "Instant clinical analysis",
      description: "Understand symptoms through natural language. Cross-referenced against global clinical guidelines.",
      icon: Brain,
      tag: "Sub-Second Triage",
      gradient: "from-sky-500/10 via-sky-400/5 to-transparent",
      accent: "text-sky-500 bg-sky-50 dark:bg-sky-950/60 border-sky-100 dark:border-sky-900",
      stats: "99.4% Accuracy",
    },
    {
      title: "Real-Time Vital Synchrony",
      subtitle: "Heart, Sleep & Activity",
      description: "Continuous vital tracking with anomaly detection and automated physician notifications.",
      icon: HeartPulse,
      tag: "Live Biomarkers",
      gradient: "from-teal-500/10 via-teal-400/5 to-transparent",
      accent: "text-teal-600 bg-teal-50 dark:bg-teal-950/60 border-teal-100 dark:border-teal-900",
      stats: "72 BPM Optimal",
    },
    {
      title: "Verified Doctor Lattice",
      subtitle: "Direct specialist access",
      description: "Book consultations with licensed physicians across 40+ medical specialties in under 2 minutes.",
      icon: Stethoscope,
      tag: "Top 3% Specialists",
      gradient: "from-blue-500/10 via-blue-400/5 to-transparent",
      accent: "text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-900",
      stats: "500+ Doctors",
    },
    {
      title: "24/7 Urgent Response",
      subtitle: "Emergency dispatch & GPS",
      description: "Immediate triage escalation with automated facility routing and critical contact sync.",
      icon: Shield,
      tag: "Immediate Care",
      gradient: "from-rose-500/10 via-rose-400/5 to-transparent",
      accent: "text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-100 dark:border-rose-900",
      stats: "< 60s Response",
    }
  ];

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-white dark:bg-slate-950 font-manrope transition-colors relative overflow-hidden overflow-x-clip max-w-full">
      
      {/* Soft background ambient light */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1100px] h-[500px] pointer-events-none opacity-40 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(14,165,233,0.05) 50%, transparent 70%)'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 md:mb-20 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-100 dark:border-sky-900/60 bg-sky-50/60 dark:bg-sky-950/40 text-sky-600 dark:text-sky-300 text-xs font-semibold mb-4">
            <Activity className="w-3.5 h-3.5" />
            <span>Clinical-Grade Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Designed for Everyday Health, <br className="hidden sm:inline" />
            <span className="text-sky-500">Built for Critical Care</span>
          </h2>

          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base md:text-lg font-normal mt-4 leading-relaxed">
            MedConnect combines AI diagnostics with certified human clinical oversight for complete healthcare confidence.
          </p>
        </div>

        {/* 4-Card Frosted Grid matching reference aesthetic with generous desktop spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 xl:gap-12">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="relative rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 lg:p-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(14,165,233,0.06)] hover:shadow-[0_25px_60px_rgba(14,165,233,0.12)] transition-all overflow-hidden text-left group flex flex-col justify-between"
            >
              {/* Subtle top-right ambient gradient */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${card.gradient} rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700`} />

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  {/* Top Bar with Icon & Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-md flex items-center justify-center text-sky-500 group-hover:scale-105 transition-transform">
                      <card.icon className="w-6 h-6 text-sky-500" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${card.accent}`}>
                      {card.tag}
                    </span>
                  </div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{card.subtitle}</p>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Metric Bar */}
                <div className="pt-6 mt-6 sm:mt-8 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {card.stats}
                  </span>
                  <span className="text-sky-500 text-xs font-semibold flex items-center gap-1">
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reference Trust Metric Bar */}
        <div className="mt-16 md:mt-24 lg:mt-28 pt-12 md:pt-16 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">12,000+</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Active Patients</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-sky-500 tracking-tight">99.4%</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Triage Precision</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">500+</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Licensed Doctors</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">&lt; 2 min</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Consultation Wait</p>
          </div>
        </div>
      </div>
    </section>
  );
}
