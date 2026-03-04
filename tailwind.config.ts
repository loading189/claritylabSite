import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f7ff',
          100: '#e6efff',
          500: '#2457d6',
          600: '#1d46ad',
          700: '#163784',
          900: '#0a162f',
        },
      },
      boxShadow: {
        soft: '0 8px 24px -12px rgba(10, 22, 47, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
