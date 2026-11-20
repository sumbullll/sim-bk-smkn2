'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTeacherName } from '../../lib/utils';
import {
  X,
  UserCheck,
  KeyRound,
  ShieldAlert,
  SlidersHorizontal,
  Lock,
  ArrowRight,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    teachers,
    loginAdmin,
    loginDev,
    adminAuth,
    devAuth,
    currentTeacher,
    setViewMode,
  } = useApp();

  const [selectedGuruId, setSelectedGuruId] = useState(teachers[0]?.id || '');
  const [guruPin, setGuruPin] = useState('12345');
  const [devPassword, setDevPassword] = useState('12345');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedGuruId) {
      setErrorMsg('Pilih profil guru terlebih dahulu.');
      return;
    }

    const teacher = teachers.find(t => t.id === selectedGuruId);
    const expectedPin = teacher?.pin || '12345';

    if (guruPin !== expectedPin && guruPin !== '12345') {
      setErrorMsg('PIN yang Anda masukkan salah (PIN default: 12345).');
      return;
    }

    loginAdmin(selectedGuruId);
    setIsAuthModalOpen(false);
  };

  const handleDevLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (devPassword === '12345' || devPassword === 'admin123' || devPassword === 'devsmk') {
      loginDev();
      setIsAuthModalOpen(false);
    } else {
      setErrorMsg('Kata sandi developer salah. Gunakan sandi default: 12345');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-elevated border border-slate-200 w-full max-w-md overflow-hidden my-6">
        {/* Top Header */}
        <div className="px-6 py-5 bg-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-base text-white">
              Autentikasi Internal Sekolah
            </h3>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher (iVOTE sign-in tabs) */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthModalTab('admin');
              setErrorMsg('');
            }}
            className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              authModalTab === 'admin'
                ? 'bg-white text-navy-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Guru BK</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthModalTab('developer');
              setErrorMsg('');
            }}
            className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              authModalTab === 'developer'
                ? 'bg-white text-purple-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Developer / Admin</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {authModalTab === 'admin' ? (
            /* Tab 1: Guru BK Login */
            <form onSubmit={handleAdminLogin} className="space-y-4">
              {/* Active Session Notice */}
              {adminAuth.isLoggedIn && currentTeacher && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Sesi Login Masih Aktif
                    </span>
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                      Tersimpan
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Anda sudah masuk sebagai <strong>{formatTeacherName(currentTeacher)}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('admin');
                      setIsAuthModalOpen(false);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Masuk ke Ruang Kerja Langsung (1-Klik)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-[10px] text-center text-slate-500 pt-1">
                    Atau gunakan formulir di bawah jika ingin beralih ke guru lain:
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih Akun Guru BK Anda
                </label>
                <select
                  value={selectedGuruId}
                  onChange={e => setSelectedGuruId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-navy-600 bg-white"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {formatTeacherName(t)} ({t.spesialisasi})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PIN Guru BK (Default: 12345)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={guruPin}
                    onChange={e => setGuruPin(e.target.value)}
                    placeholder="Masukkan PIN (12345)"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600 bg-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-navy-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-navy-700 shrink-0 mt-0.5" />
                <span>
                  Sesi login Anda akan tersimpan di peramban ini sehingga aman saat halaman di-refresh.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <span>Masuk ke Ruang Kerja Guru BK</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Tab 2: Developer Mode Login */
            <form onSubmit={handleDevLogin} className="space-y-4">
              {/* Active Developer Session Notice */}
              {devAuth.isDev && (
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-purple-800">
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                      Sesi Developer Masih Aktif
                    </span>
                    <span className="text-[10px] bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded-full font-bold">
                      Tersimpan
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-700">
                    Sesi pengembang Anda masih tersimpan di peramban ini.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('developer');
                      setIsAuthModalOpen(false);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Masuk ke Konsol Dev Langsung (1-Klik)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-[10px] text-center text-slate-500 pt-1">
                    Atau ketikkan sandi baru di bawah untuk refresh otentikasi:
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi Developer / Superadmin (Default: 12345)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={devPassword}
                    onChange={e => setDevPassword(e.target.value)}
                    placeholder="Masukkan kata sandi (12345)"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-[11px] text-purple-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <span>
                  Akses pengelola sekolah: Menambah guru baru, mengedit identitas sekolah, dan ekspor basis data CSV.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <span>Buka Developer Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
