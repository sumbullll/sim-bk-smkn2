'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateIndo } from '../../lib/utils';
import { TeacherAvatar } from '../TeacherAvatar';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

export const TrackingModal: React.FC = () => {
  const {
    isTrackingModalOpen,
    setIsTrackingModalOpen,
    trackingCodeToSearch,
    setTrackingCodeToSearch,
    reports,
    teachers,
  } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (trackingCodeToSearch) {
      setInputCode(trackingCodeToSearch);
      setSearched(true);
    }
  }, [trackingCodeToSearch, isTrackingModalOpen]);

  if (!isTrackingModalOpen) return null;

  const currentCode = (inputCode || trackingCodeToSearch).trim().toUpperCase();
  const matchedReport = reports.find(
    r => r.trackingCode.toUpperCase() === currentCode
  );

  const assignedTeacher = matchedReport?.guruId
    ? teachers.find(t => t.id === matchedReport.guruId)
    : undefined;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setTrackingCodeToSearch(inputCode.trim());
      setSearched(true);
    }
  };

  // Determine stage step (1: Masuk, 2: Proses, 3: Selesai)
  const currentStep =
    matchedReport?.status === 'selesai'
      ? 3
      : matchedReport?.status === 'proses'
      ? 2
      : 1;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-elevated border border-slate-200 w-full max-w-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 bg-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white">
              <Search className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Pelacakan Status Pengaduan Siswa
              </h3>
              <p className="text-xs text-blue-200">
                Cek perkembangan tindak lanjut E-Tiket secara mandiri dan aman
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsTrackingModalOpen(false);
              setTrackingCodeToSearch('');
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar & Demo Chips */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputCode}
                onChange={e => setInputCode(e.target.value.toUpperCase())}
                placeholder="Masukkan Kode Tiket (Contoh: BK-7890A)..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 font-mono text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-navy-600 bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs shadow-sm transition cursor-pointer"
            >
              Cari Tiket
            </button>
          </form>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {!searched && !matchedReport ? (
            <div className="text-center py-10">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700 text-sm">
                Masukkan Kode E-Tiket Anda
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Ketik kode pelacakan unik berformat BK-XXXXX yang Anda peroleh saat mengirim laporan.
              </p>
            </div>
          ) : !matchedReport ? (
            <div className="text-center py-10 bg-amber-50/50 rounded-2xl border border-amber-200 p-6">
              <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm">
                Kode E-Tiket "{currentCode}" Tidak Ditemukan
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
                Mohon periksa kembali kode tiket Anda. Pastikan tidak ada kesalahan ketik huruf atau angka.
              </p>
            </div>
          ) : (
            /* Matched Report View */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Top Summary Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Kode Tiket Terdaftar
                  </div>
                  <div className="text-2xl font-mono font-black text-navy-900 tracking-wider">
                    {matchedReport.trackingCode}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Kategori:{' '}
                    <strong className="text-slate-800">{matchedReport.kategori}</strong>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      matchedReport.status === 'selesai'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : matchedReport.status === 'proses'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        matchedReport.status === 'selesai'
                          ? 'bg-emerald-500'
                          : matchedReport.status === 'proses'
                          ? 'bg-blue-500 animate-pulse'
                          : 'bg-amber-500'
                      }`}
                    ></span>
                    {matchedReport.status === 'selesai'
                      ? 'Kasus Selesai / Tuntas'
                      : matchedReport.status === 'proses'
                      ? 'Sedang Ditangani Konselor'
                      : 'Laporan Masuk (Menunggu Penugasan)'}
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Masuk: {formatDateIndo(matchedReport.createdAt)}
                  </div>
                </div>
              </div>

              {/* Linear Stepper Timeline */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Tahapan Penanganan Kasus
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {/* Step 1 */}
                  <div
                    className={`p-3 rounded-2xl border text-center transition ${
                      currentStep >= 1
                        ? 'border-navy-600 bg-blue-50/60 text-navy-900'
                        : 'border-slate-200 bg-white text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-bold ${
                        currentStep >= 1
                          ? 'bg-navy-800 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      ✓
                    </div>
                    <div className="font-bold text-xs">1. Masuk</div>
                    <div className="text-[10px] text-slate-500 hidden sm:block">
                      Diterima Sistem
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div
                    className={`p-3 rounded-2xl border text-center transition ${
                      currentStep >= 2
                        ? 'border-blue-600 bg-blue-50/60 text-navy-900'
                        : 'border-slate-200 bg-white text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-bold ${
                        currentStep >= 2
                          ? 'bg-blue-600 text-white animate-pulse'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {currentStep >= 2 ? '✓' : '2'}
                    </div>
                    <div className="font-bold text-xs">2. Diproses</div>
                    <div className="text-[10px] text-slate-500 hidden sm:block">
                      Ditangani Guru BK
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div
                    className={`p-3 rounded-2xl border text-center transition ${
                      currentStep >= 3
                        ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950'
                        : 'border-slate-200 bg-white text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-bold ${
                        currentStep >= 3
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {currentStep >= 3 ? '✓' : '3'}
                    </div>
                    <div className="font-bold text-xs">3. Tuntas</div>
                    <div className="text-[10px] text-slate-500 hidden sm:block">
                      Solusi Resmi Diberikan
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Counselor Info */}
              {matchedReport.namaGuru ? (
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
                  <TeacherAvatar
                    src={assignedTeacher?.avatar}
                    name={matchedReport.namaGuru}
                    size="sm"
                    className="w-12 h-12 text-sm border-2 border-slate-200 shadow-sm"
                  />
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Konselor Penanggung Jawab
                    </div>
                    <div className="font-display font-bold text-sm text-slate-900">
                      {matchedReport.namaGuru}
                    </div>
                    <div className="text-xs text-slate-500">
                      {assignedTeacher?.ruangan || 'Ruang Layanan BK SMKN 2 Parepare'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Laporan sedang dalam antrean. Guru BK piket akan segera mengambil dan menugaskan kasus ini.
                  </span>
                </div>
              )}

              {/* Official Solution / Notes */}
              {matchedReport.catatanGuru ? (
                <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Catatan & Rekomendasi Resmi Konselor:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed whitespace-pre-line">
                    {matchedReport.catatanGuru}
                  </p>
                  {matchedReport.tanggapanAt && (
                    <div className="mt-3 text-[11px] text-emerald-700 font-medium">
                      Pembaruan terakhir: {formatDateIndo(matchedReport.tanggapanAt)}
                    </div>
                  )}
                </div>
              ) : (
                matchedReport.status === 'proses' && (
                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs text-navy-900">
                    Konselor sedang melakukan verifikasi dan pendampingan tertutup. Catatan resmi akan
                    muncul di sini setelah tindakan selesai.
                  </div>
                )
              )}

              {/* Identity Protection Status */}
              <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    Identitas Pelapor:{' '}
                    <strong>
                      {matchedReport.isAnonymous ? '100% Anonim' : matchedReport.namaSiswa}
                    </strong>
                  </span>
                </span>
                <span className="text-[11px] text-slate-400">
                  Data dilindungi privasi sekolah
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
