const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

require("./config/mongoose");
const routes = require("./routes");
const {generalErrorHandler} = require("./middleware/error-handler");

const app = express();

app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(cors());
app.use(routes);
app.use(generalErrorHandler);

exports.app = functions.https.onRequest(app);
