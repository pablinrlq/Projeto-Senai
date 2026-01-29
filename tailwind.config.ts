import type { Config } from "tailwindcss";

export default {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Gibson",
          "var(--font-primary)",
          "var(--font-secondary)",
          "Calibri",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
      boxShadow: {
        "senai-sm": "var(--shadow-senai-sm)",
        "senai-md": "var(--shadow-senai-md)",
        "senai-lg": "var(--shadow-senai-lg)",
      },
    },
  },
} satisfies Config;
