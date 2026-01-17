import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./src/components/ui/**/*.{ts,tsx}",
    "./src/components/exam/**/*.{ts,tsx}",
    "./src/components/editor/**/*.{ts,tsx}",
    "./src/components/arena/**/*.{ts,tsx}",
    "./src/components/assistant/**/*.{ts,tsx}",
    "./src/components/auth/**/*.{ts,tsx}",
    "./src/components/certificate/**/*.{ts,tsx}",
    "./src/components/dashboard/**/*.{ts,tsx}",
    "./src/components/layout/**/*.{ts,tsx}",
    "./src/components/leaderboard/**/*.{ts,tsx}",
    "./src/components/lives/**/*.{ts,tsx}",
    "./src/components/problems/**/*.{ts,tsx}",
    "./src/components/NavLink.tsx",
    "./src/features/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
    "./src/App.tsx",
    "./src/main.tsx"
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
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
        space: ["Space Grotesk", 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        "background-light": "#f7f6f8",
        "background-dark": "#05050A",
        "cyber-cyan": "#06B6D4",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: "#22c55e",
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        zen: {
          bg: "var(--zen-bg)",
          card: "var(--zen-card)",
          purple: "var(--zen-purple)",
          cyan: "var(--zen-cyan)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(173 80% 45% / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(173 80% 45% / 0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, hsl(173 80% 45%) 0%, hsl(199 95% 55%) 100%)",
        "gradient-accent": "linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(330 80% 60%) 100%)",
        "gradient-dark": "linear-gradient(180deg, hsl(222 47% 9%) 0%, hsl(222 47% 6%) 100%)",
        "gradient-radial": "radial-gradient(ellipse at center, hsl(173 80% 45% / 0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        glow: "0 0 40px hsl(173 80% 45% / 0.2)",
        "glow-lg": "0 0 60px hsl(173 80% 45% / 0.3)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
