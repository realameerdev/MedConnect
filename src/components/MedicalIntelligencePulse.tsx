import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, Cpu, Brain, ShieldCheck, Server, Stethoscope, Zap, Database } from 'lucide-react';

interface NetworkNode {
  id: string;
  label: string;
  role: string;
  latency: string;
  status: 'active' | 'synced' | 'standby';
  icon: React.ElementType;
  coords: { x: number; y: number }; // Percentage coords safely inside bounding box on desktop
}

const NETWORK_NODES: NetworkNode[] = [
  { 
    id: 'ai-diag', 
    label: "AI Diagnostic Engine", 
    role: "Sub-second clinical triage",
    latency: "8ms", 
    status: 'active',
    icon: Brain,
    coords: { x: 22, y: 22 }
  },
  { 
    id: 'vital-sync', 
    label: "Patient Vital Sync", 
    role: "Continuous biometric telemetry",
    latency: "1ms", 
    status: 'active',
    icon: Activity,
    coords: { x: 78, y: 22 }
  },
  { 
    id: 'security', 
    label: "Security & Encryption", 
    role: "HIPAA & ISO 27001 vault",
    latency: "0ms", 
    status: 'synced',
    icon: ShieldCheck,
    coords: { x: 15, y: 68 }
  },
  { 
    id: 'specialist', 
    label: "Specialist Dispatch", 
    role: "On-call physician routing",
    latency: "14ms", 
    status: 'active',
    icon: Stethoscope,
    coords: { x: 85, y: 68 }
  },
  { 
    id: 'cloud-core', 
    label: "Cloud Health Core", 
    role: "Distributed medical records",
    latency: "3ms", 
    status: 'synced',
    icon: Server,
    coords: { x: 50, y: 86 }
  },
  { 
    id: 'protocol-hub', 
    label: "Clinical Protocols", 
    role: "12,000+ evidence guidelines",
    latency: "2ms", 
    status: 'active',
    icon: Database,
    coords: { x: 50, y: 12 }
  },
];

export function MedicalIntelligencePulse() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(NETWORK_NODES[0]);

  return (
    <section className="w-full bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-5 sm:p-8 md:p-10 shadow-xl shadow-slate-900/5 transition-colors font-manrope relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/60 text-sky-600 dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Cpu className="w-3.5 h-3.5 text-sky-500" />
            <span>Clinical Intelligence Network</span>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            The Digital <span className="text-sky-500">Nervous System</span>
          </h3>

          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5 max-w-xl font-normal leading-relaxed">
            Real-time biometric synchronization between your personal health metrics, AI diagnostics, and verified specialist care.
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Sync Latency</p>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-mono">1.2ms</p>
            </div>
          </div>

          <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">Compliance</p>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-mono">100% HIPAA</p>
            </div>
          </div>
        </div>
      </div>

      {/* 
        RESPONSIVE SYSTEM ARCHITECTURE:
        - Clean, highly accessible node telemetry cards
        - Interactive detail inspection panel that never clips or overlaps on mobile
        - High-tech desktop radar visualization for wide screens
      */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-stretch">
        
        {/* Left Column: Interactive Telemetry Node Selector */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          
          {/* Central Active Telemetry Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] font-bold text-white/80 uppercase tracking-wider">Active Telemetry</p>
                <p className="text-xs sm:text-sm font-extrabold text-white">6 Distributed Nodes Online</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full whitespace-nowrap">
                Encrypted
              </span>
            </div>
          </div>

          {/* Node Selector Grid: Clean 2-column or 1-column layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {NETWORK_NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const Icon = node.icon;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3 sm:p-3.5 rounded-2xl text-left transition-all border cursor-pointer w-full ${
                    isSelected
                      ? 'bg-sky-50/90 dark:bg-sky-950/70 border-sky-400 dark:border-sky-700 shadow-xs ring-1 ring-sky-400/40'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center ${
                      isSelected 
                        ? 'bg-sky-500 text-white' 
                        : 'bg-white dark:bg-slate-700 text-sky-500 shadow-2xs'
                    }`}>
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-600">
                      {node.latency}
                    </span>
                  </div>
                  
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">
                    {node.label}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-snug mt-0.5 truncate">
                    {node.role}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Mobile-Adaptive Node Telemetry Inspector */}
        <div className="lg:col-span-6 flex flex-col">
          
          {/* Detailed Telemetry Showcase for Selected Node */}
          {selectedNode && (
            <div className="h-full rounded-2xl sm:rounded-3xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 flex flex-col justify-between text-left">
              <div>
                {/* Status Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
                      Node Synchronized
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                    ID: {selectedNode.id}
                  </span>
                </div>

                {/* Main Node Identity */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 shrink-0">
                    <selectedNode.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {selectedNode.label}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                      {selectedNode.role}
                    </p>
                  </div>
                </div>

                {/* Telemetry Detail Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/70 dark:border-slate-800">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Response Time</p>
                    <p className="text-sm font-extrabold text-sky-600 font-mono mt-0.5">{selectedNode.latency}</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/70 dark:border-slate-800">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Uptime SLA</p>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">99.99%</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/70 dark:border-slate-800 col-span-2 sm:col-span-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Security</p>
                    <p className="text-sm font-extrabold text-emerald-600 font-mono mt-0.5">TLS 1.3 / AES</p>
                  </div>
                </div>

                {/* Protocol Health Bar */}
                <div className="p-3.5 bg-sky-50/70 dark:bg-sky-950/40 rounded-xl border border-sky-100 dark:border-sky-900/60 mb-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-sky-500" />
                      <span>Throughput & Data Integrity</span>
                    </span>
                    <span className="text-sky-600 font-mono">100% Verified</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full w-full" />
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Status Message */}
              <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Clinical Safeguards Engaged</span>
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Continuous Monitoring</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MedicalIntelligencePulse;
