/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0e0e10",
        surface: "#0e0e10",
        'surface-container-low': "#131316",
        'surface-container': "#19191c",
        'surface-container-high': "#1f1f22",
        'surface-container-highest': "#262529",
        'surface-bright': "#2c2c2f",
        primary: "#a9ffdf",
        'primary-container': "#00fdc6",
        'primary-dim': "#00eab7",
        'on-primary-fixed': "#004534",
        secondary: "#ff51fa",
        tertiary: "#ac89ff",
        'tertiary-container': "#7000ff",
        'outline-variant': "#48474a",
        'on-surface-variant': "#adaaad",
        'on-background': "#fffbfe",
      },
      fontFamily: {
        space: ['"Space Grotesk"', 'sans-serif'],
        newsreader: ['"Newsreader"', 'serif'],
        inter: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
