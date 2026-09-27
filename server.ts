import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
