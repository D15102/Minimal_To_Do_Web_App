export default {
  darkMode: "class", // enables class-based dark mode
  plugins: [require("tailwindcss-animate")],
  theme: {
    extend: {
     colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
     },
      keyframes: {
         "bg-position": {
         "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
         }
     },
     animation: {
        "bg-position": "bg-position 4s ease-in-out infinite",
      },
     
    },
  },

};
