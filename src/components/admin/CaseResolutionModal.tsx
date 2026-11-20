'use client';

import React, { useState } from 'react';
import { Report } from '../../types';
import {
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  Send,
} from 'lucide-react';

interface CaseResolutionModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reportId: string, solutionNote: string) => void;
}

export const CaseResolutionModal: React.FC<CaseResolutionModalProps> = ({
  report,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [solutionNote, setSolutionNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !report) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionNote.trim()) {
      setErrorMsg('Harap tuliskan catatan solusi / rekomendasi tindak lanjut resmi.');
      return;
    }
    onConfirm(report.id, solutionNote.trim());
    setSolutionNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-elevated border border-slate-200 w-full max-w-lg overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 bg-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Selesaikan Penanganan Kasus
              </h3>
              <p className="text-xs text-blue-200">
                Tiket: <span className="font-mono">{report.trackingCode}</span> ({report.kategori})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Incident Preview */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Kronologi Aduan Siswa:
            </div>
            <p className="text-slate-700 italic">"{report.deskripsi}"</p>
            <div className="text-[11px] text-slate-500 pt-1">
              Pelapor:{' '}
              <strong>{report.isAnonymous ? '100% Anonim' : `${report.namaSiswa} (${report.kelas})`}</strong>
            </div>
          </div>

          {/* Strict Permission Notification */}
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-navy-900 flex items-start gap-2">
            <Lock className="w-4 h-4 text-navy-700 shrink-0 mt-0.5" />
            <span>
              <strong>Hak Akses Khusus (FR-07):</strong> Anda adalah konselor penanggung jawab kasus ini.
              Catatan yang Anda masukkan akan ditampilkan langsung pada E-Tiket pelacakan siswa.
            </span>
          </div>

          {/* Solution Note Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Catatan Solusi / Rekomendasi Resmi Konselor *
            </label>
            <textarea
              required
              rows={4}
              value={solutionNote}
              onChange={e => setSolutionNote(e.target.value)}
              placeholder="Contoh: Siswa telah diajak konseling empat mata. Masalah telah dimediasi bersama wali kelas dan dipastikan aman..."
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-white"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tandai Kasus Selesai (Tuntas)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
