'use client';

import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacherData: any) => void;
  editingTeacher?: Teacher | null;
}

export const TeacherFormModal: React.FC<TeacherFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTeacher,
}) => {
  const [nama, setNama] = useState('');
  const [gelar, setGelar] = useState('S.Pd');
  const [nip, setNip] = useState('');
  const [spesialisasi, setSpesialisasi] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [ruangan, setRuangan] = useState('Ruang Konseling BK');
  const [jadwalHari, setJadwalHari] = useState('Senin - Jumat (08.00 - 15.00 WITA)');
  const [pengalamanTahun, setPengalamanTahun] = useState(5);
  const [status, setStatus] = useState<Teacher['status']>('tersedia');
  const [pin, setPin] = useState('12345');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingTeacher) {
      setNama(editingTeacher.nama);
      setGelar(editingTeacher.gelar);
      setNip(editingTeacher.nip);
      setSpesialisasi(editingTeacher.spesialisasi);
      setBio(editingTeacher.bio);
      setAvatar(editingTeacher.avatar);
      setRuangan(editingTeacher.ruangan);
      setJadwalHari(editingTeacher.jadwalHari);
      setPengalamanTahun(editingTeacher.pengalamanTahun);
      setStatus(editingTeacher.status);
      setPin(editingTeacher.pin || '12345');
    } else {
      setNama('');
      setGelar('S.Pd');
      setNip('');
      setSpesialisasi('');
      setBio('');
      setAvatar('/avatars/preset-1.svg');
      setRuangan('Ruang Konseling BK');
      setJadwalHari('Senin - Jumat (08.00 - 15.00 WITA)');
      setPengalamanTahun(5);
      setStatus('tersedia');
      setPin('12345');
    }
    setErrorMsg('');
  }, [editingTeacher, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !spesialisasi.trim() || !nip.trim()) {
      setErrorMsg('Harap lengkapi Nama, NIP, dan Spesialisasi.');
      return;
    }

    onSave({
      nama: nama.trim(),
      gelar: gelar.trim(),
      nip: nip.trim(),
      spesialisasi: spesialisasi.trim(),
      bio: bio.trim(),
      avatar: avatar.trim() || '/avatars/preset-1.svg',
      ruangan: ruangan.trim(),
      jadwalHari: jadwalHari.trim(),
      pengalamanTahun: Number(pengalamanTahun) || 1,
      status,
      pin: pin.trim() || '12345',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-elevated border border-slate-200 w-full max-w-xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 bg-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-base text-white">
              {editingTeacher ? 'Edit Profil Guru BK' : 'Tambah Guru BK Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap (tanpa gelar) *
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={e => setNama(e.target.value)}
                placeholder="Contoh: Nur Resky Amalia"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gelar *
              </label>
              <input
                type="text"
                required
                value={gelar}
                onChange={e => setGelar(e.target.value)}
                placeholder="Contoh: S.Sos., Gr"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIP Guru *
              </label>
              <input
                type="text"
                required
                value={nip}
                onChange={e => setNip(e.target.value)}
                placeholder="19930514 202221 2 018"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PIN Akses Guru
              </label>
              <input
                type="text"
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="Masukkan 5 digit PIN"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bidang Spesialisasi Konseling *
            </label>
            <input
              type="text"
              required
              value={spesialisasi}
              onChange={e => setSpesialisasi(e.target.value)}
              placeholder="Contoh: Konseling Pribadi & Sosial / Bimbingan Karir & Prakerin"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ruangan Konseling
              </label>
              <input
                type="text"
                value={ruangan}
                onChange={e => setRuangan(e.target.value)}
                placeholder="Ruang Konseling Utama Lt. 1"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Jadwal Hari Piket
              </label>
              <input
                type="text"
                value={jadwalHari}
                onChange={e => setJadwalHari(e.target.value)}
                placeholder="Senin - Jumat (07.30 - 15.30 WITA)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pengalaman (Tahun)
              </label>
              <input
                type="number"
                min="0"
                value={pengalamanTahun}
                onChange={e => setPengalamanTahun(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status Kehadiran Awal
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="tersedia">Tersedia</option>
                <option value="konseling">Sedang Konseling</option>
                <option value="sibuk">Sibuk</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              URL Foto Avatar
            </label>
            <input
              type="url"
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bio & Filosofi Pendampingan Siswa
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tuliskan komitmen atau pendekatan konseling yang digunakan..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil Guru</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
