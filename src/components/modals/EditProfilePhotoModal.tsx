'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Teacher, TeacherStatus } from '../../types';
import { TeacherAvatar } from '../TeacherAvatar';
import { formatTeacherName, compressImageFile } from '../../lib/utils';
import {
  X,
  Camera,
  Upload,
  Link2,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';

interface EditProfilePhotoModalProps {
  teacher: Teacher | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacherId: string, updates: Partial<Teacher>) => void;
}

const PRESET_AVATARS = [
  { id: 'p1', label: 'Konselor 1', url: '/avatars/preset-1.svg' },
  { id: 'p2', label: 'Konselor 2', url: '/avatars/preset-2.svg' },
  { id: 'p3', label: 'Konselor 3', url: '/avatars/preset-3.svg' },
  { id: 'p4', label: 'Konselor 4', url: '/avatars/preset-4.svg' },
  { id: 'p5', label: 'Konselor 5', url: '/avatars/preset-5.svg' },
  { id: 'p6', label: 'Prof. Iksan', url: '/avatars/prof-iksan.jpg' },
];

export const EditProfilePhotoModal: React.FC<EditProfilePhotoModalProps> = ({
  teacher,
  isOpen,
  onClose,
  onSave,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [nip, setNip] = useState('');
  const [status, setStatus] = useState<TeacherStatus>('tersedia');
  const [spesialisasi, setSpesialisasi] = useState('');
  const [bio, setBio] = useState('');
  const [ruangan, setRuangan] = useState('');
  const [jadwalHari, setJadwalHari] = useState('');
  const [pengalamanTahun, setPengalamanTahun] = useState<number>(1);
  const [avatar, setAvatar] = useState('');
  const [pin, setPin] = useState('12345');

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [photoSuccessMsg, setPhotoSuccessMsg] = useState('');

  useEffect(() => {
    if (teacher && isOpen) {
      setFullName(formatTeacherName(teacher));
      setJabatan(teacher.jabatan || 'Guru Bimbingan & Konseling');
      setNip(teacher.nip || '');
      setStatus(teacher.status || 'tersedia');
      setSpesialisasi(teacher.spesialisasi || '');
      setBio(teacher.bio || '');
      setRuangan(teacher.ruangan || '');
      setJadwalHari(teacher.jadwalHari || '');
      setPengalamanTahun(teacher.pengalamanTahun || 1);
      setAvatar(teacher.avatar || '');
      setPin(teacher.pin || '12345');
      setShowUrlInput(false);
      setErrorMsg('');
      setPhotoSuccessMsg('');
    }
  }, [teacher, isOpen]);

  if (!isOpen || !teacher) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setPhotoSuccessMsg('');

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Harap pilih file gambar berformat JPG, PNG, atau WEBP.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Ukuran file terlalu besar (maksimal 10 MB).');
      return;
    }

    setIsProcessingPhoto(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 360, 0.85);
      setAvatar(compressedDataUrl);
      setShowUrlInput(false);
      setPhotoSuccessMsg('Foto berhasil diunggah & dioptimalkan!');
      setTimeout(() => setPhotoSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal memproses foto. Coba gambar lain.');
    } finally {
      setIsProcessingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Nama Lengkap & Gelar wajib diisi.');
      return;
    }
    if (!jabatan.trim()) {
      setErrorMsg('Jabatan / Peran di BK wajib diisi.');
      return;
    }

    onSave(teacher.id, {
      nama: fullName.trim(),
      gelar: '', // Disimpan menyatu di nama agar tidak dobel koma/gelar
      jabatan: jabatan.trim(),
      nip: nip.trim(),
      status,
      spesialisasi: spesialisasi.trim(),
      bio: bio.trim(),
      ruangan: ruangan.trim(),
      jadwalHari: jadwalHari.trim(),
      pengalamanTahun: Number(pengalamanTahun) || 0,
      avatar: avatar.trim(),
      pin: pin.trim() || '12345',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-elevated border border-slate-200 w-full max-w-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Modal Header (matched to reference UI) */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                Edit Profil & Ganti Foto
              </h3>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Ubah informasi atau foto untuk {formatTeacherName(teacher)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* FOTO PROFIL GURU BK Section */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                Foto Profil Guru BK
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* Circular Live Preview */}
                <div className="relative shrink-0">
                  <TeacherAvatar
                    src={avatar}
                    name={fullName || teacher.nama}
                    size="lg"
                    className="border-4 border-white shadow-md ring-1 ring-slate-200"
                  />
                  {isProcessingPhoto && (
                    <div className="absolute inset-0 rounded-full bg-slate-900/50 flex items-center justify-center text-[10px] font-bold text-white">
                      Proses...
                    </div>
                  )}
                </div>

                {/* Upload & Presets Controls */}
                <div className="flex-1 w-full space-y-3 text-center sm:text-left">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessingPhoto}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Foto Sendiri</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowUrlInput(prev => !prev)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition cursor-pointer"
                    >
                      <Link2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Pakai Link URL</span>
                    </button>

                    {avatar && (
                      <button
                        type="button"
                        onClick={() => setAvatar('')}
                        title="Hapus foto dan gunakan inisial"
                        className="p-2.5 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {photoSuccessMsg && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{photoSuccessMsg}</span>
                    </div>
                  )}

                  {showUrlInput && (
                    <div className="pt-1">
                      <input
                        type="url"
                        value={avatar.startsWith('data:') ? '' : avatar}
                        onChange={e => setAvatar(e.target.value)}
                        placeholder="Tempel tautan foto (https://...)"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Dukung format JPG, PNG, atau WEBP. Foto otomatis dioptimalkan agar ringan dan
                    jernih serta tersimpan otomatis ke Cloud Supabase.
                  </p>

                  {/* Preset Example Avatars */}
                  <div className="pt-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Atau Pilih Ilustrasi Contoh:
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2.5">
                      {PRESET_AVATARS.map(preset => {
                        const isSelected = avatar === preset.url;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              setAvatar(preset.url);
                              setShowUrlInput(false);
                            }}
                            title={preset.label}
                            className={`w-10 h-10 rounded-full overflow-hidden border-2 transition cursor-pointer hover:scale-110 ${
                              isSelected
                                ? 'border-indigo-600 ring-2 ring-indigo-300 scale-105'
                                : 'border-white shadow-sm'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 1: Nama Lengkap & Jabatan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Contoh: Nur Resky Amalia, S.Sos., Gr"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                  Jabatan / Peran di BK <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={jabatan}
                  onChange={e => setJabatan(e.target.value)}
                  placeholder="Contoh: Guru BK Utama / Developer SIM-BK"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Row 2: NIP & Status Ketersediaan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                  NIP (Nomor Induk Pegawai)
                </label>
                <input
                  type="text"
                  value={nip}
                  onChange={e => setNip(e.target.value)}
                  placeholder="Contoh: 19930514 202221 2 018"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                  Status Ketersediaan
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as TeacherStatus)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-800 font-semibold"
                >
                  <option value="tersedia">🟢 Tersedia untuk Konseling</option>
                  <option value="konseling">🟡 Sedang Sesi Konseling</option>
                  <option value="sibuk">🔴 Sedang Sibuk / Rapat</option>
                </select>
              </div>
            </div>

            {/* Row 3: Bidang Spesialisasi */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                Bidang Spesialisasi & Keahlian
              </label>
              <input
                type="text"
                value={spesialisasi}
                onChange={e => setSpesialisasi(e.target.value)}
                placeholder="Contoh: Konseling Siswa SMK & Bimbingan Belajar"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-800"
              />
            </div>

            {/* Row 4: Bio & Prinsip */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                Bio & Prinsip Bimbingan Konseling (Ditampilkan ke Siswa)
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Siap mendampingi dan mendengarkan siswa dengan ramah dan menjaga kerahasiaan."
                className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-800 leading-relaxed"
              />
            </div>

            {/* Row 5: Ruangan, Jadwal, Tahun Pengalaman */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                  Lokasi Ruangan BK
                </label>
                <input
                  type="text"
                  value={ruangan}
                  onChange={e => setRuangan(e.target.value)}
                  placeholder="Contoh: Ruang Konseling Lt. 1"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                  Jadwal Hari & Jam
                </label>
                <input
                  type="text"
                  value={jadwalHari}
                  onChange={e => setJadwalHari(e.target.value)}
                  placeholder="Senin - Jumat (07.30 - 15.30)"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                  Tahun Pengalaman
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={pengalamanTahun}
                  onChange={e => setPengalamanTahun(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-slate-800 font-semibold"
                />
              </div>
            </div>

            {/* Row 6: Optional PIN Update */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-slate-500 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-700">PIN Login Ruang Kerja Anda</div>
                  <div className="text-[11px] text-slate-500">
                    Ubah PIN pribadi jika diperlukan (default: 12345)
                  </div>
                </div>
              </div>
              <input
                type="text"
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="12345"
                className="w-full sm:w-32 px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 text-center"
              />
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3 sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
