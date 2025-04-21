/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ✅ Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: "#1a1a1a",
        secondary: "#2f2f2f",
        accent: "#9e9e9e",     // Replaces red
        light: "#f4f4f9",
        dark: "#0a0a0a",
      },
    },
  },
  plugins: [],
};

