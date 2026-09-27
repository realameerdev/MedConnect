import React from 'react';
import { motion } from 'motion/react';
import { Smartphone, Zap, Shield, Globe, Award, Heart, CheckCircle2, TrendingUp, Users, Microscope } from 'lucide-react';

export default function LandingStickySection() {
  const bentoItems = [
    {
      title: "Real-time Diagnostics",
      description: "Our AI engine analyzes your vitals in sub-second latency.",
      icon: Zap,
      color: "bg-amber-500",
      size: "col-span-1 sm:col-span-2 md:col-span-2 row-span-1",
      delay: 0.1
    },
    {
      title: "Global Reach",
      description: "Access a worldwide network of elite specialists across 40+ countries with zero borders.",
      icon: Globe,
      color: "bg-blue-500",
      size: "col-span-1 sm:col-span-2 md:col-span-1 row-span-1",
      delay: 0.2
    },
    {
      title: "Military Encryption",
      description: "Your data is protected by 256-bit AES protocols.",
      icon: Shield,
      color: "bg-teal-500",
      size: "col-span-1 md:col-span-1 row-span-1 md:row-span-2",
      delay: 0.3
    },
    {
      title: "FDA Approved Protocols",
      description: "We strictly adhere to international clinical standards.",
      icon: Award,
      color: "bg-rose-500",
      size: "col-span-1 md:col-span-1 row-span-1",
      delay: 0.4
    },
    {
      title: "Patient First Hub",
      description: "A centralized dashboard for your entire medical history.",
      icon: Smartphone,
      color: "bg-indigo-500",
      size: "col-span-1 sm:col-span-2 md:col-span-2 row-span-1",
      delay: 0.5
    }
  ];

  return (
    <section className="py-20 md:py-24 bg-white dark:bg-slate-900 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-8">
          <div className="max-w-2xl">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-black tracking-[0.2em] md:tracking-[0.3em] text-[10px] mb-4 transition-colors"
            >
              <Microscope className="w-4 h-4" />
              <span>Advanced clinical core</span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic leading-[0.9] transition-colors">
              Innovation that <br className="hidden sm:block" />
              <span className="text-primary-600 not-italic">Preserves life</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium max-w-sm border-l-2 border-primary-100 dark:border-primary-900 pl-4 md:pl-6 leading-relaxed transition-colors">
            We don't just build apps; we architect clinical survival systems that bridge the gap between doctor and patient.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
          {bentoItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring",
                damping: 20,
                stiffness: 100,
                delay: item.delay 
              }}
              className={`${item.size} ${item.color} rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white relative overflow-hidden group shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 min-h-[200px] md:min-h-0 flex flex-col justify-end md:justify-between transition-shadow`}
            >
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500 mb-6 md:mb-0">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black tracking-tight mb-2 leading-tight">{item.title}</h3>
                  <p className="text-white/80 text-xs font-medium leading-relaxed max-w-[250px] md:max-w-[200px]">{item.description}</p>
                </div>
              </div>
              {/* Decorative Abstract Shape */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            </motion.div>
          ))}
        </div>

        <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 border-t border-slate-100 dark:border-slate-800 pt-12 md:pt-16 transition-colors">
           <div className="flex items-start space-x-6">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center shrink-0 transition-colors">
              <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="font-black border-b border-primary-600 dark:border-primary-400 text-slate-900 dark:text-white tracking-tighter mb-2 inline-block transition-colors">Rapid growth</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed transition-colors">Joined by 1,000+ medical professionals monthly across the United Kingdom.</p>
            </div>
          </div>
          <div className="flex items-start space-x-6">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-2xl flex items-center justify-center shrink-0 transition-colors">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-black border-b border-green-600 dark:border-green-400 text-slate-900 dark:text-white tracking-tighter mb-2 inline-block transition-colors">12.4k Trust</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed transition-colors">Patients actively using our platform for daily health monitoring and consultation.</p>
            </div>
          </div>
          <div className="flex items-start space-x-6">
            <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center shrink-0 transition-colors">
              <Heart className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h4 className="font-black border-b border-rose-600 dark:border-rose-400 text-slate-900 dark:text-white tracking-tighter mb-2 inline-block transition-colors">Patient care</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed transition-colors">Voted #1 for patient-centric digital healthcare interface in 2025.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
