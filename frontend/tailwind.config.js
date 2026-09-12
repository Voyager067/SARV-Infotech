/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#05040d",
          900: "#0b0a17",
          800: "#12111f",
          700: "#1c1a2e",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 12s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 8s ease-in-out infinite 2s",
        blob: "blob 18s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(40px, -30px) scale(1.1)" },
          "66%": { transform: "translate(-30px, 20px) scale(0.95)" },
        },
      },
    },
  },
  plugins: [],
};
