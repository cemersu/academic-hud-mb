// Takvim sabitleri
export const START_HOUR = 8;  // Takvim 08:00'de başlar
export const END_HOUR = 19;   // Takvim 19:00'da biter
export const HOUR_HEIGHT = 60; // 1 saat = 60px dikey alan (1 dakika = 1px)

/**
 * "08:40" formatındaki saati, günün başlangıcından itibaren dakikaya çevirir.
 */
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Başlangıç saatine göre bloğun dikey piksel ofsetini (top) hesaplar.
 */
export function calculateTopOffset(startTime: string): number {
  const startMinutes = timeToMinutes(startTime);
  const calendarStartMinutes = START_HOUR * 60;
  const diffMinutes = Math.max(0, startMinutes - calendarStartMinutes);
  
  // 1 dakika = (HOUR_HEIGHT / 60) piksel
  return (diffMinutes / 60) * HOUR_HEIGHT;
}

/**
 * İki saat arasındaki süreyi hesaplayarak piksel yüksekliğini (height) döndürür.
 */
export function calculateBlockHeight(startTime: string, endTime: string): number {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const durationMinutes = Math.max(15, endMinutes - startMinutes);
  
  return (durationMinutes / 60) * HOUR_HEIGHT;
}

/**
 * Bir ders seansının kaç akademik saate denk geldiğini yaklaşık hesaplar.
 * Örn: 50-60 dk = 1 saat, 90-110 dk = 2 saat.
 */
export const calculateAcademicHours = (startTime: string, endTime: string): number => {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const startTotalMinutes = startH * 60 + startM;
  const endTotalMinutes = endH * 60 + endM;

  const diffInMinutes = endTotalMinutes - startTotalMinutes;

  // Hatalı girilmiş ters saatleri sıfırla
  if (diffInMinutes <= 0) return 0;

  // Toplam dakikayı 60'a böl ve en yakın saate yuvarla (örn: 120 dk = 2 saat)
  return Math.round(diffInMinutes / 60);
};

/**
 * ISO hafta anahtarı üretir (örn: "2026-W39")
 */
export function getCurrentWeekKey(): string {
  const now = new Date();
  const date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}