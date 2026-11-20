'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatTeacherName } from '../../lib/utils';
import { LogOut, ShieldAlert, X } from 'lucide-react';

export const LogoutConfirmModal: React.FC = () => {
  const { logoutModal, logoutAdmin, logoutDev, cancelLogout, currentTeacher } = useApp();

  if (!logoutModal.isOpen) return null;

  const isGuru = logoutModal.target === 'admin';
  const roleName = isGuru
    ? currentTeacher
      ? formatTeacherName(currentTeacher)
      : 'Guru BK'
    : 'Developer / Superadmin';

  const handleConfirm = () => {
    if (isGuru) {
      logoutAdmin(true);
    } else {
      logoutDev(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-sm sm:max-w-md overflow-hidden my-6">
        {/* Top close icon */}
        <div className="pt-4 pr-4 flex justify-end">
          <button
            type="button"
            onClick={cancelLogout}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-1 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-sm">
            <LogOut className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-extrabold text-lg text-slate-900">
              Konfirmasi Keluar Sesi
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin keluar dari akun <strong className="text-slate-900">{roleName}</strong>?
            </p>
            <p className="text-[11px] text-slate-400">
              Sesi Anda akan ditutup dan Anda akan dialihkan ke tampilan beranda publik.
            </p>
          </div>

          <div className="pt-2 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={cancelLogout}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Ya, Keluar Akun
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
