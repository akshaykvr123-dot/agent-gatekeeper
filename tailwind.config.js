/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gate: {
          bg: '#0A0E17',
          card: '#111827',
          cardHover: '#161F33',
          border: '#1F293D',
          muted: '#4B5565',
          text: '#F3F4F6',
          textMuted: '#9CA3AF',
          allow: '#10B981',
          allowBg: 'rgba(16, 185, 129, 0.12)',
          allowBorder: 'rgba(16, 185, 129, 0.3)',
          ask: '#F59E0B',
          askBg: 'rgba(245, 158, 11, 0.12)',
          askBorder: 'rgba(245, 158, 11, 0.3)',
          block: '#EF4444',
          blockBg: 'rgba(239, 68, 68, 0.12)',
          blockBorder: 'rgba(239, 68, 68, 0.3)',
          primary: '#3B82F6',
          primaryHover: '#2563EB',
          accent: '#6366F1'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
