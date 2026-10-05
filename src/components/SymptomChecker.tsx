import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Send, Activity, ShieldCheck, HelpCircle, User as UserIcon } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { MedConnectLogo } from './MedConnectLogo';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export function SymptomChecker({ onBack }: { onBack: () => void }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I'm your MedConnect AI Health Assistant. I can help you understand symptoms, provide general health guidance, or help you find the right specialist. \n\nPlease describe what you're feeling today. (Remember: For real emergencies, always contact 911 or head to the nearest ER.)",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const chatHistory = messages.map(msg => 
        `${msg.sender === 'user' ? 'User' : 'AI Assistant'}: ${msg.text}`
      ).join('\n');
      
      const prompt = `
        You are the MedConnect AI Health Assistant, a professional, clinical-grade symptom analysis tool.
        Your goal is to provide accurate medical information, suggest possible reasons for symptoms, and triage the user.
        
        STRICT RULES:
        1. Never provide a definitive medical diagnosis.
        2. Always use medical terminology where appropriate but explain it in simple terms.
        3. If symptoms sound life-threatening (chest pain, severe bleeding, difficulty breathing, stroke signs), immediately tell them to call 911.
        4. Suggest the type of specialist they should see based on their symptoms (e.g., Cardiologist, Dermatologist).
        5. Keep responses concise and structured with bullet points if helpful.
        
        Previous conversation:
        ${chatHistory}
        User: ${userMessage.text}
        
        Respond as the AI Medical Assistant:
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: result.text || "I apologize, I encountered a technical error. Could you repeat that?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I'm having trouble connecting to my medical database. Please ensure you have a stable connection.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors w-fit font-bold uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          General Triage
        </motion.button>
        <div className="flex items-center space-x-2 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
          <Activity className="w-3.5 h-3.5 text-primary-600" />
          <span className="text-[10px] font-black text-primary-700 uppercase tracking-widest">AI Clinical Intelligence</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-900/5 flex flex-col flex-1 overflow-hidden relative">
        {/* Chat Header */}
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-white shadow-md bg-white">
                <MedConnectLogo size={42} variant="icon" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="ml-4 text-left font-manrope">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight flex items-center">
                <span className="italic">Med</span>
                <span className="text-primary-600 not-italic ml-0.5">Connect</span>
                <span className="ml-2 text-xs uppercase tracking-widest px-2 py-0.5 bg-primary-50 text-primary-600 rounded-md border border-primary-100 font-bold">AI</span>
              </h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Clinical Triage Assistant</p>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end">
             <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Activity className="w-3.5 h-3.5 mr-1.5" />
                Real-time Triage
             </div>
             <p className="text-[9px] text-slate-300 mt-1 uppercase tracking-tighter italic">Secured by Gemini Clinical Architecture</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/10">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, index) => (
              <motion.div 
                key={msg.id} 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  type: "spring",
                  damping: 25,
                  stiffness: 200,
                  mass: 0.5
                }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[90%] sm:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="flex-shrink-0">
                    {msg.sender === 'ai' ? (
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-md">
                        <MedConnectLogo size={28} variant="icon" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 ml-4">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className={`mx-4 px-7 py-5 rounded-[1.8rem] ${
                    msg.sender === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none shadow-xl shadow-slate-900/10' 
                      : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm'
                  }`}>
                    <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.text}
                    </div>
                    <span className={`text-[9px] mt-4 block font-black uppercase tracking-widest ${msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="flex justify-start"
            >
              <div className="flex flex-row max-w-[80%]">
                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center border border-primary-500 shadow-lg">
                  <Activity className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div className="mx-4 px-7 py-6 rounded-[1.8rem] bg-white border border-slate-100 rounded-tl-none shadow-sm flex items-center space-x-1.5 min-w-[100px]">
                  <div className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 md:p-8 bg-white border-t border-slate-50 relative">
          <form onSubmit={handleSend} className="flex items-center gap-3 md:gap-5">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe symptoms..."
                className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 text-[14px] md:text-[15px] rounded-[1.5rem] md:rounded-[2rem] px-5 md:px-8 py-4 md:py-5 outline-none transition-all focus:border-primary-500 focus:bg-white placeholder:text-slate-300 font-bold group-hover:border-slate-200 shadow-inner"
                disabled={isTyping}
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.94 }}
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] md:rounded-[1.8rem] bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary-500/20 flex items-center justify-center group active:scale-95"
            >
              <Send className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
            </motion.button>
          </form>
          <div className="mt-6 flex items-center justify-center space-x-6">
             <div className="flex items-center text-[9px] font-black text-slate-300 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3 mr-1.5" />
                Encrypted Transcript
             </div>
             <div className="w-1 h-1 bg-slate-100 rounded-full" />
             <div className="flex items-center text-[9px] font-black text-slate-300 uppercase tracking-widest">
                <Activity className="w-3 h-3 mr-1.5" />
                Clinical Intelligence
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
