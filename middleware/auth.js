const passport = require("../config/passport");

const authenticated = (req, res, next) => {
  passport.authenticate("jwt", {session: false}, (err, user) => {
    if (err || !user) {
      return res.json({status: "error", message: "Unauthorized"});
    }
    req.user = user; // 把 user結果存起來
    return next();
  })(req, res, next);
};

module.exports = {
  authenticated,
};
