const userServices = require("../services/user-services");

const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) =>
      err ? next(err) : res.status(200).json(data),
    );
  },
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) =>
      err ? next(err) : res.status(200).json(data),
    );
  },
  getUserInfo: (req, res, next) => {
    const userId = req.user._id;
    userServices.getUserInfo(userId, (err, user) => {
      if (err) return next(err);
      res.status(200).json({email: user.email});
    });
  },
};

module.exports = userController;
