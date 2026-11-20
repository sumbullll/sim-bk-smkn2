'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { TeacherAvatar } from '../TeacherAvatar';
import { formatTeacherName } from '../../lib/utils';
import {
  X,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  CalendarCheck2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const TeacherDetailModal: React.FC = () => {
  const {
    isTeacherDetailModalOpen,
    setIsTeacherDetailModalOpen,
    selectedTeacherForDetail,
    setSelectedTeacherForAppointment,
    setIsAppointmentModalOpen,
  } = useApp();

  if (!isTeacherDetailModalOpen || !selectedTeacherForDetail) return null;

  const teacher = selectedTeacherForDetail;

  const handleBooking = () => {
    setIsTeacherDetailModalOpen(false);
    setSelectedTeacherForAppointment(teacher);
    setIsAppointmentModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-elevated border border-slate-200 w-full max-w-lg overflow-hidden my-6">
        {/* Top bar with back button */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setIsTeacherDetailModalOpen(false)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-navy-800 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Guru</span>
          </button>
          <button
            onClick={() => setIsTeacherDetailModalOpen(false)}
            className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Body (inspired by iVOTE Candidate Profile modal) */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Avatar and Primary Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <TeacherAvatar
                src={teacher.avatar}
                name={teacher.nama}
                size="lg"
                className="border-4 border-slate-100 shadow-md"
              />
              <span
                className={`absolute bottom-0 right-1 w-5 h-5 rounded-full border-2 border-white ${
                  teacher.status === 'tersedia'
                    ? 'bg-emerald-500'
                    : teacher.status === 'konseling'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              />
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    teacher.status === 'tersedia'
                      ? 'bg-emerald-100 text-emerald-800'
                      : teacher.status === 'konseling'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {teacher.status === 'tersedia'
                    ? 'Tersedia untuk Konseling'
                    : teacher.status === 'konseling'
                    ? 'Sedang Sesi Konseling'
                    : 'Sibuk / Jam Mengajar'}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {teacher.pengalamanTahun} Thn Mengabdi
                </span>
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 leading-snug">
                {formatTeacherName(teacher)}
              </h3>
              {teacher.jabatan && (
                <div className="text-xs font-bold text-indigo-700 mt-0.5">{teacher.jabatan}</div>
              )}
              <p className="text-xs font-mono text-slate-500 mt-0.5">NIP. {teacher.nip}</p>
              <div className="mt-2 text-xs font-semibold text-navy-800 bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-xl inline-block">
                {teacher.spesialisasi}
              </div>
            </div>
          </div>

          {/* Philosophy / Bio */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
              Pendekatan & Visi Pendampingan
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              "{teacher.bio}"
            </p>
          </div>

          {/* Details Metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>Ruang Konseling</span>
              </div>
              <div className="font-semibold text-slate-800">{teacher.ruangan}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Jadwal Piket</span>
              </div>
              <div className="font-semibold text-slate-800">{teacher.jadwalHari}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Award className="w-3 h-3 text-slate-500" />
                <span>Total Sesi Konseling</span>
              </div>
              <div className="font-bold text-navy-900 text-sm">
                {teacher.totalKonseling} Sesi Siswa
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Karakter Layanan</span>
              </div>
              <div className="font-semibold text-slate-800">Ruang Aman Tanpa Sidang</div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              onClick={handleBooking}
              className="w-full py-3.5 px-4 rounded-2xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-navy transition cursor-pointer"
            >
              <CalendarCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Jadwalkan Konseling dengan Guru Ini</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
