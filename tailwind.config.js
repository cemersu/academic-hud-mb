/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hud: {
          bg: "#0B0C10",          // Ana zemin
          card: "#12141C",        // Panel / Kart zeminleri
          cardHover: "#181B26",
          border: "#1F2333",      // Çerçeve çizgileri
          borderLight: "#2E344D",
          text: "#E6E8F0",        // Ana metin
          muted: "#6B7280",       // Pasif metinler
          primary: "#3B82F6",     // Vurgu mavisi
          green: "#10B981",       // Varsayılan / Girildi
          red: "#EF4444",         // Kaçırıldı / Due date geçmiş
          yellow: "#F59E0B",      // Yaklaşan görev
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}