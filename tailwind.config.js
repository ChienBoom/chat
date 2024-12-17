/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Đường dẫn tới các file Angular
  ],
  theme: {
    extend: {}, // Tùy chỉnh thêm nếu cần
  },
  plugins: [require("@tailwindcss/typography")],
};
