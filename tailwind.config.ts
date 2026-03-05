import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
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
        bg: 'hsl(var(--bg) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        surfaceRaised: 'hsl(var(--surface-raised) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        text: 'hsl(var(--text) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        accent: 'hsl(var(--accent) / <alpha-value>)',
        accent2: 'hsl(var(--accent-2) / <alpha-value>)',
        success: 'hsl(var(--success) / <alpha-value>)',
        warn: 'hsl(var(--warn) / <alpha-value>)',
        danger: 'hsl(var(--danger) / <alpha-value>)',
      },
      borderRadius: {
        card: '1rem',
        button: '0.75rem',
        input: '0.75rem',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        raised: 'var(--shadow-raised)',
        pressed: 'var(--shadow-pressed)',
      },
      backgroundImage: {
        'gradient-subtle': 'var(--gradient-subtle)',
      },
      spacing: {
        sectionPaddingY: 'var(--section-padding-y)',
        sectionGap: 'var(--section-gap)',
        cardPad: 'var(--card-padding)',
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
