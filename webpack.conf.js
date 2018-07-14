const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./client/main.js",
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(["public/js"]),
    /*new HtmlWebpackPlugin({
      title: "Output Management"
    })*/
  ],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "public/js"),
    publicPath: "/js"
  }
};