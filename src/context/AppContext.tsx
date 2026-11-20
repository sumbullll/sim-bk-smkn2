'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Teacher,
  Report,
  Appointment,
  SchoolSettings,
  AdminAuth,
  DevAuth,
  ViewMode,
  ReportStatus,
  TeacherStatus,
  AppointmentStatus,
} from '../types';
import {
  DEFAULT_TEACHERS,
  DEFAULT_REPORTS,
  DEFAULT_APPOINTMENTS,
  DEFAULT_SCHOOL_SETTINGS,
} from '../data/defaultData';
import { generateTrackingCode } from '../lib/utils';
import {
  CloudSyncStatus,
  fetchCloudData,
  upsertCloudReport,
  upsertCloudTeacher,
  deleteCloudTeacher,
  upsertCloudAppointment,
  upsertCloudSchoolSettings,
  pushAllLocalToCloud,
  isCloudSyncEnabled,
} from '../lib/supabase';

interface AppContextType {
  // Data State
  teachers: Teacher[];
  reports: Report[];
  appointments: Appointment[];
  schoolSettings: SchoolSettings;
  adminAuth: AdminAuth;
  devAuth: DevAuth;
  viewMode: ViewMode;
  currentTeacher?: Teacher;

  // Cloud Sync State
  cloudStatus: CloudSyncStatus;
  cloudMessage: string;
  lastSyncedAt: string | null;
  syncWithCloud: () => Promise<void>;
  pushLocalToCloud: () => Promise<boolean>;

  // Mutators
  addReport: (payload: {
    kategori: Report['kategori'];
    deskripsi: string;
    isAnonymous: boolean;
    namaSiswa?: string;
    kelas?: string;
    buktiUrl?: string;
  }) => Report;
  updateReportStatus: (
    reportId: string,
    status: ReportStatus,
    catatanGuru?: string,
    guruId?: string,
    namaGuru?: string
  ) => void;
  addAppointment: (payload: {
    namaSiswa: string;
    kelas: string;
    topik: string;
    tanggal: string;
    waktu: string;
    nomorWa: string;
    guruId: string;
    namaGuru: string;
  }) => Appointment;
  updateAppointmentStatus: (
    appointmentId: string,
    status: AppointmentStatus,
    catatan?: string
  ) => void;
  updateTeacherStatus: (teacherId: string, status: TeacherStatus) => void;
  addTeacher: (teacher: Omit<Teacher, 'id' | 'totalKonseling'>) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  updateSchoolSettings: (settings: Partial<SchoolSettings>) => void;
  resetToDefaultData: () => void;

  // Auth & View
  loginAdmin: (guruId: string) => void;
  logoutAdmin: (force?: boolean) => void;
  loginDev: () => void;
  logoutDev: (force?: boolean) => void;
  cancelLogout: () => void;
  logoutModal: {
    isOpen: boolean;
    target: 'admin' | 'developer' | null;
  };
  setViewMode: (mode: ViewMode) => void;

  // Modal Control
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  isETicketModalOpen: boolean;
  setIsETicketModalOpen: (open: boolean) => void;
  activeETicket?: Report;
  setActiveETicket: (report?: Report) => void;
  isTrackingModalOpen: boolean;
  setIsTrackingModalOpen: (open: boolean) => void;
  trackingCodeToSearch: string;
  setTrackingCodeToSearch: (code: string) => void;
  openTrackingWithCode: (code: string) => void;
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (open: boolean) => void;
  selectedTeacherForAppointment?: Teacher;
  setSelectedTeacherForAppointment: (teacher?: Teacher) => void;
  isTeacherDetailModalOpen: boolean;
  setIsTeacherDetailModalOpen: (open: boolean) => void;
  selectedTeacherForDetail?: Teacher;
  setSelectedTeacherForDetail: (teacher?: Teacher) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'admin' | 'developer';
  setAuthModalTab: (tab: 'admin' | 'developer') => void;
  openAuthModal: (tab?: 'admin' | 'developer') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LS_REPORTS = 'bk_reports';
const LS_TEACHERS = 'bk_teachers';
const LS_APPOINTMENTS = 'bk_appointments';
const LS_SETTINGS = 'bk_school_settings';
const LS_ADMIN_AUTH = 'bk_admin_auth';
const LS_DEV_AUTH = 'bk_dev_auth';
const LS_VIEW_MODE = 'bk_view_mode';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Primary state with default seeds
  const [teachers, setTeachers] = useState<Teacher[]>(DEFAULT_TEACHERS);
  const [reports, setReports] = useState<Report[]>(DEFAULT_REPORTS);
  const [appointments, setAppointments] = useState<Appointment[]>(DEFAULT_APPOINTMENTS);
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(DEFAULT_SCHOOL_SETTINGS);
  const [adminAuth, setAdminAuth] = useState<AdminAuth>({ isLoggedIn: false });
  const [devAuth, setDevAuth] = useState<DevAuth>({ isDev: false });
  const [viewMode, setViewModeState] = useState<ViewMode>('public');
  const [isInitialized, setIsInitialized] = useState(false);

  // Cloud Sync State
  const [cloudStatus, setCloudStatus] = useState<CloudSyncStatus>(
    isCloudSyncEnabled() ? 'checking' : 'offline'
  );
  const [cloudMessage, setCloudMessage] = useState<string>('Memeriksa koneksi Supabase...');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isETicketModalOpen, setIsETicketModalOpen] = useState(false);
  const [activeETicket, setActiveETicket] = useState<Report | undefined>(undefined);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [trackingCodeToSearch, setTrackingCodeToSearch] = useState('');
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedTeacherForAppointment, setSelectedTeacherForAppointment] = useState<Teacher | undefined>(undefined);
  const [isTeacherDetailModalOpen, setIsTeacherDetailModalOpen] = useState(false);
  const [selectedTeacherForDetail, setSelectedTeacherForDetail] = useState<Teacher | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'admin' | 'developer'>('admin');
  const [logoutModal, setLogoutModal] = useState<{
    isOpen: boolean;
    target: 'admin' | 'developer' | null;
  }>({
    isOpen: false,
    target: null,
  });

  // Sync with Supabase Cloud
  const syncWithCloud = useCallback(async () => {
    if (!isCloudSyncEnabled()) {
      setCloudStatus('offline');
      setCloudMessage('Mode Lokal (Offline-First)');
      return;
    }

    setCloudStatus('checking');
    const result = await fetchCloudData();

    if (result.status === 'connected') {
      const hasCloudTeachers = result.teachers && result.teachers.length > 0;
      const hasCloudReports = result.reports && result.reports.length > 0;
      const hasCloudAppointments = result.appointments && result.appointments.length > 0;

      if (!hasCloudTeachers && !hasCloudReports && !hasCloudAppointments && !result.schoolSettings) {
        // Cloud tables exist but are empty -> seed defaults automatically
        await pushAllLocalToCloud({
          teachers: DEFAULT_TEACHERS,
          reports: DEFAULT_REPORTS,
          appointments: DEFAULT_APPOINTMENTS,
          schoolSettings: DEFAULT_SCHOOL_SETTINGS,
        });
      } else {
        if (hasCloudTeachers) setTeachers(result.teachers!);
        if (result.reports) setReports(result.reports);
        if (result.appointments) setAppointments(result.appointments);
        if (result.schoolSettings) setSchoolSettings(result.schoolSettings);
      }

      setCloudStatus('connected');
      setCloudMessage('Terhubung ke Supabase PostgreSQL (Sinkronisasi 2-Arah Aktif)');
      setLastSyncedAt(new Date().toISOString());
    } else if (result.status === 'tables_missing') {
      setCloudStatus('tables_missing');
      setCloudMessage(
        result.errorMessage ||
          'Kredensial Supabase valid, namun tabel belum dibuat. Jalankan supabase/schema.sql di SQL Editor.'
      );
    } else {
      setCloudStatus('offline');
      setCloudMessage(result.errorMessage || 'Offline — Menggunakan penyimpanan lokal browser.');
    }
  }, []);

  // Push all local state to cloud manually
  const pushLocalToCloud = async (): Promise<boolean> => {
    const ok = await pushAllLocalToCloud({
      teachers,
      reports,
      appointments,
      schoolSettings,
    });
    if (ok) {
      setCloudStatus('connected');
      setLastSyncedAt(new Date().toISOString());
      setCloudMessage('Seluruh data lokal berhasil disinkronkan ke Supabase.');
    }
    return ok;
  };

  // Load from localStorage on client mount, then handshake with Supabase
  useEffect(() => {
    try {
      const storedTeachers = localStorage.getItem(LS_TEACHERS);
      if (storedTeachers) {
        setTeachers(JSON.parse(storedTeachers));
      } else {
        localStorage.setItem(LS_TEACHERS, JSON.stringify(DEFAULT_TEACHERS));
      }

      const storedReports = localStorage.getItem(LS_REPORTS);
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      } else {
        localStorage.setItem(LS_REPORTS, JSON.stringify(DEFAULT_REPORTS));
      }

      const storedAppointments = localStorage.getItem(LS_APPOINTMENTS);
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      } else {
        localStorage.setItem(LS_APPOINTMENTS, JSON.stringify(DEFAULT_APPOINTMENTS));
      }

      const storedSettings = localStorage.getItem(LS_SETTINGS);
      if (storedSettings) {
        setSchoolSettings(JSON.parse(storedSettings));
      } else {
        localStorage.setItem(LS_SETTINGS, JSON.stringify(DEFAULT_SCHOOL_SETTINGS));
      }

      const storedAdminAuth = localStorage.getItem(LS_ADMIN_AUTH);
      if (storedAdminAuth) {
        setAdminAuth(JSON.parse(storedAdminAuth));
      }

      const storedDevAuth = localStorage.getItem(LS_DEV_AUTH);
      if (storedDevAuth) {
        setDevAuth(JSON.parse(storedDevAuth));
      }

      const storedViewMode = localStorage.getItem(LS_VIEW_MODE) as ViewMode;
      if (storedViewMode) {
        setViewModeState(storedViewMode);
      }
    } catch (e) {
      console.warn('LocalStorage access warning:', e);
    } finally {
      setIsInitialized(true);
    }

    // Async two-way cloud handshake (non-blocking)
    syncWithCloud();
  }, [syncWithCloud]);

  // Sync teachers to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LS_TEACHERS, JSON.stringify(teachers));
    } catch (e) {
      console.error(e);
    }
  }, [teachers, isInitialized]);

  // Sync reports to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LS_REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.error(e);
    }
  }, [reports, isInitialized]);

  // Sync appointments to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LS_APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.error(e);
    }
  }, [appointments, isInitialized]);

  // Sync school settings to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LS_SETTINGS, JSON.stringify(schoolSettings));
    } catch (e) {
      console.error(e);
    }
  }, [schoolSettings, isInitialized]);

  // Sync admin auth to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LS_ADMIN_AUTH, JSON.stringify(adminAuth));
    } catch (e) {
      console.error(e);
    }
  }, [adminAuth, isInitialized]);

  // Sync dev auth to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LS_DEV_AUTH, JSON.stringify(devAuth));
    } catch (e) {
      console.error(e);
    }
  }, [devAuth, isInitialized]);

  // Sync viewMode to localStorage
  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    try {
      localStorage.setItem(LS_VIEW_MODE, mode);
    } catch (e) {
      console.error(e);
    }
  };

  const currentTeacher = teachers.find(t => t.id === adminAuth.guruId);

  // Add report (Local + Cloud)
  const addReport = (payload: {
    kategori: Report['kategori'];
    deskripsi: string;
    isAnonymous: boolean;
    namaSiswa?: string;
    kelas?: string;
    buktiUrl?: string;
  }): Report => {
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      trackingCode: generateTrackingCode(),
      kategori: payload.kategori,
      deskripsi: payload.deskripsi,
      isAnonymous: payload.isAnonymous,
      namaSiswa: payload.isAnonymous ? undefined : payload.namaSiswa,
      kelas: payload.isAnonymous ? undefined : payload.kelas,
      buktiUrl: payload.buktiUrl,
      status: 'masuk',
      createdAt: new Date().toISOString(),
    };

    setReports(prev => [newReport, ...prev]);

    if (cloudStatus === 'connected') {
      upsertCloudReport(newReport).then(ok => {
        if (ok) setLastSyncedAt(new Date().toISOString());
      });
    }

    return newReport;
  };

  // Update report status (Local + Cloud)
  const updateReportStatus = (
    reportId: string,
    status: ReportStatus,
    catatanGuru?: string,
    guruId?: string,
    namaGuru?: string
  ) => {
    let updatedItem: Report | null = null;
    setReports(prev =>
      prev.map(r => {
        if (r.id !== reportId) return r;
        updatedItem = {
          ...r,
          status,
          catatanGuru: catatanGuru !== undefined ? catatanGuru : r.catatanGuru,
          guruId: guruId !== undefined ? guruId : r.guruId,
          namaGuru: namaGuru !== undefined ? namaGuru : r.namaGuru,
          tanggapanAt: new Date().toISOString(),
        };
        return updatedItem;
      })
    );

    if (cloudStatus === 'connected' && updatedItem) {
      upsertCloudReport(updatedItem).then(ok => {
        if (ok) setLastSyncedAt(new Date().toISOString());
      });
    }
  };

  // Add appointment (Local + Cloud)
  const addAppointment = (payload: {
    namaSiswa: string;
    kelas: string;
    topik: string;
    tanggal: string;
    waktu: string;
    nomorWa: string;
    guruId: string;
    namaGuru: string;
  }): Appointment => {
    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      namaSiswa: payload.namaSiswa,
      kelas: payload.kelas,
      topik: payload.topik,
      tanggal: payload.tanggal,
      waktu: payload.waktu,
      nomorWa: payload.nomorWa,
      guruId: payload.guruId,
      namaGuru: payload.namaGuru,
      status: 'menunggu',
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [newApp, ...prev]);

    if (cloudStatus === 'connected') {
      upsertCloudAppointment(newApp).then(ok => {
        if (ok) setLastSyncedAt(new Date().toISOString());
      });
    }

    return newApp;
  };

  // Update appointment status (Local + Cloud)
  const updateAppointmentStatus = (
    appointmentId: string,
    status: AppointmentStatus,
    catatan?: string
  ) => {
    let updatedItem: Appointment | null = null;
    setAppointments(prev =>
      prev.map(a => {
        if (a.id !== appointmentId) return a;
        updatedItem = {
          ...a,
          status,
          catatan: catatan !== undefined ? catatan : a.catatan,
        };
        return updatedItem;
      })
    );

    if (cloudStatus === 'connected' && updatedItem) {
      upsertCloudAppointment(updatedItem).then(ok => {
        if (ok) setLastSyncedAt(new Date().toISOString());
      });
    }
  };

  // Update teacher status (Local + Cloud)
  const updateTeacherStatus = (teacherId: string, status: TeacherStatus) => {
    let updatedItem: Teacher | null = null;
    setTeachers(prev =>
      prev.map(t => {
        if (t.id !== teacherId) return t;
        updatedItem = { ...t, status };
        return updatedItem;
      })
    );

    if (cloudStatus === 'connected' && updatedItem) {
      upsertCloudTeacher(updatedItem).then(ok => {
        if (ok) setLastSyncedAt(new Date().toISOString());
      });
    }
  };

  // Teacher CRUD for Developer (Local + Cloud)
  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'totalKonseling'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `guru-${Date.now()}`,
      totalKonseling: 0,
    };
    setTeachers(prev => [...prev, newTeacher]);

    if (cloudStatus === 'connected') {
      upsertCloudTeacher(newTeacher).then(ok => {
        if (ok) setLastSyncedAt(new Date().toISOString());
      });
    }
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    let updatedItem: Teacher | null = null;
    setTeachers(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        updatedItem = { ...t, ...updates };
        return updatedItem;
      })
    );

    if (cloudStatus === 'connected' && updatedItem) {
      upsertCloudTeacher(updatedItem).then(ok => {
        if (ok) setLastSyncedAt(new Date().toISOString());
      });
    }
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));

    if (cloudStatus === 'connected') {
      deleteCloudTeacher(id).then(ok => {
        if (ok) setLastSyncedAt(new Date().toISOString());
      });
    }
  };

  // Update school settings (Local + Cloud)
  const updateSchoolSettings = (newSettings: Partial<SchoolSettings>) => {
    const merged: SchoolSettings = { ...schoolSettings, ...newSettings };
    setSchoolSettings(merged);

    if (cloudStatus === 'connected') {
      upsertCloudSchoolSettings(merged).then(ok => {
        if (ok) setLastSyncedAt(new Date().toISOString());
      });
    }
  };

  // Reset data to defaults
  const resetToDefaultData = () => {
    setTeachers(DEFAULT_TEACHERS);
    setReports(DEFAULT_REPORTS);
    setAppointments(DEFAULT_APPOINTMENTS);
    setSchoolSettings(DEFAULT_SCHOOL_SETTINGS);
    setAdminAuth({ isLoggedIn: false });
    setDevAuth({ isDev: false });
    setViewMode('public');
    localStorage.clear();
  };

  // Auth actions
  const loginAdmin = (guruId: string) => {
    setAdminAuth({ isLoggedIn: true, guruId });
    setViewMode('admin');
  };

  const logoutAdmin = (force = false) => {
    if (force !== true) {
      setLogoutModal({ isOpen: true, target: 'admin' });
      return;
    }
    setAdminAuth({ isLoggedIn: false });
    setViewMode('public');
    setLogoutModal({ isOpen: false, target: null });
  };

  const loginDev = () => {
    setDevAuth({ isDev: true });
    setViewMode('developer');
  };

  const logoutDev = (force = false) => {
    if (force !== true) {
      setLogoutModal({ isOpen: true, target: 'developer' });
      return;
    }
    setDevAuth({ isDev: false });
    setViewMode('public');
    setLogoutModal({ isOpen: false, target: null });
  };

  const cancelLogout = () => {
    setLogoutModal({ isOpen: false, target: null });
  };

  // Modal helpers
  const openTrackingWithCode = (code: string) => {
    setTrackingCodeToSearch(code);
    setIsTrackingModalOpen(true);
  };

  const openAuthModal = (tab: 'admin' | 'developer' = 'admin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        teachers,
        reports,
        appointments,
        schoolSettings,
        adminAuth,
        devAuth,
        viewMode,
        currentTeacher,
        cloudStatus,
        cloudMessage,
        lastSyncedAt,
        syncWithCloud,
        pushLocalToCloud,
        addReport,
        updateReportStatus,
        addAppointment,
        updateAppointmentStatus,
        updateTeacherStatus,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        updateSchoolSettings,
        resetToDefaultData,
        loginAdmin,
        logoutAdmin,
        loginDev,
        logoutDev,
        logoutModal,
        cancelLogout,
        setViewMode,
        isReportModalOpen,
        setIsReportModalOpen,
        isETicketModalOpen,
        setIsETicketModalOpen,
        activeETicket,
        setActiveETicket,
        isTrackingModalOpen,
        setIsTrackingModalOpen,
        trackingCodeToSearch,
        setTrackingCodeToSearch,
        openTrackingWithCode,
        isAppointmentModalOpen,
        setIsAppointmentModalOpen,
        selectedTeacherForAppointment,
        setSelectedTeacherForAppointment,
        isTeacherDetailModalOpen,
        setIsTeacherDetailModalOpen,
        selectedTeacherForDetail,
        setSelectedTeacherForDetail,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
