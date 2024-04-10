/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{js,css}",
    "./views/**/*.ejs",
    "./node_modules/tw-elements/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#EC920C',
        'secondary': '#8C98B5',
        'light': '#FFFFFF',
        'dark': '#0E1630',
      },
    }
  },
  darkMode: "class",
  plugins: [require("tw-elements/plugin.cjs")],
};