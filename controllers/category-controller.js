const categoryServices = require("../services/category-services");

const categoryController = {
  addCategory: (req, res, next) => {
    categoryServices.addCategory(req, (err, data) =>
      err ? next(err) : res.status(200).json(data),
    );
  },
};

module.exports = categoryController;
