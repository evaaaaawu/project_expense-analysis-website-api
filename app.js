if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");
const passport = require("passport");

const helpers = require("./_helpers");
require("./config/mongoose");
const routes = require("./routes");

const app = express(); // 建構應用程式伺服器
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(cors()); // 這會允許所有跨域請求
app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req);
  next();
});
app.use(passport.initialize());
app.use(routes);

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});

module.exports = app;
