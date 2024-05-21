const Category = require("../models/category");
const createError = require("http-errors");
const mongoose = require("mongoose");

const categoryServices = {
  addCategory: async (req, cb) => {
    try {
      const {mainCategory, subCategories} = req.body;
      const userId = req.user._id;

      if (!mainCategory) {
        throw createError(400, "Main category are required.");
      }
      if (!subCategories || subCategories.length === 0) {
        throw createError(400, "at least one subcategory are required.");
      }

      const newCategory = await Category.create({
        userId, mainCategory, subCategories,
      });
      cb(null, {status: "success", category: newCategory});
    } catch (err) {
      console.error("Failed to add category:", err);
      cb(err);
    }
  },
  getCategories: async (userId, cb) => {
    try {
      const categories = await Category.find({userId});
      cb(null, {status: "success", categories});
    } catch (err) {
      console.error("Failed to get categories:", err);
      cb(err);
    }
  },
  updateCategory: async (categoryId, userId, categoryData, cb) => {
    try {
      // 獲取舊的分類資料
      const oldCategory = await Category.findById(categoryId);
      if (!oldCategory) {
        throw createError(404, "Category not found or user not authorized.");
      }

      // 將舊的子分類轉換為以名稱為鍵的對象
      const oldSubCategoriesMap = {};
      oldCategory.subCategories.forEach((sub) => {
        oldSubCategoriesMap[sub.name] = sub._id;
      });

      // 更新分類資料時，保留子分類的 ID
      const updatedSubCategories = categoryData.subCategories.map((sub) => ({
        name: sub.name,
        _id: oldSubCategoriesMap[sub.name] || new mongoose.Types.ObjectId(),
      }));

      const updatedCategory = await Category.findOneAndUpdate(
          {_id: categoryId, userId: userId},
          {$set: {...categoryData, subCategories: updatedSubCategories}},
          {new: true},
      );
      if (!updatedCategory) {
        throw createError(404, "Category not found or user not authorized.");
      }

      // TODO: debug 用，開發完成後刪除
      console.log("[Category updated successfully:]", updatedCategory);

      cb(null, {status: "success", category: updatedCategory});
    } catch (err) {
      console.error("Failed to update category:", err);
      cb(err);
    }
  },
  deleteCategory: async (categoryId, userId, cb) => {
    try {
      const deletedCategory = await Category.findOneAndDelete(
          {_id: categoryId, userId: userId},
      );
      if (!deletedCategory) {
        throw createError(404, "Category not found or user not authorized.");
      }
      cb(null, {status: "success", category: deletedCategory});
    } catch (err) {
      console.error("Failed to delete category:", err);
      cb(err);
    }
  },
};

module.exports = categoryServices;
