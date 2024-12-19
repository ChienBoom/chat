const path = require("path");

module.exports = {
  mode: "production", // Hoặc 'development' nếu cần
  entry: {
    main: "./src/main.ts", // Entry chính cho ứng dụng Angular
  },
  output: {
    filename: "[name].js", // Tên file đầu ra: main.js, styles.js
    path: path.resolve(__dirname, "dist"), // Thư mục đầu ra
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Áp dụng cho các file .css
        use: [
          "style-loader", // Inject CSS vào file JS
          "css-loader", // Xử lý CSS
        ],
      },
      {
        test: /\.scss$/, // Áp dụng cho các file .scss
        use: [
          "style-loader", // Inject CSS vào file JS
          "css-loader", // Xử lý CSS
          // "postcss-loader", // Tailwind xử lý CSS qua PostCSS
          "sass-loader", // Biên dịch SCSS thành CSS
        ],
      },
      {
        test: /\.ts$/, // Áp dụng cho các file .ts
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"], // Hỗ trợ import file .ts và .js
  },
};
