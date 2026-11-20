'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { formatDateIndo } from '../../lib/utils';
import {
  X,
  Ticket,
  Printer,
  Copy,
  Check,
  Search,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ETicketModal: React.FC = () => {
  const {
    isETicketModalOpen,
    setIsETicketModalOpen,
    activeETicket,
    openTrackingWithCode,
    schoolSettings,
  } = useApp();

  const [copied, setCopied] = useState(false);

  if (!isETicketModalOpen || !activeETicket) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeETicket.trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTrackNow = () => {
    setIsETicketModalOpen(false);
    openTrackingWithCode(activeETicket.trackingCode);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-elevated border border-slate-200 w-full max-w-xl overflow-hidden my-6">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-navy-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <Ticket className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-sm text-white">
              E-Tiket Pelacakan Berhasil Diterbitkan
            </h3>
          </div>
          <button
            onClick={() => setIsETicketModalOpen(false)}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable E-Ticket Container */}
        <div className="p-6 sm:p-8">
          <div
            id="printable-eticket"
            className="bg-gradient-to-b from-white to-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-card"
          >
            {/* Top Cutout Circles for Ticket Look */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-300"></div>

            {/* School Header */}
            <div className="text-center pb-5 border-b border-slate-200">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-navy-100 text-navy-800 mb-1.5">
                E-TIKET RESMI BIMBINGAN KONSELING
              </span>
              <h2 className="text-xl font-display font-black text-navy-950 tracking-tight">
                {schoolSettings.namaSekolah}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Portal Pelaporan Siswa & Safe Space Sekolah
              </p>
            </div>

            {/* Tracking Code Centerpiece */}
            <div className="my-6 text-center bg-slate-100/80 rounded-2xl p-4 border border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Kode Pelacakan Anda
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-black text-terracotta-600 tracking-wider">
                {activeETicket.trackingCode}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Simpan atau catat kode ini untuk mengecek status penanganan kasus
              </div>
            </div>

            {/* QR Code & Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center pb-6 border-b border-slate-200">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center sm:border-r sm:border-slate-200 sm:pr-4">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <QRCodeSVG
                    value={activeETicket.trackingCode}
                    size={110}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <span className="text-[10px] font-mono font-semibold text-slate-400 mt-2">
                  Scan E-Tiket
                </span>
              </div>

              {/* Ticket Metadata */}
              <div className="sm:col-span-2 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status Aduan:</span>
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300 text-[11px]">
                    Laporan Masuk
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Kategori:</span>
                  <span className="font-bold text-slate-800">{activeETicket.kategori}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Identitas:</span>
                  <span className="font-bold text-slate-800">
                    {activeETicket.isAnonymous ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        100% Anonim
                      </span>
                    ) : (
                      `${activeETicket.namaSiswa} (${activeETicket.kelas})`
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Waktu Lapor:</span>
                  <span className="font-medium text-slate-700">
                    {formatDateIndo(activeETicket.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Footer: Barcode Aesthetic & Stamp */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              {/* Fake Barcode lines */}
              <div className="flex items-center gap-1 h-6">
                {[4, 2, 6, 2, 8, 3, 2, 5, 2, 7, 3, 2, 6, 4, 2, 5, 3, 7, 2, 4].map((w, i) => (
                  <span
                    key={i}
                    style={{ width: `${w}px` }}
                    className="h-full bg-slate-800 inline-block rounded-xs"
                  ></span>
                ))}
              </div>

              <div className="text-[10px] text-slate-400 font-mono">
                SIM-BK UPT SMKN 2 PAREPARE • SECURE TICKET
              </div>
            </div>
          </div>

          {/* Action Buttons for User (Hidden in Print) */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 no-print">
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Kode Tersalin!' : 'Salin Kode Tiket'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-navy-800 bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs transition cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4 text-blue-200" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={handleTrackNow}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
            >
              <Search className="w-4 h-4 text-amber-200" />
              <span>Pantau Status Laporan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
