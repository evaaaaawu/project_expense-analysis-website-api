const Category = require("../models/category");
const createError = require("http-errors");

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
      cb(err);
    }
  },
  getCategories: async (userId, cb) => {
    try {
      const categories = await Category.find({userId});
      cb(null, {status: "success", categories});
    } catch (err) {
      cb(err);
    }
  },
  updateCategory: async (categoryId, userId, categoryData, cb) => {
    try {
      const updatedCategory = await Category.findOneAndUpdate(
          {_id: categoryId, userId: userId},
          {$set: categoryData},
          {new: true},
      );
      if (!updatedCategory) {
        throw createError(404, "Category not found or user not authorized.");
      }
      cb(null, {status: "success", category: updatedCategory});
    } catch (err) {
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
      cb(err);
    }
  },
};

module.exports = categoryServices;