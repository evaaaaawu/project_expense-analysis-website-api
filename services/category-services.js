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
};

module.exports = categoryServices;
