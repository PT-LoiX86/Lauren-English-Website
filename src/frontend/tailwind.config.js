/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: "#2d58a1", // Primary
          foreground: "#f4f3f4", // Off-white for text on primary background
        },
        background: "#ffffff", // Main app background

        // Secondary & Accent colors
        secondary: "#6682b5",
        brand: {
          light: "#c9d6e5",
          lighter: "#7fa6c9",
          default: "#3a65a7",
          dark: "#2a6ba5",
          darker: "#5272ad",
        },
      },
    },
  },
  plugins: [],
};
