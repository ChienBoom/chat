const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader", // Nhúng CSS vào DOM
          "css-loader", // Xử lý CSS
          "postcss-loader", // Xử lý PostCSS
        ],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", // Nhúng SCSS vào DOM
          "css-loader", // Xử lý CSS trong SCSS
          "sass-loader", // Biên dịch SCSS thành CSS
          "postcss-loader", // Xử lý PostCSS cho SCSS
        ],
      },
    ],
  },
  resolve: {
    alias: {
      "@angular/material": path.resolve(
        __dirname,
        "node_modules/@angular/material"
      ),
    },
  },
};
