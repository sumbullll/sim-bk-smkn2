'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Report, TeacherStatus, Appointment } from '../../types';
import { CaseResolutionModal } from './CaseResolutionModal';
import { EditProfilePhotoModal } from '../modals/EditProfilePhotoModal';
import { formatDateIndo, generateWhatsAppLink, formatTeacherName } from '../../lib/utils';
import { TeacherAvatar } from '../TeacherAvatar';
import {
  ShieldAlert,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  User,
  Phone,
  MessageSquare,
  Search,
  Filter,
  Check,
  Lock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  LogOut,
  MapPin,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  Camera,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentTeacher,
    teachers,
    reports,
    appointments,
    updateReportStatus,
    updateAppointmentStatus,
    updateTeacherStatus,
    updateTeacher,
    setViewMode,
    logoutAdmin,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reports' | 'appointments' | 'profile'>('reports');
  const [reportFilter, setReportFilter] = useState<'all' | 'masuk' | 'proses' | 'selesai'>('all');
  const [reportSearch, setReportSearch] = useState('');
  const [selectedReportForResolution, setSelectedReportForResolution] = useState<Report | null>(null);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  if (!currentTeacher) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-slate-800">Sesi Login Guru Tidak Ditemukan</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Silakan masuk kembali melalui portal autentikasi guru BK.
        </p>
        <button
          onClick={() => setViewMode('public')}
          className="px-5 py-2.5 rounded-xl bg-navy-800 text-white text-xs font-bold"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // Metrics
  const totalReports = reports.length;
  const masukReports = reports.filter(r => r.status === 'masuk').length;
  const prosesReports = reports.filter(r => r.status === 'proses').length;
  const selesaiReports = reports.filter(r => r.status === 'selesai').length;
  const pendingAppointments = appointments.filter(a => a.status === 'menunggu').length;

  // Filtered reports
  const filteredReports = reports.filter(r => {
    const matchesFilter = reportFilter === 'all' || r.status === reportFilter;
    const matchesSearch =
      r.trackingCode.toLowerCase().includes(reportSearch.toLowerCase()) ||
      r.kategori.toLowerCase().includes(reportSearch.toLowerCase()) ||
      r.deskripsi.toLowerCase().includes(reportSearch.toLowerCase()) ||
      (r.namaSiswa && r.namaSiswa.toLowerCase().includes(reportSearch.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Handle Taking a Case (masuk -> proses)
  const handleTakeCase = (report: Report) => {
    updateReportStatus(
      report.id,
      'proses',
      undefined,
      currentTeacher.id,
      formatTeacherName(currentTeacher)
    );
  };

  // Open Resolution Modal (FR-07: Strict Case Resolution)
  const handleOpenResolution = (report: Report) => {
    setSelectedReportForResolution(report);
    setIsResolutionModalOpen(true);
  };

  // Confirm Case Completion
  const handleConfirmResolution = (reportId: string, solutionNote: string) => {
    updateReportStatus(
      reportId,
      'selesai',
      solutionNote,
      currentTeacher.id,
      formatTeacherName(currentTeacher)
    );
  };

  // Handle WhatsApp Confirmation (FR-08)
  const handleWhatsAppConfirm = (appointment: Appointment) => {
    const message = `Halo *${appointment.namaSiswa}* (${appointment.kelas}), pengajuan jadwal konselingmu bersama Guru *${formatTeacherName(currentTeacher)}* pada hari *${appointment.tanggal}* pukul *${appointment.waktu}* telah *DIKONFIRMASI*. Silakan datang tepat waktu ke *${currentTeacher.ruangan}*. Ruang BK adalah safe space yang aman untukmu. Terima kasih.`;
    const waUrl = generateWhatsAppLink(appointment.nomorWa, message);
    updateAppointmentStatus(appointment.id, 'dikonfirmasi');
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {profileSavedToast && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profil & foto Anda berhasil diperbarui dan otomatis tersinkronisasi!</span>
          </div>
        )}

        {/* Workstation Top Profile Bar (inspired by iVOTE Dashboard header) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsEditProfileModalOpen(true)}
              title="Klik untuk ganti foto atau edit profil Anda"
              className="relative group cursor-pointer shrink-0"
            >
              <TeacherAvatar
                src={currentTeacher.avatar}
                name={currentTeacher.nama}
                size="md"
                className="border-4 border-slate-100 shadow-sm group-hover:brightness-90 transition"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 text-white border-2 border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition">
                <Camera className="w-3 h-3" />
              </span>
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {currentTeacher.jabatan || 'Ruang Kerja Konselor'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-navy-800 font-bold">
                  Aktif
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-display font-extrabold text-slate-900 leading-snug">
                Halo, {formatTeacherName(currentTeacher)}!
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentTeacher.spesialisasi} • {currentTeacher.ruangan}
              </p>
            </div>
          </div>

          {/* FR-09: Live Teacher Status Switcher & Self-Edit Profile */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-semibold">
              <span className="text-slate-500 px-2 text-[11px] font-bold">Status Saya:</span>
              <button
                onClick={() => updateTeacherStatus(currentTeacher.id, 'tersedia')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  currentTeacher.status === 'tersedia'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tersedia
              </button>
              <button
                onClick={() => updateTeacherStatus(currentTeacher.id, 'konseling')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  currentTeacher.status === 'konseling'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Konseling
              </button>
              <button
                onClick={() => updateTeacherStatus(currentTeacher.id, 'sibuk')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  currentTeacher.status === 'sibuk'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sibuk
              </button>
            </div>

            <button
              onClick={() => setIsEditProfileModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Edit Profil & Foto</span>
            </button>

            <button
              onClick={() => setViewMode('public')}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Lihat Web Publik
            </button>
          </div>
        </div>

        {/* 4 Metric Cards (iVOTE styled) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Kasus Menunggu
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                !
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-amber-600">
              {masukReports}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Perlu segera ditangani</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sedang Diproses
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                ⚙
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-navy-800">
              {prosesReports}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Dalam pendampingan</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Kasus Tuntas
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                ✓
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-600">
              {selesaiReports}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Solusi resmi terbit</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Janji Temu Menunggu
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                📅
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-extrabold text-purple-700">
              {pendingAppointments}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Perlu konfirmasi WhatsApp</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Laporan Pengaduan Siswa ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-navy-800 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarCheck2 className="w-4 h-4" />
            <span>Jadwal Konseling Tatap Muka ({appointments.length})</span>
          </button>
        </div>

        {/* Tab 1 Content: Reports Management with FR-07 Strict Resolution */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
            {/* Filters bar */}
            <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-slate-500 mr-1">Filter Status:</span>
                {(['all', 'masuk', 'proses', 'selesai'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setReportFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      reportFilter === st
                        ? 'bg-navy-800 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {st === 'all'
                      ? 'Semua'
                      : st === 'masuk'
                      ? 'Masuk'
                      : st === 'proses'
                      ? 'Diproses'
                      : 'Selesai'}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={reportSearch}
                  onChange={e => setReportSearch(e.target.value)}
                  placeholder="Cari kode tiket, nama, masalah..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 bg-white"
                />
              </div>
            </div>

            {/* Reports List */}
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                Tidak ada laporan yang sesuai dengan filter.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredReports.map(report => {
                  const isAssignedToMe = report.guruId === currentTeacher.id;
                  const isAssignedToOther = report.guruId && report.guruId !== currentTeacher.id;

                  return (
                    <div
                      key={report.id}
                      className="p-5 sm:p-6 hover:bg-slate-50/70 transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-sm bg-slate-100 text-navy-900 px-2.5 py-0.5 rounded-lg border border-slate-200">
                            {report.trackingCode}
                          </span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-terracotta-800 border border-orange-200">
                            {report.kategori}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              report.status === 'selesai'
                                ? 'bg-emerald-100 text-emerald-800'
                                : report.status === 'proses'
                                ? 'bg-blue-100 text-navy-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            Status: {report.status.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                          "{report.deskripsi}"
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                          <span>
                            Pelapor:{' '}
                            <strong className="text-slate-700">
                              {report.isAnonymous
                                ? '100% Anonim'
                                : `${report.namaSiswa} (${report.kelas})`}
                            </strong>
                          </span>
                          <span>•</span>
                          <span>Waktu: {formatDateIndo(report.createdAt)}</span>
                          {report.buktiUrl && (
                            <>
                              <span>•</span>
                              <a
                                href={report.buktiUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-navy-700 font-semibold underline hover:text-navy-900 inline-flex items-center gap-1"
                              >
                                <span>Lihat Bukti Lampiran</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </>
                          )}
                        </div>

                        {/* Counselor assignment notice */}
                        {report.namaGuru && (
                          <div className="text-xs text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-xl inline-block mt-1">
                            Konselor:{' '}
                            <strong className="text-navy-900">{report.namaGuru}</strong>
                            {isAssignedToMe && (
                              <span className="ml-1.5 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                                Anda Penanggung Jawab
                              </span>
                            )}
                          </div>
                        )}

                        {/* Solution note if finished */}
                        {report.catatanGuru && (
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 mt-2">
                            <strong>Solusi Resmi:</strong> {report.catatanGuru}
                          </div>
                        )}
                      </div>

                      {/* Action buttons with FR-07 Strict Case Resolution Rules */}
                      <div className="shrink-0 flex items-center gap-2 w-full lg:w-auto justify-end">
                        {report.status === 'masuk' && (
                          <button
                            onClick={() => handleTakeCase(report)}
                            className="w-full lg:w-auto px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                          >
                            Tangani Kasus Ini
                          </button>
                        )}

                        {report.status === 'proses' && (
                          <>
                            {isAssignedToMe ? (
                              <button
                                onClick={() => handleOpenResolution(report)}
                                className="w-full lg:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Selesaikan Kasus</span>
                              </button>
                            ) : (
                              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 font-semibold cursor-not-allowed">
                                <Lock className="w-3.5 h-3.5 text-slate-400" />
                                <span>Ditangani: {report.namaGuru || 'Guru Lain'}</span>
                              </div>
                            )}
                          </>
                        )}

                        {report.status === 'selesai' && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <Check className="w-3.5 h-3.5" />
                            <span>Tuntas</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2 Content: Appointments Management with FR-08 WhatsApp Confirmation */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Daftar Pengajuan Jadwal Konseling
                </h3>
                <p className="text-xs text-slate-500">
                  Konfirmasi sesi tatap muka dan kirimkan tautan pesan langsung ke WhatsApp siswa
                </p>
              </div>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                Belum ada pengajuan jadwal konseling dari siswa.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {appointments.map(app => (
                  <div
                    key={app.id}
                    className="p-5 sm:p-6 hover:bg-slate-50/70 transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-bold text-sm text-slate-900">
                          {app.namaSiswa} ({app.kelas})
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            app.status === 'dikonfirmasi'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'selesai'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-navy-800">
                        Topik: {app.topik}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{app.tanggal}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{app.waktu}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono">{app.nomorWa}</span>
                        </span>
                        <span>•</span>
                        <span>Konselor: {app.namaGuru}</span>
                      </div>
                    </div>

                    {/* FR-08: 1-Click WhatsApp Direct Link Button */}
                    <div className="shrink-0 flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
                      <button
                        onClick={() => handleWhatsAppConfirm(app)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                        title="Buka WhatsApp dengan draft pesan konfirmasi"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Konfirmasi via WA</span>
                      </button>

                      {app.status !== 'selesai' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'selesai')}
                          className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                        >
                          Tandai Selesai
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal for strict resolution */}
        <CaseResolutionModal
          report={selectedReportForResolution}
          isOpen={isResolutionModalOpen}
          onClose={() => {
            setIsResolutionModalOpen(false);
            setSelectedReportForResolution(null);
          }}
          onConfirm={handleConfirmResolution}
        />

        {/* Self-Edit Profile & Photo Modal for Logged-In Guru BK */}
        <EditProfilePhotoModal
          teacher={currentTeacher}
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          onSave={(teacherId, updates) => {
            updateTeacher(teacherId, updates);
            setProfileSavedToast(true);
            setTimeout(() => setProfileSavedToast(false), 3500);
          }}
        />
      </div>
    </div>
  );
};
