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
  const { viewMode, adminAuth, devAuth, currentTeacher, setViewMode, logoutAdmin, logoutDev } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-orange-100 selection:text-orange-900 relative">
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

      {/* Floating Bottom Preview Banner when logged in while browsing public web */}
      {viewMode === 'public' && (adminAuth.isLoggedIn || devAuth.isDev) && (
        <aside aria-label="Status Sesi Login" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-navy-900/95 hover:bg-navy-900 text-white backdrop-blur-md px-4 sm:px-6 py-2.5 rounded-full shadow-2xl border border-navy-700/80 flex items-center gap-3 sm:gap-4 transition-all">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="text-xs text-slate-200">
              Pratinjau Publik • <strong className="text-white">{adminAuth.isLoggedIn && currentTeacher ? currentTeacher.nama.split(',')[0] : 'Developer'}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode(adminAuth.isLoggedIn ? 'admin' : 'developer')}
              className="px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Kembali ke Dashboard</span>
            </button>
            <button
              onClick={adminAuth.isLoggedIn ? logoutAdmin : logoutDev}
              className="px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-rose-600 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer"
              title="Keluar dari akun (Logout)"
            >
              Keluar
            </button>
          </div>
        </aside>
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
