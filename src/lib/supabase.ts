import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Teacher, Report, Appointment, SchoolSettings } from '../types';

export interface SupabaseConfig {
  url?: string;
  anonKey?: string;
}

export type CloudSyncStatus = 'checking' | 'connected' | 'tables_missing' | 'offline';

export const getSupabaseConfig = (): SupabaseConfig => {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
};

export const isCloudSyncEnabled = (): boolean => {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isCloudSyncEnabled()) return null;
  if (!supabaseInstance) {
    const { url, anonKey } = getSupabaseConfig();
    supabaseInstance = createClient(url!, anonKey!, {
      auth: {
        persistSession: false,
      },
    });
  }
  return supabaseInstance;
};

// ============================================================================
// MAPPERS (snake_case DB <-> camelCase App)
// ============================================================================

const teacherToDb = (t: Teacher, includeJabatan = true) => {
  const base: Record<string, any> = {
    id: t.id,
    nama: t.nama,
    gelar: t.gelar || '',
    nip: t.nip,
    spesialisasi: t.spesialisasi,
    bio: t.bio,
    status: t.status,
    avatar: t.avatar,
    ruangan: t.ruangan,
    jadwal_hari: t.jadwalHari,
    pengalaman_tahun: t.pengalamanTahun,
    total_konseling: t.totalKonseling,
    pin: t.pin || '12345',
  };
  if (includeJabatan && t.jabatan !== undefined) {
    base.jabatan = t.jabatan;
  }
  return base;
};

const dbToTeacher = (row: any): Teacher => ({
  id: row.id,
  nama: row.nama,
  gelar: row.gelar || '',
  jabatan: row.jabatan || undefined,
  nip: row.nip,
  spesialisasi: row.spesialisasi,
  bio: row.bio || '',
  status: row.status,
  avatar: row.avatar || '',
  ruangan: row.ruangan || 'Ruang Konseling BK',
  jadwalHari: row.jadwal_hari || 'Senin - Jumat (07.30 - 15.30 WITA)',
  pengalamanTahun: Number(row.pengalaman_tahun) || 1,
  totalKonseling: Number(row.total_konseling) || 0,
  pin: row.pin || '12345',
});

const reportToDb = (r: Report) => ({
  id: r.id,
  tracking_code: r.trackingCode,
  kategori: r.kategori,
  deskripsi: r.deskripsi,
  is_anonymous: r.isAnonymous,
  nama_siswa: r.isAnonymous ? null : r.namaSiswa || null,
  kelas: r.isAnonymous ? null : r.kelas || null,
  bukti_url: r.buktiUrl || null,
  status: r.status,
  guru_id: r.guruId || null,
  nama_guru: r.namaGuru || null,
  catatan_guru: r.catatanGuru || null,
  created_at: r.createdAt,
  tanggapan_at: r.tanggapanAt || null,
});

const dbToReport = (row: any): Report => ({
  id: row.id,
  trackingCode: row.tracking_code,
  kategori: row.kategori,
  deskripsi: row.deskripsi,
  isAnonymous: Boolean(row.is_anonymous),
  namaSiswa: row.nama_siswa || undefined,
  kelas: row.kelas || undefined,
  buktiUrl: row.bukti_url || undefined,
  status: row.status,
  guruId: row.guru_id || undefined,
  namaGuru: row.nama_guru || undefined,
  catatanGuru: row.catatan_guru || undefined,
  createdAt: row.created_at,
  tanggapanAt: row.tanggapan_at || undefined,
});

const appointmentToDb = (a: Appointment) => ({
  id: a.id,
  nama_siswa: a.namaSiswa,
  kelas: a.kelas,
  topik: a.topik,
  tanggal: a.tanggal,
  waktu: a.waktu,
  nomor_wa: a.nomorWa,
  guru_id: a.guruId,
  nama_guru: a.namaGuru,
  status: a.status,
  catatan: a.catatan || null,
  created_at: a.createdAt,
});

const dbToAppointment = (row: any): Appointment => ({
  id: row.id,
  namaSiswa: row.nama_siswa,
  kelas: row.kelas,
  topik: row.topik,
  tanggal: row.tanggal,
  waktu: row.waktu,
  nomorWa: row.nomor_wa,
  guruId: row.guru_id,
  namaGuru: row.nama_guru,
  status: row.status,
  catatan: row.catatan || undefined,
  createdAt: row.created_at,
});

const settingsToDb = (s: SchoolSettings) => ({
  id: 'default',
  nama_sekolah: s.namaSekolah,
  sub_nama: s.subNama,
  guru_pengembang: s.guruPengembang,
  program_resmi: s.programResmi,
  hotline_bk: s.hotlineBk,
  email_sekolah: s.emailSekolah,
  alamat_sekolah: s.alamatSekolah,
  pesan_sambutan: s.pesanSambutan,
  updated_at: new Date().toISOString(),
});

const dbToSettings = (row: any): SchoolSettings => ({
  namaSekolah: row.nama_sekolah,
  subNama: row.sub_nama,
  guruPengembang: row.guru_pengembang,
  programResmi: row.program_resmi,
  hotlineBk: row.hotline_bk,
  emailSekolah: row.email_sekolah,
  alamatSekolah: row.alamat_sekolah,
  pesanSambutan: row.pesan_sambutan,
});

// ============================================================================
// CLOUD SYNC OPERATIONS
// ============================================================================

const isTableMissingError = (error: any): boolean => {
  if (!error) return false;
  const code = String(error.code || '');
  const msg = String(error.message || '').toLowerCase();
  return (
    code === '42P01' ||
    code === 'PGRST205' ||
    msg.includes('does not exist') ||
    msg.includes('could not find the table') ||
    msg.includes('schema cache')
  );
};

export interface CloudFetchResult {
  status: CloudSyncStatus;
  teachers?: Teacher[];
  reports?: Report[];
  appointments?: Appointment[];
  schoolSettings?: SchoolSettings;
  errorMessage?: string;
}

export const fetchCloudData = async (): Promise<CloudFetchResult> => {
  const client = getSupabaseClient();
  if (!client) {
    return { status: 'offline', errorMessage: 'Kredensial Supabase belum dikonfigurasi.' };
  }

  try {
    const [teachersRes, reportsRes, appointmentsRes, settingsRes] = await Promise.all([
      client.from('bk_teachers').select('*').order('id', { ascending: true }),
      client.from('bk_reports').select('*').order('created_at', { ascending: false }),
      client.from('bk_appointments').select('*').order('created_at', { ascending: false }),
      client.from('bk_school_settings').select('*').eq('id', 'default').maybeSingle(),
    ]);

    const firstError =
      teachersRes.error || reportsRes.error || appointmentsRes.error || settingsRes.error;

    if (firstError) {
      if (isTableMissingError(firstError)) {
        return {
          status: 'tables_missing',
          errorMessage: 'Koneksi ke Supabase berhasil, namun tabel SIM-BK belum dibuat. Jalankan supabase/schema.sql di SQL Editor Supabase.',
        };
      }
      return {
        status: 'offline',
        errorMessage: firstError.message || 'Gagal terhubung ke Supabase.',
      };
    }

    return {
      status: 'connected',
      teachers: (teachersRes.data || []).map(dbToTeacher),
      reports: (reportsRes.data || []).map(dbToReport),
      appointments: (appointmentsRes.data || []).map(dbToAppointment),
      schoolSettings: settingsRes.data ? dbToSettings(settingsRes.data) : undefined,
    };
  } catch (err: any) {
    return {
      status: 'offline',
      errorMessage: err?.message || 'Tidak dapat menjangkau server Supabase.',
    };
  }
};

export const upsertCloudReport = async (report: Report): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { error } = await client.from('bk_reports').upsert(reportToDb(report));
    if (error) {
      console.warn('[Supabase] upsert report failed:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const upsertCloudTeacher = async (teacher: Teacher): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { error } = await client.from('bk_teachers').upsert(teacherToDb(teacher, true));
    if (error) {
      if (String(error.message || '').toLowerCase().includes('jabatan')) {
        const retry = await client.from('bk_teachers').upsert(teacherToDb(teacher, false));
        if (!retry.error) return true;
      }
      console.warn('[Supabase] upsert teacher failed:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const deleteCloudTeacher = async (teacherId: string): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { error } = await client.from('bk_teachers').delete().eq('id', teacherId);
    if (error) {
      console.warn('[Supabase] delete teacher failed:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const upsertCloudAppointment = async (appointment: Appointment): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { error } = await client.from('bk_appointments').upsert(appointmentToDb(appointment));
    if (error) {
      console.warn('[Supabase] upsert appointment failed:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const upsertCloudSchoolSettings = async (settings: SchoolSettings): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const { error } = await client.from('bk_school_settings').upsert(settingsToDb(settings));
    if (error) {
      console.warn('[Supabase] upsert school settings failed:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const pushAllLocalToCloud = async (payload: {
  teachers: Teacher[];
  reports: Report[];
  appointments: Appointment[];
  schoolSettings: SchoolSettings;
}): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  try {
    const upsertTeachersSafe = async () => {
      if (payload.teachers.length === 0) return;
      const res = await client.from('bk_teachers').upsert(payload.teachers.map(t => teacherToDb(t, true)));
      if (res.error && String(res.error.message || '').toLowerCase().includes('jabatan')) {
        await client.from('bk_teachers').upsert(payload.teachers.map(t => teacherToDb(t, false)));
      }
    };

    await Promise.all([
      upsertTeachersSafe(),
      payload.reports.length > 0
        ? client.from('bk_reports').upsert(payload.reports.map(reportToDb))
        : Promise.resolve(),
      payload.appointments.length > 0
        ? client.from('bk_appointments').upsert(payload.appointments.map(appointmentToDb))
        : Promise.resolve(),
      client.from('bk_school_settings').upsert(settingsToDb(payload.schoolSettings)),
    ]);
    return true;
  } catch {
    return false;
  }
};
