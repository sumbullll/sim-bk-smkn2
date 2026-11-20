-- ============================================================================
-- SKEMA DATABASE CLOUD SUPABASE (PostgreSQL)
-- Sistem Informasi Bimbingan dan Konseling (SIM-BK) UPT SMKN 2 Parepare
-- Program 10.000 Karya Digital Guru 2026 - Dinas Pendidikan Prov. Sulsel
-- ============================================================================
-- Petunjuk: Salin seluruh isi file ini ke menu "SQL Editor" pada Dashboard
-- Supabase Anda lalu klik tombol "Run".
-- ============================================================================

-- 1. Tabel Master Guru BK
CREATE TABLE IF NOT EXISTS public.bk_teachers (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  gelar TEXT NOT NULL DEFAULT '',
  jabatan TEXT DEFAULT 'Guru Bimbingan & Konseling',
  nip TEXT NOT NULL,
  spesialisasi TEXT NOT NULL,
  bio TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'tersedia' CHECK (status IN ('tersedia', 'konseling', 'sibuk')),
  avatar TEXT DEFAULT '',
  ruangan TEXT DEFAULT 'Ruang Konseling BK',
  jadwal_hari TEXT DEFAULT 'Senin - Jumat (07.30 - 15.30 WITA)',
  pengalaman_tahun INTEGER NOT NULL DEFAULT 1,
  total_konseling INTEGER NOT NULL DEFAULT 0,
  pin TEXT DEFAULT '12345',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bk_teachers ADD COLUMN IF NOT EXISTS jabatan TEXT DEFAULT 'Guru Bimbingan & Konseling';

-- 2. Tabel Laporan Pengaduan Siswa (Anonim & Terbuka)
CREATE TABLE IF NOT EXISTS public.bk_reports (
  id TEXT PRIMARY KEY,
  tracking_code TEXT NOT NULL UNIQUE,
  kategori TEXT NOT NULL CHECK (kategori IN ('Bullying', 'Akademik', 'Karir/Prakerin', 'Pribadi', 'Pelecehan', 'Lainnya')),
  deskripsi TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
  nama_siswa TEXT,
  kelas TEXT,
  bukti_url TEXT,
  status TEXT NOT NULL DEFAULT 'masuk' CHECK (status IN ('masuk', 'proses', 'selesai')),
  guru_id TEXT,
  nama_guru TEXT,
  catatan_guru TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  tanggapan_at TIMESTAMPTZ
);

-- 3. Tabel Pengajuan Jadwal Konseling Tatap Muka
CREATE TABLE IF NOT EXISTS public.bk_appointments (
  id TEXT PRIMARY KEY,
  nama_siswa TEXT NOT NULL,
  kelas TEXT NOT NULL,
  topik TEXT NOT NULL,
  tanggal TEXT NOT NULL,
  waktu TEXT NOT NULL,
  nomor_wa TEXT NOT NULL,
  guru_id TEXT NOT NULL,
  nama_guru TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'dikonfirmasi', 'selesai', 'dibatalkan')),
  catatan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabel Pengaturan Profil Sekolah (Single Row id = 'default')
CREATE TABLE IF NOT EXISTS public.bk_school_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  nama_sekolah TEXT NOT NULL,
  sub_nama TEXT NOT NULL,
  guru_pengembang TEXT NOT NULL,
  program_resmi TEXT NOT NULL,
  hotline_bk TEXT NOT NULL,
  email_sekolah TEXT NOT NULL,
  alamat_sekolah TEXT NOT NULL,
  pesan_sambutan TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- KEAMANAN ROW LEVEL SECURITY (RLS) UNTUK AKSES PORTAL BEBAS AKUN (FRICTIONLESS)
-- ============================================================================
ALTER TABLE public.bk_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bk_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bk_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bk_school_settings ENABLE ROW LEVEL SECURITY;

-- Policy tabel bk_teachers
DROP POLICY IF EXISTS "Allow public all bk_teachers" ON public.bk_teachers;
CREATE POLICY "Allow public all bk_teachers" ON public.bk_teachers
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Policy tabel bk_reports
DROP POLICY IF EXISTS "Allow public all bk_reports" ON public.bk_reports;
CREATE POLICY "Allow public all bk_reports" ON public.bk_reports
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Policy tabel bk_appointments
DROP POLICY IF EXISTS "Allow public all bk_appointments" ON public.bk_appointments;
CREATE POLICY "Allow public all bk_appointments" ON public.bk_appointments
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Policy tabel bk_school_settings
DROP POLICY IF EXISTS "Allow public all bk_school_settings" ON public.bk_school_settings;
CREATE POLICY "Allow public all bk_school_settings" ON public.bk_school_settings
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ============================================================================
-- DATA AWAL (SEED DEFAULT UPT SMKN 2 PAREPARE)
-- ============================================================================
INSERT INTO public.bk_school_settings (
  id, nama_sekolah, sub_nama, guru_pengembang, program_resmi,
  hotline_bk, email_sekolah, alamat_sekolah, pesan_sambutan
) VALUES (
  'default',
  'UPT SMKN 2 Parepare',
  'Sistem Informasi Bimbingan dan Konseling (SIM-BK)',
  'Nur Resky Amalia, S.Sos., Gr (Bimbingan dan Konseling)',
  'Dinas Pendidikan Provinsi Sulawesi Selatan - Program 10.000 Karya Digital Guru 2026',
  '+62 812-4211-8900',
  'bk@smkn2parepare.sch.id',
  'Jl. Jenderal Ahmad Yani Km. 4, Kota Parepare, Sulawesi Selatan 91122',
  'Selamat datang di Ruang Aman & Layanan Pendampingan Siswa UPT SMKN 2 Parepare. Kami hadir mendengarkan, melindungi kerahasiaan Anda, dan membimbing masa depan vokasi dengan tulus.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.bk_teachers (
  id, nama, gelar, jabatan, nip, spesialisasi, bio, status, avatar, ruangan, jadwal_hari, pengalaman_tahun, total_konseling, pin
) VALUES
  (
    'guru-1',
    'Nur Resky Amalia',
    'S.Sos., Gr',
    'Guru BK Utama & Inisiator SIM-BK',
    '19930514 202221 2 018',
    'Konseling Pribadi, Sosial & Penanganan Krisis',
    'Konselor pengembang SIM-BK yang berdedikasi membangun ruang aman ramah siswa tanpa intimidasi serta mendampingi kesehatan mental remaja vokasi.',
    'tersedia',
    '/avatars/preset-1.svg',
    'Ruang Konseling Utama Lt. 1 (Sayap Barat)',
    'Senin - Jumat (07.30 - 15.30 WITA)',
    8,
    184,
    '12345'
  ),
  (
    'guru-2',
    'Drs. H. Syamsuddin',
    'M.Pd',
    'Koordinator Bimbingan Karir & PKL',
    '19681012 199403 1 004',
    'Bimbingan Karir & Prakerin (PKL Industri)',
    'Pakar pendampingan karir kejuruan, kesiapan magang industri manufaktur/TIK, dan penelusuran minat studi lanjut ke perguruan tinggi vokasi.',
    'sibuk',
    '/avatars/preset-2.svg',
    'Ruang Bimbingan Karir Vokasi (Lt. 2)',
    'Senin - Kamis (08.00 - 14.30 WITA)',
    22,
    320,
    '12345'
  ),
  (
    'guru-3',
    'Fatimah Az-Zahra',
    'S.Pd., M.Si',
    'Konselor Belajar & Akademik',
    '19880220 201504 2 003',
    'Konseling Belajar & Adaptasi Akademik Siswa',
    'Membantu siswa menemukan metode belajar produktif, mengatasi demotivasi kejuruan, serta memfasilitasi bimbingan sebaya ramah inklusi.',
    'tersedia',
    '/avatars/preset-3.svg',
    'Ruang Konseling 2 (Gedung Pembelajaran Terpadu)',
    'Selasa - Jumat (08.00 - 15.00 WITA)',
    11,
    165,
    '12345'
  ),
  (
    'guru-4',
    'Andi Muhammad Akbar',
    'S.Pd',
    'Fasilitator Anti-Bullying & Mediasi',
    '19951108 202421 1 009',
    'Anti-Perundungan & Mediasi Konflik Sebaya',
    'Fasilitator program Sekolah Ramah Anak dan Roots Anti-Bullying, siap menjadi teman bicara suportif untuk solusi damai di lingkungan sekolah.',
    'sibuk',
    '/avatars/preset-4.svg',
    'Ruang Konseling 3 (Pusat Mediasi Siswa)',
    'Senin, Rabu, Jumat (08.00 - 15.00 WITA)',
    5,
    98,
    '12345'
  ),
  (
    'guru-5',
    'Prof. Dr. Drs. H. Iksan, S.H., S.E., M.Si., M.H., M.Pd., Ph.D. (Cand.)',
    '',
    'Konsul Magang & Skripsi',
    '231 011 008',
    'Konseling Siswa SMK & Bimbingan Belajar',
    'Siap mendampingi dan mendengarkan siswa dengan ramah dan menjaga kerahasiaan.',
    'sibuk',
    '/avatars/prof-iksan.jpg',
    'Ruang Dekan 1',
    'Senin - Jumat (07.30 - 15.30 WITA)',
    30,
    245,
    '12345'
  )
ON CONFLICT (id) DO NOTHING;

-- Catatan: Tabel bk_reports dan bk_appointments dibiarkan bersih (0 data percobaan)
-- agar siap digunakan langsung secara resmi oleh civitas SMKN 2 Parepare.
