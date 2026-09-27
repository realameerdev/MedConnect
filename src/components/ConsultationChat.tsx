import React, { useState, useEffect, useRef } from 'react';
import { Doctor } from './DoctorDirectory';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Send, User as UserIcon, ShieldAlert, Check, CheckCheck, Smile, Heart, ThumbsUp, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  sender: 'user' | 'doctor';
  text: string;
  timestamp: Date;
  status?: 'sent' | 'read';
  reactions?: Record<string, string[]>; // emoji -> userIds
}

export function ConsultationChat({ doctor, onBack }: { doctor: Doctor, onBack: () => void }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'doctor',
      text: `Hello, I'm ${doctor.name}. I've reviewed your request for a ${doctor.specialty} consultation. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleReaction = (messageId: string, emoji: string) => {
    if (!user) return;
    setMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;
      
      const reactions = { ...(msg.reactions || {}) };
      const userReactions = reactions[emoji] || [];
      
      if (userReactions.includes(user.uid)) {
        reactions[emoji] = userReactions.filter(id => id !== user.uid);
      } else {
        reactions[emoji] = [...userReactions, user.uid];
      }
      
      if (reactions[emoji].length === 0) delete reactions[emoji];
      
      return { ...msg, reactions };
    }));
    setShowEmojiPicker(null);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Mark all previous user messages as read when doctor starts responding
      setMessages(prev => prev.map(m => 
        m.sender === 'user' ? { ...m, status: 'read' } : m
      ));
      const chatHistory = messages.map(msg => 
        `${msg.sender === 'user' ? 'Patient' : 'Doctor'}: ${msg.text}`
      ).join('\n');
      
      const prompt = `
        You are ${doctor.name}, a medical professional specializing in ${doctor.specialty}.
        You are conducting a digital consultation with a patient.
        Keep your responses professional, empathetic, concise, and medical-grade.
        Do not provide definitive diagnoses, but offer guidance and ask relevant follow-up questions.
        Always advise them to seek emergency care if symptoms sound life-threatening.
        
        Previous conversation:
        ${chatHistory}
        Patient: ${userMessage.text}
        
        Respond as the doctor:
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const doctorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'doctor',
        text: response.text || "I'm sorry, I couldn't process that. Could you rephrase?",
        timestamp: new Date()
      };

      setMessages(prev => {
        const newMessages = [...prev, doctorResponse];
        // 30% chance doctor reacts to the user's last message
        if (Math.random() > 0.7) {
          let lastUserMsgIndex = -1;
          for (let i = newMessages.length - 1; i >= 0; i--) {
            if (newMessages[i].sender === 'user') {
              lastUserMsgIndex = i;
              break;
            }
          }
          if (lastUserMsgIndex !== -1) {
            const emojis = ['👍', '❤️', '🙏', '💊'];
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            const msg = newMessages[lastUserMsgIndex];
            const reactions = { ...(msg.reactions || {}) };
            reactions[emoji] = [...(reactions[emoji] || []), 'doctor'];
            newMessages[lastUserMsgIndex] = { ...msg, reactions };
          }
        }
        return newMessages;
      });
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'doctor',
        text: "I'm experiencing a temporary connection issue. Please resend your message.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 h-[calc(100vh-20px)] sm:h-[calc(100vh-80px)] flex flex-col pt-safe pb-safe"
    >
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors w-fit font-bold tracking-widest text-[10px]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          End consultation
        </button>
        <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-green-700 tracking-widest">Active session</span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-900/5 flex flex-col flex-1 overflow-hidden relative">
        {/* Chat Header */}
        <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="relative shrink-0">
              <img 
                src={doctor.imageUrl} 
                alt={doctor.name} 
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="ml-3 sm:ml-4 text-left">
              <h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-tight line-clamp-1">{doctor.name}</h3>
              <div className="flex items-center space-x-2">
                <p className="text-[9px] sm:text-[10px] font-black text-primary-600 tracking-[0.2em]">{doctor.specialty}</p>
                {isTyping && (
                  <>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 tracking-widest animate-pulse">Typing...</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end shrink-0">
             <div className="flex items-center text-[10px] font-black text-slate-400 tracking-widest">
                <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
                Medical grade security
             </div>
             <p className="text-[9px] text-slate-300 mt-1 tracking-tighter uppercase">ID: med-784{doctor.uid.slice(-4)}</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 bg-slate-50/20">
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex w-full sm:w-auto max-w-[90%] sm:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="flex-shrink-0 hidden sm:block">
                  {msg.sender === 'doctor' ? (
                    <img src={doctor.imageUrl} alt={doctor.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover border border-slate-100 shadow-sm" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 ml-4">
                      <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="relative group/msg w-full sm:w-auto">
                  <div className={`sm:mx-4 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-[1.5rem] relative ${
                    msg.sender === 'user' 
                      ? 'bg-slate-900 text-white sm:rounded-tr-none shadow-xl shadow-slate-900/10 ml-auto' 
                      : 'bg-white border border-slate-100 text-slate-800 sm:rounded-tl-none shadow-sm'
                  }`}>
                    <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                    <div className={`mt-2 sm:mt-3 flex items-center justify-end space-x-1.5 ${msg.sender === 'user' ? 'text-slate-400' : 'text-slate-300'}`}>
                      <span className="text-[7px] sm:text-[8px] font-mono tracking-wider">
                        {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      {msg.sender === 'user' && (
                        <div className="flex items-center ml-1">
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-3 h-3 text-primary-400" />
                          ) : (
                            <Check className="w-3 h-3 opacity-40" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reaction Button */}
                  <div className={`absolute top-0 ${msg.sender === 'user' ? '-left-8' : '-right-8'} opacity-0 group-hover/msg:opacity-100 transition-opacity`}>
                    <button 
                      onClick={() => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id)}
                      className="p-1.5 bg-white rounded-full border border-slate-100 shadow-sm text-slate-400 hover:text-primary-600 transition-colors"
                    >
                      <Smile className="w-3.5 h-3.5" />
                    </button>
                    
                    <AnimatePresence>
                      {showEmojiPicker === msg.id && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 10 }}
                          className={`absolute bottom-full mb-2 bg-white border border-slate-100 rounded-2xl p-1.5 shadow-2xl flex space-x-1 z-20 ${msg.sender === 'user' ? 'left-0' : 'right-0'}`}
                        >
                          {['👍', '❤️', '🙏', '💊', '😢', '💪'].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => toggleReaction(msg.id, emoji)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-lg transition-colors text-lg"
                            >
                              {emoji}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Reactions List */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className={`flex flex-wrap gap-1 mt-1.5 px-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {Object.entries(msg.reactions).map(([emoji, userIds]) => {
                        const users = userIds as string[];
                        return (
                          <button
                            key={emoji}
                            onClick={() => toggleReaction(msg.id, emoji)}
                            className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black border transition-all ${
                              user && users.includes(user.uid) 
                                ? 'bg-primary-50 border-primary-200 text-primary-600' 
                                : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                            }`}
                          >
                            <span>{emoji}</span>
                            {users.length > 0 && <span>{users.length}</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex flex-row max-w-[80%] items-end">
                <div className="hidden sm:block">
                  <img src={doctor.imageUrl} alt={doctor.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm" referrerPolicy="no-referrer" />
                </div>
                <div className="sm:mx-4 px-5 sm:px-6 py-4 sm:py-5 rounded-2xl sm:rounded-[1.5rem] bg-white border border-slate-100 sm:rounded-tl-none shadow-sm flex items-center space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-3 sm:p-6 bg-white border-t border-slate-50 mt-auto">
          <form onSubmit={handleSend} className="flex items-center gap-2 sm:gap-4 relative">
            <div className="flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 text-sm md:text-base rounded-2xl sm:rounded-[1.5rem] px-4 sm:px-6 py-3.5 sm:py-4 outline-none transition-all focus:border-primary-500 focus:bg-white placeholder:text-slate-400 font-medium"
                disabled={isTyping}
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.94 }}
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary-500/30 flex items-center justify-center group"
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform ml-1" />
            </motion.button>
          </form>
          {!user && (
            <p className="text-center text-[9px] sm:text-[10px] font-bold text-slate-400 mt-3 sm:mt-4 tracking-[0.2em]">
              Guest mode • Sign in to save transcripts
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
