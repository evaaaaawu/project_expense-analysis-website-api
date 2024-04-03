const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");

// 定義一些路由
router.get("/", (req, res) => {
  res.send("Hello World!");
});

// signup & signin
router.post("/api/users", userController.signUp);
router.post("/api/users/login", userController.signIn);

// 更多的路由定義可以在這裡添加

module.exports = router;
