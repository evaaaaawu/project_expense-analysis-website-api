const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");
const categoryController = require("../controllers/category-controller");
const recordController = require("../controllers/record-controller");

const {authenticated} = require("../middleware/auth");
const {generalErrorHandler} = require("../middleware/error-handler");

// signup & signin
router.post("/api/users", userController.signUp);
router.post("/api/users/login", userController.signIn);

// category
router.post("/api/categories", authenticated, categoryController.addCategory);
router.get("/api/categories", authenticated, categoryController.getCategories);
router.put(
    "/api/categories/:id", authenticated, categoryController.updateCategory,
);
router.delete(
    "/api/categories/:id", authenticated, categoryController.deleteCategory,
);

// record
router.post("/api/records", authenticated, recordController.addRecord);
router.get("/api/records", authenticated, recordController.getRecords);
router.put(
    "/api/records/:id", authenticated, recordController.updateRecord,
);
router.delete(
    "/api/records/:id", authenticated, recordController.deleteRecord,
);

router.use("/", generalErrorHandler);

module.exports = router;
