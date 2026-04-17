/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trustlock: {
          bg: '#FFFFFF',
          bgSecondary: '#F5F7FA',
          accent: '#4F8CFF',
          accentHover: '#3A70D6',
          accentSecondary: '#A78BFA',
          glow: '#22D3EE',
          textPrimary: '#111827',
          textSecondary: '#6B7280'
        }
      },
      boxShadow: {
        'soft-3d': '8px 8px 16px #e6e9ef, -8px -8px 16px #ffffff',
        'soft-3d-hover': '12px 12px 20px #e6e9ef, -12px -12px 20px #ffffff',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
