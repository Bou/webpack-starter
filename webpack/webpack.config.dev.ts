import path from "path";
import merge from "webpack-merge";
import "webpack-dev-server";

import baseConfig from "./webpack.config.base";

import WebpackDevServer from "webpack-dev-server";

declare module "webpack" {
  interface Configuration {
    devServer?: WebpackDevServer.Configuration;
  }
}

module.exports = merge(baseConfig, {
  mode: "development",
  devtool: "source-map",
  output: {
    path: path.resolve(path.dirname(__dirname), "dist"),
    publicPath: "/",
  },
  devServer: {
    contentBase: path.resolve(path.dirname(__dirname), "dist"),
    compress: true,
    hot: true,
    stats: "minimal",
    inline: true,
  },
});
