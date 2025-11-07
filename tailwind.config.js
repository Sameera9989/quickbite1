/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ef4444',
        accent: '#22c55e'
      }
    }
  },
  darkMode: 'class',
  plugins: []
}
