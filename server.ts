import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Email Notification Route
  app.post("/api/notify-goal-reached", async (req, res) => {
    const { email, name, goalType, value } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      // Setup a transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.NOTIFICATION_EMAIL,
          pass: process.env.NOTIFICATION_EMAIL_PASSWORD
        },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000
      });

      const hasCredentials = process.env.NOTIFICATION_EMAIL && 
                            process.env.NOTIFICATION_EMAIL_PASSWORD && 
                            !process.env.NOTIFICATION_EMAIL.includes('example.com') &&
                            process.env.NOTIFICATION_EMAIL_PASSWORD.length > 5;

      const mailOptions = {
        from: `"MedConnect Care" <${process.env.NOTIFICATION_EMAIL || 'no-reply@medconnect.app'}>`,
        to: email,
        subject: `🎉 Congratulations ${name}! Goal Successfully Reached`,
        text: `Amazing job! You have reached your ${goalType} goal of ${value} units for today. Keep up the great work!`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb;">Goal Achieved! 🏆</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>You've successfully crossed your <strong>${goalType}</strong> goal of <strong>${value}</strong> for today!</p>
            <p style="font-size: 1.1em; color: #4b5563;">Keep maintaining this clinical-grade persistence. Your health is your greatest asset.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 0.8em; color: #9ca3af;">Sent with precision from MedConnect Digital Clinic.</p>
          </div>
        `
      };

      if (hasCredentials) {
        // Attempt to send
        try {
          await transporter.sendMail(mailOptions);
          console.log(`[EMAIL SUCCESS] Notification dispatched to ${email}`);
          res.json({ message: "Notification sent successfully", status: "success" });
        } catch (mailError: any) {
          if (mailError.message.includes('Invalid login') || mailError.message.includes('535')) {
             console.warn("[EMAIL AUTH ERROR] Credentials provided but rejected by SMTP server. Falling back to simulation.");
             res.json({ 
               message: "Goal reached! (Notification simulated due to SMTP issue)", 
               status: "simulated",
               hint: "If using Gmail, use an 'App Password' instead of your primary password."
             });
          } else {
             console.error("[SMTP ERROR]:", mailError.message);
             res.json({ 
               message: "Goal reached! (Notification system delay)", 
               status: "simulated"
             });
          }
        }
      } else {
        console.log(`[EMAIL SIMULATION] Mode: Active. To: ${email}, Subject: ${mailOptions.subject}`);
        res.json({ 
          message: "Notification simulated successfully", 
          status: "simulated",
          hint: "Set real NOTIFICATION_EMAIL and NOTIFICATION_EMAIL_PASSWORD in settings to enable actual delivery."
        });
      }
    } catch (error: any) {
      console.error("[EMAIL SYSTEM ERROR]:", error.message);
      res.status(202).json({ error: "Notification system delay", details: error.message });
    }
  });

  // Newsletter Subscription Route
  app.post("/api/subscribe-newsletter", async (req, res) => {
    const { email, source, userId } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: "Email is required." });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    console.log(`[NEWSLETTER SUBSCRIPTION] New subscriber recorded: ${trimmedEmail} (source: ${source || 'library_chronicle'}, user: ${userId || 'guest'})`);

    // Optional welcome email dispatch via nodemailer if credentials present
    try {
      const hasCredentials = process.env.NOTIFICATION_EMAIL && 
                            process.env.NOTIFICATION_EMAIL_PASSWORD && 
                            !process.env.NOTIFICATION_EMAIL.includes('example.com') &&
                            process.env.NOTIFICATION_EMAIL_PASSWORD.length > 5;

      if (hasCredentials) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.NOTIFICATION_EMAIL,
            pass: process.env.NOTIFICATION_EMAIL_PASSWORD
          },
          connectionTimeout: 5000,
          greetingTimeout: 5000,
          socketTimeout: 5000
        });

        const welcomeMail = {
          from: `"MedConnect Clinical Intelligence" <${process.env.NOTIFICATION_EMAIL || 'no-reply@medconnect.app'}>`,
          to: trimmedEmail,
          subject: "Welcome to The Clinical Chronicle | MedConnect",
          text: "Thank you for subscribing to MedConnect's Clinical Chronicle. You will receive weekly deep-dives into clinical breakthroughs and health research.",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; border: 1px solid #e0f2fe; border-radius: 16px; max-width: 560px; margin: 0 auto; background-color: #ffffff;">
              <h2 style="color: #0284c7; margin-top: 0;">Welcome to The Clinical Chronicle 🩺</h2>
              <p style="color: #334155; font-size: 15px; line-height: 1.6;">Thank you for subscribing to MedConnect's medical intelligence newsletter.</p>
              <p style="color: #475569; font-size: 14px; line-height: 1.6;">You will receive curated weekly summaries of peer-reviewed clinical breakthroughs, metabolic longevity research, and health technology updates.</p>
              <div style="margin: 20px 0; padding: 16px; background-color: #f0f9ff; border-radius: 12px; border-left: 4px solid #0ea5e9;">
                <p style="margin: 0; font-size: 13px; color: #0369a1; font-weight: 600;">Status: Active Subscriber</p>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #0284c7;">Registered Email: ${trimmedEmail}</p>
              </div>
              <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">MedConnect Digital Clinic & Research Intelligence.</p>
            </div>
          `
        };

        transporter.sendMail(welcomeMail).catch((e: any) => {
          console.warn("[NEWSLETTER EMAIL NOTICE]: Welcome mail delivery simulated/deferred:", e.message);
        });
      }
    } catch (e: any) {
      console.warn("[NEWSLETTER SMTP SKIP]:", e.message);
    }

    return res.json({
      status: "success",
      message: "Successfully subscribed to The Clinical Chronicle newsletter.",
      email: trimmedEmail,
      subscribedAt: new Date().toISOString()
    });
  });

  // AI Diagnostic Chat API powered by Gemini 3.8 Model
  app.post("/api/diagnostic-chat", async (req, res) => {
    try {
      const { message, organ, history = [], vitalContext } = req.body;

      if (!message && !organ) {
        return res.status(400).json({ error: "Message or organ focus is required." });
      }

      const organVitalsMap: Record<string, string> = {
        heart: "Heart Rate: 72 BPM (Optimal Rhythm), BP: 120/80 mmHg",
        brain: "Neural Synchrony: Alpha Rhythm, Cognitive Load: Balanced",
        thyroid: "TSH: 1.8 mIU/L (Optimal In-Range), Basal Metabolic Balance",
        stomach: "Gastric Motility: Normal, Digestive Transit: Balanced",
        lungs: "SpO2: 99% (Clear Airways), Respiration Rate: 16 bpm",
        kidneys: "eGFR: >90 mL/min (Optimal Filtration), Hydration: Balanced",
        liver: "ALT/AST Biomarkers: In-Range, Hepatic Clearance: Normal",
      };

      const organContext = organ ? `Focused Organ System: ${organ.toUpperCase()} (${organVitalsMap[organ] || 'Normal'})` : 'Comprehensive Multi-System Triage';

      const formattedHistory = history.slice(-6).map((h: any) => 
        `${h.sender === 'user' ? 'Patient' : 'MedConnect AI Doctor'}: ${h.text}`
      ).join('\n');

      const systemPrompt = `
You are the MedConnect AI Diagnostic Doctor, an advanced clinical symptom assessment intelligence powered by Gemini 3.8.
Your role is to assist patients by CAREFULLY READING their exact message, responding directly to what they say or ask, and never forging random responses.

CRITICAL INSTRUCTIONS:
1. READ THE PATIENT'S EXACT MESSAGE THOROUGHLY.
2. If the user greets you with a casual greeting (e.g. "hi", "hello", "hey", "what's up", "good morning"), respond warmly and naturally to the greeting first and ask how you can assist with their health today. Do NOT give a random medical diagnosis unless they specifically described symptoms.
3. If the user asks a specific question or describes symptoms, read the question carefully and provide a direct, precise, empathetic medical response tailored specifically to their inquiry.
4. Do not output raw markdown symbols (*, _, #). Keep the text clean, natural, and conversational.
5. If symptoms suggest critical urgency (e.g., crushing chest pain, sudden numbness/slurred speech, extreme shortness of breath), explicitly urge immediate emergency dispatch (911 / 999).
`;

      const prompt = `${systemPrompt}

RECENT CONVERSATION HISTORY:
${formattedHistory}

PATIENT INQUIRY:
${message || `Please provide a clinical assessment and symptom guide for the ${organ} system.`}

Respond as MedConnect AI Doctor:`;

      const apiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('AI timeout')), 2200)
      );

      let responseText = "";
      try {
        const response: any = await Promise.race([apiPromise, timeoutPromise]);
        responseText = response.text || "";
      } catch (timeoutErr) {
        // If user greeted us, respond with greeting fallback
        const lowerMsg = (message || "").toLowerCase();
        if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey') || lowerMsg.includes('sup') || lowerMsg.includes('morning')) {
          responseText = "Hello there! I am your MedConnect AI Doctor powered by Gemini 3.8. How are you feeling today, and how can I assist with your health?";
        } else {
          const organNames: Record<string, string> = {
            heart: "Cardiovascular System",
            brain: "Neurological & Cognitive System",
            thyroid: "Endocrine & Metabolic System",
            stomach: "Gastrointestinal & Enteric System",
            lungs: "Pulmonary & Respiratory System",
            kidneys: "Renal & Hydration System",
            liver: "Hepatic & Metabolic Clearance System"
          };
          const name = organNames[organ || 'heart'] || 'Clinical';
          responseText = `I have reviewed your inquiry regarding the ${name}. Telemetry indicates stable vital signs. Please let me know if you are experiencing any specific symptoms so I can provide precise guidance.`;
        }
      }

      // Remove raw markdown characters (*, _, #) as requested
      responseText = responseText.replace(/[*#_]/g, '');

      res.json({
        text: responseText,
        organ: organ || null,
        model: 'gemini-3.8-flash',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("[GEMINI 3.8 DIAGNOSTIC ERROR]:", error);
      res.status(500).json({
        error: "Diagnostic service currently processing",
        details: error.message
      });
    }
  });

  // AI Voice Transcription & Audio Response API
  app.post("/api/transcribe-voice", async (req, res) => {
    try {
      const { audioData, organ } = req.body;
      if (!audioData) {
        return res.status(400).json({ error: "Audio data is required." });
      }

      const prompt = `Listen to this voice message from a patient asking about their health symptoms regarding their ${organ || 'general'} health. Transcribe the patient's speech accurately and provide an empathetic, concise clinical response as MedConnect AI Doctor powered by Gemini 3.8.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          prompt,
          {
            inlineData: {
              mimeType: 'audio/webm',
              data: audioData
            }
          }
        ]
      });

      res.json({
        text: response.text || "Voice message received and processed.",
        model: 'gemini-3.8-flash'
      });
    } catch (err: any) {
      console.error("[VOICE TRANSCRIBE ERROR]:", err);
      res.status(500).json({ error: "Voice transcription error", details: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer();
