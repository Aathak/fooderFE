import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage : {
        "login" : "url('/image/bg.jpeg')"
      },
      backgroundColor : {
        "black" : "rgba(0, 0, 0, 1)"
      }
    },
  },
  plugins: [],
} satisfies Config;

//untuk pengaturan tampilan seperti font, warna, dkk