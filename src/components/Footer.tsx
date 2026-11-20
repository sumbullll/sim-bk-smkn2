'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  Heart,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { schoolSettings, openAuthModal, adminAuth, devAuth, setViewMode } = useApp();

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Identity & Official Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-terracotta-600 flex items-center justify-center text-white shadow-md">
                <ShieldAlert className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <div className="font-display font-extrabold text-white text-lg tracking-tight">
                  SIM-BK
                </div>
                <div className="text-xs text-blue-300 font-medium">
                  {schoolSettings.namaSekolah}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Portal Terpadu Bimbingan dan Konseling berbasis web ramah siswa. Transformasi safe space
              vokasi tanpa rasa takut dan intimidasi.
            </p>

            <div className="p-3 rounded-xl bg-navy-900/80 border border-navy-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Program Resmi Disdik Sulsel</span>
              </div>
              <div className="text-[11px] text-slate-300">
                10.000 Karya Digital Guru 2026
              </div>
              <div className="text-[11px] text-blue-200">
                Inisiator: <strong>{schoolSettings.guruPengembang}</strong>
              </div>
            </div>
          </div>

          {/* Col 2: Hubungi Kami & Hotline */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase text-blue-200">
              Kontak Layanan BK
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-terracotta-400 shrink-0 mt-0.5" />
                <span className="text-slate-400 leading-normal">
                  {schoolSettings.alamatSekolah}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-terracotta-400 shrink-0" />
                <span className="text-slate-300 font-mono font-bold">
                  {schoolSettings.hotlineBk} (Hotline BK)
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-terracotta-400 shrink-0" />
                <span className="text-slate-300">{schoolSettings.emailSekolah}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Layanan Darurat Siswa & KemenPPPA */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase text-blue-200">
              Layanan Siaga & Bantuan
            </h4>
            <div className="p-3.5 rounded-xl bg-navy-900/70 border border-navy-800 space-y-2 text-xs">
              <div className="font-semibold text-white flex items-center justify-between">
                <span>SAPA 129 KemenPPPA</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-900/80 text-rose-300 font-bold">
                  24 Jam Bebas Pulsa
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Hotline nasional perlindungan anak dan penanganan kekerasan perempuan: Telepon 129 atau WhatsApp 08111-129-129.
              </p>
            </div>
            <div className="text-[11px] text-slate-400">
              Jam Pelayanan Tatap Muka: <strong>Senin - Jumat 07.30 - 15.30 WITA</strong>
            </div>
          </div>

          {/* Col 4: Akses Khusus & Tautan Cepat */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase text-blue-200">
              Akses Portal & Staf
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#beranda" className="text-slate-400 hover:text-white transition">
                  Beranda Utama
                </a>
              </li>
              <li>
                <a href="#direktori-guru" className="text-slate-400 hover:text-white transition">
                  Direktori Konselor Sekolah
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-white transition">
                  Panduan Privasi & FAQ
                </a>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => (adminAuth.isLoggedIn ? setViewMode('admin') : openAuthModal('admin'))}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-300 hover:text-blue-100 font-semibold cursor-pointer underline underline-offset-4"
                >
                  <span>Workstation Guru BK {adminAuth.isLoggedIn ? '(Sesi Aktif - 1 Klik)' : ''}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => (devAuth.isDev ? setViewMode('developer') : openAuthModal('developer'))}
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 font-mono cursor-pointer"
                >
                  <span>Developer / Superadmin Console {devAuth.isDev ? '(Sesi Aktif - 1 Klik)' : ''}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 <strong>{schoolSettings.namaSekolah}</strong>. Seluruh Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-1">
            <span>Dirancang dengan dedikasi untuk Safe Space Vokasi</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
