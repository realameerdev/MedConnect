import React, { useState } from 'react';
import { Phone, HeartPulse, Droplets, Wind, AlertTriangle, ArrowLeft, MapPin, Loader2, Search, Navigation, AlertCircle, Clock, ArrowRight, Activity } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';

const EMERGENCY_SCENARIOS = [
  {
    id: 'heart',
    title: 'Heart Attack',
    icon: <HeartPulse className="w-6 h-6 text-red-500" />,
    steps: [
      'Call emergency services immediately (911).',
      'Have the person sit down, rest, and keep calm.',
      'Loosen any tight clothing.',
      'Ask if they take nitroglycerin and help them take it.',
      'Begin CPR if unconscious and unresponsive (if trained).'
    ]
  },
  {
    id: 'choking',
    title: 'Choking',
    icon: <Wind className="w-6 h-6 text-blue-500" />,
    steps: [
      'Encourage coughing if they can speak.',
      'Give 5 sharp back blows between shoulder blades.',
      'Give 5 abdominal thrusts (Heimlich maneuver).',
      'Alternate between 5 blows and 5 thrusts.',
      'Call emergency services if blockage persists.'
    ]
  },
  {
    id: 'bleeding',
    title: 'Severe Bleeding',
    icon: <Droplets className="w-6 h-6 text-red-600" />,
    steps: [
      'Call emergency services immediately.',
      'Apply direct, firm pressure with clean cloth.',
      'Maintain continuous pressure until help arrives.',
      'Elevate the injured area above the heart.',
      'Add more layers on top; do not remove soaked cloths.'
    ]
  },
  {
    id: 'snake',
    title: 'Snake Bite',
    icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    steps: [
      'Keep the person calm and still.',
      'Immobilize the bitten limb.',
      'Keep the bite area below heart level.',
      'Call emergency services immediately.',
      'Do NOT cut or suck the wound.'
    ]
  },
  {
    id: 'burns',
    title: 'Burns',
    icon: <Droplets className="w-6 h-6 text-orange-500" />,
    steps: [
      'Cool with running water for 20 mins.',
      'Remove jewelry unless stuck.',
      'Cover with cling wrap or clean cloth.',
      'Seek medical help if severe.'
    ]
  },
  {
    id: 'fainting',
    title: 'Fainting',
    icon: <Activity className="w-6 h-6 text-slate-500" />,
    steps: [
      'Lay person on their back.',
      'Elevate legs (about 12 inches).',
      'Loosen tight clothing.',
      'Check for breathing.',
      'Stay until they regain consciousness.'
    ]
  }
];

interface Hospital {
  name: string;
  distance: string;
  phone: string;
  address: string;
}

export function EmergencyGuidance({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const findNearbyHospitals = async (useGeolocation: boolean) => {
    setLoading(true);
    setError(null);
    setHospitals([]);

    try {
      let locationContext = locationInput;

      if (useGeolocation) {
        if (!navigator.geolocation) {
          throw new Error("Geolocation not supported.");
        }
        
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        locationContext = `${position.coords.latitude}, ${position.coords.longitude}`;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Find 5 nearest hospitals to ${locationContext || 'me'}. 
        Return ONLY a JSON array of objects with keys: "name", "distance", "phone", "address".`,
        config: {
          tools: [{ googleSearch: {} }] as any
        }
      });

      const cleanedJson = response.text.replace(/```json|```/g, '').trim();
      setHospitals(JSON.parse(cleanedJson));
    } catch (err: any) {
      setError("Failed to locate facilities. Please use 911 for immediate help.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onBack} 
          className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 mb-8 flex items-center mx-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </motion.button>
        <h2 className="text-4xl md:text-8xl font-black font-display text-slate-900 tracking-tighter uppercase leading-[0.8] mb-8">
          Emergency <br /><span className="text-red-600">Response.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-20">
        <div className="space-y-6">
          <motion.a 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="tel:911" 
            className="flex items-center justify-between p-6 md:p-10 bg-black text-white rounded-[2rem] md:rounded-[3rem] transition-all shadow-2xl group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-2xl md:rounded-3xl flex items-center justify-center mr-4 md:mr-6 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 md:w-8 md:h-8 text-white fill-white" />
              </div>
              <div className="text-left">
                <p className="text-[9px] md:text-[10px] font-black uppercase text-red-500 mb-1 leading-none">Dispatch</p>
                <h3 className="text-3xl md:text-5xl font-black uppercase italic leading-none">911</h3>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-slate-800" />
          </motion.a>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden relative">
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-8 border-l-4 border-red-600 pl-4">Facility Locator</h4>
            <div className="space-y-4">
              <input 
                placeholder="Enter zip or city..." 
                value={locationInput} 
                onChange={e => setLocationInput(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 px-6 py-5 rounded-3xl font-bold outline-none focus:border-red-600 focus:bg-white transition-all"
              />
              <div className="grid grid-cols-2 gap-4">
                <motion.button 
                  whileTap={{ scale: 0.96 }}
                  onClick={() => findNearbyHospitals(false)} 
                  className="bg-slate-900 text-white py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
                >
                  <Search className="w-4 h-4 mr-2" /> Search
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.96 }}
                  onClick={() => findNearbyHospitals(true)} 
                  className="bg-white text-slate-900 border-2 border-slate-100 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center cursor-pointer"
                >
                  <Navigation className="w-4 h-4 mr-2" /> Location
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-[3rem] border border-slate-100 p-8 min-h-[400px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase">Scanning...</p>
             </div>
          ) : hospitals.length > 0 ? (
            <div className="space-y-4">
              <AnimatePresence>
                {hospitals.map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 25, delay: i * 0.1 }}
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    <h5 className="text-xl font-black text-slate-900 uppercase leading-tight mb-2 group-hover:text-red-600 transition-colors">{h.name}</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{h.address}</p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-500 uppercase rounded-full">{h.distance}</span>
                      <a href={`tel:${h.phone}`} className="px-3 py-1 bg-red-50 text-[9px] font-black text-red-600 uppercase rounded-full">Call Now</a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-12">
               <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
               <p className="text-xs font-bold text-slate-600">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-30 grayscale p-12">
               <MapPin className="w-16 h-16 text-slate-300 mb-6" />
               <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Location Context</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">First Aid Procedures</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EMERGENCY_SCENARIOS.map(s => (
            <motion.button 
              whileTap={{ scale: 0.96 }}
              key={s.id} 
              onClick={() => setSelectedScenario(s.id)} 
              className={`p-8 rounded-[2.5rem] border-2 text-left transition-all ${selectedScenario === s.id ? 'bg-white border-red-600 shadow-xl' : 'bg-white border-slate-100 opacity-60 hover:opacity-100'}`}
            >
              <div className="mb-4">{s.icon}</div>
              <h5 className="text-lg font-black uppercase italic">{s.title}</h5>
            </motion.button>
          ))}
        </div>

        {selectedScenario && (
          <div className="bg-slate-900 text-white rounded-[3.5rem] p-12 shadow-2xl animate-in slide-in-from-bottom-8">
             <div className="flex items-center mb-8">
                <AlertTriangle className="w-8 h-8 text-red-500 mr-4" />
                <h5 className="text-4xl font-black uppercase italic">{EMERGENCY_SCENARIOS.find(s => s.id === selectedScenario)?.title} Procedure</h5>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {EMERGENCY_SCENARIOS.find(s => s.id === selectedScenario)?.steps.map((step, i) => (
                  <div key={i} className="flex items-start">
                    <span className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center font-black text-xl mr-4 flex-shrink-0">{i + 1}</span>
                    <p className="text-xl font-medium leading-relaxed text-slate-300">{step}</p>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
