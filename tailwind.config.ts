import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1EAEDB",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#33C3F0",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#0FA0CE",
          foreground: "#FFFFFF",
        },
        background: "#FFFFFF",
        foreground: "#222222",
        muted: {
          DEFAULT: "#F6F6F7",
          foreground: "#555555",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#222222",
        },
        border: "#F1F1F1",
        input: "#F1F1F1",
        ring: "#1EAEDB",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
      },
      backgroundImage: {
        "chat-gradient": "linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)",
        "message-gradient": "linear-gradient(to right, #243949 0%, #517fa4 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;