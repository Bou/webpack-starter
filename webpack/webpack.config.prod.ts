import path from "path";

import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { merge } from "webpack-merge";

import baseConfig from "./webpack.config.base";

module.exports = merge(baseConfig, {
  mode: "production",
  devtool: false,
  optimization: {
    minimize: true,
  },
  output: {
    path: path.resolve(path.dirname(__dirname), "dist"),
    crossOriginLoading: "anonymous",
    clean: true,
  },
  plugins: [new CleanWebpackPlugin({})],
});
