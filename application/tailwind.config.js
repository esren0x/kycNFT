/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        secondary: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
        },
      },
      animation: {
        "text-scroll": "text-scroll 15s linear infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        "text-scroll": {
          "0%": { "--tw-text-scroll-offset": "0%" },
          "100%": { "--tw-text-scroll-offset": "-100%" },
        },
      },
      fontFamily: {
        sans: ["var(--font-innovator)", "sans-serif"], // Sets the default font
        innovator: ["var(--font-innovator)", "sans-serif"],
        abcd: ["var(--font-abcd)", "monospace"],
      },
    },
  },
  plugins: [],
};
