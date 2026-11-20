'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTeacherName } from '../../lib/utils';
import {
  X,
  CalendarCheck2,
  User,
  GraduationCap,
  MessageSquare,
  Clock,
  Phone,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TIME_SLOTS = [
  '08.00 - 09.00 WITA',
  '09.30 - 10.30 WITA',
  '11.00 - 12.00 WITA',
  '13.30 - 14.30 WITA',
];

export const AppointmentModal: React.FC = () => {
  const {
    isAppointmentModalOpen,
    setIsAppointmentModalOpen,
    selectedTeacherForAppointment,
    setSelectedTeacherForAppointment,
    teachers,
    addAppointment,
  } = useApp();

  const [guruId, setGuruId] = useState('');
  const [namaSiswa, setNamaSiswa] = useState('');
  const [kelas, setKelas] = useState('');
  const [topik, setTopik] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [waktu, setWaktu] = useState(TIME_SLOTS[0]);
  const [nomorWa, setNomorWa] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (selectedTeacherForAppointment) {
      setGuruId(selectedTeacherForAppointment.id);
    } else if (teachers.length > 0 && !guruId) {
      setGuruId(teachers[0].id);
    }
  }, [selectedTeacherForAppointment, teachers]);

  // Set default minimum date to tomorrow
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (!tanggal) {
      setTanggal(getTomorrowDate());
    }
  }, []);

  if (!isAppointmentModalOpen) return null;

  const selectedTeacher = teachers.find(t => t.id === guruId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!namaSiswa.trim() || !kelas.trim() || !topik.trim() || !nomorWa.trim() || !tanggal) {
      setErrorMsg('Mohon lengkapi semua kolom formulir.');
      return;
    }

    if (!selectedTeacher) {
      setErrorMsg('Pilih guru konselor yang diinginkan.');
      return;
    }

    addAppointment({
      namaSiswa: namaSiswa.trim(),
      kelas: kelas.trim(),
      topik: topik.trim(),
      tanggal,
      waktu,
      nomorWa: nomorWa.trim(),
      guruId: selectedTeacher.id,
      namaGuru: formatTeacherName(selectedTeacher),
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}

    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsAppointmentModalOpen(false);
    setSelectedTeacherForAppointment(undefined);
    setIsSuccess(false);
    setNamaSiswa('');
    setKelas('');
    setTopik('');
    setNomorWa('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-elevated border border-slate-200 w-full max-w-xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-navy-800 to-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Reservasi Konseling Tatap Muka
              </h3>
              <p className="text-xs text-blue-200">
                Pilih waktu bincang santai bersama konselor di ruang BK
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900">
              Permohonan Jadwal Berhasil Dikirim!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Jadwal Anda bersama <strong>{selectedTeacher ? formatTeacherName(selectedTeacher) : ''}</strong> untuk{' '}
              <strong>{tanggal} ({waktu})</strong> telah dicatat di sistem antrean guru. Guru BK akan
              mengirim pesan konfirmasi resmi ke WhatsApp Anda.
            </p>
            <div className="pt-4">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold transition shadow-sm"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Select Teacher */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Pilih Konselor BK
              </label>
              <select
                value={guruId}
                onChange={e => setGuruId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-navy-600 bg-white"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {formatTeacherName(t)} ({t.spesialisasi}) - Status: {t.status}
                  </option>
                ))}
              </select>
              {selectedTeacher && (
                <div className="mt-1.5 text-[11px] text-slate-500 flex items-center gap-2">
                  <span>Lokasi: {selectedTeacher.ruangan}</span>
                  <span>•</span>
                  <span>Jadwal: {selectedTeacher.jadwalHari}</span>
                </div>
              )}
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    placeholder="Nama lengkap Anda"
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
                    placeholder="Contoh: XI RPL 1"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Topik yang Ingin Dibahas *
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={topik}
                  onChange={e => setTopik(e.target.value)}
                  placeholder="Contoh: Konsultasi PKL Industri / Bimbingan Belajar / Masalah Pribadi"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 bg-white"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Tanggal Pertemuan *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    min={getTomorrowDate()}
                    value={tanggal}
                    onChange={e => setTanggal(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Jam Pertemuan *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={waktu}
                    onChange={e => setWaktu(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 bg-white"
                  >
                    {TIME_SLOTS.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor WhatsApp Aktif Siswa *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={nomorWa}
                  onChange={e => setNomorWa(e.target.value)}
                  placeholder="08xxxxxxxxxx (untuk konfirmasi jadwal dari Guru BK)"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 bg-white"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Guru BK akan mengirim pesan persetujuan jadwal ke nomor ini sebelum sesi dimulai.
              </p>
            </div>

            {/* Submit */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold shadow-md transition cursor-pointer"
              >
                <CalendarCheck2 className="w-4 h-4" />
                <span>Ajukan Jadwal Konseling</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
