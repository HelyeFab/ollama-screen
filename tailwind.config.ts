import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ['selector', '[data-theme="dark"], [data-theme="midnight"], .dark'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Elms Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'theme-bg-primary': 'rgb(var(--bg-primary) / <alpha-value>)',
        'theme-bg-secondary': 'rgb(var(--bg-secondary) / <alpha-value>)',
        'theme-bg-tertiary': 'rgb(var(--bg-tertiary) / <alpha-value>)',
        'theme-text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
        'theme-text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        'theme-text-tertiary': 'rgb(var(--text-tertiary) / <alpha-value>)',
        'theme-border': 'rgb(var(--border) / <alpha-value>)',
        'theme-accent': 'rgb(var(--accent) / <alpha-value>)',
        'theme-accent-hover': 'rgb(var(--accent-hover) / <alpha-value>)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
