/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // include mdx
    './components/**/*.{js,ts,jsx,tsx}',
    './content/**/*.{md,mdx}', // just in case
  ],
  theme: {
    fontFamily: {
      sans: ['"IBM Plex Sans"', 'sans-serif'],
      mono: ['"IBM Plex Mono"', 'monospace'],
    },
    extend: {
      colors: {
        gray: {
          900: '#161616',
          800: '#262626',
          700: '#393939',
          600: '#525252',
          500: '#6f6f6f',
          400: '#8d8d8d',
          300: '#a8a8a8',
          200: '#c6c6c6',
          100: '#e0e0e0',
          50: '#f4f4f4',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
