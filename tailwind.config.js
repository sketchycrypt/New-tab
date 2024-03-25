/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily: {
      kode: ["Kode Mono", "monospace"]
    },
    colors: {
      'background': '#191919',
      'white': '#ffffff',
      'dark-bg': '#000000'
    },
    fontWeight: {
      medium: '500',
      semibold: '600',
       black: '900',
    },
    extend: {},
  },
  plugins: [],
  darkMode: 'selector',
}