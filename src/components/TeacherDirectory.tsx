'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Teacher, TeacherStatus } from '../types';
import { TeacherAvatar } from './TeacherAvatar';
import { formatTeacherName } from '../lib/utils';
import {
  Users,
  Calendar,
  MapPin,
  Clock,
  Award,
  ChevronRight,
  Search,
  Filter,
  Sparkles,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';

export const TeacherDirectory: React.FC = () => {
  const {
    teachers,
    setIsAppointmentModalOpen,
    setSelectedTeacherForAppointment,
    setIsTeacherDetailModalOpen,
    setSelectedTeacherForDetail,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TeacherStatus>('all');

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch =
      t.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.spesialisasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.gelar.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TeacherStatus) => {
    switch (status) {
      case 'tersedia':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Tersedia
          </span>
        );
      case 'konseling':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Sedang Konseling
          </span>
        );
      case 'sibuk':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Sibuk / Rapat
          </span>
        );
      default:
        return null;
    }
  };

  const handleOpenDetail = (teacher: Teacher) => {
    setSelectedTeacherForDetail(teacher);
    setIsTeacherDetailModalOpen(true);
  };

  const handleOpenAppointment = (teacher: Teacher) => {
    setSelectedTeacherForAppointment(teacher);
    setIsAppointmentModalOpen(true);
  };

  return (
    <section id="direktori-guru" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 text-terracotta-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-3.5 h-3.5 text-terracotta-600" />
              Tim Konselor Vokasi
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
              Direktori & Status Real-Time Guru BK
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-2xl">
              Pilih konselor yang sesuai dengan topik bahasan Anda. Pantau ketersediaan langsung guru
              sebelum datang ke ruang bimbingan konseling.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari guru atau spesialisasi..."
                className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-navy-600 w-48 sm:w-60"
              />
            </div>

            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === 'all'
                    ? 'bg-white text-navy-800 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setStatusFilter('tersedia')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === 'tersedia'
                    ? 'bg-white text-emerald-700 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tersedia
              </button>
              <button
                onClick={() => setStatusFilter('konseling')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === 'konseling'
                    ? 'bg-white text-amber-700 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Konseling
              </button>
            </div>
          </div>
        </div>

        {/* Teachers Grid (iVOTE Candidate/Voters card style) */}
        {filteredTeachers.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">
              Tidak ada guru BK yang cocok dengan pencarian atau filter Anda.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="mt-3 text-xs text-navy-700 font-bold hover:underline"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map(teacher => (
              <div
                key={teacher.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 flex-1 flex flex-col">
                  {/* Top status bar */}
                  <div className="flex items-center justify-between mb-4">
                    {getStatusBadge(teacher.status)}
                    <span className="text-[11px] font-semibold text-slate-400">
                      {teacher.pengalamanTahun} Thn Pengalaman
                    </span>
                  </div>

                  {/* Circular Avatar (iVOTE inspired) */}
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="relative mb-3">
                      <TeacherAvatar
                        src={teacher.avatar}
                        name={teacher.nama}
                        size="lg"
                        className="border-4 border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-200"
                      />
                      <span
                        className={`absolute bottom-0 right-1 w-5 h-5 rounded-full border-2 border-white ${
                          teacher.status === 'tersedia'
                            ? 'bg-emerald-500'
                            : teacher.status === 'konseling'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        title={`Status: ${teacher.status}`}
                      />
                    </div>
                    <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-navy-800 transition-colors leading-snug">
                      {formatTeacherName(teacher)}
                    </h3>
                    {teacher.jabatan && (
                      <span className="mt-1 inline-block text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full">
                        {teacher.jabatan}
                      </span>
                    )}
                    <p className="text-[11px] font-mono text-slate-500 mt-1">
                      NIP: {teacher.nip}
                    </p>
                  </div>

                  {/* Specialization Badge */}
                  <div className="mb-4">
                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                      Spesialisasi
                    </div>
                    <div className="text-xs font-semibold text-navy-800 bg-blue-50/70 border border-blue-200/70 px-2.5 py-1.5 rounded-xl leading-relaxed">
                      {teacher.spesialisasi}
                    </div>
                  </div>

                  {/* Location & Duty details */}
                  <div className="space-y-1.5 text-xs text-slate-600 mt-auto pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{teacher.ruangan}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{teacher.jadwalHari}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons (iVOTE styled) */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenDetail(teacher)}
                    className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer text-center"
                  >
                    Lihat Profil
                  </button>
                  <button
                    onClick={() => handleOpenAppointment(teacher)}
                    className="w-full py-2 px-3 text-xs font-bold text-white bg-navy-800 hover:bg-navy-900 rounded-xl transition shadow-sm cursor-pointer text-center"
                  >
                    Jadwalkan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
