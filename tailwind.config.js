/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "Vercel-like" dark theme colors
        background: "#09090b",
        surface: "#18181b",
        border: "#27272a",
        primary: "#6366f1", // Indigo-500
        text: "#e4e4e7",
        muted: "#a1a1aa",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
