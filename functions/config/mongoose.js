const mongoose = require("mongoose");
const functions = require("firebase-functions");

const MONGODB_URI = functions.config().mongo.uri;
mongoose.connect(MONGODB_URI);

// 取得資料庫連線狀態
const db = mongoose.connection;

// 連線異常(只要有觸發 error 就印出 error 訊息)
db.on("error", () => {
  console.log("mongodb error!");
});

// 連線成功(一旦連線成功，就執行 callback，執行完後就會解除監聽器)
db.once("open", () => {
  console.log("mongodb connected!");
});

module.exports = db;