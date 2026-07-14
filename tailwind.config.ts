import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
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
        surface: {
          hot: { DEFAULT: "hsl(var(--surface-hot))", foreground: "hsl(var(--surface-hot-foreground))" },
          cool: { DEFAULT: "hsl(var(--surface-cool))", foreground: "hsl(var(--surface-cool-foreground))" },
          cash: { DEFAULT: "hsl(var(--surface-cash))", foreground: "hsl(var(--surface-cash-foreground))" },
          gold: { DEFAULT: "hsl(var(--surface-gold))", foreground: "hsl(var(--surface-gold-foreground))" },
          blue: { DEFAULT: "hsl(var(--surface-blue))", foreground: "hsl(var(--surface-blue-foreground))" },
          lilac: { DEFAULT: "hsl(var(--surface-lilac))", foreground: "hsl(var(--surface-lilac-foreground))" },
          coral: { DEFAULT: "hsl(var(--surface-coral))", foreground: "hsl(var(--surface-coral-foreground))" },
        },
        cheeti: {
          gold: "hsl(var(--cheeti-gold))",
          "gold-light": "hsl(var(--cheeti-gold-light))",
          "gold-dark": "hsl(var(--cheeti-gold-dark))",
          blue: "hsl(var(--digital-blue))",
          graphite: "hsl(var(--deep-graphite))",
        },
      },
      backgroundImage: {
        "gradient-speed": "var(--speed-gradient)",
        "gradient-hero": "var(--hero-gradient)",
        "gradient-warmth": "var(--gradient-warmth)",
        "gradient-cool": "var(--gradient-cool)",
        "gradient-fresh": "var(--gradient-fresh)",
      },
      boxShadow: {
        glow: "var(--shadow-glow)",
        elegant: "var(--shadow-elegant)",
        pot: "var(--shadow-pot)",
        float: "var(--shadow-float)",
      },
      borderRadius: {
        "4xl": "2rem",
        "3xl": "1.5rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0", opacity: "0" }, to: { height: "var(--radix-accordion-content-height)", opacity: "1" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)", opacity: "1" }, to: { height: "0", opacity: "0" } },
        "fade-in": { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "fade-in-up": { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { from: { transform: "scale(0.95)", opacity: "0" }, to: { transform: "scale(1)", opacity: "1" } },
        "slide-in-right": { from: { transform: "translateX(100%)" }, to: { transform: "translateX(0)" } },
        "slide-up": { from: { transform: "translateY(100%)" }, to: { transform: "translateY(0)" } },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--cheeti-gold) / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--cheeti-gold) / 0.6)" },
        },
        "bounce-subtle": { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-5px)" } },
        "spring-in": {
          "0%": { opacity: "0", transform: "scale(0.9) translateY(20px)" },
          "60%": { transform: "scale(1.02) translateY(-2px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s ease-out",
        "accordion-up": "accordion-up 0.3s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "slide-up": "slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 1s ease-in-out infinite",
        "spring-in": "spring-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
