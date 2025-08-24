const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', 
    "./node_modules/slick-carousel/slick/slick.css",
  ],
  safelist: [
    "slick-slider",
    "slick-track",
    "slick-slide",
    "slick-arrow",
    "slick-prev",
    "slick-next",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'divyanshu':'url("../src/Images/background/bottom_green.jpg")',
        'tanya':'url("../src/Images/background/silver_tree.jpg")'
      },
      colors: {
        gold: {
          400: '#D4AF37',
          500: '#C9A227',
          600: '#BD9B1D',
        },
      }
    },
  },
  plugins: [],
});
