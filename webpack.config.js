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
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: false,
              esModule: true,
              importLoaders: 0,
            },
          },
        ],
      },

      {
        test: /\.module\.css$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
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
    ...(process.env.NODE_ENV === "production"
      ? [
          new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash].css",
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
