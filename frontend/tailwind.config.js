/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'blue8f3': "#1a78f3",
        'greyf1':'#f1f1f1',
        'Truewhite':'#ffffff',
        "primaryColor": "#9a6de1",
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
