import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Network, Activity, Cpu, Sparkles, Brain, Globe, ShieldCheck } from 'lucide-react';

export default function MedicalIntelligencePulse() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [0, 1, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.3], [0.8, 1, 1]);

  const nodes = [
    { label: "London Hub", latency: "2ms", top: "20%", left: "15%" },
    { label: "AI Diagnostic Node", latency: "8ms", top: "45%", left: "35%" },
    { label: "Patient Sync", latency: "1ms", top: "70%", left: "10%" },
    { label: "Security Layer", latency: "0ms", top: "15%", left: "80%" },
    { label: "Global Specialist", latency: "15ms", top: "60%", left: "85%" },
    { label: "Cloud Core", latency: "3ms", top: "40%", left: "65%" },
  ];

  return (
    <section className="relative min-h-[80vh] bg-slate-50 dark:bg-slate-900 overflow-hidden py-20 md:py-24 flex items-center transition-colors">
      {/* Immersive Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 -left-1/4 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-primary-600/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-blue-600/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse delay-700" />
      </div>

      <motion.div 
        style={{ opacity, scale }}
        className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10 w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-display font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[8px] md:text-[10px] mb-5 md:mb-6 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>Real-time cognitive network</span>
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-slate-900 dark:text-white tracking-tighter italic leading-[0.9] md:leading-[0.85] mb-6 md:mb-8 transition-colors">
              The digital <br />
              <span className="text-primary-600 dark:text-primary-500 not-italic">Nervous system</span>
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-xl font-medium leading-relaxed max-w-xl mb-10 md:mb-12 transition-colors">
              MedConnect utilizes a distributed intelligence lattice to synchronize patient data with global medical protocols in real-time. Experience zero-latency healthcare orchestration.
            </p>

            <div className="grid grid-cols-2 gap-4 sm:gap-8">
              <div className="space-y-1.5 md:space-y-2">
                <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                  <Activity className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-mono text-lg md:text-xl font-bold tracking-tight">1.2ms</span>
                </div>
                <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest leading-tight">Average Analysis <br /> Response</p>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-mono text-lg md:text-xl font-bold tracking-tight">99.99%</span>
                </div>
                <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest leading-tight">Identity <br /> Validation</p>
              </div>
            </div>
          </div>

          <div className="relative h-[350px] sm:h-[500px] block lg:mt-0">
            {/* Visual Pulse Grid */}
            <div className="absolute inset-0 bg-white/40 dark:bg-slate-800/20 rounded-[2rem] md:rounded-[3rem] border border-slate-200 dark:border-white/5 backdrop-blur-sm shadow-2xl overflow-hidden transition-colors">
               {/* Pulsing Grid Lines */}
               <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none transition-opacity" 
                    style={{ background: 'linear-gradient(90deg, transparent 49%, currentColor 50%, transparent 51%) 0 0 / 40px 40px, linear-gradient(0deg, transparent 49%, currentColor 50%, transparent 51%) 0 0 / 40px 40px' }} 
               />
               
               {/* Interactive Nodes */}
               {nodes.map((node, i) => (
                 <motion.div
                   key={i}
                   initial={{ opacity: 0, scale: 0 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.1, type: "spring" }}
                   style={{ top: node.top, left: node.left }}
                   className="absolute group"
                 >
                   <div className="relative">
                     <span className="absolute inset-0 w-6 h-6 md:w-8 md:h-8 bg-primary-500/30 rounded-full animate-ping" />
                     <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-primary-500 rounded-full relative z-10 border-2 border-white dark:border-slate-900 group-hover:scale-150 transition-transform duration-300" />
                     
                     <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-white/10 p-2 md:p-3 rounded-lg md:rounded-xl whitespace-nowrap z-20 pointer-events-none">
                       <p className="text-[9px] md:text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">{node.label}</p>
                       <div className="flex items-center space-x-1.5 md:space-x-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                         <span className="text-[7px] md:text-[8px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active • {node.latency} Latency</span>
                       </div>
                     </div>
                   </div>
                 </motion.div>
               ))}

               {/* Connecting Lines (Simulated with simple CSS) */}
               <svg className="absolute inset-0 w-full h-full opacity-10 dark:opacity-10 text-slate-900 dark:text-white" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M 15 20 L 35 45 L 10 70 M 35 45 L 80 15 M 35 45 L 65 40 L 85 60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
               </svg>

               <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 p-4 md:p-6 bg-slate-100/50 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 transition-colors">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-2 md:space-x-4">
                     <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-500 rounded-lg flex items-center justify-center shrink-0">
                       <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" />
                     </div>
                     <div>
                       <p className="text-[8px] md:text-[10px] font-black text-slate-500 dark:text-white/50 uppercase tracking-widest mb-0.5 md:mb-1 transition-colors">Current Process</p>
                       <p className="text-[10px] md:text-xs font-bold text-slate-900 dark:text-white uppercase tracking-tight transition-colors">AI Differential Synthesis</p>
                     </div>
                   </div>
                   <div className="text-right ml-2 md:ml-0">
                     <p className="text-[8px] md:text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest mb-0.5 md:mb-1 animate-pulse italic font-display underline decoration-green-400/30 underline-offset-4">Verifying...</p>
                     <p className="text-[6px] md:text-[8px] font-mono text-slate-400 dark:text-white/30 uppercase tracking-widest leading-none">ID: SYNTH-882-QX</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
