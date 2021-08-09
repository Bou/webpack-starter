import { join, dirname, resolve } from "path";

import webpack, { Configuration as WebpackConfiguration } from "webpack";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlPlugin from "html-webpack-plugin";

export const __PROD__ = process.env.NODE_ENV === "production";

const dirSrc = resolve(dirname(__dirname), "src");
const dirPublic = resolve(dirname(__dirname), "public");
const dirStyles = resolve(dirSrc, "styles");
const dirAssets = resolve(dirSrc, "assets");
const dirNode = resolve(dirname(__dirname), "node_modules");

const excluded = new Set([".DS_Store"]);

const config: WebpackConfiguration = {
  entry: [join(dirSrc, "index.ts"), join(dirStyles, "index.scss")],
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: ["html-loader"],
      },
      {
        test: /\.tsx?$/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: __PROD__ ? "dist" : "dev",
            },
          },
          { loader: "css-loader" },
          { loader: "postcss-loader" },
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff2?|webp)$/,
        loader: "file-loader",
        options: {
          name(_: any) {
            if (__PROD__) {
              return "[contenthash].[ext]";
            }
            return "[name].[ext]";
          },
          outputPath: "./images",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    modules: [dirSrc, dirStyles, dirAssets, dirNode],
  },
  output: {
    filename: "[name].bundle.js",
    path: resolve(dirname(__dirname), "dist"),
  },
  plugins: [
    new webpack.DefinePlugin({ __PROD__ }),
    new CopyPlugin({
      patterns: [
        {
          from: join(dirSrc, "assets"),
          to: join(dirname(__dirname), "dist", "assets"),
          noErrorOnMissing: true,
          filter: file => {
            for (const exclusion of excluded) {
              if (file.endsWith(exclusion)) {
                return false;
              }
            }
            return true;
          },
        },
      ],
    }),
    new HtmlPlugin({
      title: "Website",
      template: resolve(dirPublic, "index.html"),
      minify: __PROD__,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
};

export default config;
