export type ReportCategory =
  | 'Bullying'
  | 'Akademik'
  | 'Karir/Prakerin'
  | 'Pribadi'
  | 'Pelecehan'
  | 'Lainnya';

export type ReportStatus = 'masuk' | 'proses' | 'selesai';

export interface Report {
  id: string;
  trackingCode: string;
  kategori: ReportCategory;
  deskripsi: string;
  isAnonymous: boolean;
  namaSiswa?: string;
  kelas?: string;
  buktiUrl?: string;
  status: ReportStatus;
  guruId?: string;
  namaGuru?: string;
  catatanGuru?: string;
  createdAt: string;
  tanggapanAt?: string;
}

export type TeacherStatus = 'tersedia' | 'konseling' | 'sibuk';

export interface Teacher {
  id: string;
  nama: string;
  gelar: string;
  jabatan?: string;
  nip: string;
  spesialisasi: string;
  bio: string;
  status: TeacherStatus;
  avatar: string;
  ruangan: string;
  jadwalHari: string;
  pengalamanTahun: number;
  totalKonseling: number;
  pin?: string;
}

export type AppointmentStatus = 'menunggu' | 'dikonfirmasi' | 'selesai' | 'dibatalkan';

export interface Appointment {
  id: string;
  namaSiswa: string;
  kelas: string;
  topik: string;
  tanggal: string;
  waktu: string;
  nomorWa: string;
  guruId: string;
  namaGuru: string;
  status: AppointmentStatus;
  createdAt: string;
  catatan?: string;
}

export interface SchoolSettings {
  namaSekolah: string;
  subNama: string;
  guruPengembang: string;
  programResmi: string;
  hotlineBk: string;
  emailSekolah: string;
  alamatSekolah: string;
  pesanSambutan: string;
}

export interface AdminAuth {
  isLoggedIn: boolean;
  guruId?: string;
}

export interface DevAuth {
  isDev: boolean;
}

export type ViewMode = 'public' | 'admin' | 'developer';
