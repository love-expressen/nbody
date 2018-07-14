const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const roomRoutes = require("../routes/room");
const webpackConfig = require('../../webpack.conf.js');

const compiler = webpack(webpackConfig);
const app = express();

/// GENERIC
app.use(webpackDevMiddleware(
  compiler,
  {
    publicPath: webpackConfig.output.publicPath
  }
));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "../../public")));

/// GAME CODEZ
roomRoutes(app);

const server = app.listen(3001, () => {
  console.log("Server running on port", server.address().port)
});
