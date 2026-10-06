import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Send, 
  Phone, 
  MoreVertical, 
  Mic, 
  MicOff, 
  Pin, 
  PinOff, 
  History, 
  Plus, 
  Trash2, 
  Sparkles, 
  X, 
  Volume2, 
  VolumeX, 
  Bot, 
  User as UserIcon, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  RefreshCw,
  PhoneOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type OrganKey = 'brain' | 'thyroid' | 'stomach' | 'heart' | 'lungs' | 'kidneys' | 'liver';

interface OrganConfig {
  id: OrganKey;
  name: string;
  emoji: string;
  vitals: string;
  description: string;
  commonSymptoms: string[];
}

const ORGANS: Record<OrganKey, OrganConfig> = {
  heart: {
    id: 'heart',
    name: 'Heart',
    emoji: '🫀',
    vitals: 'Heart: 72 BPM · Optimal Rhythm',
    description: 'Cardiovascular diagnostics, arterial pressure & rhythm sync',
    commonSymptoms: ['Palpitations', 'Chest Tightness', 'Fatigue', 'Shortness of Breath', 'Irregular Rhythm']
  },
  brain: {
    id: 'brain',
    name: 'Brain',
    emoji: '🧠',
    vitals: 'Brain: Alpha Waves · High Cognitive Synchrony',
    description: 'Neurological assessment, cognitive function & migraine triage',
    commonSymptoms: ['Migraine', 'Brain Fog', 'Dizziness', 'Tension Headache', 'Sleep Disturbance']
  },
  thyroid: {
    id: 'thyroid',
    name: 'Thyroid',
    emoji: '🦋',
    vitals: 'Thyroid: TSH 1.8 mIU/L · Balanced Metabolism',
    description: 'Endocrine metabolism, temperature tolerance & hormone balance',
    commonSymptoms: ['Metabolic Changes', 'Cold Sensitivity', 'Unexplained Fatigue', 'Mood Shifts']
  },
  stomach: {
    id: 'stomach',
    name: 'Stomach',
    emoji: '🫄',
    vitals: 'Stomach: Gastric Motility · Balanced Transit',
    description: 'Gastrointestinal triage, digestion balance & enteric health',
    commonSymptoms: ['Acid Reflux', 'Bloating', 'Nausea', 'Abdominal Cramping', 'Indigestion']
  },
  lungs: {
    id: 'lungs',
    name: 'Lungs',
    emoji: '🫁',
    vitals: 'Lungs: 99% SpO2 · Clear Airways',
    description: 'Respiratory pathways, oxygen saturation & pulmonary efficiency',
    commonSymptoms: ['Persistent Cough', 'Wheezing', 'Shortness of Breath', 'Chest Congestion']
  },
  kidneys: {
    id: 'kidneys',
    name: 'Kidneys',
    emoji: '🫘',
    vitals: 'Kidneys: eGFR >90 · Optimal Hydration',
    description: 'Renal filtration, fluid regulation & systemic electrolyte balance',
    commonSymptoms: ['Flank Pain', 'Fluid Retention', 'Fatigue', 'Urinary Discomfort']
  },
  liver: {
    id: 'liver',
    name: 'Liver',
    emoji: '🥩',
    vitals: 'Liver: ALT/AST In-Range · Hepatic Clearance',
    description: 'Hepatic metabolism, toxin filtration & digestive enzymes',
    commonSymptoms: ['Upper Right Pain', 'Nausea', 'Jaundice Warning', 'Digestive Sluggishness']
  }
};

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  organ?: OrganKey;
  pinned?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  lastUpdated: string;
  messages: ChatMessage[];
  pinned?: boolean;
}

export function SymptomChecker({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [selectedOrgan, setSelectedOrgan] = useState<OrganKey>('heart');
  const [activeSessionId, setActiveSessionId] = useState<string>('current');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'orb' | 'chat'>('orb');
  const [pastSessions, setPastSessions] = useState<ChatSession[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Load past sessions from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`medconnect_chats_${user?.uid || 'guest'}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPastSessions(parsed);
      }
    } catch (e) {
      console.warn("Storage load error:", e);
    }
  }, [user]);

  // Save sessions to localStorage
  const saveSessions = (updated: ChatSession[]) => {
    setPastSessions(updated);
    try {
      localStorage.setItem(`medconnect_chats_${user?.uid || 'guest'}`, JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage save error:", e);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (viewMode === 'chat') {
      scrollToBottom();
    }
  }, [messages, isTyping, viewMode]);

  // Triggered when user selects an organ default pill
  const handleOrganSelect = async (organKey: OrganKey) => {
    setSelectedOrgan(organKey);
    setIsScanning(true);

    const organInfo = ORGANS[organKey];
    
    // Add user selection prompt to chat
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: `Clinical assessment for ${organInfo.name} (${organInfo.emoji})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      organ: organKey
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/diagnostic-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Provide a clinical symptom assessment for the ${organInfo.name} organ system. Include current vitals correlation (${organInfo.vitals}), common symptoms, self-care guidance, and specialist routing recommendations.`,
          organ: organKey,
          vitalContext: organInfo.vitals,
          history: messages
        })
      });

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || `I've analyzed your ${organInfo.name} status against clinical guidelines. Current telemetry indicates: ${organInfo.vitals}. Please let me know if you are experiencing symptoms such as ${organInfo.commonSymptoms.slice(0, 3).join(', ')}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        organ: organKey
      };

      setMessages(prev => [...prev, aiMsg]);
      
      if (isVoiceCallActive) {
        speakText(aiMsg.text);
      }
    } catch (err) {
      console.error("Diagnostic error:", err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `**${organInfo.name} Diagnostic Telemetry**\n\n• **Biometric Status**: ${organInfo.vitals}\n• **Common Indicators**: ${organInfo.commonSymptoms.join(', ')}\n• **Clinical Recommendation**: Track symptoms for 24-48 hours. Consult a specialist if acute pain or irregular rhythms persist.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        organ: organKey
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
      setIsScanning(false);
    }
  };

  // Text-to-Speech synthesis
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Tap Orb action
  const handleOrbTap = () => {
    handleOrganSelect(selectedOrgan);
  };

  // Send text message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      organ: selectedOrgan
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setViewMode('chat'); // Automatically open chat view when sending messages

    try {
      const response = await fetch('/api/diagnostic-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          organ: selectedOrgan,
          vitalContext: ORGANS[selectedOrgan].vitals,
          history: messages
        })
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || "I've evaluated your symptoms. If you experience worsening discomfort, please seek in-person medical evaluation.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        organ: selectedOrgan
      };

      setMessages(prev => [...prev, aiMsg]);

      if (isVoiceCallActive) {
        speakText(aiMsg.text);
      }
    } catch (err) {
      console.error("AI chat error:", err);
      const fallbackAi: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I'm correlating your symptoms against clinical evidence. Please describe the duration and severity of your symptoms.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackAi]);
    } finally {
      setIsTyping(false);
    }
  };

  // Voice Message Recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          await processVoiceMessage(base64Audio);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingVoice(true);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Microphone permission is required to record a voice message.");
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
    }
  };

  const processVoiceMessage = async (base64Audio: string) => {
    const userVoiceMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: "🎤 [Voice Message Recorded]",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      organ: selectedOrgan
    };

    setMessages(prev => [...prev, userVoiceMsg]);
    setIsTyping(true);
    setViewMode('chat');

    try {
      const response = await fetch('/api/transcribe-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: base64Audio,
          organ: selectedOrgan
        })
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || "I listened to your voice message. Please monitor your symptoms and contact emergency care if breathing difficulty occurs.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        organ: selectedOrgan
      };

      setMessages(prev => [...prev, aiMsg]);
      speakText(aiMsg.text);
    } catch (e) {
      console.error("Voice process error:", e);
    } finally {
      setIsTyping(false);
    }
  };

  // Toggle Pinned Message
  const togglePinMessage = (messageId: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, pinned: !m.pinned } : m));
  };

  // Save current conversation as a named session
  const saveCurrentSession = () => {
    if (messages.length === 0) return;
    const title = `${ORGANS[selectedOrgan].emoji} ${ORGANS[selectedOrgan].name} Assessment - ${new Date().toLocaleDateString()}`;
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title,
      lastUpdated: new Date().toLocaleDateString(),
      messages: [...messages],
      pinned: false
    };

    saveSessions([newSession, ...pastSessions]);
    alert("Session saved to your medical history!");
  };

  const loadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setActiveSessionId(session.id);
    setShowHistoryModal(false);
    setViewMode('chat');
  };

  const deleteSession = (sessionId: string) => {
    const filtered = pastSessions.filter(s => s.id !== sessionId);
    saveSessions(filtered);
  };

  const togglePinSession = (sessionId: string) => {
    const updated = pastSessions.map(s => s.id === sessionId ? { ...s, pinned: !s.pinned } : s);
    saveSessions(updated);
  };

  const startNewChat = () => {
    if (messages.length > 0) {
      saveCurrentSession();
    }
    setMessages([]);
    setViewMode('orb');
    setShowMenuDropdown(false);
  };

  const pinnedMessages = messages.filter(m => m.pinned);

  return (
    <div className="relative w-full min-h-screen bg-slate-900 flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8 font-manrope selection:bg-sky-400/30 overflow-x-hidden">
      
      {/* 
        =======================================================
        SMARTPHONE / CLINICAL SCREEN FRAME CONTAINER
        Exact aesthetic reproduction of the uploaded screenshot
        =======================================================
      */}
      <div className="relative w-full max-w-md md:max-w-lg min-h-screen sm:min-h-[820px] sm:max-h-[92vh] rounded-none sm:rounded-[3.25rem] bg-gradient-to-b from-[#38bdf8] via-[#0ea5e9] to-[#0284c7] shadow-[0_25px_80px_rgba(0,0,0,0.6)] border-0 sm:border-[8px] sm:border-slate-800 flex flex-col overflow-hidden text-white select-none">
        
        {/* Dynamic Island Pill at Top Center (Desktop/Tablet preview) */}
        <div className="hidden sm:flex justify-center pt-3 pb-1 z-30">
          <div className="w-28 h-6 bg-slate-900 rounded-full flex items-center justify-end px-3 gap-2 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
            <div className="w-2 h-2 rounded-full bg-sky-900/60" />
          </div>
        </div>

        {/* Top Status Bar: Dynamic Time and 5G/Battery */}
        <div className="px-4 sm:px-6 pt-2 sm:pt-3 pb-1.5 flex items-center justify-between text-xs font-bold text-white/90 z-20">
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span>5G</span>
            <div className="w-5 h-2.5 rounded-[3px] border border-white/80 p-0.5 flex items-center">
              <div className="w-full h-full bg-white rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Header Bar matching Screenshot */}
        <div className="px-3 sm:px-5 py-2 sm:py-3 flex items-center justify-between gap-2 z-30 relative">
          <button
            onClick={onBack}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer active:scale-95 shrink-0"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="text-center truncate px-1">
            <h2 className="text-sm sm:text-xl font-extrabold tracking-tight text-white flex items-center justify-center gap-1.5 sm:gap-2">
              <span className="truncate">AI Doctor</span>
              <span className="text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/20 text-sky-100 uppercase tracking-wider shrink-0">
                Gemini 3.8
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Call Button */}
            <button
              onClick={() => setIsVoiceCallActive(!isVoiceCallActive)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm shrink-0 ${
                isVoiceCallActive 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={isVoiceCallActive ? "End Voice Call" : "Start Live Voice Call"}
            >
              {isVoiceCallActive ? <PhoneOff className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" /> : <Phone className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />}
            </button>

            {/* Menu Button / Hamburger / More Options */}
            <div className="relative">
              <button
                onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all cursor-pointer active:scale-95 shadow-md shrink-0"
                title="Options Menu"
              >
                <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Menu Dropdown */}
              <AnimatePresence>
                {showMenuDropdown && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl p-2 z-50 text-slate-900 border border-slate-100"
                  >
                    <button
                      onClick={() => {
                        setShowHistoryModal(true);
                        setShowMenuDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-sky-50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <History className="w-4 h-4 text-sky-500" />
                      <span>Past Messages & History</span>
                    </button>

                    <button
                      onClick={() => {
                        saveCurrentSession();
                        setShowMenuDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-sky-50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <Pin className="w-4 h-4 text-amber-500" />
                      <span>Save / Pin Current Chat</span>
                    </button>

                    <button
                      onClick={() => {
                        setViewMode(viewMode === 'orb' ? 'chat' : 'orb');
                        setShowMenuDropdown(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-sky-50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <span>{viewMode === 'orb' ? 'Show Chat Transcript' : 'Show Hologram Orb'}</span>
                    </button>

                    <div className="h-px bg-slate-100 my-1" />

                    <button
                      onClick={startNewChat}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-rose-500" />
                      <span>Start New Diagnostic</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 
          =======================================================
          ORGAN PILLS SELECTION GRID (MOBILE-RESPONSIVE & FLUID)
          Exact matching rows from the uploaded screenshot
          =======================================================
        */}
        <div className="px-2.5 sm:px-4 py-1.5 sm:py-2 flex flex-col items-center gap-2 sm:gap-2.5 z-20">
          
          {/* Row 1: Brain, Thyroid */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 w-full flex-wrap">
            {(['brain', 'thyroid'] as OrganKey[]).map((key) => {
              const organ = ORGANS[key];
              const isSelected = selectedOrgan === key;
              return (
                <button
                  key={key}
                  onClick={() => handleOrganSelect(key)}
                  className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-md scale-105 ring-2 ring-white/50'
                      : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30'
                  }`}
                >
                  <span className="text-sm">{organ.emoji}</span>
                  <span>{organ.name}</span>
                </button>
              );
            })}
          </div>

          {/* Row 2: Stomach, Heart (Active White Pill in screenshot), Lungs */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 w-full flex-wrap">
            {(['stomach', 'heart', 'lungs'] as OrganKey[]).map((key) => {
              const organ = ORGANS[key];
              const isSelected = selectedOrgan === key;
              return (
                <button
                  key={key}
                  onClick={() => handleOrganSelect(key)}
                  className={`py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-lg scale-105 ring-2 ring-white/50'
                      : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30'
                  }`}
                >
                  <span className="text-sm">{organ.emoji}</span>
                  <span>{organ.name}</span>
                </button>
              );
            })}
          </div>

          {/* Row 3: Kidneys, Liver */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 w-full flex-wrap">
            {(['kidneys', 'liver'] as OrganKey[]).map((key) => {
              const organ = ORGANS[key];
              const isSelected = selectedOrgan === key;
              return (
                <button
                  key={key}
                  onClick={() => handleOrganSelect(key)}
                  className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-md scale-105 ring-2 ring-white/50'
                      : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30'
                  }`}
                >
                  <span className="text-sm">{organ.emoji}</span>
                  <span>{organ.name}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* 
          =======================================================
          CENTER CONTENT: GLOWING IRIDESCENT HOLOGRAM ORB OR CHAT
          =======================================================
        */}
        <div className="flex-1 flex flex-col items-center justify-center relative px-3 sm:px-4 overflow-hidden my-auto py-2">
          
          {viewMode === 'orb' ? (
            <div className="flex flex-col items-center justify-center my-auto relative z-10 w-full">
              
              {/* Concentric Ambient Pulse Rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-52 h-52 sm:w-72 sm:h-72 rounded-full border border-white/20 transition-all ${isScanning || isVoiceCallActive ? 'animate-ping [animation-duration:3s]' : ''}`} />
                <div className="w-68 h-68 sm:w-88 sm:h-88 rounded-full border border-white/10" />
              </div>

              {/* Holographic Glowing Glass Orb from the Screenshot (Scales gracefully on mobile) */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOrbTap}
                className="relative w-44 h-44 xs:w-52 xs:h-52 sm:w-60 sm:h-60 md:w-64 md:h-64 rounded-full flex items-center justify-center cursor-pointer select-none group shadow-[0_20px_60px_rgba(2,132,199,0.5)] my-2"
              >
                {/* Outer Glow Halo */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-300 to-fuchsia-400 opacity-70 blur-xl group-hover:opacity-90 transition-opacity" />

                {/* Main Orb Surface with Realistic Holographic Shader Mesh */}
                <div 
                  className="relative w-full h-full rounded-full overflow-hidden border border-white/40 shadow-inner flex items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #7dd3fc 25%, #38bdf8 50%, #c084fc 80%, #ec4899 100%)'
                  }}
                >
                  {/* Top-Left Specular Light Glare */}
                  <div className="absolute top-3 left-5 sm:top-4 sm:left-6 w-16 h-12 sm:w-24 sm:h-16 rounded-full bg-white/70 blur-md rotate-[-25deg] pointer-events-none" />

                  {/* Soft bottom-right secondary sheen */}
                  <div className="absolute bottom-4 right-6 sm:bottom-6 sm:right-8 w-12 h-6 sm:w-16 sm:h-8 rounded-full bg-fuchsia-300/60 blur-sm pointer-events-none" />

                  {/* Internal Pulsating Heartbeat / Brainwave Animation */}
                  <motion.div
                    animate={isScanning ? { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] } : { scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center justify-center text-white drop-shadow-md z-10"
                  >
                    <span className="text-3xl sm:text-5xl">{ORGANS[selectedOrgan].emoji}</span>
                    {isSpeaking && (
                      <div className="flex items-center gap-1 mt-1 sm:mt-2 bg-black/20 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Speaking</span>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>

              {/* Subtitle Below Orb matching screenshot */}
              <div className="mt-4 sm:mt-6 text-center space-y-1 z-10 px-2">
                <p className="text-[11px] sm:text-sm font-extrabold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/95 drop-shadow-sm">
                  {isScanning ? 'DIAGNOSTIC SCAN IN PROGRESS...' : 'TAP ORB TO SCAN SYMPTOMS'}
                </p>
                <p className="text-[11px] sm:text-xs font-bold text-sky-100/90 drop-shadow-sm">
                  {ORGANS[selectedOrgan].vitals}
                </p>
              </div>

              {/* Quick AI Response Card if any messages exist */}
              {messages.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 text-left w-full max-w-xs sm:max-w-sm flex items-start gap-2 sm:gap-2.5"
                >
                  <Bot className="w-4 h-4 text-sky-200 shrink-0 mt-0.5" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] sm:text-[11px] font-semibold text-white line-clamp-2 leading-tight">
                      {messages[messages.length - 1].text}
                    </p>
                    <button
                      onClick={() => setViewMode('chat')}
                      className="text-[9px] sm:text-[10px] font-bold text-sky-100 hover:text-white underline mt-1 cursor-pointer block"
                    >
                      View full clinical discussion →
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          ) : (
            /* Scrollable Chat View */
            <div className="w-full h-full flex flex-col p-1.5 sm:p-4 overflow-hidden z-10">
              
              {/* Pinned Messages Header if any */}
              {pinnedMessages.length > 0 && (
                <div className="mb-2 p-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Pin className="w-3.5 h-3.5 text-amber-300" />
                    <span>{pinnedMessages.length} Pinned Health Insights</span>
                  </div>
                  <button 
                    onClick={() => setViewMode('orb')}
                    className="text-[10px] text-sky-200 underline font-semibold cursor-pointer"
                  >
                    Back to Orb
                  </button>
                </div>
              )}

              {/* Chat Stream */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="text-center py-10 px-4 text-white/80">
                    <Bot className="w-10 h-10 mx-auto mb-2 text-white/60" />
                    <p className="text-sm font-bold">MedConnect AI Doctor Ready</p>
                    <p className="text-xs text-sky-100 mt-1">Tap any organ pill above or type a message below to start your diagnostic check.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-start gap-1.5 sm:gap-2 max-w-[90%] sm:max-w-[88%]">
                        {msg.sender === 'ai' && (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-sky-600 flex items-center justify-center shrink-0 shadow-sm mt-1">
                            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                        )}

                        <div
                          className={`p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-white text-slate-900 font-medium rounded-tr-xs shadow-md'
                              : 'bg-white/20 backdrop-blur-xl text-white border border-white/30 rounded-tl-xs shadow-sm'
                          }`}
                        >
                          <div className="whitespace-pre-line">{msg.text}</div>

                          <div className="mt-1.5 flex items-center justify-between gap-3 text-[10px] text-white/60">
                            <span className={msg.sender === 'user' ? 'text-slate-400' : 'text-white/60'}>
                              {msg.timestamp}
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              {msg.sender === 'ai' && (
                                <button
                                  onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.text)}
                                  className="hover:text-white cursor-pointer"
                                  title="Listen"
                                >
                                  {isSpeaking ? <VolumeX className="w-3 h-3 text-rose-300" /> : <Volume2 className="w-3 h-3" />}
                                </button>
                              )}
                              <button
                                onClick={() => togglePinMessage(msg.id)}
                                className={`cursor-pointer ${msg.pinned ? 'text-amber-300 font-bold' : 'hover:text-white'}`}
                                title={msg.pinned ? "Unpin message" : "Pin message"}
                              >
                                <Pin className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {msg.sender === 'user' && (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-sky-900 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                            <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-white/80 p-2">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center animate-spin">
                      <RefreshCw className="w-3 h-3" />
                    </div>
                    <span>MedConnect AI is analyzing diagnostic vectors...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

        </div>

        {/* 
          =======================================================
          BOTTOM SEND MESSAGE / VOICE SECTION (MOBILE STICKY & TOUCH-FRIENDLY)
          =======================================================
        */}
        <div className="p-2.5 sm:p-4 bg-white/10 backdrop-blur-2xl border-t border-white/20 z-20 sticky bottom-0">
          
          {/* Active Voice Call HUD Overlay */}
          {isVoiceCallActive && (
            <div className="mb-2 p-2 sm:p-2.5 bg-sky-900/80 rounded-2xl border border-sky-400/40 flex items-center justify-between text-xs animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-[11px] sm:text-xs">Live AI Voice Call Active</span>
              </div>
              <button
                onClick={() => setIsVoiceCallActive(false)}
                className="px-2.5 py-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold cursor-pointer"
              >
                End Call
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 sm:gap-2">
            
            {/* View Mode Toggle Button */}
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'orb' ? 'chat' : 'orb')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
              title={viewMode === 'orb' ? "Show Chat Messages" : "Show Hologram Orb"}
            >
              {viewMode === 'orb' ? <Activity className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
            </button>

            {/* Input Field */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isRecordingVoice ? "Listening to your voice..." : `Ask AI Doctor about ${ORGANS[selectedOrgan].name}...`}
                className="w-full py-2 sm:py-2.5 pl-3.5 sm:pl-4 pr-8 sm:pr-10 rounded-full bg-white/20 hover:bg-white/25 focus:bg-white/30 text-white placeholder-white/60 text-xs sm:text-sm font-medium border border-white/30 focus:border-white focus:outline-none transition-all"
              />
            </div>

            {/* Voice Record Button */}
            <button
              type="button"
              onClick={isRecordingVoice ? stopVoiceRecording : startVoiceRecording}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md ${
                isRecordingVoice 
                  ? 'bg-rose-500 text-white animate-bounce' 
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
              title={isRecordingVoice ? "Stop Recording Voice" : "Send Voice Message"}
            >
              {isRecordingVoice ? <MicOff className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Mic className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-slate-900 hover:bg-sky-50 disabled:opacity-40 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md active:scale-95"
              title="Send Message"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600" />
            </button>

          </form>

        </div>

      </div>

      {/* 
        =======================================================
        PAST MESSAGES & SESSIONS HISTORY MODAL
        =======================================================
      */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 text-slate-900 shadow-2xl border border-slate-100 flex flex-col max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-sky-500" />
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Past Diagnostic Records</h3>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 sm:py-4 space-y-2.5 sm:space-y-3 custom-scrollbar">
                {pastSessions.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <History className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-bold">No saved diagnostic records yet.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Your past symptom checks and pinned assessments will appear here.</p>
                  </div>
                ) : (
                  pastSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 hover:bg-sky-50/60 border border-slate-100 transition-colors flex items-center justify-between gap-2.5 sm:gap-3"
                    >
                      <button
                        onClick={() => loadSession(session)}
                        className="flex-1 text-left cursor-pointer overflow-hidden"
                      >
                        <div className="flex items-center gap-1.5">
                          {session.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                          <p className="text-xs font-extrabold text-slate-900 truncate">{session.title}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{session.lastUpdated} · {session.messages.length} messages</p>
                      </button>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => togglePinSession(session.id)}
                          className={`p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer ${
                            session.pinned ? 'text-amber-500' : 'text-slate-400'
                          }`}
                          title={session.pinned ? "Unpin session" : "Pin session"}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteSession(session.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-white transition-colors cursor-pointer"
                          title="Delete session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={startNewChat}
                  className="w-full py-2.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start Fresh Diagnostic Session</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default SymptomChecker;
