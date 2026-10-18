import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rose: {
          50: "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
        },
        sage: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
        },
        lavender: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
        },
        amber: {
          50: "#FFFCF0",
          100: "#FEF9E7",
          200: "#FDE68A",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        coral: {
          50: "#FFF5F2",
          100: "#FFE8E0",
          200: "#FDC6B3",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
        },
        warm: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          500: "#78716C",
          700: "#44403C",
          900: "#1C1917",
        },
        "esc-slate": {
          50: "#F1F5F9",
          100: "#E2E8F0",
          200: "#CBD5E1",
          600: "#475569",
          800: "#1E293B",
        },
        "esc-sage": {
          50: "#F0FDF4",
          100: "#DCFCE7",
          500: "#22C55E",
        },
        "esc-terracotta": {
          50: "#FEF2F0",
          100: "#FEE2DE",
          500: "#E07A5F",
        },
        "esc-amber": {
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#F59E0B",
        },
        "esc-indigo": {
          50: "#EEF2FF",
          100: "#E0E7FF",
          500: "#6366F1",
        },
        "esc-berry": {
          50: "#FDF2F8",
          100: "#FCE7F3",
          500: "#EC4899",
        },
        "esc-crisis": {
          50: "#FFF1F2",
          100: "#FFE4E6",
          600: "#E11D48",
          icon: "#BE123C",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
      },
      boxShadow: {
        "card": "0 1px 2px rgba(0,0,0,0.04)",
        "elevated": "0 4px 6px rgba(0,0,0,0.06)",
        "modal": "0 10px 15px rgba(0,0,0,0.08)",
      },
      spacing: {
        "18": "4.5rem",
      },
      keyframes: {
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "slide-down": "slide-down 300ms ease-out",
        "scale-in": "scale-in 400ms ease-out",
        "fade-in": "fade-in 200ms ease-out",
        shimmer: "shimmer 1.5s infinite linear",
      },
    },
  },
  plugins: [],
};

export default config;
