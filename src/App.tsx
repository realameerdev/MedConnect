import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { motion, AnimatePresence } from 'motion/react';
import { DoctorDirectory, Doctor } from './components/DoctorDirectory';
import { ConsultationChat } from './components/ConsultationChat';
import { AppointmentBooking } from './components/AppointmentBooking';
import { EmergencyGuidance } from './components/EmergencyGuidance';
import { AuthModal } from './components/AuthModal';
import { DoctorProfileModal } from './components/DoctorProfileModal';
import { PatientProfileModal } from './components/PatientProfileModal';
import { MyAppointments } from './components/MyAppointments';
import { SymptomChecker } from './components/SymptomChecker';
import { PatientDashboard } from './components/PatientDashboard';
import { HealthBlog } from './components/HealthBlog';
import { RegionalHealthHub } from './components/RegionalHealthHub';
import { FeaturesSection } from './components/FeaturesSection';
import { NotificationsView } from './components/NotificationsView';
import LandingStickySection from './components/LandingStickySection';
import BottomNav from './components/BottomNav';

import { useAuth } from './contexts/AuthContext';

type ViewState = 'home' | 'doctors' | 'chat' | 'book' | 'emergency' | 'appointments' | 'consult' | 'dashboard' | 'blog' | 'notifications' | 'regional-hub';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: 'success' | 'info' | 'alert';
}

import MedicalIntelligencePulse from './components/MedicalIntelligencePulse.tsx';
import Footer from './components/Footer.tsx';

function AppContent() {
  const { user, userRole, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'signin' | 'signup' }>({
    open: false,
    mode: 'signin'
  });
  const [doctorProfileOpen, setDoctorProfileOpen] = useState(false);
  const [patientProfileOpen, setPatientProfileOpen] = useState(false);

  React.useEffect(() => {
    if (!authLoading) {
      if (!user && currentView !== 'home') {
        setCurrentView('home');
      }
    }
  }, [user, authLoading, currentView]);

  const addNotification = (title: string, message: string, type: Notification['type'] = 'info') => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNavigate = (view: string) => {
    if (!user && view !== 'home') {
      setAuthModal({ open: true, mode: 'signin' });
      return;
    }
    
    setCurrentView(view as ViewState);
    if (view === 'notifications') {
      markNotificationsAsRead();
    }
    if (view !== 'consult' && view !== 'book') {
      setSelectedDoctor(null);
    }
  };

  const handleSelectDoctor = (doctor: Doctor, action: 'chat' | 'book') => {
    if (!user) {
      setAuthModal({ open: true, mode: 'signin' });
      return;
    }
    
    setSelectedDoctor(doctor);
    setCurrentView(action === 'chat' ? 'consult' : 'book');
  };

  if (authModal.open) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 font-sans overflow-hidden transition-colors selection:bg-primary-500/30">
        <AuthModal 
          initialMode={authModal.mode} 
          onClose={() => setAuthModal({ ...authModal, open: false })} 
          onSuccess={() => {
            setAuthModal({ ...authModal, open: false });
            if (userRole) {
              handleNavigate('dashboard');
            } else {
              // Usually handled by useEffect in App, but navigate anyway so when they complete profile they are on dashboard
              handleNavigate('dashboard');
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors selection:bg-primary-500/30 overflow-x-hidden max-w-full w-full">
      <Navbar 
        onNavigate={handleNavigate} 
        onAuthOpen={(mode) => setAuthModal({ open: true, mode })} 
        onDoctorProfileOpen={() => setDoctorProfileOpen(true)}
        onPatientProfileOpen={() => setPatientProfileOpen(true)}
        unreadNotifications={notifications.filter(n => !n.read).length}
      />
      
      <main className={`relative overflow-x-hidden max-w-full w-full ${user && currentView !== 'home' ? 'pb-16 md:pb-0' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ 
              type: "spring",
              damping: 25,
              stiffness: 200,
              mass: 0.5
            }}
            className="w-full"
          >
            {currentView === 'home' && (
              <>
                <Hero onNavigate={handleNavigate} onAuthOpen={(mode) => setAuthModal({ open: true, mode })} />
                <LandingStickySection />
                <FeaturesSection 
                  onNavigate={handleNavigate} 
                  onAuthOpen={(mode) => setAuthModal({ open: true, mode })}
                  onPatientProfileOpen={() => setPatientProfileOpen(true)}
                />
                <Footer />
              </>
            )}
            
            {currentView === 'doctors' && (
              <DoctorDirectory onSelectDoctor={handleSelectDoctor} />
            )}
            
            {currentView === 'chat' && (
              <SymptomChecker onBack={() => handleNavigate('home')} />
            )}

            {currentView === 'consult' && selectedDoctor && (
              <ConsultationChat doctor={selectedDoctor} onBack={() => handleNavigate('doctors')} />
            )}
            
            {currentView === 'book' && selectedDoctor && (
              <AppointmentBooking 
                doctor={selectedDoctor} 
                onBack={() => handleNavigate('doctors')} 
                onComplete={() => handleNavigate('home')} 
              />
            )}
            
            {currentView === 'emergency' && (
              <EmergencyGuidance onBack={() => handleNavigate('home')} />
            )}

            {currentView === 'appointments' && (
              <MyAppointments onBack={() => handleNavigate('home')} />
            )}

            {currentView === 'dashboard' && (
              <PatientDashboard 
                onBack={() => handleNavigate('home')} 
                onActionClick={handleNavigate}
                onNotificationAdd={addNotification}
              />
            )}

            {currentView === 'blog' && (
              <HealthBlog onBack={() => handleNavigate('home')} />
            )}

            {currentView === 'notifications' && (
              <NotificationsView 
                notifications={notifications} 
                onBack={() => handleNavigate('home')} 
              />
            )}

            {currentView === 'regional-hub' && (
              <RegionalHealthHub onBack={() => handleNavigate('dashboard')} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {authModal.open && (
        <AuthModal 
          initialMode={authModal.mode} 
          onClose={() => setAuthModal({ ...authModal, open: false })} 
          onSuccess={() => {
            setAuthModal({ ...authModal, open: false });
            handleNavigate('dashboard');
          }}
        />
      )}

      {doctorProfileOpen && (
        <DoctorProfileModal onClose={() => setDoctorProfileOpen(false)} />
      )}

      {patientProfileOpen && (
        <PatientProfileModal onClose={() => setPatientProfileOpen(false)} />
      )}

      {user && currentView !== 'home' && (
        <BottomNav 
          currentView={currentView}
          onNavigate={handleNavigate}
          user={user}
          onAuthOpen={(mode) => setAuthModal({ open: true, mode })}
          onPatientProfileOpen={() => setPatientProfileOpen(true)}
        />
      )}
    </div>
  );
}

import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

