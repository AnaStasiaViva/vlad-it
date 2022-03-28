const path = require("path");
const currentTask = process.env.npm_lifecycle_event;
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const config = {
  entry: "./app/app.js",
  output: {
    filename: "myBundle.[hash].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HTMLWebpackPlugin({ template: "./app/index.html", inject: "body" }),
  ],
  mode: "development",
  devServer: {
    port: 8080,
    contentBase: path.resolve(__dirname, "dist"),
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
};

if (currentTask === "build") {
  //config.mode === "production";
  config.module.rules[0].use[0] = MiniCSSExtractPlugin.loader;
  config.plugins.push(
    new MiniCSSExtractPlugin({ filename: "main.[hash].css" }),
    new CleanWebpackPlugin()
  );
}

module.exports = config;
