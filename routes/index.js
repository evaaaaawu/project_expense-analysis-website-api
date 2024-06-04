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

// user
router.get("/api/users/info", authenticated, userController.getUserInfo);
router.delete("/api/users/:id", authenticated, userController.deleteUser);

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

// TODO: 舊的 getRecords 方法，前端遷移完成後刪除
router.get("/api/v1/records", authenticated, recordController.getRecords);

// 新的 getRecords 方法
router.get("/api/v2/records", authenticated, recordController.getRawRecords);
router.get(
    "/api/v2/records/categories",
    authenticated,
    recordController.getCategoryRecords,
);
router.get(
    "/api/v2/records/periods",
    authenticated,
    recordController.getPeriodRecords,
);

router.put(
    "/api/records/:id", authenticated, recordController.updateRecord,
);

router.delete(
    "/api/records/:id", authenticated, recordController.deleteRecord,
);

router.use("/", generalErrorHandler);

module.exports = router;
