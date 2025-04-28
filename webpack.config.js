const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      // Regla para CSS Global (archivos .css que NO terminan en .module.css)
      {
        test: /\.css$/,
        exclude: /\.module\.css$/, // Excluye archivos que terminan en .module.css
        use: [
          // 'style-loader', // Usar style-loader en desarrollo
          // O MiniCssExtractPlugin.loader en producción:
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: false, // Asegura que CSS Modules esté desactivado para CSS global
              esModule: true,
              importLoaders: 0, // Importante si usas PostCSS o Sass/Less después
            },
          },
        ],
      },

      // Regla para CSS Modules (archivos que terminan en .module.css)
      {
        test: /\.module\.css$/, // Solo archivos que terminan en .module.css
        use: [
          // 'style-loader', // Usar style-loader en desarrollo
          // O MiniCssExtractPlugin.loader en producción:
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              // modules: {
              //   localIdentName: "[name]__[local]___[hash:base64:5]", // Define cómo se generan los nombres de clase
              // },
              // importLoaders: 0, // Importante si usas PostCSS o Sass/Less después
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name].[hash:8][ext]",
        },
      },
      {
        test: /\.ico$/,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Keychain Helper React Test App",
      template: "./public/index.html",
      favicon: path.resolve(__dirname, "public", "keychain-helper.ico"),
    }),
    // Esto asegura que el plugin exista si se necesita en producción
    ...(process.env.NODE_ENV === "production"
      ? [
          new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash].css", // Nombra los archivos CSS de salida
            chunkFilename: "static/css/[id].[contenthash].css",
          }),
        ]
      : []),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 8080,
    open: true,
  },
};
