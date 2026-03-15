/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f59e0b',
        dark: {
          DEFAULT: '#0f0f0f',
          100: '#1a1a1a',
          200: '#242424',
          300: '#2e2e2e',
        }
      },
    },
  },
  plugins: [],
}
