import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EDF5FB',
          100: '#D5E8F5',
          200: '#B0D4ED',
          300: '#7BB8DF',
          400: '#4A9AD0',
          500: '#2A7FBA',
          600: '#0F4C81',
          700: '#0A3A63',
          800: '#0D3259',
          900: '#0A2747',
          950: '#061A30',
        },
        accent: {
          50:  '#E6FAFB',
          100: '#C0F2F5',
          200: '#80E5EB',
          300: '#33D4DD',
          400: '#0ABFCC',
          500: '#00A8B5',
          600: '#008A94',
          700: '#006D75',
        },
        surface: {
          50:  '#FAFBFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
        },
        success: {
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        error: {
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      boxShadow: {
        'card': '0 1px 2px rgba(15,76,129,0.04)',
        'card-hover': '0 8px 24px rgba(15,76,129,0.08)',
        'dropdown': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
        'sm-brand': '0 1px 2px rgba(15,76,129,0.04)',
        'md-brand': '0 4px 12px rgba(15,76,129,0.06)',
        'lg-brand': '0 8px 24px rgba(15,76,129,0.08)',
        'xl-brand': '0 16px 48px rgba(15,76,129,0.12)',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
export default config
