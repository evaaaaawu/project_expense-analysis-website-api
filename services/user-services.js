const User = require("../models/user");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const userServices = {
  signUp: async (req, cb) => {
    try {
      const {email, password, checkPassword} = req.body;
      if ( !email || !password || !checkPassword) {
        throw createError(400, "All information is required.");
      }
      const user = await User.findOne({email});
      if (user) {
        throw createError(
            400, "This email address has already been registered.",
        );
      }
      if (password !== checkPassword) {
        throw createError(
            400, "Password and confirmation password do not match.",
        );
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const newUser = await User.create({
        email,
        password: hash,
      });
      const userData = newUser.toJSON();
      delete userData.password;
      cb(null, {
        status: "success",
        message: "Registration successful!",
        user: userData,
      });
    } catch (err) {
      cb(err);
    }
  },
  signIn: async (req, cb) => {
    try {
      const {email, password} = req.body;
      if (!email || !password) {
        throw createError(400, "All information is required.");
      }
      const user = await User.findOne({email});
      if (!user) {
        throw createError(402, "This account has not been registered yet.");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw createError(401, "Incorrect account or password.");
      const token = jwt.sign(
          {id: user._id}, JWT_SECRET, {expiresIn: "30d"},
      );
      const userData = user.toJSON();
      delete userData.password;
      cb(null, {
        status: "success",
        message: "Logged in successfully!",
        token,
        user: userData,
      });
    } catch (err) {
      cb(err);
    }
  },
};

module.exports = userServices;
