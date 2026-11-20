/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#dde6f2',
          200: '#c0d2e8',
          300: '#94b5db',
          400: '#6292cb',
          500: '#3e74ba',
          600: '#2b5ca5',
          700: '#234986',
          800: '#1e3a8a', // Deep Navy Slate from PRD
          900: '#1a335f',
          950: '#0f1f3b',
        },
        terracotta: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c', // Warm Terracotta Orange from PRD
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        display: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'card': '0 10px 25px -5px rgba(30, 58, 138, 0.08), 0 8px 10px -6px rgba(30, 58, 138, 0.04)',
        'elevated': '0 20px 35px -10px rgba(30, 58, 138, 0.12), 0 10px 10px -5px rgba(30, 58, 138, 0.04)',
        'glow-terracotta': '0 8px 25px -5px rgba(234, 88, 12, 0.35)',
        'glow-navy': '0 8px 25px -5px rgba(30, 58, 138, 0.35)',
      },
    },
  },
  plugins: [],
};
