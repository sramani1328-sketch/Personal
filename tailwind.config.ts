import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  safelist: [
    "md:col-span-1",
    "md:col-span-2",
    "md:col-span-3",
    "md:col-span-4",
    "md:col-span-5",
    "md:col-span-6",
    "md:col-span-7",
    "md:col-span-8",
    "md:col-span-9",
    "md:col-span-10",
    "md:col-span-11",
    "md:col-span-12",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1B2A4A",
        slate: "#2E4A7A",
        gold: "#C9A84C",
        "gold-hi": "#E3C46B",
        bg: "#F8F9FB",
        dark: "#0D1B2A",
        ink: "#1A1A2E",
        muted: "#5A6B82",
        border: "#E2E8F0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(27,42,74,0.06)",
        cardHover: "0 10px 30px rgba(27,42,74,0.12)",
      },
      animation: {
        "fade-up": "fadeUp 500ms cubic-bezier(0.22,1,0.36,1) both",
        "float-slow": "float 12s ease-in-out infinite",
        "blink": "blink 1.1s steps(1) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        blink: {
          "0%,49%": { opacity: "1" },
          "50%,100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
