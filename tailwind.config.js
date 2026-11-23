/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#1B365D',
          900: '#142B4A', // Primary Navy Blue
          950: '#0B1728',
        },
        royal: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB', // Secondary Royal Blue
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -1px rgba(20, 43, 74, 0.06), 0 1px 4px -1px rgba(20, 43, 74, 0.04)',
        'card-hover': '0 10px 25px -3px rgba(20, 43, 74, 0.1), 0 4px 6px -2px rgba(20, 43, 74, 0.05)',
        'glass': '0 8px 32px 0 rgba(20, 43, 74, 0.08)',
      },
    },
  },
  plugins: [],
}
