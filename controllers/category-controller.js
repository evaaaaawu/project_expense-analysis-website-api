const categoryServices = require("../services/category-services");

const categoryController = {
  addCategory: (req, res, next) => {
    categoryServices.addCategory(req, (err, data) =>
      err ? next(err) : res.status(200).json(data),
    );
  },
  getCategories: (req, res, next) => {
    categoryServices.getCategories(req.user._id, (err, data) =>
      err ? next(err) : res.status(200).json(data),
    );
  },
  updateCategory: (req, res, next) => {
    const categoryId = req.params.id;
    categoryServices.updateCategory(
        categoryId, req.user._id, req.body, (err, data) =>
          err ? next(err) : res.status(200).json(data),
    );
  },
  deleteCategory: (req, res, next) => {
    const categoryId = req.params.id;
    categoryServices.deleteCategory(
        categoryId, req.user._id, (err, data) =>
          err ? next(err) : res.status(200).json(data),
    );
  },
};

module.exports = categoryController;
