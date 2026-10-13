/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme: milky pearl / warm white
        light: {
          bg: '#FAF9F7',
          surface: '#FFFFFF',
          border: '#E8E6E3',
          text: '#1A1A1A',
          'text-secondary': '#4A4A4A',
          accent: '#6366F1'
        },
        // Dark theme: deep charcoal
        dark: {
          bg: '#121212',
          surface: '#1E1E1E',
          border: '#2A2A2A',
          text: '#F5F5F5',
          'text-secondary': '#B0B0B0',
          accent: '#818CF8'
        }
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          'monospace'
        ]
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem'
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem'
      }
    }
  },
  plugins: []
};
