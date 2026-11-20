'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReportCategory } from '../../types';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  EyeOff,
  User,
  GraduationCap,
  Paperclip,
  Send,
  HelpCircle,
  AlertTriangle,
  BookOpen,
  Briefcase,
  HeartHandshake,
  MessageSquare,
} from 'lucide-react';

const CATEGORIES: { id: ReportCategory; label: string; desc: string; icon: any; color: string }[] = [
  {
    id: 'Bullying',
    label: 'Perundungan / Bullying',
    desc: 'Verbal, fisik, pengucilan, atau siber di medsos',
    icon: AlertTriangle,
    color: 'border-rose-200 bg-rose-50/60 text-rose-800',
  },
  {
    id: 'Akademik',
    label: 'Akademik & Belajar',
    desc: 'Kesulitan materi kejuruan, ujian, atau kejenuhan',
    icon: BookOpen,
    color: 'border-blue-200 bg-blue-50/60 text-navy-800',
  },
  {
    id: 'Karir/Prakerin',
    label: 'Karir & PKL Magang',
    desc: 'Masalah di tempat PKL industri, karir vokasi',
    icon: Briefcase,
    color: 'border-amber-200 bg-amber-50/60 text-amber-800',
  },
  {
    id: 'Pribadi',
    label: 'Masalah Pribadi & Sosial',
    desc: 'Kecemasan, konflik keluarga, pertemanan',
    icon: HeartHandshake,
    color: 'border-purple-200 bg-purple-50/60 text-purple-800',
  },
  {
    id: 'Pelecehan',
    label: 'Pelecehan & Kekerasan',
    desc: 'Tindakan pelecehan, ancaman fisik atau verbal',
    icon: ShieldAlert,
    color: 'border-red-300 bg-red-100/70 text-red-900',
  },
  {
    id: 'Lainnya',
    label: 'Keluhan Lainnya',
    desc: 'Hal lain yang membutuhkan pendampingan BK',
    icon: MessageSquare,
    color: 'border-slate-200 bg-slate-50 text-slate-800',
  },
];

export const ReportModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    addReport,
    setActiveETicket,
    setIsETicketModalOpen,
  } = useApp();

  const [category, setCategory] = useState<ReportCategory>('Bullying');
  const [deskripsi, setDeskripsi] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [namaSiswa, setNamaSiswa] = useState('');
  const [kelas, setKelas] = useState('');
  const [buktiUrl, setBuktiUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isReportModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!deskripsi.trim()) {
      setErrorMsg('Harap ceritakan kronologi kejadian atau keluhan Anda.');
      return;
    }

    if (!isAnonymous) {
      if (!namaSiswa.trim() || !kelas.trim()) {
        setErrorMsg('Harap lengkapi Nama Lengkap dan Kelas Anda, atau aktifkan opsi 100% Anonim.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const createdReport = addReport({
        kategori: category,
        deskripsi: deskripsi.trim(),
        isAnonymous,
        namaSiswa: isAnonymous ? undefined : namaSiswa.trim(),
        kelas: isAnonymous ? undefined : kelas.trim(),
        buktiUrl: buktiUrl.trim() || undefined,
      });

      // Launch celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }

      // Reset form
      setDeskripsi('');
      setNamaSiswa('');
      setKelas('');
      setBuktiUrl('');
      setIsAnonymous(true);
      setCategory('Bullying');
      setIsSubmitting(false);

      // Close report modal and open E-Ticket modal
      setIsReportModalOpen(false);
      setActiveETicket(createdReport);
      setIsETicketModalOpen(true);
    } catch (err) {
      console.error(err);
      setErrorMsg('Terjadi kendala saat menyimpan laporan. Silakan coba lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-elevated border border-slate-200 w-full max-w-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-navy-800 to-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta-600 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Formulir Pengaduan & Kotak Curhat
              </h3>
              <p className="text-xs text-blue-200">
                Safe Space Bimbingan & Konseling UPT SMKN 2 Parepare
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsReportModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step 1: Select Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Pilih Kategori Masalah
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-terracotta-600 ring-2 ring-terracotta-500/20 bg-orange-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-terracotta-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-terracotta-600"></span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800">{cat.label}</div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                        {cat.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Anonymity Toggle (Zero Identifiable Trace) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isAnonymous ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-navy-800'
                  }`}
                >
                  {isAnonymous ? <EyeOff className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <span>Sembunyikan Identitas Saya</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isAnonymous
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isAnonymous ? '100% Anonim' : 'Identitas Terbuka'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {isAnonymous
                      ? 'Nama dan kelas Anda TIDAK akan dicatat atau disimpan sama sekali.'
                      : 'Nama dan kelas Anda hanya dapat dilihat oleh Guru BK penanggung jawab.'}
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={e => setIsAnonymous(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Non-anonymous fields */}
            {!isAnonymous && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={namaSiswa}
                      onChange={e => setNamaSiswa(e.target.value)}
                      placeholder="Contoh: Muhammad Rezky"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kelas & Jurusan *
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={kelas}
                      onChange={e => setKelas(e.target.value)}
                      placeholder="Contoh: XI TKJ 2 / XII TBSM 1"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Kronologi & Deskripsi */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              2. Ceritakan Masalah / Kronologi Kejadian *
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Jelaskan apa yang terjadi, kapan, di mana, atau hal yang membuat Anda merasa tidak nyaman.
            </p>
            <textarea
              required
              rows={4}
              value={deskripsi}
              onChange={e => setDeskripsi(e.target.value)}
              placeholder="Ceritakan dengan bebas di sini... Ruang ini aman untuk Anda."
              className="w-full p-3.5 text-xs sm:text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-terracotta-600 bg-slate-50/50"
            ></textarea>
          </div>

          {/* Step 4: Optional Proof URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              3. Tautan Bukti Pendukung (Opsional)
            </label>
            <div className="relative">
              <Paperclip className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={buktiUrl}
                onChange={e => setBuktiUrl(e.target.value)}
                placeholder="https://drive.google.com/... (link foto / screenshot / dokumen)"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 bg-white"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Pastikan tautan dapat diakses publik atau guru jika menggunakan Google Drive.
            </p>
          </div>

          {/* Reassurance Notice */}
          <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-navy-900 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-navy-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              Setelah tombol kirim ditekan, sistem otomatis menerbitkan <strong>E-Tiket Digital</strong>{' '}
              berisi <strong>Kode Pelacakan Unik</strong> untuk memantau proses penanganan.
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Menerbitkan E-Tiket...' : 'Kirim Laporan & Terbitkan E-Tiket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
