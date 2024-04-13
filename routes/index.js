const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");
const categoryController = require("../controllers/category-controller");

const {authenticated} = require("../middleware/auth");
const {generalErrorHandler} = require("../middleware/error-handler");

// signup & signin
router.post("/api/users", userController.signUp);
router.post("/api/users/login", userController.signIn);

// category
router.post("/api/categories", authenticated, categoryController.addCategory);

router.use("/", generalErrorHandler);

module.exports = router;
