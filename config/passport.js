const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const User = require("../models/user");

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  User.findById(jwtPayload.id).then((user) => {
    return done(null, user);
  }).catch((err) => {
    return done(err, false);
  });
}));

module.exports = passport;
