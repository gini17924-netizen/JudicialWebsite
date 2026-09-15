/** Build-time Tailwind config — mirrors the former runtime CDN config. */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#d89924",
          light: "#f2dc99",
          dark: "#9c5819",
        },
        dark: {
          DEFAULT: "#0b0d12",
          card: "#11141b",
          border: "#1e2330",
        },
      },
    },
  },
  corePlugins: {
    preflight: true,
  },
};
