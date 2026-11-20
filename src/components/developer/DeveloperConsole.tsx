'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Teacher, SchoolSettings } from '../../types';
import { TeacherFormModal } from './TeacherFormModal';
import { EditProfilePhotoModal } from '../modals/EditProfilePhotoModal';
import { exportToCSV, formatDateIndo, formatTeacherName } from '../../lib/utils';
import { TeacherAvatar } from '../TeacherAvatar';
import {
  SlidersHorizontal,
  Users,
  Building,
  Download,
  RotateCcw,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle,
  FileSpreadsheet,
  LogOut,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Cloud,
  RefreshCw,
  UploadCloud,
} from 'lucide-react';

export const DeveloperConsole: React.FC = () => {
  const {
    teachers,
    reports,
    appointments,
    schoolSettings,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    updateSchoolSettings,
    resetToDefaultData,
    setViewMode,
    logoutDev,
    cloudStatus,
    cloudMessage,
    lastSyncedAt,
    syncWithCloud,
    pushLocalToCloud,
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);

  const [activeTab, setActiveTab] = useState<'teachers' | 'school' | 'export'>('teachers');
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isEditPhotoModalOpen, setIsEditPhotoModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // School settings form state
  const [schoolForm, setSchoolForm] = useState<SchoolSettings>({ ...schoolSettings });
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  // Handle open add teacher
  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setIsTeacherModalOpen(true);
  };

  // Handle open edit teacher (uses rich Edit Profile & Photo modal)
  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setIsEditPhotoModalOpen(true);
  };

  // Handle save teacher
  const handleSaveTeacher = (teacherData: any) => {
    if (editingTeacher) {
      updateTeacher(editingTeacher.id, teacherData);
    } else {
      addTeacher(teacherData);
    }
  };

  // Handle save school settings
  const handleSaveSchoolSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolSettings(schoolForm);
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 3000);
  };

  // Export Reports CSV
  const handleExportReports = () => {
    const formattedRows = reports.map(r => ({
      id: r.id,
      trackingCode: r.trackingCode,
      kategori: r.kategori,
      deskripsi: r.deskripsi,
      isAnonymous: r.isAnonymous ? 'Ya (Anonim)' : 'Tidak (Terbuka)',
      namaSiswa: r.namaSiswa || '-',
      kelas: r.kelas || '-',
      status: r.status,
      namaGuru: r.namaGuru || '-',
      catatanGuru: r.catatanGuru || '-',
      createdAt: formatDateIndo(r.createdAt),
      tanggapanAt: r.tanggapanAt ? formatDateIndo(r.tanggapanAt) : '-',
      buktiUrl: r.buktiUrl || '-',
    }));

    exportToCSV(`SIM_BK_Laporan_Pengaduan_${Date.now()}`, formattedRows);
  };

  // Export Appointments CSV
  const handleExportAppointments = () => {
    const formattedRows = appointments.map(a => ({
      id: a.id,
      namaSiswa: a.namaSiswa,
      kelas: a.kelas,
      topik: a.topik,
      tanggal: a.tanggal,
      waktu: a.waktu,
      nomorWa: a.nomorWa,
      guruKonselor: a.namaGuru,
      status: a.status,
      createdAt: formatDateIndo(a.createdAt),
    }));

    exportToCSV(`SIM_BK_Jadwal_Konseling_${Date.now()}`, formattedRows);
  };

  // Confirm Reset
  const handleResetData = () => {
    if (
      confirm(
        'PERINGATAN: Seluruh data laporan, perubahan guru, dan jadwal akan dikembalikan ke data awal purwarupa (seed default). Lanjutkan?'
      )
    ) {
      resetToDefaultData();
      alert('Data sistem berhasil direset ke kondisi awal.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-200/90 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-700 text-white flex items-center justify-center shadow-md">
              <SlidersHorizontal className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                  Developer & Superadmin Mode
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    cloudStatus === 'connected'
                      ? 'bg-emerald-100 text-emerald-800'
                      : cloudStatus === 'tables_missing'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {cloudStatus === 'connected'
                    ? 'v1.0 Supabase Cloud Sync'
                    : cloudStatus === 'tables_missing'
                    ? 'Supabase Ready (Perlu Run SQL)'
                    : 'v1.0 Offline-First'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900">
                Konsol Master Data & Konfigurasi Sekolah
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola guru BK, informasi sekolah, serta ekspor rekapitulasi data dinas
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setViewMode('public')}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Lihat Web Publik
            </button>
            <button
              onClick={() => logoutDev()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Dev</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab('teachers')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'teachers'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Master Data Guru BK ({teachers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('school')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'school'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Pengaturan Profil Sekolah</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'export'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Basis Data (CSV)</span>
          </button>
        </div>

        {/* Tab 1: Teachers Master Data */}
        {activeTab === 'teachers' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Daftar Guru Bimbingan dan Konseling
                </h3>
                <p className="text-xs text-slate-500">
                  Data profil, spesialisasi, status ketersediaan, dan jadwal piket
                </p>
              </div>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Guru BK</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 uppercase text-[10px] font-bold text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Guru BK</th>
                    <th className="px-5 py-3">Spesialisasi</th>
                    <th className="px-5 py-3">Ruangan & Jadwal</th>
                    <th className="px-5 py-3">Status Live</th>
                    <th className="px-5 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {teachers.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <TeacherAvatar
                            src={t.avatar}
                            name={t.nama}
                            size="sm"
                            className="border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">
                              {formatTeacherName(t)}
                            </div>
                            {t.jabatan && (
                              <div className="text-[11px] font-semibold text-indigo-700">
                                {t.jabatan}
                              </div>
                            )}
                            <div className="text-[11px] font-mono text-slate-400">
                              NIP: {t.nip}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-navy-800 border border-blue-200 text-[11px] font-semibold">
                          {t.spesialisasi}
                        </span>
                      </td>
                      <td className="px-5 py-4 space-y-0.5">
                        <div className="text-slate-800 font-semibold">{t.ruangan}</div>
                        <div className="text-[11px] text-slate-400">{t.jadwalHari}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            t.status === 'tersedia'
                              ? 'bg-emerald-100 text-emerald-800'
                              : t.status === 'konseling'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              t.status === 'tersedia'
                                ? 'bg-emerald-500'
                                : t.status === 'konseling'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          />
                          {t.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Edit Guru"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus guru ${t.nama}?`)) {
                                deleteTeacher(t.id);
                              }
                            }}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                            title="Hapus Guru"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: School Settings */}
        {activeTab === 'school' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8">
            <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Profil & Identitas Satuan Pendidikan
                </h3>
                <p className="text-xs text-slate-500">
                  Sesuaikan teks branding, hotline BK, dan program resmi sekolah
                </p>
              </div>
              {savedSettingsSuccess && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <CheckCircle className="w-4 h-4" />
                  <span>Pengaturan Berhasil Disimpan!</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveSchoolSettings} className="space-y-4 max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Satuan Pendidikan
                  </label>
                  <input
                    type="text"
                    value={schoolForm.namaSekolah}
                    onChange={e =>
                      setSchoolForm({ ...schoolForm, namaSekolah: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sub Judul / Nama Sistem
                  </label>
                  <input
                    type="text"
                    value={schoolForm.subNama}
                    onChange={e =>
                      setSchoolForm({ ...schoolForm, subNama: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Guru Pengembang / Mapel
                  </label>
                  <input
                    type="text"
                    value={schoolForm.guruPengembang}
                    onChange={e =>
                      setSchoolForm({ ...schoolForm, guruPengembang: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Program Resmi / Naungan
                  </label>
                  <input
                    type="text"
                    value={schoolForm.programResmi}
                    onChange={e =>
                      setSchoolForm({ ...schoolForm, programResmi: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hotline WhatsApp BK Sekolah
                  </label>
                  <input
                    type="text"
                    value={schoolForm.hotlineBk}
                    onChange={e =>
                      setSchoolForm({ ...schoolForm, hotlineBk: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Resmi Layanan BK
                  </label>
                  <input
                    type="email"
                    value={schoolForm.emailSekolah}
                    onChange={e =>
                      setSchoolForm({ ...schoolForm, emailSekolah: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Sekolah
                </label>
                <input
                  type="text"
                  value={schoolForm.alamatSekolah}
                  onChange={e =>
                    setSchoolForm({ ...schoolForm, alamatSekolah: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pesan Sambutan Utama Portal
                </label>
                <textarea
                  rows={3}
                  value={schoolForm.pesanSambutan}
                  onChange={e =>
                    setSchoolForm({ ...schoolForm, pesanSambutan: e.target.value })
                  }
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Pengaturan</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Cloud Sync, Export & Maintenance */}
        {activeTab === 'export' && (
          <div className="space-y-6">
            {/* Supabase Cloud Database Panel */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      cloudStatus === 'connected'
                        ? 'bg-emerald-100 text-emerald-700'
                        : cloudStatus === 'tables_missing'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-sm text-slate-900">
                        Koneksi Cloud Database (Supabase PostgreSQL)
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cloudStatus === 'connected'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cloudStatus === 'tables_missing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {cloudStatus === 'connected'
                          ? 'TERHUBUNG'
                          : cloudStatus === 'tables_missing'
                          ? 'TABEL BELUM DIBUAT'
                          : cloudStatus === 'checking'
                          ? 'MEMERIKSA...'
                          : 'OFFLINE / LOKAL'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{cloudMessage}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={async () => {
                      setIsSyncing(true);
                      await syncWithCloud();
                      setIsSyncing(false);
                    }}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold shadow-sm transition cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Menyinkronkan...' : 'Cek & Tarik Data Cloud'}</span>
                  </button>

                  {cloudStatus === 'connected' && (
                    <button
                      onClick={async () => {
                        setIsSyncing(true);
                        const ok = await pushLocalToCloud();
                        setIsSyncing(false);
                        if (ok) alert('Seluruh data lokal berhasil diunggah ke Supabase!');
                      }}
                      disabled={isSyncing}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition cursor-pointer disabled:opacity-50"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Unggah Data Lokal ke Cloud</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Project URL</div>
                  <div className="font-mono text-slate-700 mt-0.5 truncate">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Belum dikonfigurasi'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Sinkronisasi Terakhir
                  </div>
                  <div className="font-semibold text-slate-700 mt-0.5">
                    {lastSyncedAt ? formatDateIndo(lastSyncedAt) : 'Belum tersinkron'}
                  </div>
                </div>
              </div>

              {cloudStatus === 'tables_missing' && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  <strong>Langkah Terakhir Aktivasi Cloud:</strong> Buka Dashboard Supabase Anda ➔
                  menu <strong>SQL Editor</strong> ➔ salin & jalankan file{' '}
                  <code className="px-1.5 py-0.5 bg-amber-100 rounded font-mono font-bold">
                    supabase/schema.sql
                  </code>{' '}
                  dari folder proyek ini, lalu klik tombol <strong>Cek & Tarik Data Cloud</strong> di
                  atas.
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">
                    Ekspor Data Laporan & Konseling (CSV)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Unduh berkas spreadsheet terstruktur untuk laporan berkala dinas/sekolah
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Data CSV telah diformat dengan UTF-8 BOM sehingga langsung terbaca rapi pada Microsoft
                Excel dan Google Sheets.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleExportReports}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-between shadow-sm transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Ekspor Seluruh Laporan Pengaduan Siswa</span>
                  </span>
                  <span className="text-[11px] bg-emerald-800 px-2 py-0.5 rounded-md font-mono">
                    {reports.length} Data
                  </span>
                </button>

                <button
                  onClick={handleExportAppointments}
                  className="w-full py-3 px-4 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold flex items-center justify-between shadow-sm transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>Ekspor Jadwal Janji Temu Konseling</span>
                  </span>
                  <span className="text-[11px] bg-navy-950 px-2 py-0.5 rounded-md font-mono">
                    {appointments.length} Data
                  </span>
                </button>
              </div>
            </div>

            {/* Maintenance & Reset Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-slate-900">
                    Pemeliharaan Basis Data Lokal
                  </h3>
                  <p className="text-xs text-slate-500">
                    Reset storage atau pembersihan cache purwarupa
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Fitur ini berguna selama pengujian aplikasi. Tombol reset akan mengembalikan seluruh data
                ke spesifikasi master awal dokumen PRD (termasuk 5 profil guru BK & pengembang, serta mengosongkan antrean aduan).
              </p>

              <div className="pt-4">
                <button
                  onClick={handleResetData}
                  className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Basis Data ke Kondisi Awal</span>
                </button>
              </div>
            </div>
            </div>
          </div>
        )}

        {/* Teacher modal for adding new teacher */}
        <TeacherFormModal
          isOpen={isTeacherModalOpen}
          onClose={() => {
            setIsTeacherModalOpen(false);
            setEditingTeacher(null);
          }}
          onSave={handleSaveTeacher}
          editingTeacher={null}
        />

        {/* Rich Edit Profile & Photo modal */}
        <EditProfilePhotoModal
          teacher={editingTeacher}
          isOpen={isEditPhotoModalOpen}
          onClose={() => {
            setIsEditPhotoModalOpen(false);
            setEditingTeacher(null);
          }}
          onSave={(id, updates) => updateTeacher(id, updates)}
        />
      </div>
    </div>
  );
};
