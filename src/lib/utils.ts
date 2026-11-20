import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate tracking code format BK-XXXXX (alphanumeric uppercase)
 */
export function generateTrackingCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BK-${result}`;
}

/**
 * Format ISO date string into Indonesian readable format
 */
export function formatDateIndo(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Makassar', // WITA for Parepare, South Sulawesi
    }).format(d) + ' WITA';
  } catch {
    return dateStr;
  }
}

/**
 * Format date only (YYYY-MM-DD to Indonesian)
 */
export function formatDateOnly(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Standardize Indonesian WhatsApp number into 628xxx
 */
export function formatWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (!cleaned.startsWith('62') && cleaned.length > 5) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
}

/**
 * Generate direct WhatsApp URL with pre-filled message
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  const formattedPhone = formatWhatsAppNumber(phone);
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Export array of objects to CSV file and trigger browser download
 */
export function exportToCSV(filename: string, rows: Record<string, any>[], headers?: { key: string; label: string }[]) {
  if (!rows || !rows.length) {
    alert('Tidak ada data untuk diekspor.');
    return;
  }

  const columnKeys = headers ? headers.map(h => h.key) : Object.keys(rows[0]);
  const columnLabels = headers ? headers.map(h => h.label) : columnKeys;

  const csvRows: string[] = [];
  // Add header
  csvRows.push(columnLabels.map(l => `"${(l || '').replace(/"/g, '""')}"`).join(','));

  // Add rows
  for (const row of rows) {
    const values = columnKeys.map(key => {
      let val = row[key];
      if (val === undefined || val === null) val = '';
      if (typeof val === 'boolean') val = val ? 'Ya' : 'Tidak';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format teacher full name + title cleanly without trailing commas
 */
export function formatTeacherName(teacher: { nama: string; gelar?: string }): string {
  const nama = (teacher.nama || '').trim();
  const gelar = (teacher.gelar || '').trim();
  if (!gelar) return nama;
  return `${nama}, ${gelar}`;
}

/**
 * Compress and crop uploaded image file into a crisp square JPEG Base64 data URL
 * so photos stay lightweight for LocalStorage & Supabase Cloud Sync.
 */
export function compressImageFile(file: File, maxSize = 360, quality = 0.84): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format gambar tidak didukung.'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;

        const targetSize = Math.min(maxSize, size);
        canvas.width = targetSize;
        canvas.height = targetSize;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context tidak tersedia.'));
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetSize, targetSize);
        ctx.drawImage(img, sx, sy, size, size, 0, 0, targetSize, targetSize);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
