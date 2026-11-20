'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { HowItWorks } from '../components/HowItWorks';
import { TeacherDirectory } from '../components/TeacherDirectory';
import { Footer } from '../components/Footer';

// Modals
import { ReportModal } from '../components/modals/ReportModal';
import { ETicketModal } from '../components/modals/ETicketModal';
import { TrackingModal } from '../components/modals/TrackingModal';
import { AppointmentModal } from '../components/modals/AppointmentModal';
import { TeacherDetailModal } from '../components/modals/TeacherDetailModal';
import { AuthModal } from '../components/modals/AuthModal';

// Admin & Developer Views
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { DeveloperConsole } from '../components/developer/DeveloperConsole';

export default function HomePage() {
  const { viewMode } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-orange-100 selection:text-orange-900">
      {/* Dynamic Main View */}
      {viewMode === 'admin' ? (
        <>
          <Navbar />
          <main className="flex-1">
            <AdminDashboard />
          </main>
        </>
      ) : viewMode === 'developer' ? (
        <>
          <Navbar />
          <main className="flex-1">
            <DeveloperConsole />
          </main>
        </>
      ) : (
        /* Public Portal View */
        <>
          <Navbar />
          <main className="flex-1">
            <HeroSection />
            <HowItWorks />
            <TeacherDirectory />
          </main>
          <Footer />
        </>
      )}

      {/* Global Interactive Modals */}
      <ReportModal />
      <ETicketModal />
      <TrackingModal />
      <AppointmentModal />
      <TeacherDetailModal />
      <AuthModal />
    </div>
  );
}
