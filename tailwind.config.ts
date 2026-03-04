import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
        display: ['var(--font-display)', 'var(--font-sans)', 'ui-sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace'],
      },
      colors: {

        brand: {
          50: '#eef2ff',
          100: '#dfe8ff',
          500: '#3156d3',
          600: '#2748b2',
          700: '#1f3b8e',
          800: '#172e6a',
          900: '#0f214b',
        },
        bg: '#f7f8fb',
        surface: '#ffffff',
        surfaceRaised: '#fdfdff',
        border: '#e4e7ec',
        text: '#101828',
        muted: '#475467',
        accent: '#3156d3',
      },
      borderRadius: {
        card: '1rem',
        button: '0.75rem',
        input: '0.75rem',
      },
      boxShadow: {
        subtle: '0 10px 35px -22px rgba(16, 24, 40, 0.35)',
      },
      spacing: {
        sectionPaddingY: '5rem',
      },
      maxWidth: {
        container: '76rem',
        prose: '70ch',
      },
      transitionDuration: {
        DEFAULT: '180ms',
      },
    },
  },
  plugins: [],
};

export default config;
