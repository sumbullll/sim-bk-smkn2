'use client';

import React, { useState } from 'react';
import {
  FileText,
  Ticket,
  UserCheck,
  ChevronDown,
  ShieldCheck,
  Lock,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HowItWorks: React.FC = () => {
  const { setIsReportModalOpen } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      step: 'Langkah 1',
      title: 'Tulis Aduan / Pilih Jadwal',
      desc: 'Pilih kategori masalah (Bullying, Belajar, Karir, dsb). Centang "Sembunyikan Identitas" bila ingin 100% anonim.',
      icon: FileText,
      badge: 'Bebas Akun',
      color: 'bg-blue-50 text-navy-800 border-blue-200',
    },
    {
      step: 'Langkah 2',
      title: 'Terima E-Tiket Ber-QR',
      desc: 'Sistem langsung menerbitkan Kode Tracking (format BK-XXXXX) dan Kartu E-Tiket digital untuk diunduh / dicetak.',
      icon: Ticket,
      badge: 'Real-Time',
      color: 'bg-orange-50 text-terracotta-600 border-orange-200',
    },
    {
      step: 'Langkah 3',
      title: 'Pendampingan & Solusi',
      desc: 'Konselor BK SMKN 2 Parepare memproses kasus dan memberikan catatan tindak lanjut resmi yang terpantau.',
      icon: UserCheck,
      badge: 'Solutif',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  const faqs = [
    {
      q: 'Apakah benar identitas saya tidak akan diketahui oleh guru jika memilih opsi anonim?',
      a: 'Benar sekali. Saat Anda mencentang tombol "Sembunyikan Identitas Saya", formulir akan otomatis menghapus kolom nama dan kelas. Sistem SIM-BK tidak merekam IP address, akun perangkat, atau data pengenal lainnya. Penanganan tetap berjalan murni melalui Kode Tracking E-Tiket Anda.',
    },
    {
      q: 'Bagaimana cara saya mengetahui perkembangan laporan yang telah saya kirimkan?',
      a: 'Gunakan Kode Tracking unik yang tercantum pada E-Tiket Anda (contoh: BK-7890A). Buka menu "Cek E-Tiket" kapan saja, masukkan kodenya, dan sistem akan menampilkan tahapan proses, nama guru penanggung jawab, serta catatan solusi resmi.',
    },
    {
      q: 'Kapan saja saya bisa menggunakan layanan bimbingan dan konseling ini?',
      a: 'Pelaporan sistem web dapat diakses 24 jam sehari, 7 hari seminggu. Notifikasi akan diterima oleh guru BK piket pada jam kerja sekolah (Senin - Jumat 07.30 - 15.30 WITA) dan ditindaklanjuti sesegera mungkin sesuai skala prioritas.',
    },
    {
      q: 'Apakah saya bisa menjadwalkan konseling tatap muka jika ingin bicara langsung?',
      a: 'Bisa! Anda cukup memilih guru BK yang tersedia di bagian "Daftar Guru BK", klik "Jadwalkan Konseling", lalu tentukan tanggal dan jam pertemuan. Guru BK akan mengonfirmasi sesi Anda secara langsung.',
    },
  ];

  return (
    <section id="alur-layanan" className="py-16 bg-slate-100/60 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-navy-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-navy-700" />
            Alur Layanan Bebas Hambatan
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Tiga Langkah Mudah Mendapatkan Bantuan
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Proses pelaporan dirancang ringkas (frictionless) agar siswa dapat bercerita dengan nyaman tanpa rasa khawatir.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-elevated transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                      {st.step}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${st.color}`}
                    >
                      {st.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-navy-800 mb-4 group-hover:bg-navy-800 group-hover:text-white transition-colors duration-200">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                    {st.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{st.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-navy-800">
                  <span>Tahap {idx + 1} dari 3</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ & Reassurance Accordion */}
        <div id="faq" className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-navy-800 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900">
                Pertanyaan yang Sering Diajukan Siswa
              </h3>
              <p className="text-xs text-slate-500">
                Ketahui hak kerahasiaan Anda dan cara kerja sistem BK terpadu.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200/80 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3 bg-slate-50/50 hover:bg-slate-50 transition"
                  >
                    <span className="font-semibold text-sm text-slate-800">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-navy-800' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 py-3 text-xs sm:text-sm text-slate-600 bg-white leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Privacy Callout Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong>Komitmen Ruang Aman SMKN 2 Parepare:</strong> Ruang BK bukan ruang hukuman.
              Segala bentuk perundungan, kecemasan belajar, dan masalah pribadi ditangani secara
              profesional dan humanis oleh guru BK tersertifikasi.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
