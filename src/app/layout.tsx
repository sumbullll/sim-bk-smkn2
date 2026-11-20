import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppProvider } from '../context/AppContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SIM-BK UPT SMKN 2 Parepare | Safe Space & E-Tiket Konseling',
  description:
    'Sistem Informasi Bimbingan dan Konseling UPT SMKN 2 Parepare. Pengaduan anonim 100%, e-tiket digital real-time, dan manajemen konseling siswa terintegrasi.',
  keywords: [
    'SIM-BK',
    'SMKN 2 Parepare',
    'Bimbingan Konseling',
    'Pengaduan Anonim Siswa',
    'E-Tiket BK',
    'Karya Digital Guru 2026',
    'Dinas Pendidikan Sulsel',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 selection:bg-orange-100 selection:text-orange-900">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
