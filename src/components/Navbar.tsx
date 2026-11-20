'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { TeacherAvatar } from './TeacherAvatar';
import { formatTeacherName } from '../lib/utils';
import {
  ShieldAlert,
  Search,
  UserCheck,
  LifeBuoy,
  LogOut,
  SlidersHorizontal,
  LayoutDashboard,
  Calendar,
  Sparkles,
  Cloud,
  CloudOff,
  ArrowRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    schoolSettings,
    adminAuth,
    devAuth,
    currentTeacher,
    viewMode,
    setViewMode,
    logoutAdmin,
    logoutDev,
    teachers,
    setIsReportModalOpen,
    setIsTrackingModalOpen,
    setIsAppointmentModalOpen,
    openAuthModal,
    cloudStatus,
  } = useApp();

  const availableTeachersCount = teachers.filter(t => t.status === 'tersedia').length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      {/* Top micro-bar */}
      <div className="bg-navy-800 text-white text-xs px-4 py-1.5 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-navy-700 font-medium text-blue-200 text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Program 10.000 Karya Digital Guru 2026
          </span>
          <span className="hidden sm:inline text-slate-300">
            Dinas Pendidikan Provinsi Sulawesi Selatan
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-300">
          <span className="hidden md:inline">
            Pengembang: <strong className="text-white">{schoolSettings.guruPengembang}</strong>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-semibold">
            {cloudStatus === 'connected' ? (
              <>
                <Cloud className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300">Supabase Sync</span>
              </>
            ) : cloudStatus === 'tables_missing' ? (
              <>
                <Cloud className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300">Setup SQL</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3 h-3 text-slate-400" />
                <span className="text-slate-300">Lokal</span>
              </>
            )}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <strong className="text-white">{availableTeachersCount} Guru BK Siap</strong>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-3">
        {/* Brand / Logo */}
        <div
          onClick={() => setViewMode('public')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-navy-800 to-navy-600 flex items-center justify-center text-white shadow-card group-hover:scale-105 transition-transform duration-200">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-navy-800 text-lg tracking-tight group-hover:text-terracotta-600 transition-colors">
                SIM-BK
              </span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                OFFICIAL
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-500 tracking-wide">
              {schoolSettings.namaSekolah}
            </span>
          </div>
        </div>

        {/* Center Nav Links (Desktop) */}
        {viewMode === 'public' && (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80 text-sm font-medium">
            <a
              href="#beranda"
              className="px-4 py-1.5 rounded-full text-slate-700 hover:text-navy-800 hover:bg-white transition-colors"
            >
              Beranda
            </a>
            <a
              href="#alur-layanan"
              className="px-4 py-1.5 rounded-full text-slate-700 hover:text-navy-800 hover:bg-white transition-colors"
            >
              Alur Layanan
            </a>
            <a
              href="#direktori-guru"
              className="px-4 py-1.5 rounded-full text-slate-700 hover:text-navy-800 hover:bg-white transition-colors"
            >
              Daftar Guru BK
            </a>
            <a
              href="#faq"
              className="px-4 py-1.5 rounded-full text-slate-700 hover:text-navy-800 hover:bg-white transition-colors"
            >
              Panduan Siswa
            </a>
          </nav>
        )}

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Public Mode Buttons */}
          {viewMode === 'public' ? (
            <>
              <button
                onClick={() => setIsTrackingModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-navy-800 bg-blue-50/80 border border-blue-200 hover:bg-blue-100 transition shadow-sm"
                title="Cek status pengaduan dengan kode tiket"
              >
                <Search className="w-3.5 h-3.5 text-navy-700" />
                <span>Cek E-Tiket</span>
              </button>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl text-white bg-terracotta-600 hover:bg-terracotta-700 shadow-sm transition active:scale-95"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Lapor Anonim</span>
              </button>

              {/* Smart Session Check: Jika sudah login, tampilkan akses langsung 1-klik tanpa input sandi */}
              {adminAuth.isLoggedIn && currentTeacher ? (
                <div className="flex items-center bg-blue-50/90 border border-blue-200/90 rounded-2xl p-1 shadow-sm gap-1">
                  <button
                    onClick={() => setViewMode('admin')}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-navy-900 hover:bg-white rounded-xl transition cursor-pointer"
                    title={`Kembali ke Ruang Kerja ${formatTeacherName(currentTeacher)} (Sesi Aktif - 1 Klik)`}
                  >
                    <TeacherAvatar src={currentTeacher.avatar} name={currentTeacher.nama} size="xs" />
                    <span className="hidden sm:inline">Ruang Kerja: {currentTeacher.nama.split(',')[0]}</span>
                    <span className="sm:hidden">Ruang Kerja</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Sesi Login Aktif"></span>
                  </button>
                  <button
                    onClick={logoutAdmin}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition cursor-pointer"
                    title="Keluar dari akun Guru BK (Logout)"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : devAuth.isDev ? (
                <div className="flex items-center bg-purple-50 border border-purple-200 rounded-2xl p-1 shadow-sm gap-1">
                  <button
                    onClick={() => setViewMode('developer')}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-purple-900 hover:bg-white rounded-xl transition cursor-pointer"
                    title="Kembali ke Konsol Developer (Sesi Aktif - 1 Klik)"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-purple-700" />
                    <span className="hidden sm:inline">Konsol Dev</span>
                    <span className="sm:hidden">Dev</span>
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" title="Sesi Dev Aktif"></span>
                  </button>
                  <button
                    onClick={logoutDev}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition cursor-pointer"
                    title="Keluar Konsol Dev"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('admin')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 transition cursor-pointer"
                  title="Masuk Guru BK atau Konsol Pengembang"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden md:inline">Masuk Guru / Dev</span>
                </button>
              )}
            </>
          ) : viewMode === 'admin' ? (
            /* Admin Mode Bar */
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs max-w-[240px]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="font-semibold text-navy-800 truncate">
                  Konselor: {currentTeacher?.nama || 'Guru BK'}
                </span>
              </div>
              <button
                onClick={() => setViewMode('public')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Lihat Web Publik
              </button>
              <button
                onClick={logoutAdmin}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            /* Developer Mode Bar */
            <div className="flex items-center gap-2.5">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold">
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
                Developer / Superadmin
              </span>
              <button
                onClick={() => setViewMode('public')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Lihat Web Publik
              </button>
              <button
                onClick={logoutDev}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Dev</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
