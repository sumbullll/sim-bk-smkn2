'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Search,
  CalendarCheck2,
  Lock,
  HeartHandshake,
  QrCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const {
    schoolSettings,
    setIsReportModalOpen,
    setIsTrackingModalOpen,
    setIsAppointmentModalOpen,
    reports,
    teachers,
  } = useApp();

  const totalTuntas = reports.filter(r => r.status === 'selesai').length;
  const availableTeachers = teachers.filter(t => t.status === 'tersedia').length;
  const cumulativeSiswa = teachers.reduce((acc, t) => acc + (t.totalKonseling || 0), 0);

  return (
    <section id="beranda" className="relative pt-8 pb-16 overflow-hidden">
      {/* Background soft ambient blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/40 via-orange-50/20 to-transparent -z-10 pointer-events-none rounded-b-[48px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top pill badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-soft text-xs font-semibold text-slate-700">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta-600"></span>
            </span>
            <span className="text-navy-800 font-bold">{schoolSettings.namaSekolah}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600">Safe Space & Layanan Pengaduan Resmi</span>
          </div>
        </div>

        {/* Hero Headline & Subhead */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Ruang Aman Siswa{' '}
            <span className="bg-gradient-to-r from-navy-800 via-navy-600 to-terracotta-600 bg-clip-text text-transparent">
              Bebas Intimidasi & 100% Rahasia
            </span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Selamat datang di portal terpadu Bimbingan dan Konseling UPT SMKN 2 Parepare. Sampaikan
            keluhan Anda tanpa rasa cemas, pantau penanganan via E-Tiket ber-QR Code, atau jadwalkan
            konsultasi tatap muka langsung bersama konselor ramah.
          </p>
        </div>

        {/* 3 Quick Action CTA Buttons (iVOTE inspired clean buttons) */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14 max-w-2xl mx-auto">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex-1 min-w-[220px] inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm sm:text-base shadow-glow-terracotta transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <ShieldAlert className="w-5 h-5 text-amber-200" />
            <span>Lapor Masalah Sekarang</span>
          </button>

          <button
            onClick={() => setIsTrackingModalOpen(true)}
            className="flex-1 min-w-[190px] inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-sm sm:text-base shadow-glow-navy transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Search className="w-5 h-5 text-blue-200" />
            <span>Cek E-Tiket Saya</span>
          </button>

          <button
            onClick={() => setIsAppointmentModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border-2 border-slate-200/80 shadow-soft transition-all duration-200 hover:border-slate-300 cursor-pointer"
          >
            <CalendarCheck2 className="w-5 h-5 text-emerald-600" />
            <span>Jadwalkan Konseling</span>
          </button>
        </div>

        {/* 3 Value Pillars (iVOTE card styling: clean floating cards, soft shadow, rounded-2xl) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-elevated transition-shadow duration-300 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-orange-100/80 text-terracotta-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-bold text-lg text-slate-900">
                100% Bebas Akun & Anonim
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Zero Trace
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Siswa tidak perlu daftar akun, mengingat password, atau membagikan data identitas. Privasi
              dijamin aman tanpa risiko kebocoran data.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-elevated transition-shadow duration-300 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-blue-100/80 text-navy-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-bold text-lg text-slate-900">
                E-Tiket & Pelacakan Live
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                QR Ready
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Setiap aduan otomatis menghasilkan kode pelacakan unik dan E-Tiket resmi dengan QR Code
              untuk memantau perkembangan kasus secara mandiri.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-elevated transition-shadow duration-300 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Pendampingan Vokasi Nyata
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Solutif
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Bimbingan karir kejuruan, konsultasi PKL industri, penanganan perundungan, hingga mediasi
              teman sebaya oleh tim konselor bersertifikasi.
            </p>
          </div>
        </div>

        {/* Quick Live Stats Strip */}
        <div className="mt-10 max-w-4xl mx-auto bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 rounded-2xl p-5 text-white shadow-elevated flex flex-wrap items-center justify-around gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-blue-200 font-medium">Status Kerahasiaan</div>
              <div className="text-base font-bold text-white">Terenkripsi & Anonim</div>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-blue-200 font-medium">Konselor Siap Siaga</div>
              <div className="text-base font-bold text-white">{availableTeachers} Konselor Tersedia</div>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-orange-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-blue-200 font-medium">Layanan Konseling Tuntas</div>
              <div className="text-base font-bold text-white">
                {totalTuntas > 0 ? `${totalTuntas} Siswa Aktif Tuntas` : `${cumulativeSiswa}+ Sesi Terbantu`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
