import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // NSF Healthcare Professional Palette
        // Primary: Petrol/Deep Teal - Trust, healthcare, Norwegian design
        petrol: {
          50: "#f0f7f7",
          100: "#daeaeb",
          200: "#b8d8da",
          300: "#8bbfc3",
          400: "#5a9fa6",
          500: "#3d838b",
          600: "#336b73",
          700: "#2b565d",
          800: "#264649",
          900: "#1f3a3d",
        },
        // Secondary: Sage - Growth, preparedness, calm
        sage: {
          50: "#f4f7f4",
          100: "#e4ebe4",
          200: "#c9d8c9",
          300: "#a3bda3",
          400: "#7a9e7a",
          500: "#5c825c",
          600: "#486848",
          700: "#3b533b",
          800: "#324432",
          900: "#2a382a",
        },
        // Tertiary: Slate Blue - Sophistication, data
        indigo: {
          50: "#f5f6fa",
          100: "#eaecf4",
          200: "#d5d9e9",
          300: "#b3bad6",
          400: "#8b94bf",
          500: "#6b74a8",
          600: "#565e8d",
          700: "#474d72",
          800: "#3d425f",
          900: "#353950",
        },
        // Accent: Warm Sand - Highlights, positive changes
        sand: {
          50: "#fdfaf5",
          100: "#faf3e6",
          200: "#f4e4c8",
          300: "#ecd19f",
          400: "#e2b86e",
          500: "#d9a04a",
          600: "#c4863a",
          700: "#a36831",
          800: "#84532d",
          900: "#6c4528",
        },
        // Semantic: Success/Active
        success: {
          50: "#f2f8f4",
          100: "#e0efe4",
          200: "#c3dfcc",
          300: "#98c8a6",
          400: "#6aab7a",
          500: "#478f5a",
          600: "#357346",
          700: "#2c5c3a",
          800: "#264a31",
          900: "#203d29",
        },
        // Keep teal for compatibility and maps
        teal: {
          50: "#f0f7f7",
          100: "#daeaeb",
          200: "#b8d8da",
          300: "#8bbfc3",
          400: "#5a9fa6",
          500: "#3d838b",
          600: "#336b73",
        },
        // Slate - neutral grays
        slate: {
          50: "#F8F9FA",
          100: "#f1f3f5",
          150: "#e9ecef",
          200: "#dee2e6",
          300: "#ced4da",
          400: "#adb5bd",
          500: "#6c757d",
          600: "#495057",
          700: "#343a40",
          800: "#212529",
          900: "#1a1d20",
        },
        // Sidebar - Deep professional navy
        sidebar: {
          DEFAULT: "#1e2a38",
          hover: "#2a3a4d",
        },
        // Legacy color aliases for existing components
        mint: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        coral: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
        },
        lavender: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
        },
      },
      fontFamily: {
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Dashboard-optimized type scale
        "2xs": ["0.625rem", { lineHeight: "0.875rem", letterSpacing: "0.02em" }],
        xs: ["0.75rem", { lineHeight: "1.125rem", letterSpacing: "0.01em" }],
        sm: ["0.8125rem", { lineHeight: "1.25rem" }],
        base: ["0.9375rem", { lineHeight: "1.5rem" }],
        lg: ["1.0625rem", { lineHeight: "1.625rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.01em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.015em" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em" }],
      },
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },
      boxShadow: {
        // Refined shadow system
        "soft-xs": "0 1px 2px 0 rgba(30, 42, 56, 0.03)",
        soft: "0 1px 3px 0 rgba(30, 42, 56, 0.06), 0 1px 2px -1px rgba(30, 42, 56, 0.04)",
        "soft-md": "0 4px 8px -2px rgba(30, 42, 56, 0.06), 0 2px 4px -2px rgba(30, 42, 56, 0.04)",
        card: "0 1px 3px 0 rgba(30, 42, 56, 0.04), 0 1px 2px -1px rgba(30, 42, 56, 0.02), 0 0 0 1px rgba(30, 42, 56, 0.02)",
        "card-hover": "0 8px 16px -4px rgba(30, 42, 56, 0.08), 0 4px 8px -2px rgba(30, 42, 56, 0.04)",
        elevated: "0 12px 24px -6px rgba(30, 42, 56, 0.1), 0 6px 12px -4px rgba(30, 42, 56, 0.05)",
        "elevated-lg": "0 20px 40px -10px rgba(30, 42, 56, 0.12), 0 10px 20px -8px rgba(30, 42, 56, 0.06)",
        inner: "inset 0 2px 4px 0 rgba(30, 42, 56, 0.04)",
        "glow-petrol": "0 0 24px -6px rgba(61, 131, 139, 0.3)",
        "glow-success": "0 0 24px -6px rgba(71, 143, 90, 0.3)",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.35s ease-out forwards",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slideDown 0.3s ease-out forwards",
        "scale-in": "scaleIn 0.25s ease-out forwards",
        "pulse-subtle": "pulseSubtle 2.5s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.88" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
