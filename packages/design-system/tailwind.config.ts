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
    },
  },
  plugins: [],
};

export default config;
